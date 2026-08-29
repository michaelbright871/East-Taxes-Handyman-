import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  GUEST_STORAGE_KEY,
  type ChatAttachment,
  type ChatConversation,
  type ChatMessage,
} from "./chat-types";

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  name: "Ranger",
  content:
    "Hi! I'm Ranger, the East Texas Handyman assistant. Tell me what's going on around the house — I can size up the job, share a price range, walk you through a safe temporary fix, or set you up with a free estimate.",
  attachments: [],
  reactions: {},
  createdAt: new Date().toISOString(),
};

type Row = {
  id: string;
  sender_role: string;
  sender_name: string | null;
  content: string;
  attachments: unknown;
  reactions: unknown;
  read_at: string | null;
  created_at: string;
};

function rowToMessage(row: Row): ChatMessage {
  return {
    id: row.id,
    role: row.sender_role as ChatMessage["role"],
    name: row.sender_name,
    content: row.content,
    attachments: Array.isArray(row.attachments) ? (row.attachments as ChatAttachment[]) : [],
    reactions:
      row.reactions && typeof row.reactions === "object"
        ? (row.reactions as Record<string, string[]>)
        : {},
    readAt: row.read_at,
    createdAt: row.created_at,
  };
}

function loadGuest(): ChatMessage[] {
  if (typeof window === "undefined") return [WELCOME];
  try {
    const raw = window.localStorage.getItem(GUEST_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as ChatMessage[]) : null;
    return parsed && parsed.length ? parsed : [WELCOME];
  } catch {
    return [WELCOME];
  }
}

async function askAssistant(history: ChatMessage[]) {
  const messages = history
    .filter((m) => m.role === "customer" || m.role === "assistant")
    .slice(-20)
    .map((m) => {
      const role = m.role === "customer" ? ("user" as const) : ("assistant" as const);
      const images = m.attachments.filter((a) => a.type === "image" && a.url);
      if (role === "user" && images.length) {
        return {
          role,
          content: [
            { type: "text" as const, text: m.content || "Here are photos of the issue." },
            ...images.map((a) => ({
              type: "image_url" as const,
              image_url: { url: a.url },
            })),
          ],
        };
      }
      return { role, content: m.content };
    });
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const data = (await res.json()) as { reply?: string; attachments?: ChatAttachment[]; error?: string };
  if (!res.ok) throw new Error(data.error ?? "The assistant is unavailable right now.");
  return {
    reply: data.reply ?? "",
    attachments: data.attachments ?? [],
  };
}

