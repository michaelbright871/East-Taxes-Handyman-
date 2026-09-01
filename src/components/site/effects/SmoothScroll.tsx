import React, { useEffect } from "react";
import Lenis from "lenis";

export function resetSmoothScroll() {
  if (typeof window === "undefined") return;

  const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
  if (lenis) {
    lenis.scrollTo(0, { immediate: true, duration: 0 });
  }

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  const root = document.scrollingElement ?? document.body;
  if (root) {
    root.scrollTop = 0;
    root.scrollLeft = 0;
  }
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    (window as Window & { __lenis?: Lenis }).__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      window.requestAnimationFrame(raf);
    }

    window.requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      delete (window as Window & { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}
