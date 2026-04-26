import {
  locationDistances,
  type Property,
  type PropertyImage,
  type LocationDistance,
} from "@/data/properties";
import { apiFetch, mockFetch } from "./client";
import {
  coverFrom,
  num,
  type RawAmenity,
  type RawImage,
  type RawReview,
  type RawRule,
} from "./shared";

export type { Property, PropertyImage, LocationDistance };

// ---------------------------------------------------------------------------
// Raw API shapes (endpoint-specific — shared building blocks live in ./shared)
// ---------------------------------------------------------------------------

interface RawProperty {
  id: string;
  slug: string;
  name: string;
  address: string;
  neighborhood: string | null;
  latitude: number | null;
  longitude: number | null;
  place_id: string | null;
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

function mapProperty(raw: RawProperty): Property {
  return {
    id: raw.id,
    slug: raw.slug,
    hostId: raw.host_id,
    latitude: raw.latitude ?? null,
    longitude: raw.longitude ?? null,
    placeId: raw.place_id ?? null,
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
export interface CreatePropertyPayload {
  slug: string;
  name: string;
  address: string;
  neighborhood?: string;
  latitude?: number;
  longitude?: number;
  place_id?: string;
  type?: string;
  size_sqm?: number;
  price_per_night: number;
  check_in_time?: string;
  check_out_time?: string;
  deposit?: string;
  max_guests?: number;
  amenities?: string[];
  rules?: string[];
}

export async function createProperty(
  payload: CreatePropertyPayload,
): Promise<Property> {
  const raw = await apiFetch<RawProperty>("/properties", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return mapProperty(raw);
}

export async function uploadPropertyImages(
  id: string,
  files: File[],
): Promise<void> {
  const form = new FormData();
  for (const f of files) form.append("files", f);
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";
  const stored = typeof localStorage !== "undefined" ? localStorage.getItem("ziggla_auth") : null;
  const token = stored ? (JSON.parse(stored) as { token?: string }).token : null;
  const res = await fetch(`${baseUrl}/properties/${id}/images`, {
    method: "POST",
    body: form,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
}

export interface UpdatePropertyPayload {
  name?: string;
  address?: string;
  neighborhood?: string;
  latitude?: number;
  longitude?: number;
  place_id?: string;
  price_per_night?: number;
  is_active?: boolean;
}

export interface AvailabilityRange {
  check_in: string;
  check_out: string;
  reference?: string;
  status?: string;
}

export async function getPropertyAvailability(
  slugOrId: string,
): Promise<AvailabilityRange[]> {
  return apiFetch<AvailabilityRange[]>(`/properties/${slugOrId}/availability`);
}

export async function deleteProperty(id: string): Promise<void> {
  await apiFetch<void>(`/properties/${id}`, { method: "DELETE" });
}

export async function updateProperty(
  id: string,
  payload: UpdatePropertyPayload,
): Promise<Property> {
  const raw = await apiFetch<RawProperty>(`/properties/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return mapProperty(raw);
}

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
