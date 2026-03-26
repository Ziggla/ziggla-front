import rawUsers from "@/data/mock/users.json";
import { mockFetch } from "./client";

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

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

const users = rawUsers as User[];

/** Returns all users. */
export async function getUsers(): Promise<User[]> {
  return mockFetch(users, "/users");
}

/** Returns a single user by id, or null if not found. */
export async function getUser(id: string): Promise<User | null> {
  const data = users.find((u) => u.id === id) ?? null;
  return mockFetch(data, `/users/${id}`);
}
