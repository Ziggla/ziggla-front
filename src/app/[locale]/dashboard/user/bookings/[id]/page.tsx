"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import { getBooking, cancelMyBooking, type Booking } from "@/lib/api/bookings";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

const STATUS_CLASSES: Record<string, string> = {
  confirmed:  "bg-primary/20 text-primary",
  completed:  "bg-green-500/15 text-green-400",
  cancelled:  "bg-error/15 text-error",
  pending:    "bg-secondary/20 text-secondary",
  checked_in: "bg-tertiary/20 text-tertiary",
};

const STATUS_LABEL: Record<string, string> = {
  confirmed:  "Confirmed",
  completed:  "Completed",
  cancelled:  "Cancelled",
  pending:    "Pending",
  checked_in: "Checked In",
};

export default function BookingDetailPage() {
  const t = useTranslations("dashboard.user.bookingDetail");
  const { id } = useParams<{ id: string }>();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getBooking(id)
      .then((data) => {
        if (!data) setNotFound(true);
        else setBooking(data);
      })
      .catch((err) => {
        console.error("Failed to load booking", err);
        setNotFound(true);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  return (
    <DashboardShell role="user" activeItem="bookings">
      <main className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <Link
            href="/dashboard/user/bookings"
            className="inline-flex items-center gap-2 text-xs font-label uppercase tracking-widest text-primary/90 hover:text-primary transition-colors mb-8"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            {t("backTo")}
          </Link>

          {isLoading && (
            <p className="text-sm text-on-surface-variant py-12 text-center">Loading…</p>
          )}

          {notFound && !isLoading && (
            <p className="text-sm text-error py-12 text-center">Booking not found.</p>
          )}

          {booking && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="xl:col-span-2 space-y-8">
                {/* Property Title */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-4xl font-headline text-on-surface">{booking.property.name}</h1>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${STATUS_CLASSES[booking.status] ?? ""}`}>
                        {STATUS_LABEL[booking.status] ?? booking.status}
                      </span>
                      <span className="text-xs text-on-surface-variant font-label rounded-full px-3 py-1 bg-surface-container-low">
                        {t("reference")}: {booking.reference}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold mb-1">
                    {booking.property.neighborhood}, London
                  </p>
                </div>

                {/* Cover Image */}
                <div className="relative rounded-xl overflow-hidden" style={{ height: "320px" }}>
                  <Image
                    loading="eager"
                    src={booking.property.coverImage}
                    alt={booking.property.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1280px) 100vw, 66vw"
                  />
                </div>

                {/* Dates Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container-low p-6 rounded-xl">
                    <p className="text-xs uppercase tracking-widest text-on-surface-variant font-label mb-2">
                      {t("checkIn")}
                    </p>
                    <p className="text-2xl font-headline text-on-surface">{formatDateShort(booking.checkIn)}</p>
                    <p className="text-sm text-on-surface-variant">After 3:00 PM</p>
                  </div>
                  <div className="bg-surface-container-low p-6 rounded-xl">
                    <p className="text-xs uppercase tracking-widest text-on-surface-variant font-label mb-2">
                      {t("checkOut")}
                    </p>
                    <p className="text-2xl font-headline text-on-surface">{formatDateShort(booking.checkOut)}</p>
                    <p className="text-sm text-on-surface-variant">Before 11:00 AM</p>
                  </div>
                </div>

                {/* Timeline */}
                {booking.timeline && booking.timeline.length > 0 && (
                  <div className="bg-surface-container-low p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      {booking.timeline.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2 relative flex-1">
                          {idx < booking.timeline!.length - 1 && (
                            <div
                              className="absolute top-5 left-1/2 w-full h-px"
                              style={{ background: step.done ? "rgb(var(--color-primary))" : "rgba(77,70,55,0.2)" }}
                            />
                          )}
                          <div
                            className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${
                              step.done ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"
                            }`}
                          >
                            <span
                              className="material-symbols-outlined text-base"
                              style={step.done ? { fontVariationSettings: "'FILL' 1" } : undefined}
                            >
                              {step.icon}
                            </span>
                          </div>
                          <p className={`text-xs font-bold uppercase tracking-widest ${step.done ? "text-primary" : "text-on-surface-variant"}`}>
                            {step.label}
                          </p>
                          <p className="text-[10px] text-on-surface-variant/60">{step.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* House Rules */}
                {booking.houseRules && booking.houseRules.length > 0 && (
                  <div className="bg-surface-container-low p-6 rounded-xl">
                    <h3 className="text-sm uppercase tracking-widest text-on-surface-variant font-label mb-4">
                      {t("houseRules")}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {booking.houseRules.map((rule, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-surface-container-high rounded-lg flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-primary text-base">{rule.icon}</span>
                          </div>
                          <span className="text-sm text-on-surface">{rule.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Help Card */}
                <div className="bg-surface-container-low p-6 rounded-xl flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-base">support_agent</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-on-surface mb-1">{t("needHelp")}</p>
                    <p className="text-sm text-on-surface-variant mb-4">{t("helpDesc")}</p>
                    <div className="flex gap-3">
                      <button className="gold-gradient text-on-primary px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                        {t("contactHost")}
                      </button>
                      {(booking.status === "confirmed" || booking.status === "pending") && (
                        <button
                          onClick={() => {
                            cancelMyBooking(booking.id)
                              .then((updated) => setBooking(updated))
                              .catch((err) => console.error("Failed to cancel booking", err));
                          }}
                          className="bg-surface-container-high text-error px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-surface-container-highest transition-colors"
                        >
                          {t("cancelBooking")}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar — Booking Summary */}
              <aside className="xl:col-span-1">
                <div className="sticky top-24 bg-surface-container-low p-6 rounded-xl space-y-6">
                  <div className="h-48 relative rounded-xl overflow-hidden">
                    <Image
                      src={booking.property.coverImage}
                      alt={booking.property.name}
                      loading="eager"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1280px) 100vw, 33vw"
                      style={{
                        WebkitMaskImage:
                          "linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0.08) 80%, transparent 100%)",
                        maskImage:
                          "linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0.08) 80%, transparent 100%)",
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                        WebkitMaskSize: "100% 100%",
                        maskSize: "100% 100%",
                      }}
                    />
                    <div className="absolute inset-0 z-20 flex items-end bg-linear-to-t from-surface-container-low/95 via-surface-container-low/45 to-transparent">
                      <div className="px-6 pb-4">
                        <p className="text-[10px] font-bold tracking-widest text-primary uppercase">Summary</p>
                        <h4 className="text-xl font-headline font-bold text-on-surface">Booking Details</h4>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant">{t("dates")}</span>
                      <span className="text-on-surface font-medium">
                        {formatDateShort(booking.checkIn)} — {formatDateShort(booking.checkOut)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant">{t("duration")}</span>
                      <span className="text-on-surface font-medium">{booking.nights} {t("nights")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant">{t("guests")}</span>
                      <span className="text-on-surface font-medium">{booking.guestsCount}</span>
                    </div>
                  </div>

                  <div
                    className="space-y-3 text-sm pt-4"
                    style={{ borderTop: "1px solid rgba(77,70,55,0.15)" }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant">
                        £{booking.property.pricePerNight} × {booking.nights} {t("nights")}
                      </span>
                      <span className="text-on-surface">£{booking.subtotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div
                    className="flex justify-between items-center pt-4"
                    style={{ borderTop: "1px solid rgba(77,70,55,0.15)" }}
                  >
                    <span className="font-bold text-on-surface">{t("total")}</span>
                    <span className="text-2xl font-headline text-primary">£{booking.total.toFixed(2)}</span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <button className="w-full gold-gradient text-on-primary py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-base">download</span>
                      {t("downloadReceipt")}
                    </button>
                    <button className="w-full bg-surface-container-high text-on-surface py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-base">calendar_add_on</span>
                      {t("addCalendar")}
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
    </DashboardShell>
  );
}
