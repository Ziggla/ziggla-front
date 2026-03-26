"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { AuthUser } from "./types";
import { mockLogin } from "./mockUsers";
import { BASE_URL } from "@/lib/api/client";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<AuthUser>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "ziggla_auth";

// Cookie helpers — sets a non-httpOnly cookie so middleware can read role for route guards
function setRoleCookie(role: string, rememberMe = false) {
  const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7; // 30d or 7d
  document.cookie = `ziggla_role=${role}; path=/; SameSite=Lax; Max-Age=${maxAge}`;
}

function clearRoleCookie() {
  document.cookie = "ziggla_role=; path=/; Max-Age=0";
}

function decodeJwt(token: string): Record<string, string> {
  try {
    return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return {};
  }
}

// Fetch /users/me for full profile; fall back to JWT payload if the call fails
async function fetchAuthUser(accessToken: string): Promise<AuthUser> {
  try {
    const res = await fetch(`${BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.ok) {
      const json = await res.json();
      console.log("[Auth] /users/me raw response:", json);
      const u = json.data ?? json;
      console.log("[Auth] /users/me unwrapped:", u);
      const firstName = u.first_name ?? u.firstName ?? "";
      const lastName = u.last_name ?? u.lastName ?? "";
      const authUser = {
        id: u.id,
        firstName,
        lastName,
        email: u.email,
        role: u.role ?? "user",
        initials: ((firstName[0] ?? "?") + (lastName[0] ?? "?")).toUpperCase(),
        avatarBg: "bg-surface-container-highest",
        avatarUrl: u.avatar_url ?? u.avatarUrl ?? undefined,
        token: accessToken,
      };
      console.log("[Auth] built AuthUser:", authUser);
      return authUser;
    }
  } catch {
    // network error — fall through to JWT fallback
  }

  // Fallback: decode JWT (has sub, email, role — no name)
  const p = decodeJwt(accessToken);
  return {
    id: p.sub ?? "",
    firstName: "",
    lastName: "",
    email: p.email ?? "",
    role: (p.role as AuthUser["role"]) ?? "user",
    initials: (p.email?.[0] ?? "?").toUpperCase(),
    avatarBg: "bg-surface-container-highest",
    token: accessToken,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      console.log("[Auth] localStorage raw:", stored);
      if (stored) {
        const parsed = JSON.parse(stored) as AuthUser;
        // Fix missing initials from sessions stored before this field was added
        if (!parsed.initials || parsed.initials === "??") {
          const fn = parsed.firstName?.[0] ?? "?";
          const ln = parsed.lastName?.[0] ?? "?";
          parsed.initials = (fn + ln).toUpperCase();
        }
        console.log("[Auth] rehydrated user:", parsed);
        setUser(parsed);
        // Re-sync cookie in case it expired but localStorage is still valid
        if (parsed.role) setRoleCookie(parsed.role);
      } else {
        console.log("[Auth] no stored session found");
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (
    email: string,
    password: string,
    rememberMe = false,
  ): Promise<AuthUser> => {
    // 1. Try real API
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const json = await res.json();
        const payload = json.data ?? json;
        const accessToken = payload.access_token ?? payload.accessToken;
        const authUser = await fetchAuthUser(accessToken);
        const stored = { ...authUser, refreshToken: payload.refresh_token ?? payload.refreshToken };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
        setRoleCookie(authUser.role, rememberMe);
        setUser(authUser);
        return authUser;
      }
      if (res.status === 429) {
        throw new Error("Too many attempts. Please wait 30 seconds and try again.");
      }
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.message ?? "Invalid email or password");
    } catch (err) {
      if (err instanceof Error && err.message !== "Failed to fetch") throw err;
      console.warn("[Auth] API unavailable, falling back to mock credentials");
    }

    // 2. Fallback to mock credentials
    const mockUser = mockLogin(email, password);
    if (!mockUser) throw new Error("Invalid email or password");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
    setRoleCookie(mockUser.role, rememberMe);
    setUser(mockUser);
    return mockUser;
  }, []);

  const register = useCallback(async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<AuthUser> => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password }),
    });
    if (!res.ok) {
      if (res.status === 429) throw new Error("Too many attempts. Please wait 30 seconds.");
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.message ?? "Registration failed");
    }
    const json = await res.json();
    const payload = json.data ?? json;
    const accessToken = payload.access_token ?? payload.accessToken;
    const authUser = await fetchAuthUser(accessToken);
    const stored = { ...authUser, refreshToken: payload.refresh_token ?? payload.refreshToken };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    setRoleCookie(authUser.role);
    setUser(authUser);
    return authUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    clearRoleCookie();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
