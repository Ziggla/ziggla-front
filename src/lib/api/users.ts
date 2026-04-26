import { apiFetch } from "./client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "guest" | "host" | "admin";
  initials: string;
  bookingsCount: number;
  lastActive: string;
  avatarBg: string;
  bio?: string;
  languages?: string[];
  memberSince?: string;
  guestsWelcomed?: number;
  responseRate?: number;
  totalStaysHosted?: number;
  averageRating?: number;
}

interface RawUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: User["role"];
  created_at: string;
  avatar_url?: string | null;
  _count?: { bookings?: number };
}

const AVATAR_BGS = [
  "bg-surface-container-highest",
  "bg-primary-container",
  "bg-secondary/30",
  "bg-tertiary/30",
];

function initialsOf(first?: string, last?: string): string {
  return ((first?.[0] ?? "?") + (last?.[0] ?? "?")).toUpperCase();
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const diffDays = Math.floor((Date.now() - then) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function mapUser(raw: RawUser, idx = 0): User {
  return {
    id: raw.id,
    firstName: raw.first_name,
    lastName: raw.last_name,
    email: raw.email,
    role: raw.role,
    initials: initialsOf(raw.first_name, raw.last_name),
    bookingsCount: raw._count?.bookings ?? 0,
    lastActive: formatRelative(raw.created_at),
    avatarBg: AVATAR_BGS[idx % AVATAR_BGS.length],
  };
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/** Admin: list all users. */
export interface MeProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  nationality: string | null;
  avatar_url: string | null;
  language: "en" | "fr";
  notif_booking_updates: boolean;
  notif_sms: boolean;
  notif_marketing: boolean;
  role: string;
}

export function getMe(): Promise<MeProfile> {
  return apiFetch<MeProfile>("/users/me");
}

export function updateMe(payload: {
  first_name?: string;
  last_name?: string;
  phone?: string;
  nationality?: string;
}): Promise<MeProfile> {
  return apiFetch<MeProfile>("/users/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function updatePreferences(payload: {
  language?: "en" | "fr";
  notif_booking_updates?: boolean;
  notif_sms?: boolean;
  notif_marketing?: boolean;
}): Promise<MeProfile> {
  return apiFetch<MeProfile>("/users/me/preferences", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function getUsers(): Promise<User[]> {
  const raw = await apiFetch<RawUser[]>("/users");
  return raw.map(mapUser);
}

/** Admin: get a single user. */
export async function getUser(id: string): Promise<User | null> {
  try {
    const raw = await apiFetch<RawUser>(`/users/${id}`);
    return mapUser(raw);
  } catch (err) {
    if (err instanceof Error && err.message.includes(" 404")) return null;
    throw err;
  }
}
