import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Send, StickyNote } from "lucide-react";
import { toast } from "sonner";
import { AdminCard, AdminPage, StatusPill } from "@/components/admin/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { formatDate, relativeTime, useRows } from "@/lib/admin/db";

export const Route = createFileRoute("/admin/chats")({
  ssr: false,
  component: ChatsAdmin,
});

function ChatsAdmin() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: conversations = [], refetch: refetchConvos } = useRows(
    "conversations",
    {
      order: { column: "last_message_at", ascending: false },
      limit: 100,
      ...(mode !== "all" ? { eq: { mode } } : {}),
      ...(search ? { search: { term: search, columns: ["title"] } } : {}),
    },
    { refetchInterval: 15_000 },
  );

  const active = useMemo(
    () => conversations.find((c) => String(c["id"]) === activeId) ?? null,
    [conversations, activeId],
  );

  const { data: messages = [], refetch: refetchMessages } = useRows(
    "messages",
    {
      order: { column: "created_at", ascending: true },
      ...(activeId ? { eq: { conversation_id: activeId } } : { eq: { conversation_id: "00000000-0000-0000-0000-000000000000" } }),
    },
    { enabled: Boolean(activeId), refetchInterval: 8_000 },
  );

  const { data: notes = [], refetch: refetchNotes } = useRows(
    "conversation_notes",
    {
      order: { column: "created_at", ascending: false },
      ...(activeId ? { eq: { conversation_id: activeId } } : { eq: { conversation_id: "00000000-0000-0000-0000-000000000000" } }),
    },
    { enabled: Boolean(activeId) },
  );

  const { data: canned = [] } = useRows("canned_replies", { limit: 50 });

  useEffect(() => {
    if (!activeId) return;
    const channel = supabase
      .channel(`admin-chat-${activeId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${activeId}` },
        () => void refetchMessages(),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [activeId, refetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const send = async () => {
    if (!draft.trim() || !activeId) return;
    setSending(true);
    const { error } = await (supabase.from("messages") as any).insert({
      conversation_id: activeId,
      sender_id: user?.id ?? null,
      sender_role: "agent",
      sender_name: user?.user_metadata?.["full_name"] ?? user?.email ?? "Agent",
      content: draft.trim(),
    });
    setSending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setDraft("");
    void refetchMessages();
    void refetchConvos();
  };

  const patchConversation = async (patch: Record<string, unknown>) => {
    if (!activeId) return;
    const { error } = await (supabase.from("conversations") as any).update(patch).eq("id", activeId);
    if (error) toast.error(error.message);
    else void refetchConvos();
  };

  const addNote = async () => {
    if (!note.trim() || !activeId) return;
    const { error } = await (supabase.from("conversation_notes") as any).insert({
      conversation_id: activeId,
      author_id: user?.id ?? null,
      author_name: user?.email ?? "Agent",
      body: note.trim(),
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    setNote("");
    void refetchNotes();
  };

  return (
    <AdminPage title="Live chat" description="Handle AI and human conversations, assign agents and keep internal notes.">
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <AdminCard bodyClassName="p-0" className="max-h-[70vh] overflow-hidden">
          <div className="space-y-2 border-b border-border/60 p-3">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations…"
              className="h-9"
            />
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All conversations</SelectItem>
                <SelectItem value="ai">AI conversations</SelectItem>
                <SelectItem value="live">Live conversations</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="max-h-[55vh] overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">No conversations yet.</p>
            ) : (
              conversations.map((c) => (
                <button
                  key={String(c["id"])}
                  onClick={() => setActiveId(String(c["id"]))}
                  className={cn(
                    "flex w-full flex-col gap-1 border-b border-border/40 px-3 py-2.5 text-left transition-colors hover:bg-accent/50",
                    activeId === String(c["id"]) && "bg-primary/5",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{c["title"] || "Conversation"}</span>
                    {Number(c["agent_unread"]) > 0 ? (
                      <span className="ml-auto rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                        {c["agent_unread"]}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill value={c["mode"]} />
                    <StatusPill value={c["status"]} />
                    <span className="ml-auto text-[10px] text-muted-foreground">
                      {relativeTime(c["last_message_at"])}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </AdminCard>

        <div className="space-y-4">
          <AdminCard
            title={active ? active["title"] || "Conversation" : "Select a conversation"}
            description={active ? `Started ${formatDate(active["created_at"], true)}` : ""}
            actions={
              active ? (
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => patchConversation({ mode: "live", assigned_agent_id: user?.id ?? null, status: "open" })}>
                    Take over
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => patchConversation({ mode: "ai" })}>
                    Back to AI
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => patchConversation({ assigned_agent_id: null, status: "queued" })}>
                    Transfer
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => patchConversation({ status: "closed" })}>
                    Close
                  </Button>
                </div>
              ) : null
            }
            bodyClassName="p-0"
          >
            <div className="max-h-[45vh] min-h-[220px] space-y-3 overflow-y-auto p-4">
              {!active ? (
                <p className="text-sm text-muted-foreground">Pick a conversation on the left to view its history.</p>
              ) : messages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No messages yet.</p>
              ) : (
                messages.map((m) => {
                  const staff = ["agent", "assistant", "system"].includes(String(m["sender_role"]));
                  return (
                    <div key={String(m["id"])} className={cn("flex", staff ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                          staff ? "bg-primary text-primary-foreground" : "bg-muted",
                        )}
                      >
                        <p className="whitespace-pre-wrap break-words">{m["content"]}</p>
                        <p className="mt-1 text-[10px] opacity-70">
                          {m["sender_name"] ?? m["sender_role"]} · {formatDate(m["created_at"], true)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {active ? (
              <div className="space-y-2 border-t border-border/60 p-3">
                {canned.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {canned.slice(0, 6).map((c) => (
                      <button
                        key={String(c["id"])}
                        onClick={() => setDraft(String(c["body"]))}
                        className="rounded-full border border-border px-2.5 py-1 text-[11px] transition-colors hover:bg-accent"
                      >
                        {c["title"]}
                      </button>
                    ))}
                  </div>
                ) : null}
                <div className="flex gap-2">
                  <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void send();
                      }
                    }}
                    placeholder="Reply as agent…"
                  />
                  <Button onClick={send} disabled={sending || !draft.trim()}>
                    {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  </Button>
                </div>
              </div>
            ) : null}
          </AdminCard>

          {active ? (
            <AdminCard title="Internal notes" description="Only visible to staff">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note…" />
                  <Button onClick={addNote} disabled={!note.trim()}>
                    <StickyNote className="size-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {notes.map((n) => (
                    <div key={String(n["id"])} className="rounded-lg border border-border/60 bg-muted/30 p-2.5 text-sm">
                      <p className="whitespace-pre-wrap">{n["body"]}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {n["author_name"]} · {relativeTime(n["created_at"])}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </AdminCard>
          ) : null}
        </div>
      </div>
    </AdminPage>
  );
}
