import {
  locationDistances,
  type Property,
  type PropertyImage,
  type LocationDistance,
} from "@/data/properties";
import { apiFetch, mockFetch } from "./client";

export type { Property, PropertyImage, LocationDistance };

// ---------------------------------------------------------------------------
// Raw API shapes
// ---------------------------------------------------------------------------

interface RawImage { id?: string; url: string; alt?: string | null; is_cover?: boolean }
interface RawAmenity { label: string }
interface RawRule { label: string }
interface RawReview {
  text: string;
  overall_score?: number | string | null;
  user?: { first_name: string; last_name: string; nationality?: string | null };
}

interface RawProperty {
  id: string;
  slug: string;
  name: string;
  address: string;
  neighborhood: string | null;
  type: string | null;
  size_sqm: number | null;
  price_per_night: string | number;
  check_in_time: string | null;
  check_out_time: string | null;
  deposit: string | null;
  host_id: string;
  is_active: boolean;
  images?: RawImage[];
  amenities?: RawAmenity[];
  rules?: RawRule[];
  reviews?: RawReview[];
  avg_rating?: number | null;
  _count?: { reviews?: number };
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

const PLACEHOLDER_IMAGE = "/images/bridge.png";

function num(v: string | number | undefined | null, d = 0): number {
  if (v === undefined || v === null) return d;
  return typeof v === "number" ? v : Number(v);
}

function coverFrom(images?: RawImage[]): string {
  if (!images || images.length === 0) return PLACEHOLDER_IMAGE;
  return images.find((i) => i.is_cover)?.url ?? images[0].url;
}

function mapProperty(raw: RawProperty): Property {
  return {
    id: raw.id,
    slug: raw.slug,
    hostId: raw.host_id,
    name: raw.name,
    address: raw.address,
    neighborhood: raw.neighborhood ?? "",
    size: raw.size_sqm ?? 0,
    type: raw.type ?? "",
    rating: num(raw.avg_rating),
    reviewCount: raw._count?.reviews ?? raw.reviews?.length ?? 0,
    coverImage: coverFrom(raw.images),
    images: (raw.images ?? []).map((i) => ({ src: i.url, label: i.alt ?? "" })),
    scores: { staff: 0, amenities: 0, cleanliness: 0, comfort: 0, value: 0, location: 0 },
    checkIn: raw.check_in_time ?? "15:00",
    checkOut: raw.check_out_time ?? "11:00",
    deposit: raw.deposit ?? "",
    amenities: (raw.amenities ?? []).map((a) => a.label),
    rules: (raw.rules ?? []).map((r) => r.label),
    reviews: (raw.reviews ?? []).map((r) => ({
      author: `${r.user?.first_name ?? ""} ${r.user?.last_name ?? ""}`.trim() || "Guest",
      country: r.user?.nationality ?? "",
      text: r.text,
    })),
    pricePerNight: num(raw.price_per_night),
  };
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/** Public list of active properties. */
export async function getProperties(): Promise<Property[]> {
  const raw = await apiFetch<RawProperty[]>("/properties");
  return raw.map(mapProperty);
}

/** Public property detail by slug. Returns null on 404. */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  try {
    const raw = await apiFetch<RawProperty>(`/properties/${slug}`);
    return mapProperty(raw);
  } catch (err) {
    if (err instanceof Error && err.message.includes(" 404")) return null;
    throw err;
  }
}

/** Static location distances — kept client-side until the API exposes them. */
export async function getLocationDistances(): Promise<LocationDistance[]> {
  return mockFetch(locationDistances, "/properties/location-distances");
}
