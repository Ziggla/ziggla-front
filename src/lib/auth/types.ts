export type UserRole = "user" | "host" | "admin";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  initials: string;
  avatarBg: string;
  avatarUrl?: string;
  token?: string;
}
