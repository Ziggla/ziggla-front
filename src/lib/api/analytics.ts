import rawAnalytics from "@/data/mock/analytics.json";
import { mockFetch } from "./client";

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
// API functions
// ---------------------------------------------------------------------------

const analytics = rawAnalytics as Analytics;

/** Returns the full analytics dataset. */
export async function getAnalytics(): Promise<Analytics> {
  return mockFetch(analytics, "/analytics");
}
