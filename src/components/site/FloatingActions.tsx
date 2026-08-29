import { useEffect, useState } from "react";
import { CalendarCheck, MessageSquare, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { business } from "./business";
import { useBooking } from "./booking/BookingProvider";

/** Floating conversion bar: free estimate, call and text — always reachable while scrolling. */
export function FloatingActions() {
  const { open } = useBooking();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 px-4 pb-4 transition-all duration-300 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:px-0 sm:pb-0",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      <div className="mx-auto flex max-w-md items-center gap-2 rounded-full border border-border bg-card/95 p-2 shadow-2xl backdrop-blur-md sm:max-w-none">
        <button
          type="button"
          onClick={() => open("estimate")}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 font-display text-xs uppercase tracking-widest text-brand-foreground transition-colors hover:bg-brand/90 sm:flex-none"
        >
          <CalendarCheck className="size-4" /> Get Free Estimate
        </button>
        <a
          href={business.phoneHref}
          aria-label={`Call ${business.phone}`}
          className="flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-accent"
        >
          <Phone className="size-4" />
        </a>
        <a
          href={business.smsHref}
          aria-label="Text us"
          className="flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-accent sm:hidden"
        >
          <MessageSquare className="size-4" />
        </a>
      </div>
    </div>
  );
}
