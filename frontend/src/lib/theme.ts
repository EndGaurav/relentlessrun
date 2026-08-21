export type Theme = "dark";

/** Public marketing site — always dark */
export const SITE_THEME_KEY = "mr-site-theme";
export const SITE_THEME_EVENT = "mr-site-theme-change";

/** /admin console — always dark */
export const ADMIN_THEME_KEY = "mr-admin-theme";
export const ADMIN_THEME_EVENT = "mr-admin-theme-change";

export const SITE_THEME_DEFAULT: Theme = "dark";
export const ADMIN_THEME_DEFAULT: Theme = "dark";

export function isTheme(value: unknown): value is Theme {
  return value === "dark";
}

export function readStoredTheme(_key: string, _fallback: Theme): Theme {
  return "dark";
}

export function writeStoredTheme(key: string, theme: Theme, eventName: string) {
  try {
    window.localStorage.setItem(key, "dark");
  } catch {
    /* private mode */
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(eventName, { detail: "dark" }));
  }
}

/** Apply permanent dark theme on <html> (class + data-theme for CSS). */
export function applySiteTheme(_theme?: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = "dark";
  root.classList.add("dark");
  root.style.colorScheme = "dark";
}

export function getOppositeTheme(_theme: Theme): Theme {
  return "dark";
}
