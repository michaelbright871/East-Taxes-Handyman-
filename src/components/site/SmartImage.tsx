import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** Extra classes applied to the wrapper element. */
  wrapperClassName?: string;
  priority?: boolean;
}

/**
 * Image with a shimmering skeleton placeholder that fades out once loaded.
 */
export function SmartImage({
  src,
  alt,
  className,
  wrapperClassName,
  priority = false,
  ...rest
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <div 
      ref={ref}
      className={cn("relative overflow-hidden group/image", wrapperClassName)}
    >
      <div
        aria-hidden="true"
        className={cn(
          "skeleton-shimmer absolute inset-0 z-10 transition-opacity duration-500",
          loaded ? "opacity-0" : "opacity-100",
        )}
      />
      <motion.img
        style={{ y, scale } as any}
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={cn(
          "transition-opacity duration-700 w-full h-full object-cover", 
          loaded ? "opacity-100" : "opacity-0", 
          className
        )}
        {...(rest as any)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
}

/** Reusable shimmering block used for card and text placeholders. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("skeleton-shimmer rounded-md", className)} />;
}

/** Card-shaped skeleton used while a section's content is still hydrating. */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4 rounded-lg bg-card p-7", className)}>
      <Skeleton className="size-11 rounded-md" />
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
    </div>
  );
}
