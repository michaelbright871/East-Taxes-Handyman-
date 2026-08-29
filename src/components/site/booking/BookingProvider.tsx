import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { BookingDialog, type BookingMode } from "./BookingDialog";

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
  const [mode, setMode] = useState<BookingMode>("estimate");
  const [preset, setPreset] = useState<string | undefined>(undefined);

  const open = useCallback((nextMode: BookingMode = "estimate", presetServiceId?: string) => {
    setMode(nextMode);
    setPreset(presetServiceId);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <BookingContext.Provider value={value}>
      {children}
      <BookingDialog open={isOpen} mode={mode} presetServiceId={preset} onOpenChange={setIsOpen} />
    </BookingContext.Provider>
  );
}
