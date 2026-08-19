"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

type ThemeOption = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: ThemeOption;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeOption) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_THEME: ThemeOption = "system";
const STORAGE_KEY = "rupalytic_theme";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyThemeToDOM(theme: ResolvedTheme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeOption>(DEFAULT_THEME);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = authClient.useSession();

  // Step 1: Apply cached theme immediately (prevents flash)
  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY) as ThemeOption | null;
    const initialTheme = cached && ["light", "dark", "system"].includes(cached) ? cached : DEFAULT_THEME;
    
    setThemeState(initialTheme);
    const resolved = initialTheme === "system" ? getSystemTheme() : initialTheme;
    setResolvedTheme(resolved);
    applyThemeToDOM(resolved);
    setIsLoading(false);
  }, []);

  // Step 2: Fetch theme from database (source of truth)
  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchFromDB = async () => {
      try {
        const res = await fetch("/api/user/settings");
        if (res.ok) {
          const settings = await res.json();
          if (settings.theme && ["light", "dark", "system"].includes(settings.theme)) {
            const dbTheme = settings.theme as ThemeOption;
            setThemeState(dbTheme);
            const resolved = dbTheme === "system" ? getSystemTheme() : dbTheme;
            setResolvedTheme(resolved);
            applyThemeToDOM(resolved);
            localStorage.setItem(STORAGE_KEY, dbTheme);
          }
        }
      } catch (error) {
        console.error("Failed to fetch theme:", error);
      }
    };

    fetchFromDB();
  }, [session?.user?.id]);

  // Step 3: Listen for system theme changes (when theme is "system")
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const newResolved = e.matches ? "dark" : "light";
      setResolvedTheme(newResolved);
      applyThemeToDOM(newResolved);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback(async (newTheme: ThemeOption) => {
    // Update state immediately
    setThemeState(newTheme);
    const resolved = newTheme === "system" ? getSystemTheme() : newTheme;
    setResolvedTheme(resolved);
    applyThemeToDOM(resolved);
    localStorage.setItem(STORAGE_KEY, newTheme);

    // Save to database
    try {
      await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: newTheme }),
      });
    } catch (error) {
      console.error("Failed to save theme to DB:", error);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}