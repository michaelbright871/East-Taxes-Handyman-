import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface VideoBackdropProps {
  src: string;
  poster?: string;
  className?: string;
  overlayClassName?: string;
  /** Load immediately (above the fold) instead of waiting for scroll. */
  priority?: boolean;
}

/**
 * Muted, looping, inline autoplay background video.
 * The source is only attached once the section is near the viewport, playback is
 * paused while off screen, and a skeleton/poster is shown until the first frame
 * is ready — this keeps scrolling smooth and avoids stalled hero playback.
 */
export function VideoBackdrop({
  src,
  poster,
  className,
  overlayClassName,
  priority = false,
}: VideoBackdropProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(priority);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(true);
          const video = videoRef.current;
          if (!video) continue;
          if (entry.isIntersecting) {
            void video.play().catch(() => {});
          } else if (!video.paused) {
            video.pause();
          }
        }
      },
      { rootMargin: "800px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const video = videoRef.current;
    if (!video) return;
    const tryPlay = () => void video.play().catch(() => {});
    tryPlay();
    video.addEventListener("loadeddata", tryPlay);
    document.addEventListener("visibilitychange", tryPlay);
    return () => {
      video.removeEventListener("loadeddata", tryPlay);
      document.removeEventListener("visibilitychange", tryPlay);
    };
  }, [active]);

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {!ready && (
        <div className="absolute inset-0">
          {poster ? (
            <img
              src={poster}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
              fetchPriority={priority ? "high" : "auto"}
            />
          ) : (
            <div className="skeleton-shimmer h-full w-full" />
          )}
        </div>
      )}

      {active && (
        <video
          ref={videoRef}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-700",
            ready ? "opacity-100" : "opacity-0",
          )}
          src={src}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          preload={priority ? "auto" : "metadata"}
          onCanPlay={() => setReady(true)}
          onPlaying={() => setReady(true)}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-b from-steel/85 via-steel/75 to-steel/90",
          overlayClassName,
        )}
      />
    </div>
  );
}
