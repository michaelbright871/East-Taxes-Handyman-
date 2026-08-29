import { useEffect, useRef, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { CalendarCheck, MessageCircle, MessagesSquare, Phone, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { business } from "./business";
import { useBooking } from "./booking/BookingProvider";

export const OPEN_CHAT_EVENT = "eths:open-chat";
export const MENU_STATE_EVENT = "eths:menu-state";

/** Single floating action launcher: one button, one animated drop-up menu. */
export function FloatingHub() {
  const { open: openBooking } = useBooking();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMenu = (e: Event) => setMenuOpen(Boolean((e as CustomEvent<boolean>).detail));
    window.addEventListener(MENU_STATE_EVENT, onMenu);
    return () => window.removeEventListener(MENU_STATE_EVENT, onMenu);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const path = location.pathname;
  const hidden = menuOpen || path.startsWith("/auth") || path.startsWith("/admin");
  if (hidden) return null;

  type HubItem = {
    icon: typeof Phone;
    label: string;
    onClick?: () => void;
    href?: string;
    external?: boolean;
  };

  const items: HubItem[] = [
    {
      icon: CalendarCheck,
      label: "Get free estimate",
      onClick: () => openBooking("estimate"),
    },
    {
      icon: MessagesSquare,
      label: "Chat with Ranger",
      onClick: () => window.dispatchEvent(new Event(OPEN_CHAT_EVENT)),
    },
    {
      icon: MessageCircle,
      label: "WhatsApp us",
      href: business.whatsappHref,
      external: true,
    },
    { icon: Phone, label: `Call ${business.phone}`, href: business.phoneHref },
  ];

  return (
    <div ref={ref} className="fixed bottom-5 right-4 z-50 flex flex-col items-end sm:bottom-6 sm:right-6">
      <div
        role="menu"
        aria-hidden={!open}
        className={cn(
          "mb-3 w-60 origin-bottom-right overflow-hidden rounded-2xl border border-border bg-popover p-1.5 shadow-2xl",
          "transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
          open
            ? "pointer-events-auto scale-100 opacity-100 translate-y-0"
            : "pointer-events-none scale-95 opacity-0 translate-y-2",
        )}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const content = (
            <>
              <Icon className="size-[18px] shrink-0 text-foreground/80" />
              <span className="truncate text-[15px] text-popover-foreground">{item.label}</span>
            </>
          );
          const className =
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-accent";
          return item.href ? (
            <a
              key={item.label}
              href={item.href}
              {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
              onClick={() => setOpen(false)}
              className={className}
              role="menuitem"
            >
              {content}
            </a>
          ) : (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                item.onClick?.();
              }}
              className={className}
            >
              {content}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        aria-label={open ? "Close quick actions" : "Open quick actions"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative flex size-14 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-2xl transition-transform duration-300 hover:scale-105 active:scale-95"
      >
        {!open && <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-brand/30" />}
        <Plus
          className={cn("absolute size-6 transition-all duration-300", open && "rotate-45 opacity-0")}
        />
        <X
          className={cn(
            "absolute size-6 transition-all duration-300",
            open ? "rotate-0 opacity-100" : "-rotate-45 opacity-0",
          )}
        />
      </button>
    </div>
  );
}
