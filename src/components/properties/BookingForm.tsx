"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Property } from "@/data/properties";
import { useRouter } from "@/i18n/navigation";

interface BookingFormProps {
  property: Property;
}

export default function BookingForm({ property }: BookingFormProps) {
  const t = useTranslations("booking");
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.round(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  const subtotal = nights * property.pricePerNight;
  const total = subtotal;

  return (
    <div className="bg-surface-container-high rounded-xl p-6 space-y-5 sticky top-24">
      {/* Price header */}
      <div className="flex items-end gap-2 justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="font-label font-bold text-on-surface text-2xl">
              £{property.pricePerNight}
            </span>
            <span className="text-on-surface-variant text-sm">
              {t("perNight")}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-primary text-sm">
              star
            </span>
            <span className="text-on-surface font-label text-sm font-medium">
              {property.rating}
            </span>
            <span className="text-on-surface-variant text-xs">
              · {property.reviewCount} {t("reviews")}
            </span>
          </div>
        </div>
        <span className="bg-primary/20 text-primary text-xs font-label font-semibold tracking-wide px-3 py-1 rounded-full">
          {t("topRated")}
        </span>
      </div>

      {/* Date inputs */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-on-surface-variant text-xs font-label tracking-widest uppercase">
            {t("checkIn")}
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="bg-surface-container text-on-surface text-sm font-body px-3 py-2.5 rounded-lg outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-200"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-on-surface-variant text-xs font-label tracking-widest uppercase">
            {t("checkOut")}
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="bg-surface-container text-on-surface text-sm font-body px-3 py-2.5 rounded-lg outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-200"
          />
        </div>
      </div>

      {/* Guests */}
      <div className="flex flex-col gap-1">
        <label className="text-on-surface-variant text-xs font-label tracking-widest uppercase">
          {t("guests")}
        </label>
        <div className="flex items-center gap-4 bg-surface-container rounded-lg px-4 py-2.5">
          <button
            onClick={() => setGuests(Math.max(1, guests - 1))}
            className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:text-primary transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-base">remove</span>
          </button>
          <span className="flex-1 text-center font-label font-medium text-on-surface">
            {guests} {t("adults")}
          </span>
          <button
            onClick={() => setGuests(Math.min(6, guests + 1))}
            className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:text-primary transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-base">add</span>
          </button>
        </div>
      </div>

      {/* Price breakdown */}
      {nights > 0 && (
        <div className="space-y-3 pt-3 border-t border-outline-variant/20">
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant font-body">
              £{property.pricePerNight} × {nights} nights
            </span>
            <span className="text-on-surface font-label">£{subtotal}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-outline-variant/20">
            <span className="text-on-surface font-label font-semibold text-sm">
              {t("total")}
            </span>
            <span className="text-primary font-label font-bold text-lg">
              £{total}
            </span>
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={() => {
          const params = new URLSearchParams({
            checkIn,
            checkOut,
            guests: String(guests),
            nights: String(nights),
            total: String(total),
            pricePerNight: String(property.pricePerNight),
            propertyName: property.name,
          });
          router.push(`/booking/${property.slug}?${params.toString()}`);
        }}
        className="w-full gold-gradient text-on-primary text-xs font-label font-semibold tracking-widest uppercase py-4 rounded-full hover:opacity-90 transition-opacity duration-200 flex items-center justify-center"
      >
        {t("confirmBooking")}
      </button>

      <p className="text-center text-on-surface-variant text-xs font-body">
        {t("notChargedYet")}
      </p>
    </div>
  );
}
