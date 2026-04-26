"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { type HostProperty, type HostPropertyStatus } from "@/lib/api/analytics";

export const STATUS_CONFIG: Record<
  HostPropertyStatus,
  { label: string; dot: string; text: string; bg: string }
> = {
  active:      { label: "Active",      dot: "#4ade80", text: "text-green-400",           bg: "bg-green-500/15" },
  inactive:    { label: "Inactive",    dot: "#99907e", text: "text-on-surface-variant",  bg: "bg-surface-container-high" },
  maintenance: { label: "Maintenance", dot: "#fb923c", text: "text-orange-400",          bg: "bg-orange-500/15" },
};

interface PropertyCardProps {
  property: HostProperty;
  onStatusChange: (id: string, status: HostPropertyStatus) => void;
  onDelete?: (id: string) => void;
}

export default function PropertyCard({
  property,
  onStatusChange,
  onDelete,
}: PropertyCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [statusDropOpen, setStatusDropOpen] = useState(false);
  const status = STATUS_CONFIG[property.status];

  return (
    <article
      className="group relative flex flex-col md:flex-row bg-surface-container-low rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl"
      style={{ boxShadow: "inset 0 0 0 1px rgba(77,70,55,0.1)", transition: "box-shadow 0.3s" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow =
          "inset 4px 0 0 #e6c364, inset 0 0 0 1px rgba(230,195,100,0.15), 0 20px 60px rgba(0,0,0,0.4)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "inset 0 0 0 1px rgba(77,70,55,0.1)")
      }
    >
      {/* Cover image */}
      <div className="relative shrink-0 overflow-hidden" style={{ width: "280px", minHeight: "220px" }}>
        <Image
          src={property.coverImage}
          alt={property.name}
          fill
          loading="eager"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="280px"
        />
        <div className="absolute inset-0 bg-linear-to-r from-transparent to-surface-container-low/30" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <button
            onClick={() => setStatusDropOpen((p) => !p)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${status.bg} ${status.text} backdrop-blur-sm`}
          >
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: status.dot }} />
            {status.label}
            <span className="material-symbols-outlined text-xs ml-0.5">expand_more</span>
          </button>
          {statusDropOpen && (
            <div
              className="absolute top-full left-0 mt-1 bg-surface-container-highest rounded-lg overflow-hidden shadow-xl z-20"
              style={{ border: "1px solid rgba(77,70,55,0.2)", minWidth: "140px" }}
            >
              {(Object.keys(STATUS_CONFIG) as HostPropertyStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => { onStatusChange(property.id, s); setStatusDropOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-surface-container-high transition-colors ${STATUS_CONFIG[s].text}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_CONFIG[s].dot }} />
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-6">
        {/* Top */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h3 className="font-headline text-2xl text-on-surface mb-1">{property.name}</h3>
            <p className="flex items-center gap-1 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-sm">location_on</span>
              {property.neighborhood} · {property.address}
            </p>
          </div>

          {/* Kebab menu */}
          <div className="relative shrink-0">
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-xl">more_vert</span>
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 top-full mt-1 bg-surface-container-highest rounded-lg overflow-hidden shadow-xl z-20"
                style={{ border: "1px solid rgba(77,70,55,0.2)", minWidth: "160px" }}
              >
                {[
                  {
                    icon: "pause_circle",
                    label: property.status === "active" ? "Pause listing" : "Activate listing",
                    onClick: () =>
                      onStatusChange(
                        property.id,
                        property.status === "active" ? "inactive" : "active",
                      ),
                  },
                  {
                    icon: "delete",
                    label: "Delete",
                    danger: true,
                    onClick: () => {
                      if (
                        onDelete &&
                        confirm(`Delete "${property.name}"? This cannot be undone.`)
                      ) {
                        onDelete(property.id);
                      }
                    },
                  },
                ].map(({ icon, label, danger, onClick }) => (
                  <button
                    key={label}
                    onClick={() => {
                      setMenuOpen(false);
                      onClick?.();
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-medium flex items-center gap-2 hover:bg-surface-container-high transition-colors ${
                      danger ? "text-error" : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">{icon}</span>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded-full text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-sm">bed</span>
            {property.type}
          </span>
          <span className="flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded-full text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-sm">square_foot</span>
            {property.size} m²
          </span>
          <span className="flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded-full text-xs font-bold text-primary">
            <span className="material-symbols-outlined text-sm">payments</span>
            £{property.pricePerNight} / night
          </span>
          <span className="flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded-full text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            {property.rating} · {property.reviewCount} reviews
          </span>
        </div>

        {/* Occupancy bar */}
        <div className="mb-auto">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Occupancy</span>
            <span className="text-sm font-bold text-primary">{property.occupancyRate}%</span>
          </div>
          <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${property.occupancyRate}%` }} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 mt-5 pt-5" style={{ borderTop: "1px solid rgba(77,70,55,0.12)" }}>
          <Link
            href={`/dashboard/host/properties/${property.slug}/edit`}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors"
            style={{ border: "1px solid rgba(77,70,55,0.25)" }}
          >
            <span className="material-symbols-outlined text-base">edit</span>
            Edit Listing
          </Link>
          <Link
            href={`/dashboard/host/properties/${property.slug}/calendar`}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors"
            style={{ border: "1px solid rgba(77,70,55,0.25)" }}
          >
            <span className="material-symbols-outlined text-base">calendar_month</span>
            View Calendar
          </Link>
          <Link
            href={`/properties/${property.slug}`}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-widest text-primary hover:opacity-80 transition-opacity ml-auto"
          >
            <span className="material-symbols-outlined text-base">open_in_new</span>
            View Public Page
          </Link>
        </div>
      </div>
    </article>
  );
}
