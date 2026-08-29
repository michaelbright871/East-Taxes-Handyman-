import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Copy,
  MoreVertical,
  Share2,
  TextSelect,
  ThumbsDown,
  ThumbsUp,
  Volume2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { referenceImages } from "@/lib/chat/reference-images";
import type { ImageTag } from "@/lib/chat/knowledge";
import type { ChatMessage } from "./chat-types";

const LINK = /(https?:\/\/[^\s]+)/g;

function renderContent(text: string) {
  return text.split("\n").map((line, i) => {
    const bullet = /^\s*[-*•]\s+/.test(line);
    const clean = bullet ? line.replace(/^\s*[-*•]\s+/, "") : line;
    const parts = clean.split(LINK);
    const nodes = parts.map((part, j) =>
      /^https?:\/\//.test(part) ? (
        <a
          key={j}
          href={part}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2"
        >
          {part.replace(/^https?:\/\//, "")}
        </a>
      ) : (
        <span key={j}>{part.replace(/\*\*/g, "")}</span>
      ),
    );
    if (!clean.trim()) return <div key={i} className="h-3" />;
    return bullet ? (
      <div key={i} className="flex gap-2">
        <span className="mt-[10px] size-1.5 shrink-0 rounded-full bg-foreground/60" />
        <p className="min-w-0">{nodes}</p>
      </div>
    ) : (
      <p key={i}>{nodes}</p>
    );
  });
}

function stamp(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yest = new Date();
  yest.setDate(today.getDate() - 1);
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (d.toDateString() === today.toDateString()) return `Today, ${time}`;
  if (d.toDateString() === yest.toDateString()) return `Yesterday, ${time}`;
  return `${d.toLocaleDateString(undefined, { weekday: "long" })} ${time}`;
}

/** Copy / like / dislike / read aloud / share row shown under every AI reply. */
function AssistantActions({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1400);
    return () => clearTimeout(t);
  }, [copied]);

  const speak = () => {
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel();
      synth.speak(new SpeechSynthesisUtterance(content));
    } catch {
      /* speech unavailable */
    }
  };

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ text: content });
      else await navigator.clipboard.writeText(content);
    } catch {
      /* dismissed */
    }
  };

  const btn =
    "flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";

  return (
    <>
      <div className="mt-1.5 flex items-center gap-1">
        <button
          type="button"
          aria-label="Copy response"
          className={btn}
          onClick={() => {
            void navigator.clipboard.writeText(content).then(() => setCopied(true)).catch(() => {});
          }}
        >
          {copied ? <Check className="size-[18px]" /> : <Copy className="size-[18px]" />}
        </button>

        <div
          className={cn(
            "grid transition-all duration-300",
            vote === "down" ? "w-0 scale-90 opacity-0" : "w-9 scale-100 opacity-100",
          )}
        >
          <button
            type="button"
            aria-label="Good response"
            onClick={() => setVote("up")}
            className={cn(btn, vote === "up" && "text-brand")}
          >
            <ThumbsUp className="size-[18px]" fill={vote === "up" ? "currentColor" : "none"} />
          </button>
        </div>

        <div
          className={cn(
            "grid transition-all duration-300",
            vote === "up" ? "w-0 scale-90 opacity-0" : "w-9 scale-100 opacity-100",
          )}
        >
          <button
            type="button"
            aria-label="Bad response"
            onClick={() => {
              setVote("down");
              setFeedbackOpen(true);
            }}
            className={cn(btn, vote === "down" && "text-brand")}
          >
            <ThumbsDown className="size-[18px]" fill={vote === "down" ? "currentColor" : "none"} />
          </button>
        </div>

        <button type="button" aria-label="Read aloud" className={btn} onClick={speak}>
          <Volume2 className="size-[18px]" />
        </button>
      </div>

      <AnimatePresence>
        {feedbackOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFeedbackOpen(false)}
              className="absolute inset-0 bg-background/40 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-[480px] overflow-hidden rounded-[40px] border border-white/20 bg-card/80 p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] backdrop-blur-3xl ring-1 ring-white/10"
            >
              <button
                type="button"
                onClick={() => setFeedbackOpen(false)}
                className="absolute right-8 top-8 flex size-10 items-center justify-center rounded-full bg-white/5 text-muted-foreground transition-all hover:bg-white/10 hover:text-foreground active:scale-90"
              >
                <X className="size-5" />
              </button>

              <div className="mb-8 flex size-16 items-center justify-center rounded-[24px] bg-brand/20 text-brand ring-1 ring-brand/30">
                <ThumbsDown className="size-8" />
              </div>

              <h3 className="font-display text-3xl uppercase tracking-wide text-foreground">Help us improve</h3>
              <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                What was wrong with this response? Your feedback helps make Ranger more helpful.
              </p>

              {sent ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="my-12 text-center"
                >
                  <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 ring-1 ring-emerald-500/30">
                    <Check className="size-10" />
                  </div>
                  <p className="font-display text-2xl uppercase tracking-wide text-emerald-500">Thank you!</p>
                  <p className="mt-2 text-muted-foreground">We've received your feedback.</p>
                </motion.div>
              ) : (
                <div className="mt-10 space-y-6">
                  <div className="group relative">
                    <textarea
                      autoFocus
                      rows={4}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Tell us what happened..."
                      className="w-full resize-none rounded-[24px] border border-white/10 bg-white/5 px-6 py-5 text-lg leading-relaxed outline-none transition-all focus:border-brand/50 focus:bg-white/10 focus:ring-8 focus:ring-brand/5"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setFeedbackOpen(false)}
                      className="flex-1 rounded-[20px] border border-white/10 py-5 text-lg font-bold transition-all hover:bg-white/5 active:scale-[0.98]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={!feedback.trim()}
                      onClick={() => {
                        setSent(true);
                        setTimeout(() => {
                          setFeedbackOpen(false);
                          setSent(false);
                          setFeedback("");
                        }, 1800);
                      }}
                      className="flex-1 rounded-[20px] bg-brand py-5 text-lg font-bold text-brand-foreground shadow-[0_8px_20px_-4px_rgba(var(--brand),0.3)] transition-all hover:opacity-90 hover:shadow-[0_12px_24px_-4px_rgba(var(--brand),0.4)] active:scale-[0.98] disabled:opacity-50"
                    >
                      Send Feedback
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isMine = message.role === "customer";
  const isSystem = message.role === "system";
  const [menu, setMenu] = useState(false);
  const [selectable, setSelectable] = useState(false);
  const [copied, setCopied] = useState(false);
  const holdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const time = useMemo(() => stamp(message.createdAt), [message.createdAt]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1400);
    return () => clearTimeout(t);
  }, [copied]);

  const startHold = () => {
    holdRef.current = setTimeout(() => setMenu(true), 450);
  };
  const cancelHold = () => {
    if (holdRef.current) clearTimeout(holdRef.current);
    holdRef.current = null;
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
    } catch {
      /* clipboard unavailable */
    }
    setMenu(false);
  };

  const selectText = () => {
    setSelectable(true);
    setMenu(false);
    requestAnimationFrame(() => {
      const el = bodyRef.current;
      if (!el) return;
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    });
  };

  const share = async () => {
    setMenu(false);
    const data = { text: message.content, title: "East Texas Handyman chat" };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(message.content);
    } catch {
      /* dismissed */
    }
  };

  if (isSystem) {
    return (
      <div className="my-3 flex justify-center">
        <p className="max-w-[85%] text-center text-[13px] text-muted-foreground">
          {message.content}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("relative flex flex-col", isMine ? "items-end" : "items-start")}>
      {menu && (
        <>
          <button
            type="button"
            aria-label="Close message menu"
            onClick={() => setMenu(false)}
            className="fixed inset-0 z-30 cursor-default bg-background/40 backdrop-blur-[2px]"
          />
          <div
            className={cn(
              "absolute top-2 z-40 w-[252px] overflow-hidden rounded-[28px] border border-border bg-popover shadow-2xl",
              isMine ? "right-0" : "left-0",
            )}
          >
            <p className="px-5 pb-1 pt-4 text-[15px] text-muted-foreground">{time}</p>
            <button
              type="button"
              onClick={() => void copy()}
              className="flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-accent"
            >
              <Copy className="size-5" />
              <span className="text-[17px]">Copy</span>
            </button>
            <button
              type="button"
              onClick={selectText}
              className="flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-accent"
            >
              <TextSelect className="size-5" />
              <span className="text-[17px]">Select text</span>
            </button>
            <button
              type="button"
              onClick={() => void share()}
              className="flex w-full items-center gap-4 px-5 pb-4 pt-3 text-left transition-colors hover:bg-accent"
            >
              <Share2 className="size-5" />
              <span className="text-[17px]">Share prompt</span>
            </button>
          </div>
        </>
      )}

      {message.attachments.length > 0 && (
        <div className="mb-3 w-full max-w-full">
          <div className="flex w-full gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {message.attachments.map((att, i) => {
              const isRef = att.type === "reference";
              const src = isRef ? referenceImages[att.url as ImageTag]?.src : att.url;
              if (!src) return null;

              return (
                <div 
                  key={i} 
                  className={cn(
                    "relative aspect-video h-48 min-w-[280px] overflow-hidden rounded-2xl border border-border shadow-sm transition-transform hover:scale-[1.02]",
                    isMine ? "ml-auto" : ""
                  )}
                >
                  <img
                    src={src}
                    alt={att.name}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                  {!isMine && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <p className="truncate text-xs font-medium text-white">{att.name}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {message.content.trim() && (
        <div
          ref={bodyRef}
          onContextMenu={(e) => {
            e.preventDefault();
            setMenu(true);
          }}
          onTouchStart={startHold}
          onTouchEnd={cancelHold}
          onTouchMove={cancelHold}
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onMouseLeave={cancelHold}
          className={cn(
            "text-[17px] leading-[26px] [overflow-wrap:anywhere]",
            selectable ? "select-text" : "select-none",
            isMine
              ? "max-w-[85%] rounded-[24px] bg-muted px-4 py-3 text-foreground"
              : "w-full text-foreground",
          )}
        >
          <div className="space-y-2">{renderContent(message.content)}</div>
        </div>
      )}

      {!isMine && message.content.trim() && <AssistantActions content={message.content} />}

      {copied && <span className="px-1 pt-1 text-[11px] text-muted-foreground">Copied</span>}
    </div>
  );
}
