"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Price from "@/components/Price";

export type BookingStatus = "confirmed" | "completed" | "cancelled" | "pending" | "checked_in";

export interface Stay {
  id: string;
  reference: string;
  propertyName: string;
  propertyLocation: string;
  propertyImage: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  total: string;
  totalAmount: number;
  status: BookingStatus;
  hasReview?: boolean;
}

interface StayCardProps {
  stay: Stay;
  onCancel?: (id: string) => void;
}

const STATUS_CLASSES: Record<BookingStatus, string> = {
  confirmed:  "bg-primary/20 text-primary",
  completed:  "bg-green-500/15 text-green-400",
  cancelled:  "bg-error/15 text-error",
  pending:    "bg-secondary/20 text-secondary",
  checked_in: "bg-tertiary/20 text-tertiary",
};

export default function StayCard({ stay, onCancel }: StayCardProps) {
  const t = useTranslations("dashboard.bookings.card");
  const statusClasses = STATUS_CLASSES[stay.status];
  const isUpcoming = stay.status === "confirmed" || stay.status === "pending" || stay.status === "checked_in";
  const isCompleted = stay.status === "completed";

  return (
    <article className="bg-surface-container-low rounded-xl overflow-hidden flex flex-col md:flex-row group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
      {/* Image */}
      <div
        className="md:w-56 lg:w-64 shrink-0 relative overflow-hidden"
        style={{ minHeight: "13rem" }}
      >
        <Image
          src={stay.propertyImage}
          alt={stay.propertyName}
          fill
          loading="eager"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 256px"
        />
        {/* mobile: fade bottom — desktop: fade right edge toward content */}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent md:bg-linear-to-l md:from-black/30 md:to-transparent" />
        <span
          className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${statusClasses}`}
        >
          {t(`status.${stay.status}`)}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">
              {stay.propertyLocation}
            </p>
            <h3 className="font-headline text-xl text-on-surface">{stay.propertyName}</h3>
            <p className="text-xs text-on-surface-variant/60 font-label mt-1">
              {t("ref")} {stay.reference}
            </p>
          </div>
          <Price
            amount={stay.totalAmount}
            fractionDigits={2}
            className="text-2xl font-headline text-primary shrink-0"
          />
        </div>

        {/* Details row */}
        <div className="flex flex-wrap gap-5 text-sm text-on-surface-variant mb-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">calendar_today</span>
            <span>{stay.checkIn} — {stay.checkOut}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">bedtime</span>
            <span>{t("nights", { count: stay.nights })}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">group</span>
            <span>{t("guests", { count: stay.guests })}</span>
          </div>
        </div>

        {/* Actions */}
        <div
          className="flex flex-wrap items-center gap-3 mt-5 pt-5"
          style={{ borderTop: "1px solid rgba(77,70,55,0.12)" }}
        >
          <Link
            href={`/dashboard/user/bookings/${stay.id}`}
            className="gold-gradient text-on-primary px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">visibility</span>
            {t("viewDetails")}
          </Link>

          {isCompleted && !stay.hasReview && (
            <button className="bg-surface-container-high text-on-surface px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-surface-container-highest transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">star</span>
              {t("leaveReview")}
            </button>
          )}

          {isCompleted && stay.hasReview && (
            <span className="flex items-center gap-1.5 text-xs text-primary font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
              {t("reviewed")}
            </span>
          )}

          {isUpcoming && onCancel && (
            <button
              onClick={() => onCancel(stay.id)}
              className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/50 hover:text-error transition-colors px-4 py-2.5"
            >
              {t("cancel")}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
