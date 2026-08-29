import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./theme";

/** Animated on/off switch that toggles light and dark mode. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex h-9 w-16 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-500",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        isDark
          ? "border-brand/60 bg-surface-foreground/10"
          : "border-surface-foreground/25 bg-surface-foreground/15",
        className,
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute left-1 flex size-7 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-md",
          "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isDark ? "translate-x-7 rotate-[360deg]" : "translate-x-0 rotate-0",
        )}
      >
        <Sun
          className={cn(
            "absolute size-4 transition-all duration-300",
            isDark ? "scale-0 opacity-0" : "scale-100 opacity-100",
          )}
        />
        <Moon
          className={cn(
            "absolute size-4 transition-all duration-300",
            isDark ? "scale-100 opacity-100" : "scale-0 opacity-0",
          )}
        />
      </span>
    </button>
  );
}
