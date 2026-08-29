import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
type ThemePreference = "light" | "dark" | "system";

const STORAGE_KEY = "eths-theme";

interface ThemeContextValue {
  /** Resolved theme actually applied to the document. */
  theme: Theme;
  /** User preference — "system" follows the OS setting automatically. */
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  preference: "system",
  setPreference: () => {},
  toggleTheme: () => {},
});

/**
 * Inline script that applies the resolved theme before first paint (no flash).
 * Defaults to the operating-system theme when the user has no explicit choice.
 */
export const themeInitScript = `(function(){try{var p=localStorage.getItem("${STORAGE_KEY}")||"system";var m=window.matchMedia("(prefers-color-scheme: dark)");var t=p==="system"?(m.matches?"dark":"light"):p;document.documentElement.classList.toggle("dark",t==="dark");document.documentElement.style.colorScheme=t;}catch(e){}})();`;

function systemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [theme, setTheme] = useState<Theme>("light");

  // Read the stored preference after hydration.
  useEffect(() => {
    let stored: ThemePreference = "system";
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === "light" || raw === "dark" || raw === "system") stored = raw;
    } catch {
      /* ignore */
    }
    setPreferenceState(stored);
    setTheme(stored === "system" ? systemTheme() : stored);
  }, []);

  // Follow the OS in real time while the preference is "system".
  useEffect(() => {
    if (preference !== "system") {
      setTheme(preference);
      return;
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => setTheme(mq.matches ? "dark" : "light");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [preference]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref);
    try {
      localStorage.setItem(STORAGE_KEY, pref);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setPreference(theme === "dark" ? "light" : "dark");
  }, [setPreference, theme]);

  return (
    <ThemeContext.Provider value={{ theme, preference, setPreference, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
