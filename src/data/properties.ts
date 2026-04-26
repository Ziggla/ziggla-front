import rawData from "@/data/mock/properties.json";

export interface ReviewScore {
  staff: number;
  amenities: number;
  cleanliness: number;
  comfort: number;
  value: number;
  location: number;
  wifi?: number;
}

export interface Review {
  author: string;
  country: string;
  text: string;
}

export interface PropertyImage {
  src: string;
  label: string;
}

export interface Property {
  id: string;
  slug: string;
  hostId: string;
  name: string;
  address: string;
  neighborhood: string;
  latitude?: number | null;
  longitude?: number | null;
  placeId?: string | null;
  size: number;
  type: string;
  rating: number;
  reviewCount: number;
  coverImage: string;
  images: PropertyImage[];
  scores: ReviewScore;
  checkIn: string;
  checkOut: string;
  deposit: string;
  amenities: string[];
  rules: string[];
  reviews: Review[];
  pricePerNight: number;
}

export interface LocationDistance {
  label: string;
  distance: string;
  icon: string;
}

export const properties: Property[] = rawData.properties as Property[];

export const locationDistances: LocationDistance[] = rawData.locationDistances;

export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug);
}
