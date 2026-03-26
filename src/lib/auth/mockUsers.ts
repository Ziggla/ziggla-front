import type { AuthUser } from "./types";

export const MOCK_CREDENTIALS: Array<{ email: string; password: string; user: AuthUser }> = [
  {
    email: "user@ziggla.com",
    password: "ziggla123",
    user: {
      id: "usr-001",
      firstName: "Alex",
      lastName: "Mercer",
      email: "user@ziggla.com",
      role: "user",
      initials: "AM",
      avatarBg: "bg-surface-container-highest",
      token: "mock-token-user",
    },
  },
  {
    email: "host@ziggla.com",
    password: "ziggla123",
    user: {
      id: "usr-host-001",
      firstName: "Ziggla",
      lastName: "Properties",
      email: "host@ziggla.com",
      role: "host",
      initials: "ZP",
      avatarBg: "bg-primary-container",
      token: "mock-token-host",
    },
  },
  {
    email: "admin@ziggla.com",
    password: "ziggla123",
    user: {
      id: "usr-admin-001",
      firstName: "James",
      lastName: "Doyle",
      email: "admin@ziggla.com",
      role: "admin",
      initials: "JD",
      avatarBg: "bg-primary-container",
      token: "mock-token-admin",
    },
  },
];

export function mockLogin(email: string, password: string): AuthUser | null {
  const match = MOCK_CREDENTIALS.find(
    (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
  );
  return match?.user ?? null;
}
