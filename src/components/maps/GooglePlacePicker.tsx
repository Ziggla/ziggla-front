"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          Autocomplete: new (
            input: HTMLInputElement,
            opts?: {
              fields?: string[];
              types?: string[];
            },
          ) => {
            addListener: (event: string, cb: () => void) => void;
            getPlace: () => {
              place_id?: string;
              formatted_address?: string;
              geometry?: {
                location?: { lat: () => number; lng: () => number };
              };
            };
          };
        };
      };
    };
    initGoogleMaps?: () => void;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadScript(apiKey: string): Promise<void> {
  if (window.google?.maps?.places) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const id = "google-maps-places-sdk";
    if (document.getElementById(id)) {
      const check = setInterval(() => {
        if (window.google?.maps?.places) {
          clearInterval(check);
          resolve();
        }
      }, 100);
      return;
    }
    const script = document.createElement("script");
    script.id = id;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps SDK"));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export interface PickedPlace {
  address: string;
  latitude: number;
  longitude: number;
  placeId: string;
}

interface Props {
  defaultAddress?: string;
  onPick: (place: PickedPlace) => void;
  placeholder?: string;
  className?: string;
}

export default function GooglePlacePicker({
  defaultAddress,
  onPick,
  placeholder,
  className,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) {
      setError("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY missing");
      return;
    }
    let cancelled = false;
    loadScript(apiKey)
      .then(() => {
        if (cancelled || !inputRef.current || !window.google?.maps?.places)
          return;
        const autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            fields: ["place_id", "formatted_address", "geometry"],
            types: ["address"],
          },
        );
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const lat = place.geometry?.location?.lat();
          const lng = place.geometry?.location?.lng();
          if (
            place.place_id &&
            place.formatted_address &&
            typeof lat === "number" &&
            typeof lng === "number"
          ) {
            onPick({
              address: place.formatted_address,
              latitude: lat,
              longitude: lng,
              placeId: place.place_id,
            });
          }
        });
      })
      .catch((e: Error) => setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [apiKey, onPick]);

  return (
    <div className={className}>
      <input
        ref={inputRef}
        defaultValue={defaultAddress}
        placeholder={placeholder ?? "Search for an address"}
        className="w-full bg-surface-container-high rounded-lg p-4 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all border-none outline-none"
      />
      {error && <p className="text-error text-xs mt-2">{error}</p>}
    </div>
  );
}
