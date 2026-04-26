import { apiFetch } from "./client";
import {
  coverFrom,
  initialsOf,
  num,
  type RawAmenity,
  type RawEmbeddedUser,
  type RawImage,
  type RawRule,
} from "./shared";

// ---------------------------------------------------------------------------
// Types (frontend-facing — camelCase)
// ---------------------------------------------------------------------------

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "completed"
  | "cancelled";

export interface EmbeddedProperty {
  id: string;
  slug: string;
  name: string;
  neighborhood: string;
  type: string;
  pricePerNight: number;
  coverImage: string;
}

export interface EmbeddedUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  initials: string;
}

export interface TimelineStep {
  icon: string;
  label: string;
  date: string;
  done: boolean;
}

export interface HouseRule {
  icon: string;
  label: string;
}

export interface Booking {
  id: string;
  reference: string;
  property: EmbeddedProperty;
  guest?: EmbeddedUser;
  host?: EmbeddedUser;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestsCount: number;
  subtotal: number;
  serviceFee: number;
  total: number;
  status: BookingStatus;
  hasReview: boolean;
  createdAt: string;
  timeline?: TimelineStep[];
  houseRules?: HouseRule[];
}

export interface BookingListItem {
  id: string;
  reference: string;
  property: {
    name: string;
    neighborhood: string;
    coverImage: string;
  };
  checkIn: string;
  checkOut: string;
  nights: number;
  guestsCount: number;
  total: number;
  status: BookingStatus;
  hasReview: boolean;
}

// ---------------------------------------------------------------------------
// Raw API shapes (endpoint-specific — shared building blocks live in ./shared)
// ---------------------------------------------------------------------------

interface RawProperty {
  id: string;
  slug: string;
  name: string;
  neighborhood?: string | null;
  type?: string | null;
  price_per_night?: string | number | null;
  images?: RawImage[];
  rules?: RawRule[];
  amenities?: RawAmenity[];
}

interface RawBooking {
  id: string;
  reference: string;
  status: BookingStatus;
  check_in: string;
  check_out: string;
  nights: number;
  guests_count: number;
  price_per_night: string | number;
  subtotal: string | number;
  service_fee: string | number;
  total: string | number;
  created_at: string;
  property?: RawProperty;
  user?: RawEmbeddedUser;
  review?: { id: string } | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mapEmbeddedUser(u?: RawEmbeddedUser): EmbeddedUser | undefined {
  if (!u) return undefined;
  return {
    id: u.id,
    firstName: u.first_name,
    lastName: u.last_name,
    email: u.email,
    initials: initialsOf(u.first_name, u.last_name),
  };
}

function mapBooking(raw: RawBooking): Booking {
  const property = raw.property;
  return {
    id: raw.id,
    reference: raw.reference,
    property: {
      id: property?.id ?? "",
      slug: property?.slug ?? "",
      name: property?.name ?? "—",
      neighborhood: property?.neighborhood ?? "",
      type: property?.type ?? "",
      pricePerNight: num(property?.price_per_night ?? raw.price_per_night),
      coverImage: coverFrom(property?.images),
    },
    guest: mapEmbeddedUser(raw.user),
    checkIn: raw.check_in,
    checkOut: raw.check_out,
    nights: raw.nights,
    guestsCount: raw.guests_count,
    subtotal: num(raw.subtotal),
    serviceFee: num(raw.service_fee),
    total: num(raw.total),
    status: raw.status,
    hasReview: !!raw.review,
    createdAt: raw.created_at,
    houseRules: property?.rules?.map((r) => ({ icon: "rule", label: r.label })),
  };
}

export function toBookingListItem(b: Booking): BookingListItem {
  return {
    id: b.id,
    reference: b.reference,
    property: {
      name: b.property.name,
      neighborhood: b.property.neighborhood,
      coverImage: b.property.coverImage,
    },
    checkIn: b.checkIn,
    checkOut: b.checkOut,
    nights: b.nights,
    guestsCount: b.guestsCount,
    total: b.total,
    status: b.status,
    hasReview: b.hasReview,
  };
}

// ---------------------------------------------------------------------------
// API functions — connected to NestJS backend
// ---------------------------------------------------------------------------

export interface CreateBookingPayload {
  property_id: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  special_requests?: string;
}

/** Create a booking (auth required). */
export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  const raw = await apiFetch<RawBooking>("/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return mapBooking(raw);
}

export interface CheckoutInfo {
  checkout_id: string;
  reference: string;
  amount: number;
  currency: string;
}

/** Create a SumUp checkout for a booking (auth required). */
export async function createSumupCheckout(bookingId: string): Promise<CheckoutInfo> {
  return apiFetch<CheckoutInfo>(`/payments/checkout/${bookingId}`, {
    method: "POST",
  });
}

/** Current user's bookings (auth required). The userId arg is ignored — the API derives it from the JWT. */
export async function getBookings(_userId?: string): Promise<Booking[]> {
  const raw = await apiFetch<RawBooking[]>("/bookings/me");
  return raw.map(mapBooking);
}

export interface BookingStatusInfo {
  id: string;
  reference: string;
  status: BookingStatus;
  check_in: string;
  check_out: string;
  total: number;
  currency: string;
  payment?: { status: string } | null;
  property: {
    name: string;
    slug: string;
    address: string;
    coverImage: string;
  };
}

interface RawBookingStatus extends Omit<BookingStatusInfo, "property"> {
  property: {
    name: string;
    slug: string;
    address: string;
    images?: RawImage[];
  };
}

/** Fetch a booking (any status) by its reference — used by confirmation page polling. */
export async function getBookingByReference(
  reference: string,
): Promise<BookingStatusInfo | null> {
  try {
    const raw = await apiFetch<RawBookingStatus>(`/bookings/me/by-ref/${reference}`);
    return {
      ...raw,
      property: {
        name: raw.property.name,
        slug: raw.property.slug,
        address: raw.property.address,
        coverImage: coverFrom(raw.property.images),
      },
    };
  } catch (err) {
    if (err instanceof Error && err.message.toLowerCase().includes("not found"))
      return null;
    throw err;
  }
}

/** Current user's booking detail. Returns null on 404. */
export async function getBooking(id: string): Promise<Booking | null> {
  try {
    const raw = await apiFetch<RawBooking>(`/bookings/me/${id}`);
    return mapBooking(raw);
  } catch (err) {
    if (err instanceof Error && err.message.includes(" 404")) return null;
    throw err;
  }
}

/** Cancel current user's booking (>48h before check-in). */
export async function cancelMyBooking(id: string): Promise<Booking> {
  const raw = await apiFetch<RawBooking>(`/bookings/me/${id}`, { method: "DELETE" });
  return mapBooking(raw);
}

/** Bookings on properties owned by the current host (auth + role: host). */
export async function getBookingsByHost(_hostId?: string): Promise<Booking[]> {
  const raw = await apiFetch<RawBooking[]>("/bookings/host");
  return raw.map(mapBooking);
}

/** All bookings, admin view. */
export async function getAdminBookings(): Promise<Booking[]> {
  const raw = await apiFetch<RawBooking[]>("/bookings");
  return raw.map(mapBooking);
}
