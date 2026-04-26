"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  getBookingByReference,
  type BookingStatusInfo,
} from "@/lib/api/bookings";

type View = "loading" | "confirmed" | "pending" | "failed" | "missing";

const POLL_INTERVAL_MS = 3000;
const POLL_MAX_MS = 60_000;

export default function BookingConfirmationPage() {
  const t = useTranslations("confirmation");
  const searchParams = useSearchParams();
  const reference = searchParams.get("ref");
  const [view, setView] = useState<View>(reference ? "loading" : "missing");
  const [booking, setBooking] = useState<BookingStatusInfo | null>(null);

  useEffect(() => {
    if (!reference) return;
    let cancelled = false;
    const startedAt = Date.now();

    async function tick() {
      if (cancelled || !reference) return;
      try {
        const b = await getBookingByReference(reference);
        if (cancelled) return;
        if (!b) {
          setView("missing");
          return;
        }
        setBooking(b);
        const paid = b.payment?.status === "completed";
        if (
          paid ||
          b.status === "confirmed" ||
          b.status === "checked_in" ||
          b.status === "completed"
        ) {
          setView("confirmed");
          return;
        }
        if (b.status === "cancelled" || b.payment?.status === "failed") {
          setView("failed");
          return;
        }
        if (Date.now() - startedAt > POLL_MAX_MS) {
          setView("pending");
          return;
        }
        setTimeout(tick, POLL_INTERVAL_MS);
      } catch {
        if (cancelled) return;
        setView("missing");
      }
    }
    tick();
    return () => {
      cancelled = true;
    };
  }, [reference]);

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-10 flex flex-col items-center">
          <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border:
                  view === "confirmed"
                    ? "4px solid rgba(230,195,100,0.2)"
                    : view === "failed"
                      ? "4px solid rgba(255,180,171,0.2)"
                      : "4px solid rgba(208,197,178,0.2)",
                transform: "scale(1.1)",
              }}
            ></div>
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center ${
                view === "confirmed"
                  ? "gold-gradient text-on-primary"
                  : view === "failed"
                    ? "bg-error text-on-surface"
                    : "bg-surface-container-high text-primary"
              }`}
            >
              <span
                className={`material-symbols-outlined text-4xl ${
                  view === "loading" || view === "pending" ? "animate-spin" : ""
                }`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {view === "confirmed"
                  ? "check_circle"
                  : view === "failed"
                    ? "cancel"
                    : view === "missing"
                      ? "help"
                      : "progress_activity"}
              </span>
            </div>
          </div>
          <h1 className="font-headline text-5xl md:text-5xl text-on-surface mb-3">
            {view === "confirmed"
              ? t("title")
              : view === "pending"
                ? t("pendingTitle")
                : view === "failed"
                  ? t("failedTitle")
                  : view === "missing"
                    ? t("notFoundTitle")
                    : t("verifyingTitle")}
          </h1>
          {reference && (
            <p className="font-mono text-primary tracking-widest text-sm bg-primary/10 px-4 py-1.5 rounded-full inline-block">
              {reference}
            </p>
          )}
          <p className="mt-6 text-on-surface-variant max-w-lg">
            {view === "confirmed"
              ? t("confirmedSubtitle")
              : view === "pending"
                ? t("pendingSubtitle")
                : view === "failed"
                  ? t("failedSubtitle")
                  : view === "missing"
                    ? t("notFoundSubtitle")
                    : t("verifyingSubtitle")}
          </p>
        </div>

        {view === "confirmed" && booking && (
          <div className="bg-surface-container rounded-xl p-8 mb-12 text-left relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-8 relative z-10">
              <div className="w-full md:w-1/3 h-48 md:h-auto rounded-lg overflow-hidden relative">
                <Image
                  src={booking.property.coverImage}
                  alt={booking.property.name}
                  loading="eager"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className="font-label text-xs uppercase tracking-[0.2em] text-primary mb-2 block">
                    {t("curatedStay")}
                  </span>
                  <h2 className="font-headline text-2xl mb-4 text-on-surface">
                    {booking.property.name}
                  </h2>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                    <div>
                      <p className="text-on-surface-variant text-xs uppercase tracking-wider">
                        {t("checkIn")}
                      </p>
                      <p className="font-medium text-on-surface">
                        {new Date(booking.check_in).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant text-xs uppercase tracking-wider">
                        {t("checkOut")}
                      </p>
                      <p className="font-medium text-on-surface">
                        {new Date(booking.check_out).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-on-surface-variant text-xs uppercase tracking-wider">
                        {t("location")}
                      </p>
                      <p className="font-medium text-on-surface">
                        {booking.property.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {view === "confirmed" ? (
            <Link
              href="/dashboard/user"
              className="gold-gradient text-on-primary px-10 py-4 rounded font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              {t("viewBooking")}
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          ) : view === "failed" || view === "missing" ? (
            <Link
              href="/properties"
              className="gold-gradient text-on-primary px-10 py-4 rounded font-bold shadow-lg hover:brightness-110 transition-all"
            >
              {t("tryAgain")}
            </Link>
          ) : null}
          <Link
            href="/"
            className="text-on-surface px-10 py-4 rounded font-medium hover:bg-surface-container transition-all"
            style={{ border: "1px solid #4d4637" }}
          >
            {t("backHome")}
          </Link>
        </div>
      </div>
    </main>
  );
}
