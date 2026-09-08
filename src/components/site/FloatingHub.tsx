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
    <>
      {/* iOS-style Full-Screen Background Blur Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/25 backdrop-blur-md transition-all duration-300 ease-out",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0 backdrop-blur-none",
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <div ref={ref} className="fixed bottom-5 right-4 z-50 flex flex-col items-end sm:bottom-6 sm:right-6">
        <div
          role="menu"
          aria-hidden={!open}
          className={cn(
            "mb-3 w-[265px] origin-bottom-right overflow-hidden rounded-[20px]",
            "border border-black/[0.08] dark:border-white/[0.12]",
            "bg-[#F2F2F7]/85 dark:bg-[#1C1C1E]/85",
            "backdrop-blur-2xl backdrop-saturate-[180%]",
            "shadow-[0_20px_45px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)]",
            "divide-y divide-black/[0.08] dark:divide-white/[0.1]",
            "transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
            open
              ? "pointer-events-auto scale-100 opacity-100 translate-y-0"
              : "pointer-events-none scale-90 opacity-0 translate-y-3",
          )}
        >
          {items.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                <span className="truncate text-[16px] sm:text-[17px] font-normal tracking-[-0.24px] text-foreground dark:text-white">
                  {item.label}
                </span>
                <Icon className="size-[20px] shrink-0 stroke-[1.8] text-foreground/90 dark:text-white/90 ml-3" />
              </>
            );
            const className = cn(
              "flex w-full items-center justify-between px-4 py-3.5 text-left",
              "transition-colors duration-150",
              "hover:bg-black/[0.04] active:bg-black/[0.08]",
              "dark:hover:bg-white/[0.06] dark:active:bg-white/[0.12]",
              "focus:outline-none focus-visible:bg-black/[0.06] dark:focus-visible:bg-white/[0.08]",
            );
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
    </>
  );
}
