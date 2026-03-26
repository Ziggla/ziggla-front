import rawBookings from "@/data/mock/bookings.json";
import { mockFetch } from "./client";

// ---------------------------------------------------------------------------
// Types
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
  guest: EmbeddedUser;
  host: EmbeddedUser;
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
// Helpers
// ---------------------------------------------------------------------------

const bookings = rawBookings as Booking[];

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
// API functions
// ---------------------------------------------------------------------------

/** Returns all bookings, optionally filtered to a specific guest. */
export async function getBookings(userId?: string): Promise<Booking[]> {
  const data = userId
    ? bookings.filter((b) => b.guest.id === userId)
    : bookings;
  return mockFetch(data, `/bookings${userId ? `?guestId=${userId}` : ""}`);
}

/** Returns a single booking by id, or null if not found. */
export async function getBooking(id: string): Promise<Booking | null> {
  const data = bookings.find((b) => b.id === id) ?? null;
  return mockFetch(data, `/bookings/${id}`);
}

/** Returns all bookings managed by a specific host. */
export async function getBookingsByHost(hostId: string): Promise<Booking[]> {
  const data = bookings.filter((b) => b.host.id === hostId);
  return mockFetch(data, `/bookings?hostId=${hostId}`);
}

/** Returns all bookings (admin view). */
export async function getAdminBookings(): Promise<Booking[]> {
  return mockFetch(bookings, `/admin/bookings`);
}
