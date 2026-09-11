import { createContext, useCallback, useContext, useMemo, useState, useEffect, type ReactNode } from "react";
import { BookingDialog, type BookingMode } from "./BookingDialog";
import { cn } from "@/lib/utils";

interface BookingContextValue {
  open: (mode?: BookingMode, presetServiceId?: string) => void;
  close: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [isPageScaled, setIsPageScaled] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState("50% 50%");
  const [mode, setMode] = useState<BookingMode>("estimate");
  const [preset, setPreset] = useState<string | undefined>(undefined);

  const open = useCallback((nextMode: BookingMode = "estimate", presetServiceId?: string) => {
    setMode(nextMode);
    setPreset(presetServiceId);

    if (typeof window !== "undefined") {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const vh = window.innerHeight;
      setTransformOrigin(`50% ${scrollY + vh / 2}px`);

      // Pause Lenis smooth scroll while the booking modal is active
      const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
      if (lenis && typeof lenis.stop === "function") {
        lenis.stop();
      }
    }

    setIsOpen(true);
    // 1. Scale underlying page down smoothly immediately
    setIsPageScaled(true);

    // 2. Smoothly slide the booking sheet up with iOS spring timing
    requestAnimationFrame(() => {
      setTimeout(() => {
        setIsSheetVisible(true);
      }, 50);
    });
  }, []);

  const close = useCallback(() => {
    // 1. Smoothly slide modal sheet down
    setIsSheetVisible(false);

    // 2. Restore underlying page scale
    setTimeout(() => {
      setIsPageScaled(false);
    }, 120);

    // 3. Unmount dialog and re-enable smooth scroll
    setTimeout(() => {
      setIsOpen(false);
      if (typeof window !== "undefined") {
        const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
        if (lenis && typeof lenis.start === "function") {
          lenis.start();
        }
      }
    }, 420);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const vh = window.innerHeight;
      setTransformOrigin(`50% ${scrollY + vh / 2}px`);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <BookingContext.Provider value={value}>
      <div
        id="app-page-scale-wrapper"
        style={{
          transformOrigin,
          transform: isPageScaled ? "scale(0.955)" : "scale(1)",
          borderRadius: isPageScaled ? "28px" : "0px",
          filter: isPageScaled ? "brightness(0.88)" : "brightness(1)",
          boxShadow: isPageScaled
            ? "0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.08)"
            : "none",
          transition:
            "transform 480ms cubic-bezier(0.32, 0.72, 0, 1), border-radius 480ms cubic-bezier(0.32, 0.72, 0, 1), filter 480ms ease, box-shadow 480ms ease",
        }}
        className={cn(
          "min-h-screen w-full bg-background",
          isPageScaled && "pointer-events-none select-none overflow-hidden"
        )}
      >
        {children}
      </div>

      {isOpen && (
        <BookingDialog
          open={isOpen}
          isSheetVisible={isSheetVisible}
          mode={mode}
          presetServiceId={preset}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) close();
          }}
          onClose={close}
        />
      )}
    </BookingContext.Provider>
  );
}
