"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import { getBookings, type Booking, type BookingStatus } from "@/lib/api/bookings";
import { useAuth } from "@/lib/auth/AuthContext";
import Price from "@/components/Price";

const UPCOMING_STATUSES: BookingStatus[] = ["confirmed", "checked_in"];
const PAID_STATUSES: BookingStatus[] = ["confirmed", "checked_in", "completed"];

export default function UserDashboardPage() {
  const t = useTranslations("dashboard.user");
  const { user } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const userId = user?.id ?? "usr-001";
    getBookings(userId)
      .then(setBookings)
      .catch((err) => console.error("Failed to load bookings", err));
  }, [user]);

  const upcomingBookings = bookings.filter((b) => UPCOMING_STATUSES.includes(b.status));
  const pastBookings = bookings.filter((b) => b.status === "completed");
  // Sum every paid booking — past, current, and upcoming — not just completed stays.
  const totalSpent = bookings
    .filter((b) => PAID_STATUSES.includes(b.status))
    .reduce((acc, b) => acc + b.total, 0);

  const nextStay = upcomingBookings[0] ?? null;

  return (
    <DashboardShell role="user" activeItem="dashboard">
      <main className="flex-1 bg-background">
        {/* Top Header */}
        <header className="sticky top-4 z-40 pointer-events-none">
          <div className="bg-surface-container-lowest/80 backdrop-blur-xl rounded-full mx-8 px-8 py-3 flex justify-between items-center shadow-2xl pointer-events-auto">
            <h1 className="font-headline text-xl text-on-surface italic pl-10">{t("myJourneys")}</h1>
            <div className="flex items-center gap-6">
              <div className="hidden md:flex gap-8">
                <Link href="/properties" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
                  {t("apartments")}
                </Link>
              </div>
              <Link
                href="/booking/gilded-atelier"
                className="gold-gradient text-on-primary px-6 py-2 rounded-full text-xs font-bold tracking-tight uppercase hover:opacity-90 transition-opacity"
              >
                {t("bookNow")}
              </Link>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-8 py-12">
          {/* Bookings Tab */}
          <div className="mb-8">
            <span className="text-xs uppercase tracking-widest text-primary font-bold border-b-2 border-primary pb-1">
              {t("bookingsTab")}
            </span>
          </div>

          {/* Stats Row */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-surface-container-low p-8 rounded-lg relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                <span className="material-symbols-outlined" style={{ fontSize: "96px" }}>travel_explore</span>
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-4">
                {t("totalStays")}
              </p>
              <p className="text-4xl font-headline text-on-surface">{bookings.length}</p>
            </div>
            <div className="bg-surface-container p-8 rounded-lg relative overflow-hidden group" style={{ boxShadow: "0 0 0 1px rgba(230,195,100,0.1)" }}>
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: "96px" }}>event_available</span>
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">{t("upcoming")}</p>
              <p className="text-4xl font-headline text-on-surface">{upcomingBookings.length}</p>
            </div>
            <div className="bg-surface-container-low p-8 rounded-lg relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                <span className="material-symbols-outlined" style={{ fontSize: "96px" }}>account_balance_wallet</span>
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-4">
                {t("totalSpent")}
              </p>
              <Price
                amount={totalSpent}
                fractionDigits={2}
                className="text-4xl font-headline text-primary"
              />
            </div>
          </section>

          {/* Upcoming Bookings */}
          <section className="mb-20">
            <div className="flex items-baseline gap-4 mb-8">
              <h2 className="font-headline text-3xl text-on-surface">{t("upcomingBookings")}</h2>
              <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(77,70,55,0.3), transparent)" }}></div>
            </div>

            {nextStay ? (
              <div className="bg-surface-container-low rounded-lg overflow-hidden flex flex-col md:flex-row shadow-xl group">
                <div className="md:w-1/3 relative overflow-hidden" style={{ minHeight: "250px" }}>
                  <Image
                    src={nextStay.property.coverImage}
                    alt={nextStay.property.name}
                    fill
                    loading="eager"
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-on-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    {nextStay.status === "checked_in" ? "Checked In" : nextStay.status.charAt(0).toUpperCase() + nextStay.status.slice(1)}
                  </div>
                </div>
                <div className="md:w-2/3 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-headline text-2xl text-on-surface">{nextStay.property.name}</h3>
                      <Price
                        amount={nextStay.total}
                        fractionDigits={2}
                        className="text-2xl font-headline text-primary"
                      />
                    </div>
                    <div className="flex flex-wrap gap-8 text-on-surface-variant">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-primary">calendar_today</span>
                        <span className="text-sm font-medium tracking-tight">
                          {new Date(nextStay.checkIn).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          {" — "}
                          {new Date(nextStay.checkOut).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                        <span className="text-sm font-medium tracking-tight">{nextStay.property.neighborhood}, London</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-primary">group</span>
                        <span className="text-sm font-medium tracking-tight">{nextStay.guestsCount} {t("guestsCount")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex gap-4 pt-8" style={{ borderTop: "1px solid rgba(77,70,55,0.1)" }}>
                    <Link
                      href={`/dashboard/user/bookings/${nextStay.id}`}
                      className="bg-primary text-on-primary px-8 py-3 text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all rounded-sm"
                    >
                      {t("viewDetails")}
                    </Link>
                    <button className="text-on-surface-variant/60 hover:text-error px-8 py-3 text-xs font-bold uppercase tracking-widest transition-colors">
                      {t("cancel")}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-surface-container-low rounded-lg p-12 text-center">
                <span className="material-symbols-outlined text-on-surface-variant text-4xl mb-4 block">event_available</span>
                <p className="font-headline text-xl text-on-surface mb-1">No upcoming stays</p>
                <p className="text-sm text-on-surface-variant">
                  <Link href="/properties" className="text-primary hover:underline underline-offset-4">Browse apartments</Link> to plan your next visit.
                </p>
              </div>
            )}
          </section>

          {/* Past Bookings */}
          {pastBookings.length > 0 && (
            <section>
              <div className="flex items-baseline gap-4 mb-8">
                <h2 className="font-headline text-2xl text-on-surface-variant">{t("pastBookings")}</h2>
                <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(77,70,55,0.2), transparent)" }}></div>
              </div>
              <div className="space-y-6">
                {pastBookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-surface-container-low/50 rounded-lg p-6 flex items-center gap-8 opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 relative">
                      <Image
                        loading="eager"
                        src={b.property.coverImage}
                        alt={b.property.name}
                        fill
                        className="object-cover grayscale-50"
                        sizes="96px"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-headline text-lg text-on-surface">{b.property.name}</h4>
                      <p className="text-xs text-on-surface-variant/80 uppercase tracking-widest mt-1">
                        {new Date(b.checkIn).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        {" — "}
                        {new Date(b.checkOut).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div className="text-right">
                      {b.hasReview ? (
                        <div className="flex items-center gap-1 text-primary mb-1 justify-end">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <span
                              key={i}
                              className="material-symbols-outlined text-xs"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              star
                            </span>
                          ))}
                        </div>
                      ) : (
                        <Link
                          href={`/dashboard/user/bookings/${b.id}`}
                          className="block mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:underline underline-offset-4 mb-1"
                        >
                          {t("leaveReview")}
                        </Link>
                      )}
                      <Price
                        amount={b.total}
                        fractionDigits={2}
                        className="text-lg font-headline text-on-surface-variant/60"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </DashboardShell>
  );
}
