import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { AlignLeft, Maximize2, Minus, SquarePen, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatPanel } from "./ChatPanel";
import { OPEN_CHAT_EVENT } from "@/components/site/FloatingHub";

/** Floating support launcher + panel, available on every page. */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [, setUnread] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newChatKey, setNewChatKey] = useState(0);
  const location = useLocation();


  useEffect(() => setMounted(true), []);

  // The single floating launcher opens the chat through this event.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, []);

  // Deep link: /?chat=1 (used after signing in for a live agent).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("chat") === "1") setOpen(true);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div
        className={cn(
          "fixed z-50 flex flex-col overflow-hidden border border-border bg-background shadow-2xl transition-all duration-300",
          "inset-x-0 bottom-0 top-0 rounded-none sm:inset-auto sm:bottom-24 sm:right-6 sm:top-auto sm:rounded-2xl",
          maximized
            ? "sm:h-[80vh] sm:w-[min(92vw,560px)]"
            : "sm:h-[560px] sm:max-h-[75vh] sm:w-[380px]",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        )}
        role="dialog"
        aria-label="Customer support chat"
      >
        <header
          className={cn(
            "relative z-20 flex items-center justify-between px-3 py-2.5",
            drawerOpen && "invisible pointer-events-none",
          )}
        >
          <button
            type="button"
            aria-label="Open chat menu"
            onClick={() => setDrawerOpen((v) => !v)}
            className="flex size-11 items-center justify-center rounded-full bg-muted transition-colors hover:bg-accent"
          >
            <AlignLeft className="size-5" />
          </button>
          <div className="flex items-center gap-1 rounded-full bg-muted px-1">
            <button
              type="button"
              aria-label="New chat"
              onClick={() => setNewChatKey((k) => k + 1)}
              className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-accent"
            >
              <SquarePen className="size-5" />
            </button>
            <button
              type="button"
              aria-label={maximized ? "Restore chat size" : "Maximize chat"}
              onClick={() => setMaximized((v) => !v)}
              className="hidden size-11 items-center justify-center rounded-full transition-colors hover:bg-accent sm:flex"
            >
              {maximized ? <Minus className="size-5" /> : <Maximize2 className="size-5" />}
            </button>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-accent"
            >
              <X className="size-5" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 bg-background">
          <ChatPanel
            key={newChatKey}
            open={open}
            onUnread={setUnread}
            drawerOpen={drawerOpen}
            onDrawerChange={setDrawerOpen}
            onClose={() => setOpen(false)}
          />
        </div>
      </div>

    </>
  );
}
