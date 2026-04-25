export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

const STORAGE_KEY = "ziggla_auth";

function getStoredAuth(): Record<string, string> | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function getAuthToken(): string | null {
  return getStoredAuth()?.token ?? null;
}

// Auto-refresh: attempts one token refresh on 401, then retries the original request
let refreshingPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const stored = getStoredAuth();
  const refreshToken = stored?.refreshToken;
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const data = json.data ?? json;
    const newToken = data.access_token ?? data.accessToken;
    if (!newToken) return null;

    // Persist updated token
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, token: newToken }));
    return newToken;
  } catch {
    return null;
  }
}

/**
 * Mock fetch — wraps static data in a resolved Promise.
 */
export async function mockFetch<T>(data: T, path: string): Promise<T> {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[API] GET ${path}`);
  }
  return Promise.resolve(data);
}

/**
 * Real fetch wrapper — calls the NestJS API.
 * Automatically attaches Bearer token from localStorage.
 * On 401, attempts a single token refresh then retries.
 * Throws on non-2xx responses.
 */
export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`;

  async function attempt(token: string | null): Promise<Response> {
    return fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...((options?.headers as Record<string, string>) ?? {}),
      },
    });
  }

  let res = await attempt(getAuthToken());

  // On 401: refresh once, then retry
  if (res.status === 401) {
    if (!refreshingPromise) {
      refreshingPromise = refreshAccessToken().finally(() => {
        refreshingPromise = null;
      });
    }
    const newToken = await refreshingPromise;

    if (newToken) {
      res = await attempt(newToken);
    } else {
      // Refresh failed — clear session
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
        document.cookie = "ziggla_role=; path=/; Max-Age=0";
        window.location.href = "/auth/login";
      }
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    let message = body;
    try {
      const parsed = JSON.parse(body);
      message =
        parsed?.error?.message ??
        parsed?.message ??
        parsed?.error ??
        body;
    } catch {
      // body wasn't JSON — keep raw text
    }
    if (typeof console !== "undefined") {
      console.error(
        `[API] ${options?.method ?? "GET"} ${url} failed with ${res.status}:`,
        body,
      );
    }
    throw new Error(typeof message === "string" ? message : String(message));
  }

  // Backend wraps responses in { data, timestamp, path } via TransformInterceptor.
  // Unwrap automatically so callers receive the payload directly.
  const json = await res.json();
  return (json && typeof json === "object" && "data" in json ? json.data : json) as T;
}
