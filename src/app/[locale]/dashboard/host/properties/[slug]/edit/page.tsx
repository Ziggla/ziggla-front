"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import GooglePlacePicker from "@/components/maps/GooglePlacePicker";
import PropertyMap from "@/components/maps/PropertyMap";
import { updateProperty } from "@/lib/api/properties";
import { apiFetch } from "@/lib/api/client";

interface RawHostProperty {
  id: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  place_id: string | null;
}

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.slug);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [property, setProperty] = useState<RawHostProperty | null>(null);
  const [picked, setPicked] = useState<{
    address: string;
    latitude: number;
    longitude: number;
    placeId: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<RawHostProperty>(`/properties/${id}`)
      .then((p) => {
        if (cancelled) return;
        setProperty(p);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSave() {
    if (!picked || saving) return;
    setSaving(true);
    setError(null);
    try {
      await updateProperty(id, {
        address: picked.address,
        latitude: picked.latitude,
        longitude: picked.longitude,
        place_id: picked.placeId,
      });
      router.push("/dashboard/host/properties");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
      setSaving(false);
    }
  }

  return (
    <DashboardShell role="host" activeItem="properties">
      <main className="flex-1 bg-background px-8 py-10">
        <h1 className="font-headline text-3xl text-on-surface mb-8">
          Edit property location
        </h1>

        {loading ? (
          <p className="text-on-surface-variant">Loading…</p>
        ) : !property ? (
          <p className="text-error">{error ?? "Property not found"}</p>
        ) : (
          <div className="space-y-8 max-w-3xl">
            <div>
              <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                Property
              </p>
              <p className="text-on-surface text-lg">{property.name}</p>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-on-surface-variant mb-2 block">
                Search the address
              </label>
              <GooglePlacePicker
                defaultAddress={property.address}
                onPick={setPicked}
                placeholder="Start typing the property address…"
              />
              <p className="text-on-surface-variant text-xs mt-2">
                Current: {property.address}
              </p>
            </div>

            {picked && (
              <div>
                <p className="text-xs uppercase tracking-widest text-primary mb-2">
                  New location preview
                </p>
                <p className="text-on-surface text-sm mb-3">{picked.address}</p>
                <PropertyMap
                  latitude={picked.latitude}
                  longitude={picked.longitude}
                  placeId={picked.placeId}
                  address={picked.address}
                />
              </div>
            )}

            {error && <p className="text-error text-sm">{error}</p>}

            <div className="flex gap-4">
              <button
                type="button"
                disabled={!picked || saving}
                onClick={handleSave}
                className="gold-gradient text-on-primary px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? "Saving…" : "Save location"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard/host/properties")}
                className="text-on-surface px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-surface-container transition-all"
                style={{ border: "1px solid #4d4637" }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>
    </DashboardShell>
  );
}
