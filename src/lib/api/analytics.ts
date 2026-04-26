import { apiFetch } from "./client";
import { coverFrom, num, type RawImage } from "./shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MonthlyRevenue {
  month: string;
  amount: number;
  highlight: boolean;
  heightPercent: number;
}

export interface RevenueStats {
  total: number;
  growth: number;
  monthly: MonthlyRevenue[];
}

export interface BookingStats {
  total: number;
  last30Days: number;
  confirmed: number;
  pending: number;
  cancelled: number;
}

export interface UserStats {
  active: number;
  total: number;
  newThisMonth: number;
}

export interface OccupancyEntry {
  propertyId: string;
  propertyName: string;
  rate: number;
  revenue: number;
  rating: number;
  stars: number;
  coverImage: string;
}

export type HostPropertyStatus = "active" | "inactive" | "maintenance";

export interface HostProperty {
  id: string;
  slug: string;
  name: string;
  neighborhood: string;
  address: string;
  type: string;
  size: number;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  status: HostPropertyStatus;
  occupancyRate: number;
  revenueThisMonth: number;
  coverImage: string;
}

export interface Analytics {
  revenue: RevenueStats;
  bookings: BookingStats;
  users: UserStats;
  occupancy: OccupancyEntry[];
  hostProperties: HostProperty[];
}

// ---------------------------------------------------------------------------
// Raw API shapes
// ---------------------------------------------------------------------------

interface RawRevenue {
  months: { month: string; revenue: number }[];
  total: number;
}

interface RawBookingStats {
  by_status: { status: string; count: number }[];
  last_30_days: number;
}

interface RawUserStats {
  total: number;
  new_last_30_days: number;
  active_last_30_days: number;
}

interface RawOccupancy {
  property_id: string;
  property_name: string;
  occupied_nights: number;
  occupancy_rate: number;
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
  is_active: boolean;
  images?: RawImage[];
  _count?: { bookings?: number };
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

function shortMonth(yyyymm: string): string {
  // "2026-04" → "Apr"
  const [y, m] = yyyymm.split("-").map((s) => parseInt(s, 10));
  if (!y || !m) return yyyymm;
  return new Date(y, m - 1, 1).toLocaleDateString("en-GB", { month: "short" });
}

function mapRevenue(raw: RawRevenue): RevenueStats {
  const months = raw.months ?? [];
  const max = months.reduce((acc, m) => Math.max(acc, m.revenue), 0) || 1;
  const lastIdx = months.length - 1;
  const monthly: MonthlyRevenue[] = months.map((m, i) => ({
    month: shortMonth(m.month),
    amount: m.revenue,
    highlight: i === lastIdx,
    heightPercent: Math.max(8, Math.round((m.revenue / max) * 100)),
  }));

  // Growth = (last month vs previous month) %
  let growth = 0;
  if (months.length >= 2) {
    const prev = months[months.length - 2].revenue;
    const last = months[months.length - 1].revenue;
    growth = prev > 0 ? Math.round(((last - prev) / prev) * 100) : 0;
  }

  return { total: raw.total ?? 0, growth, monthly };
}

function mapBookingStats(raw: RawBookingStats): BookingStats {
  const byStatus = new Map((raw.by_status ?? []).map((s) => [s.status, s.count]));
  const get = (k: string) => byStatus.get(k) ?? 0;
  const total = Array.from(byStatus.values()).reduce((a, b) => a + b, 0);
  return {
    total,
    last30Days: raw.last_30_days ?? 0,
    confirmed: get("confirmed"),
    pending: get("pending"),
    cancelled: get("cancelled"),
  };
}

function mapUserStats(raw: RawUserStats): UserStats {
  return {
    active: raw.active_last_30_days ?? 0,
    total: raw.total ?? 0,
    newThisMonth: raw.new_last_30_days ?? 0,
  };
}

function mapOccupancy(
  raw: RawOccupancy[],
  propertyById: Map<string, RawProperty>,
): OccupancyEntry[] {
  return raw.map((o) => {
    const prop = propertyById.get(o.property_id);
    return {
      propertyId: o.property_id,
      propertyName: o.property_name,
      rate: o.occupancy_rate,
      revenue: 0, // not provided per-property by the API yet
      rating: 0,
      stars: 0,
      coverImage: coverFrom(prop?.images),
    };
  });
}

function mapHostProperty(p: RawProperty): HostProperty {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    neighborhood: p.neighborhood ?? "",
    address: p.address,
    type: p.type ?? "",
    size: p.size_sqm ?? 0,
    pricePerNight: num(p.price_per_night),
    rating: 0,
    reviewCount: 0,
    status: p.is_active ? "active" : "inactive",
    occupancyRate: 0,
    revenueThisMonth: 0,
    coverImage: coverFrom(p.images),
  };
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/** Admin dashboard: aggregates revenue, bookings, users, occupancy + property metadata. */
export async function getAnalytics(): Promise<Analytics> {
  const [revenue, bookings, users, occupancyRaw, properties] = await Promise.all([
    apiFetch<RawRevenue>("/analytics/revenue"),
    apiFetch<RawBookingStats>("/analytics/bookings"),
    apiFetch<RawUserStats>("/analytics/users"),
    apiFetch<RawOccupancy[]>("/analytics/occupancy"),
    apiFetch<RawProperty[]>("/properties"),
  ]);

  const propertyById = new Map(properties.map((p) => [p.id, p]));

  return {
    revenue: mapRevenue(revenue),
    bookings: mapBookingStats(bookings),
    users: mapUserStats(users),
    occupancy: mapOccupancy(occupancyRaw, propertyById),
    hostProperties: properties.map(mapHostProperty),
  };
}

/** Host: own properties (auth + role: host). */
export async function getHostProperties(): Promise<HostProperty[]> {
  const raw = await apiFetch<RawProperty[]>("/properties/host/mine");
  return raw.map(mapHostProperty);
}
