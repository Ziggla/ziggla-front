// Shared API types + helpers used by multiple endpoint clients (properties,
// bookings, analytics, …). Per-endpoint `RawProperty` shapes vary (different
// `select`/`include` per controller) and stay local; the building blocks below
// don't.

export interface RawImage {
  id?: string;
  url: string;
  alt?: string | null;
  is_cover?: boolean;
  sort_order?: number;
}

export interface RawAmenity {
  label: string;
}

export interface RawRule {
  label: string;
}

export interface RawReview {
  text: string;
  overall_score?: number | string | null;
  user?: { first_name: string; last_name: string; nationality?: string | null };
}

export interface RawEmbeddedUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export const PLACEHOLDER_IMAGE = "/images/bridge.png";

export function num(v: string | number | undefined | null, d = 0): number {
  if (v === undefined || v === null) return d;
  return typeof v === "number" ? v : Number(v);
}

export function coverFrom(images?: RawImage[]): string {
  if (!images || images.length === 0) return PLACEHOLDER_IMAGE;
  return images.find((i) => i.is_cover)?.url ?? images[0].url;
}

export function initialsOf(first?: string, last?: string): string {
  return ((first?.[0] ?? "?") + (last?.[0] ?? "?")).toUpperCase();
}
