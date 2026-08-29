import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Headset, Sparkle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { QUICK_REPLIES } from "@/lib/chat/knowledge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageBubble } from "./MessageBubble";
import { Composer } from "./Composer";
import { ChatDrawer } from "./ChatDrawer";
import { useChatEngine } from "./useChatEngine";

function dayLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yest = new Date();
  yest.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yest.toDateString()) return "Yesterday";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function timeLabel(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function ChatPanel({
  open,
  onUnread,
  drawerOpen,
  onDrawerChange,
  onClose,
}: {
  open: boolean;
  onUnread: (n: number) => void;
  drawerOpen: boolean;
  onDrawerChange: (v: boolean) => void;
  onClose?: () => void;
}) {
  const engine = useChatEngine(open);
  const { user } = useAuth();
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => onUnread(engine.unread), [engine.unread, onUnread]);

  useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [engine.messages, engine.typing, open]);

  const grouped = useMemo(() => {
    const out: { label: string; items: typeof engine.messages }[] = [];
    for (const m of engine.messages) {
      const label = dayLabel(m.createdAt);
      const last = out[out.length - 1];
      if (last && last.label === label) last.items.push(m);
      else out.push({ label, items: [m] });
    }
    return out;
  }, [engine.messages]);

  const goAuth = () => {
    onDrawerChange(false);
    onClose?.();
    void navigate({ to: "/auth", search: { next: "/", chat: "1" } as never });
  };

  const requireAuth = () => {
    if (user) return true;
    goAuth();
    return false;
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
      <ChatDrawer
        open={drawerOpen}
        onClose={() => onDrawerChange(false)}
        conversations={engine.conversations}
        activeId={engine.activeId}
        onSelect={(id) => {
          engine.setActiveId(id);
          onDrawerChange(false);
        }}
        onNew={() => void engine.newConversation()}
        onPin={(id, pinned) => void engine.togglePin(id, pinned)}
        onRename={(id, title) => void engine.renameConversation(id, title)}
        onDelete={(id) => void engine.deleteConversation(id)}
      />

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-5">
        {engine.loading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-3/4 rounded-[24px]" />
            <Skeleton className="ml-auto h-10 w-1/2 rounded-[24px]" />
            <Skeleton className="h-20 w-4/5 rounded-[24px]" />
          </div>
        ) : (
          grouped.map((group) => (
            <div key={group.label} className="space-y-5">
              <p className="py-1 text-center text-[13px] text-muted-foreground">
                <span className="font-semibold text-foreground/70">{group.label}</span>{" "}
                {timeLabel(group.items[0]!.createdAt)}
              </p>
              {group.items.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
            </div>
          ))
        )}

        {engine.typing && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="size-1.5 animate-bounce rounded-full bg-foreground/50"
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
        )}

        {engine.error && (
          <p className="rounded-2xl bg-destructive/10 px-4 py-2.5 text-[14px] text-destructive">
            {engine.error}
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      {!engine.messages.some((m) => m.role === "customer") && (
        <div className="flex flex-wrap gap-2 px-4 pb-1">
          {QUICK_REPLIES.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => {
                if (!requireAuth()) return;
                void engine.sendMessage(q);
              }}
              className="rounded-full border border-border px-3.5 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {user && (
        <div className="px-4 pb-1 pt-2">
          {engine.active?.mode === "ai" || !engine.active ? (
            <button
              type="button"
              onClick={() => void engine.requestLiveAgent()}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-border px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-accent"
            >
              <Headset className="size-4" /> Chat with a live agent
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void engine.backToAi()}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-border px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-accent"
            >
              <Sparkle className="size-4" /> Back to AI assistant
            </button>
          )}
        </div>
      )}

      <Composer
        onSend={(text, files) => engine.sendMessage(text, files)}
        onBeforeSend={requireAuth}
        disabled={engine.typing}
        placeholder={
          engine.active?.mode === "live" ? "Message the support team" : "Message Ranger"
        }
      />
    </div>
  );
}
