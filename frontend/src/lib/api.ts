function getBaseApiUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://127.0.0.1:4000";
    }
    return "https://api.relentlessrun.in";
  }
  if (process.env.NODE_ENV === "production") {
    return "https://api.relentlessrun.in";
  }
  return "http://127.0.0.1:4000";
}

export function getApiUrl(path = "") {
  const base = getBaseApiUrl();
  if (!path) {
    return base;
  }

  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function authHeaders(token: string | null | undefined, init: HeadersInit = {}): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...init,
  };
}

export async function readApiError(response: Response, fallback: string) {
  const error = await response.json().catch(() => null);
  return (error?.error?.message as string | undefined) ?? fallback;
}
