import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { googleReviews, type CustomerReview } from "./trust-data";
import { GoogleMark, Initials, StarRating } from "./TrustPrimitives";

/** Premium auto-scrolling review carousel with manual navigation. */
export function ReviewCarousel({ reviews = googleReviews }: { reviews?: CustomerReview[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (next: number) => {
      if (!reviews || reviews.length === 0) return;
      setIndex(((next % reviews.length) + reviews.length) % reviews.length);
    },
    [reviews],
  );

  useEffect(() => {
    if (paused || !reviews || reviews.length === 0) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % reviews.length), 6000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, reviews]);

  if (!reviews || reviews.length === 0) return null;

  const currentReview = reviews[index];
  if (!currentReview) return null;

  return (
    <div
      className="relative w-full max-w-full min-w-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="w-full max-w-full overflow-hidden rounded-lg border border-border bg-card glass-dark shadow-depth">
        <div className="flex w-full max-w-full">
          <AnimatePresence mode="wait">
            <motion.article 
              key={currentReview.id} 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full shrink-0 p-7 sm:p-10" 
              aria-hidden={undefined}
            >
              <div className="flex items-start justify-between gap-4">
                <Quote className="size-8 text-brand" />
                <GoogleMark className="size-6 opacity-80" />
              </div>
              <StarRating rating={currentReview.rating} className="mt-5" />
              <blockquote className="mt-4 text-base leading-relaxed text-steel-foreground sm:text-lg">
                {currentReview.text}
              </blockquote>
              <div className="mt-7 flex items-center gap-3 border-t border-border pt-5">
                <Initials name={currentReview.name} />
                <div>
                  <p className="font-display text-base text-steel-foreground">{currentReview.name}</p>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {currentReview.location} · {currentReview.service}
                  </p>
                </div>
                <span className="ml-auto hidden text-xs text-muted-foreground sm:block">{currentReview.date}</span>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex gap-2">
          {reviews.map((review, i) => (
            <button
              key={review.id}
              type="button"
              aria-label={`Show review from ${review.name}`}
              aria-current={i === index}
              onClick={() => go(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index ? "w-8 bg-brand" : "w-3 bg-border hover:bg-brand/50",
              )}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" aria-label="Previous review" onClick={() => go(index - 1)}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="icon" aria-label="Next review" onClick={() => go(index + 1)}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
