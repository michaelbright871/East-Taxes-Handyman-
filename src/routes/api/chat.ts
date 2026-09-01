import { createFileRoute } from "@tanstack/react-router";
import { buildSystemPrompt, parseAssistantReply } from "@/lib/chat/knowledge";

type ContentPart =
  | { type: "text"; text?: string }
  | { type: "image_url"; image_url?: { url?: string } };
type ChatTurn = { role: "user" | "assistant" | "system"; content: string | ContentPart[] };
type Body = { messages?: ChatTurn[] };

type GroqMessage = { role: "user" | "assistant"; content: string };

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const DEFAULT_GROQ_MODEL = "openai/gpt-oss-20b";
const MAX_MESSAGE_HISTORY = 24;

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

function safeMessageContent(content: string | ContentPart[] | undefined): string {
  if (typeof content === "string") return content.trim();
  if (!Array.isArray(content)) return "";

  const lines: string[] = [];
  for (const part of content) {
    if (!part || typeof part !== "object") continue;

    if (part.type === "text" && typeof part.text === "string") {
      const value = part.text.trim();
      if (value) lines.push(value);
      continue;
    }

    if (part.type === "image_url") {
      const url = part.image_url?.url;
      if (typeof url === "string" && url.trim()) {
        lines.push("[User attached an image for reference]");
      }
    }
  }

  return lines.join("\n").trim();
}

function normalizeChatHistory(messages: Body["messages"]): GroqMessage[] | null {
  if (!Array.isArray(messages) || messages.length === 0) return null;

  const normalized: GroqMessage[] = [];
  for (const entry of messages.slice(-MAX_MESSAGE_HISTORY)) {
    if (!entry || typeof entry !== "object") return null;
    if (entry.role === "system") continue;
    if (entry.role !== "user" && entry.role !== "assistant") return null;

    const content = safeMessageContent(entry.content);
    if (!content) continue;

    normalized.push({ role: entry.role, content });
  }

  return normalized.length > 0 ? normalized : null;
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Body;
        try {
          body = (await request.json()) as Body;
        } catch {
          return Response.json({ error: "Invalid request body." }, { status: 400 });
        }

        const messages = normalizeChatHistory(body.messages);
        if (!messages) {
          return Response.json({ error: "messages required" }, { status: 400 });
        }

        const apiKey = process.env["GROQ_API_KEY"];
        if (!apiKey || !apiKey.trim()) {
          console.error("Groq API key missing for /api/chat");
          return Response.json({ error: "Ranger is temporarily unavailable. Please try again in a moment." }, { status: 500 });
        }

        const knowledge = await loadKnowledgeBase();
        const model = (process.env["GROQ_MODEL"] ?? DEFAULT_GROQ_MODEL).trim() || DEFAULT_GROQ_MODEL;

        try {
          const res = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: buildSystemPrompt(knowledge) },
                ...messages,
              ],
              temperature: 0.7,
            }),
          });

          if (res.status === 429) {
            return Response.json(
              { error: "Ranger is temporarily unavailable. Please try again in a moment." },
              { status: 429 },
            );
          }

          if (!res.ok) {
            const text = await res.text();
            console.error("Groq API request failed", {
              status: res.status,
              model,
              error: text.slice(0, 1500),
            });
            return Response.json(
              { error: "Ranger is temporarily unavailable. Please try again in a moment." },
              { status: 502 },
            );
          }

          const data = (await res.json()) as {
            choices?: Array<{ message?: { content?: string | Array<{ type?: string; text?: string }> } }>;
          };
          const raw =
            data.choices?.[0]?.message?.content && typeof data.choices[0].message.content === "string"
              ? data.choices[0].message.content
              : Array.isArray(data.choices?.[0]?.message?.content)
                ? data.choices[0].message.content
                    .map((part) => (typeof part?.text === "string" ? part.text : ""))
                    .join("")
                : "";

          const { text, imageQueries } = parseAssistantReply(raw);
          const imageAttachments = imageQueries.map((query, i) => ({
            type: "image" as const,
            url: `https://images.unsplash.com/featured/?${encodeURIComponent(query)}&sig=${i}`,
            name: query,
          }));

          return Response.json({
            reply: text || "Sorry — I didn't catch that. Could you rephrase?",
            attachments: imageAttachments,
          });
        } catch (error) {
          console.error("Unexpected Groq chat error", error);
          return Response.json(
            { error: "Ranger is temporarily unavailable. Please try again in a moment." },
            { status: 502 },
          );
        }
      },
    },
  },
});
