import {
  properties,
  locationDistances,
  getPropertyBySlug as _getPropertyBySlug,
  type Property,
  type PropertyImage,
  type LocationDistance,
} from "@/data/properties";
import { mockFetch } from "./client";

export type { Property, PropertyImage, LocationDistance };

/** Returns all properties. */
export async function getProperties(): Promise<Property[]> {
  return mockFetch(properties, "/properties");
}

/** Returns a property by slug, or null if not found. */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const property = _getPropertyBySlug(slug) ?? null;
  return mockFetch(property, `/properties/${slug}`);
}

/** Returns location distances (static, shared across all properties). */
export async function getLocationDistances(): Promise<LocationDistance[]> {
  return mockFetch(locationDistances, "/properties/location-distances");
}