/** Drives both the guest (local) assistant and the signed-in, persisted chat. */
export function useChatEngine(open: boolean) {
  const { user, isStaff } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadGuest());
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agentsOnline, setAgentsOnline] = useState(0);
  const creating = useRef(false);

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId],
  );

  /* ---------- guest persistence ---------- */
  useEffect(() => {
    if (user) return;
    try {
      window.localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(messages.slice(-60)));
    } catch {
      /* storage unavailable */
    }
  }, [messages, user]);

  /* ---------- load conversations ---------- */
  const refreshConversations = useCallback(async () => {
    if (!user) return;
    const query = supabase
      .from("conversations")
      .select(
        "id,title,mode,status,assigned_agent_id,customer_unread,last_message_at,customer_id,pinned",
      )
      .order("last_message_at", { ascending: false })
      .limit(50);
    const { data, error: err } = isStaff ? await query : await query.eq("customer_id", user.id);
    if (err) return;
    const list = (data ?? []).map<ChatConversation>((c) => ({
      id: c.id,
      title: c.title,
      mode: c.mode as ChatConversation["mode"],
      status: c.status as ChatConversation["status"],
      assignedAgentId: c.assigned_agent_id,
      customerUnread: c.customer_unread,
      lastMessageAt: c.last_message_at,
      pinned: Boolean(c.pinned),
    }));
    setConversations(list);
    setActiveId((prev) => prev ?? list[0]?.id ?? null);
  }, [user, isStaff]);


  useEffect(() => {
    if (!user) {
      setConversations([]);
      setActiveId(null);
      setMessages(loadGuest());
      return;
    }
    void refreshConversations();
  }, [user, refreshConversations]);

  /* ---------- agent availability ---------- */
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void supabase
      .from("agent_presence")
      .select("agent_id", { count: "exact", head: true })
      .eq("is_online", true)
      .then(({ count }) => {
        if (!cancelled) setAgentsOnline(count ?? 0);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  /* ---------- load + subscribe to messages ---------- */
  useEffect(() => {
    if (!user || !activeId) return;
    let cancelled = false;
    setLoading(true);
    void supabase
      .from("messages")
      .select("id,sender_role,sender_name,content,attachments,reactions,read_at,created_at")
      .eq("conversation_id", activeId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (cancelled) return;
        const list = (data ?? []).map((r) => rowToMessage(r as Row));
        setMessages(list.length ? list : [WELCOME]);
        setLoading(false);
      });

    const channel = supabase
      .channel(`conversation:${activeId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${activeId}`,
        },
        (payload) => {
          const msg = rowToMessage(payload.new as Row);
          setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
          filter: `id=eq.${activeId}`,
        },
        () => void refreshConversations(),
      )
      .subscribe();

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, [user, activeId, refreshConversations]);

  /* ---------- mark read ---------- */
  useEffect(() => {
    if (!open || !user || !activeId) return;
    void supabase
      .from("conversations")
      .update(isStaff ? { agent_unread: 0 } : { customer_unread: 0 })
      .eq("id", activeId);
  }, [open, user, activeId, messages.length, isStaff]);

  const ensureConversation = useCallback(async (): Promise<string | null> => {
    if (!user) return null;
    if (activeId) return activeId;
    if (creating.current) return null;
    creating.current = true;
    const { data, error: err } = await supabase
      .from("conversations")
      .insert({ customer_id: user.id, title: "New conversation" })
      .select("id")
      .single();
    creating.current = false;
    if (err || !data) {
      setError(err?.message ?? "Could not start a conversation.");
      return null;
    }
    await refreshConversations();
    setActiveId(data.id);
    return data.id;
  }, [user, activeId, refreshConversations]);

  const newConversation = useCallback(async () => {
    if (!user) {
      setMessages([{ ...WELCOME, createdAt: new Date().toISOString() }]);
      return;
    }
    const { data } = await supabase
      .from("conversations")
      .insert({ customer_id: user.id, title: "New conversation" })
      .select("id")
      .single();
    if (data) {
      await refreshConversations();
      setActiveId(data.id);
      setMessages([WELCOME]);
    }
  }, [user, refreshConversations]);

  const uploadFiles = useCallback(
    async (files: File[]): Promise<ChatAttachment[]> => {
      if (!user || files.length === 0) return [];
      const out: ChatAttachment[] = [];
      for (const file of files) {
        const path = `${user.id}/${crypto.randomUUID()}-${file.name.replace(/[^\w.-]/g, "_")}`;
        const { error: upErr } = await supabase.storage
          .from("chat-attachments")
          .upload(path, file, { upsert: false });
        if (upErr) continue;
        const { data: signed } = await supabase.storage
          .from("chat-attachments")
          .createSignedUrl(path, 60 * 60 * 24 * 7);
        out.push({
          type: file.type.startsWith("image/") ? "image" : "file",
          url: signed?.signedUrl ?? "",
          name: file.name,
          size: file.size,
        });
      }
      return out;
    },
    [user],
  );

  const sendMessage = useCallback(
    async (text: string, files: File[] = []) => {
      const trimmed = text.trim();
      if (!trimmed && files.length === 0) return;
      setError(null);

      const now = new Date().toISOString();
      const senderRole: ChatMessage["role"] = isStaff && user ? "agent" : "customer";

      /* ---- guest: local AI conversation ---- */
      if (!user) {
        const optimistic: ChatMessage = {
          id: crypto.randomUUID(),
          role: "customer",
          content: trimmed,
          attachments: [],
          reactions: {},
          createdAt: now,
          readAt: now,
        };
        const next = [...messages, optimistic];
        setMessages(next);
        setTyping(true);
        try {
          const { reply, attachments } = await askAssistant(next);
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              name: "Ranger",
              content: reply,
              attachments,
              reactions: {},
              createdAt: new Date().toISOString(),
            },
          ]);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Something went wrong.");
        } finally {
          setTyping(false);
        }
        return;
      }

      /* ---- signed in: persisted ---- */
      const conversationId = await ensureConversation();
      if (!conversationId) return;

      const attachments = await uploadFiles(files);
      const { error: insErr } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: user.id,
        sender_role: senderRole,
        sender_name: user.user_metadata?.["full_name"] ?? user.email ?? null,
        content: trimmed,
        attachments,
      });
      if (insErr) {
        setError(insErr.message);
        return;
      }

      const convo = conversations.find((c) => c.id === conversationId);
      if (convo?.title === "New conversation" && trimmed) {
        void supabase
          .from("conversations")
          .update({ title: trimmed.slice(0, 48) })
          .eq("id", conversationId);
      }

      // Only the AI answers while the conversation is in AI mode.
      if (senderRole === "customer" && (!convo || convo.mode === "ai")) {
        setTyping(true);
        try {
          const history = [
            ...messages,
            {
              id: "tmp",
              role: "customer" as const,
              content: trimmed,
              attachments,
              reactions: {},
              createdAt: now,
            },
          ];
          const { reply, attachments: refs } = await askAssistant(history);
          await supabase.from("messages").insert({
            conversation_id: conversationId,
            sender_role: "assistant",
            sender_name: "Ranger",
            content: reply,
            attachments: refs,
          });
        } catch (e) {
          setError(e instanceof Error ? e.message : "Something went wrong.");
        } finally {
          setTyping(false);
        }
      }
      void refreshConversations();
    },
    [user, isStaff, messages, conversations, ensureConversation, uploadFiles, refreshConversations],
  );

  const requestLiveAgent = useCallback(async () => {
    if (!user) return;
    const conversationId = await ensureConversation();
    if (!conversationId) return;

    // Simple load balancing: pick the online agent with the fewest open chats.
    const { data: agents } = await supabase
      .from("agent_presence")
      .select("agent_id,display_name,max_chats")
      .eq("is_online", true);

    let assigned: string | null = null;
    if (agents && agents.length) {
      const counts = await Promise.all(
        agents.map(async (a) => {
          const { count } = await supabase
            .from("conversations")
            .select("id", { count: "exact", head: true })
            .eq("assigned_agent_id", a.agent_id)
            .eq("status", "open");
          return { agent: a, count: count ?? 0 };
        }),
      );
      const best = counts
        .filter((c) => c.count < c.agent.max_chats)
        .sort((a, b) => a.count - b.count)[0];
      assigned = best?.agent.agent_id ?? null;
    }

    await supabase
      .from("conversations")
      .update({
        mode: assigned ? "live" : "queued",
        assigned_agent_id: assigned,
        queue_position: assigned ? null : 1,
      })
      .eq("id", conversationId);

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_role: "system",
      sender_name: "Support",
      content: assigned
        ? "You're connected to a live team member. They can see this conversation and will reply here shortly."
        : "Our agents are offline right now — you're in the queue and we'll reply here first thing during business hours (Mon–Sat, 7 AM – 6 PM).",
    });

    await refreshConversations();
  }, [user, ensureConversation, refreshConversations]);

  const backToAi = useCallback(async () => {
    if (!user || !activeId) return;
    await supabase
      .from("conversations")
      .update({ mode: "ai", queue_position: null })
      .eq("id", activeId);
    await refreshConversations();
  }, [user, activeId, refreshConversations]);

  const toggleReaction = useCallback(
    async (messageId: string, emoji: string) => {
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== messageId) return m;
          const key = user?.id ?? "guest";
          const current = m.reactions[emoji] ?? [];
          const nextUsers = current.includes(key)
            ? current.filter((u) => u !== key)
            : [...current, key];
          const reactions = { ...m.reactions, [emoji]: nextUsers };
          if (!nextUsers.length) delete reactions[emoji];
          if (user) void supabase.from("messages").update({ reactions }).eq("id", messageId);
          return { ...m, reactions };
        }),
      );
    },
    [user],
  );

  const togglePin = useCallback(
    async (id: string, pinned: boolean) => {
      setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, pinned } : c)));
      await supabase.from("conversations").update({ pinned }).eq("id", id);
    },
    [],
  );

  const renameConversation = useCallback(async (id: string, title: string) => {
    const clean = title.trim().slice(0, 80);
    if (!clean) return;
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, title: clean } : c)));
    await supabase.from("conversations").update({ title: clean }).eq("id", id);
  }, []);

  const deleteConversation = useCallback(
    async (id: string) => {
      await supabase.from("messages").delete().eq("conversation_id", id);
      await supabase.from("conversations").delete().eq("id", id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      setActiveId((prev) => (prev === id ? null : prev));
      if (activeId === id) setMessages([WELCOME]);
      await refreshConversations();
    },
    [activeId, refreshConversations],
  );

  return {
    conversations,
    active,
    activeId,
    setActiveId,
    messages,
    loading,
    typing,
    error,
    agentsOnline,
    isStaff,
    sendMessage,
    requestLiveAgent,
    backToAi,
    newConversation,
    toggleReaction,
    togglePin,
    renameConversation,
    deleteConversation,
    unread: conversations.reduce((n, c) => n + (isStaff ? 0 : c.customerUnread), 0),
  };

}
