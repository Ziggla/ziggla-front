"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getProperties, type Property } from "@/lib/api/properties";


export default function SearchPage() {
  const t = useTranslations("search");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [properties, setProperties] = useState<Property[]>([]);
  const [amenityFilters, setAmenityFilters] = useState({
    jacuzzi: true,
    concierge: false,
    kitchen: true,
    spa: false,
  });

  useEffect(() => {
    let cancelled = false;
    getProperties()
      .then((p) => {
        if (!cancelled) setProperties(p);
      })
      .catch(() => {
        /* empty list on failure */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleAmenity = (key: keyof typeof amenityFilters) => {
    setAmenityFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <main className="pt-32 pb-20 max-w-7xl mx-auto px-6">
      {/* Sticky Search Bar */}
      <header className="sticky top-20 z-40 mb-12">
        <div className="bg-surface-container-lowest/90 backdrop-blur-xl rounded-xl p-4 shadow-2xl flex flex-wrap lg:flex-nowrap items-center gap-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col px-4 border-r border-outline-variant/20">
              <span className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">
                {t("checkIn")}
              </span>
              <input
                className="bg-transparent border-none p-0 text-on-surface font-semibold focus:outline-none text-sm"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div className="flex flex-col px-4 border-r border-outline-variant/20">
              <span className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">
                {t("checkOut")}
              </span>
              <input
                className="bg-transparent border-none p-0 text-on-surface font-semibold focus:outline-none text-sm"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
            <div className="flex flex-col px-4">
              <span className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">
                {t("guests")}
              </span>
              <input
                className="bg-transparent border-none p-0 text-on-surface font-semibold focus:outline-none text-sm"
                type="number"
                min="1"
                max="4"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              />
            </div>
          </div>
          <button className="gold-gradient text-on-primary px-10 py-4 rounded-lg font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">search</span>
            {t("searchBtn")}
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filter Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 space-y-10">
          <div>
            <h3 className="font-headline text-on-surface text-xl mb-6">
              {t("refineStay")}
            </h3>

            {/* Price Range */}
            <div className="mb-10">
              <label className="block text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-4">
                {t("priceRange")}
              </label>
              <div className="relative h-1 w-full bg-surface-container-highest rounded-full mb-6">
                <div className="absolute left-0 right-1/4 h-full bg-primary rounded-full" />
                <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg cursor-pointer" />
              </div>
              <div className="flex justify-between text-xs font-mono text-on-surface-variant">
                <span>£0</span>
                <span>£500+</span>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-4">
                {t("amenitiesLabel")}
              </label>
              {(
                [
                  { key: "jacuzzi", label: t("amenityPool") },
                  { key: "concierge", label: t("amenityConcierge") },
                  { key: "kitchen", label: t("amenityKitchen") },
                  { key: "spa", label: t("amenitySpa") },
                ] as const
              ).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => toggleAmenity(key)}
                  className="flex items-center gap-3 group cursor-pointer w-full text-left"
                >
                  <div
                    className={`w-5 h-5 rounded-sm flex items-center justify-center transition-colors ${
                      amenityFilters[key]
                        ? "bg-primary"
                        : "bg-surface-container-high group-hover:bg-surface-container-highest"
                    }`}
                  >
                    {amenityFilters[key] && (
                      <span
                        className="material-symbols-outlined text-on-primary text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-sm transition-colors ${
                      amenityFilters[key]
                        ? "text-on-surface font-semibold"
                        : "text-on-surface-variant group-hover:text-primary"
                    }`}
                  >
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <section className="flex-1 space-y-8">
          <div className="flex justify-between items-end mb-4">
            <h2 className="font-headline text-3xl text-on-surface">
              {t("curatedResults")}{" "}
              <span className="text-on-surface-variant font-body text-sm ml-2">
                ({properties.length} {t("properties")})
              </span>
            </h2>
            <span className="text-xs uppercase tracking-widest text-on-surface-variant">
              {t("sortedBy")}
            </span>
          </div>

          {properties.map((property) => (
            <div
              key={property.slug}
              className="group flex flex-col md:flex-row bg-surface-container-low overflow-hidden rounded-lg hover:bg-surface-container transition-all duration-500"
            >
              {/* Image */}
              <div className="relative w-full md:w-95 h-65 shrink-0 overflow-hidden">
                <Image
                  loading="eager"
                  src={property.coverImage}
                  alt={property.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="380px"
                />
                <div className="absolute top-4 left-4 bg-surface-container-lowest/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span
                    className="material-symbols-outlined text-primary text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="text-xs font-bold text-on-surface">
                    {property.rating}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-headline text-2xl text-on-surface group-hover:text-primary transition-colors">
                      {property.name}
                    </h3>
                  </div>
                  <p className="text-on-surface-variant text-xs flex items-center gap-1 mb-4">
                    <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                    {property.address}
                  </p>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary text-base">hot_tub</span>
                      <span className="text-xs">Jacuzzi</span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary text-base">square_foot</span>
                      <span className="text-xs">{property.size} m²</span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary text-base">wifi</span>
                      <span className="text-xs">WiFi 66Mb/s</span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary text-base">location_city</span>
                      <span className="text-xs">City View</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-5 border-t border-outline-variant/10">
                  <div>
                    <span className="text-primary font-headline text-3xl">
                      £{property.pricePerNight}
                    </span>
                    <span className="text-on-surface-variant text-xs uppercase tracking-widest ml-2">
                      {t("perNight")}
                    </span>
                  </div>
                  <Link
                    href={`/booking/${property.slug}`}
                    className="gold-gradient px-8 py-3 rounded-sm text-on-primary font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-all"
                  >
                    {t("bookNow")}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
