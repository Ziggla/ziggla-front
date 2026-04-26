"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import GooglePlacePicker from "@/components/maps/GooglePlacePicker";
import PropertyMap from "@/components/maps/PropertyMap";
import {
  createProperty,
  uploadPropertyImages,
} from "@/lib/api/properties";

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export default function NewPropertyPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("Studio");
  const [neighborhood, setNeighborhood] = useState("");
  const [size, setSize] = useState<number>(50);
  const [maxGuests, setMaxGuests] = useState<number>(2);
  const [pricePerNight, setPricePerNight] = useState<number>(150);
  const [deposit, setDeposit] = useState("");
  const [checkInTime, setCheckInTime] = useState("15:00");
  const [checkOutTime, setCheckOutTime] = useState("11:00");
  const [amenities, setAmenities] = useState("WiFi, Air Conditioning, Full Kitchen");
  const [rules, setRules] = useState("No smoking, No parties, Adults only");
  const [files, setFiles] = useState<File[]>([]);
  const [picked, setPicked] = useState<{
    address: string;
    latitude: number;
    longitude: number;
    placeId: string;
  } | null>(null);

  async function handleSubmit() {
    if (saving) return;
    setError(null);
    if (!name || !slug || !picked || !pricePerNight) {
      setError("Name, slug, address and price are required.");
      return;
    }
    setSaving(true);
    try {
      const property = await createProperty({
        slug,
        name,
        address: picked.address,
        latitude: picked.latitude,
        longitude: picked.longitude,
        place_id: picked.placeId,
        neighborhood: neighborhood || undefined,
        type,
        size_sqm: size,
        max_guests: maxGuests,
        price_per_night: pricePerNight,
        check_in_time: checkInTime,
        check_out_time: checkOutTime,
        deposit: deposit || undefined,
        amenities: amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        rules: rules
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean),
      });
      if (files.length > 0) {
        await uploadPropertyImages(property.id, files);
      }
      router.push("/dashboard/host/properties");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Create failed");
      setSaving(false);
    }
  }

  return (
    <DashboardShell role="host" activeItem="properties">
      <main className="flex-1 bg-background px-8 py-10">
        <h1 className="font-headline text-3xl text-on-surface mb-8">
          Publish a new listing
        </h1>

        <div className="space-y-6 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Name">
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slug) setSlug(slugify(e.target.value));
                }}
                className="input"
                placeholder="The Gilded Atelier"
              />
            </Field>
            <Field label="Slug (URL)">
              <input
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                className="input"
                placeholder="gilded-atelier"
              />
            </Field>
          </div>

          <Field label="Address (Google Maps)">
            <GooglePlacePicker
              onPick={setPicked}
              placeholder="Search the address…"
            />
            {picked && (
              <p className="text-on-surface-variant text-xs mt-2">
                {picked.address}
              </p>
            )}
          </Field>

          {picked && (
            <PropertyMap
              latitude={picked.latitude}
              longitude={picked.longitude}
              placeId={picked.placeId}
              address={picked.address}
            />
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Field label="Type">
              <input
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Neighborhood">
              <input
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="input"
                placeholder="Putney"
              />
            </Field>
            <Field label="Size (m²)">
              <input
                type="number"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="input"
              />
            </Field>
            <Field label="Max guests">
              <input
                type="number"
                value={maxGuests}
                onChange={(e) => setMaxGuests(Number(e.target.value))}
                className="input"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Field label="Price / night">
              <input
                type="number"
                value={pricePerNight}
                onChange={(e) => setPricePerNight(Number(e.target.value))}
                className="input"
              />
            </Field>
            <Field label="Deposit">
              <input
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                className="input"
                placeholder="€200"
              />
            </Field>
            <Field label="Check-in">
              <input
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Check-out">
              <input
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                className="input"
              />
            </Field>
          </div>

          <Field label="Amenities (comma-separated)">
            <textarea
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
              rows={2}
              className="input"
            />
          </Field>

          <Field label="House rules (comma-separated)">
            <textarea
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              rows={2}
              className="input"
            />
          </Field>

          <Field label="Images">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                setFiles((prev) => [...prev, ...Array.from(e.target.files ?? [])])
              }
              className="text-on-surface-variant text-sm"
            />
            {files.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                {files.map((f, i) => {
                  const url = URL.createObjectURL(f);
                  return (
                    <div
                      key={i}
                      className="relative aspect-square rounded-lg overflow-hidden bg-surface-container-high"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={f.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFiles((prev) => prev.filter((_, idx) => idx !== i))
                        }
                        className="absolute top-2 right-2 bg-error text-on-surface rounded-full w-7 h-7 flex items-center justify-center shadow"
                      >
                        <span className="material-symbols-outlined text-base">
                          close
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </Field>

          {error && <p className="text-error text-sm">{error}</p>}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="gold-gradient text-on-primary px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? "Publishing…" : "Publish listing"}
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

        <style jsx>{`
          .input {
            width: 100%;
            background: var(--color-surface-container-high, #1f2a3d);
            color: var(--color-on-surface, #d7e3fc);
            border: none;
            outline: none;
            border-radius: 0.5rem;
            padding: 0.75rem 1rem;
          }
          .input:focus {
            box-shadow: 0 0 0 2px rgba(230, 195, 100, 0.4);
          }
        `}</style>
      </main>
    </DashboardShell>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-on-surface-variant mb-2 block">
        {label}
      </label>
      {children}
    </div>
  );
}
