import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className={cn(
            "overflow-hidden rounded-2xl border transition-all duration-300",
            openIndex === i
              ? "border-brand/40 bg-card shadow-lg ring-1 ring-brand/5"
              : "border-border bg-card/50 hover:border-border/80 hover:bg-card"
          )}
        >
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center justify-between px-6 py-5 text-left"
          >
            <span className={cn(
              "font-display text-base transition-colors sm:text-lg",
              openIndex === i ? "text-brand" : "text-card-foreground"
            )}>
              {item.question}
            </span>
            <motion.div
              animate={{ rotate: openIndex === i ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="ml-4 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary/50 text-muted-foreground transition-colors group-hover:bg-secondary"
            >
              <ChevronDown className="size-4" />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              >
                <div className="border-t border-border/40 px-6 pb-6 pt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {item.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
