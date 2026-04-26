"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import type { Property } from "@/data/properties";
import { useRouter } from "@/i18n/navigation";
import Price from "@/components/Price";
import {
  getPropertyAvailability,
  type AvailabilityRange,
} from "@/lib/api/properties";

interface BookingFormProps {
  property: Property;
}

function rangesOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date,
): boolean {
  return aStart < bEnd && aEnd > bStart;
}

export default function BookingForm({ property }: BookingFormProps) {
  const t = useTranslations("booking");
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [availability, setAvailability] = useState<AvailabilityRange[]>([]);

  useEffect(() => {
    let cancelled = false;
    getPropertyAvailability(property.id)
      .then((d) => {
        if (!cancelled) setAvailability(d);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [property.id]);

  const bookedRanges = useMemo(
    () =>
      availability.map((r) => ({
        start: new Date(r.check_in),
        end: new Date(r.check_out),
      })),
    [availability],
  );

  const conflict = useMemo(() => {
    if (!checkIn || !checkOut) return false;
    const ci = new Date(checkIn);
    const co = new Date(checkOut);
    return bookedRanges.some((b) => rangesOverlap(ci, co, b.start, b.end));
  }, [checkIn, checkOut, bookedRanges]);

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
  const today = new Date().toISOString().split("T")[0];
  const minCheckOut = checkIn
    ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split("T")[0]
    : today;
  const datesValid =
    nights > 0 && new Date(checkOut) > new Date(checkIn) && !conflict;

  return (
    <div className="bg-surface-container-high rounded-xl p-6 space-y-5 sticky top-24">
      {/* Price header */}
      <div className="flex items-end gap-2 justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <Price
              amount={property.pricePerNight}
              className="font-label font-bold text-on-surface text-2xl"
            />
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
            min={today}
            onChange={(e) => {
              setCheckIn(e.target.value);
              if (checkOut && new Date(checkOut) <= new Date(e.target.value)) {
                setCheckOut("");
              }
            }}
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
            min={minCheckOut}
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
            <span className="text-on-surface-variant font-body flex items-center gap-1">
              <Price amount={property.pricePerNight} /> × {nights} nights
            </span>
            <Price amount={subtotal} className="text-on-surface font-label" />
          </div>
          <div className="flex justify-between pt-3 border-t border-outline-variant/20">
            <span className="text-on-surface font-label font-semibold text-sm">
              {t("total")}
            </span>
            <Price
              amount={total}
              className="text-primary font-label font-bold text-lg"
            />
          </div>
        </div>
      )}

      {conflict && (
        <p className="text-error text-xs">{t("datesUnavailable")}</p>
      )}

      {bookedRanges.length > 0 && (
        <details className="text-xs text-on-surface-variant">
          <summary className="cursor-pointer hover:text-on-surface">
            {t("bookedDates")} ({bookedRanges.length})
          </summary>
          <ul className="mt-2 space-y-1">
            {bookedRanges.map((b, i) => (
              <li key={i}>
                {b.start.toLocaleDateString()} → {b.end.toLocaleDateString()}
              </li>
            ))}
          </ul>
        </details>
      )}

      {/* CTA */}
      <button
        onClick={() => {
          if (!datesValid) return;
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
        disabled={!datesValid}
        className="w-full gold-gradient text-on-primary text-xs font-label font-semibold tracking-widest uppercase py-4 rounded-full hover:opacity-90 transition-opacity duration-200 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t("confirmBooking")}
      </button>

      <p className="text-center text-on-surface-variant text-xs font-body">
        {t("notChargedYet")}
      </p>
    </div>
  );
}
