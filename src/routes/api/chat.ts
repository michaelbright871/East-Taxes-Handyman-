import { createFileRoute } from "@tanstack/react-router";
import { buildSystemPrompt, parseAssistantReply } from "@/lib/chat/knowledge";

type ContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };
type ChatTurn = { role: "user" | "assistant"; content: string | ContentPart[] };
type Body = { messages?: ChatTurn[] };

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

async function loadKnowledgeBase(): Promise<string[]> {
  const url = process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"];
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return [];
  try {
    const res = await fetch(
      `${url}/rest/v1/ai_knowledge?select=topic,content&is_active=eq.true`,
      { headers: { apikey: key } },
    );
    if (!res.ok) return [];
    const rows = (await res.json()) as { topic: string; content: string }[];
    return rows.map((r) => `${r.topic}: ${r.content}`);
  } catch {
    return [];
  }
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as Body;
        if (!Array.isArray(messages) || messages.length === 0) {
          return Response.json({ error: "messages required" }, { status: 400 });
        }

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return Response.json({ error: "AI is not configured" }, { status: 500 });
        }

        const knowledge = await loadKnowledgeBase();

        const res = await fetch(GATEWAY, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3.6-flash",
            messages: [
              { role: "system", content: buildSystemPrompt(knowledge) },
              ...messages.slice(-24),
            ],
          }),
        });

        if (res.status === 429) {
          return Response.json(
            { error: "Our assistant is busy right now — please try again in a moment." },
            { status: 429 },
          );
        }
        if (!res.ok) {
          console.error("AI gateway error", res.status, await res.text());
          return Response.json({ error: "The assistant is unavailable right now." }, { status: 502 });
        }

        const data = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const raw = data.choices?.[0]?.message?.content ?? "";
        const { text, imageQueries } = parseAssistantReply(raw);
        const imageAttachments = imageQueries.map((query, i) => ({
          type: "image" as const,
          url: `https://images.unsplash.com/featured/?${encodeURIComponent(query)}&sig=${i}`,
          name: query
        }));

        return Response.json({
          reply: text || "Sorry — I didn't catch that. Could you rephrase?",
          attachments: imageAttachments,
        });
      },
    },
  },
});
