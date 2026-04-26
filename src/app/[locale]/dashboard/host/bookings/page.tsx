"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import {
  getBookingsByHost,
  type Booking,
  type BookingStatus,
} from "@/lib/api/bookings";
import Price from "@/components/Price";

type Tab = "all" | "upcoming" | "past" | "cancelled";

const TABS: Tab[] = ["all", "upcoming", "past", "cancelled"];
const UPCOMING: BookingStatus[] = ["confirmed", "checked_in"];

export default function HostBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("all");

  useEffect(() => {
    getBookingsByHost()
      .then(setBookings)
      .catch((err) => console.error("Failed to load bookings", err))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => {
    if (tab === "upcoming")
      return bookings.filter((b) => UPCOMING.includes(b.status));
    if (tab === "past") return bookings.filter((b) => b.status === "completed");
    if (tab === "cancelled")
      return bookings.filter((b) => b.status === "cancelled");
    return bookings;
  }, [bookings, tab]);

  const stats = useMemo(() => {
    const paid = bookings.filter((b) =>
      ["confirmed", "checked_in", "completed"].includes(b.status),
    );
    return {
      total: bookings.length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      checkedIn: bookings.filter((b) => b.status === "checked_in").length,
      revenue: paid.reduce((acc, b) => acc + b.total, 0),
    };
  }, [bookings]);

  const statusStyle = (s: BookingStatus) => {
    if (s === "confirmed") return "bg-primary/20 text-primary";
    if (s === "checked_in") return "bg-secondary/20 text-secondary";
    if (s === "completed") return "bg-tertiary/20 text-tertiary";
    if (s === "cancelled") return "bg-error/20 text-error";
    return "bg-surface-container-high text-on-surface-variant";
  };

  return (
    <DashboardShell role="host" activeItem="bookings">
      <main className="flex-1 bg-background">
        <header className="sticky top-4 z-40 pointer-events-none">
          <div className="bg-surface-container-lowest/80 backdrop-blur-xl rounded-full mx-8 px-8 py-3 flex justify-between items-center shadow-2xl pointer-events-auto">
            <h1 className="font-headline text-xl text-on-surface italic pl-10">
              Bookings
            </h1>
            <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
              {bookings.length} total
            </span>
          </div>
        </header>

        <div className="px-8 py-10">
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <Stat label="Total" value={stats.total} />
            <Stat label="Confirmed" value={stats.confirmed} accent />
            <Stat label="Currently in-house" value={stats.checkedIn} />
            <div className="bg-surface-container-low p-6 rounded-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-3">
                Total revenue
              </p>
              <Price
                amount={stats.revenue}
                fractionDigits={0}
                className="text-3xl font-headline text-primary"
              />
            </div>
          </section>

          <div className="flex gap-2 mb-6 overflow-x-auto">
            {TABS.map((t) => {
              const count =
                t === "all"
                  ? bookings.length
                  : t === "upcoming"
                    ? bookings.filter((b) => UPCOMING.includes(b.status)).length
                    : t === "past"
                      ? bookings.filter((b) => b.status === "completed").length
                      : bookings.filter((b) => b.status === "cancelled").length;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${
                    tab === t
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {t} ({count})
                </button>
              );
            })}
          </div>

          <div className="bg-surface-container-low rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-high/50 text-xs uppercase tracking-widest text-on-surface-variant">
                  <th className="px-6 py-4">Ref</th>
                  <th className="px-6 py-4">Guest</th>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Check-in</th>
                  <th className="px-6 py-4">Check-out</th>
                  <th className="px-6 py-4 text-center">Nights</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading && (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-on-surface-variant">
                      Loading…
                    </td>
                  </tr>
                )}
                {!loading && visible.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-on-surface-variant">
                      No bookings.
                    </td>
                  </tr>
                )}
                {visible.map((b, idx) => (
                  <tr
                    key={b.id}
                    className="hover:bg-surface-container-high transition-colors"
                    style={{ backgroundColor: idx % 2 === 0 ? "#142032" : "#101c2e" }}
                  >
                    <td className="px-6 py-4 font-mono text-primary text-xs">
                      {b.reference}
                    </td>
                    <td className="px-6 py-4 font-bold">
                      {b.guest ? `${b.guest.firstName} ${b.guest.lastName}` : "—"}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {b.property.name}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(b.checkIn).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(b.checkOut).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">{b.nights}</td>
                    <td className="px-6 py-4 font-medium">
                      <Price amount={b.total} fractionDigits={2} />
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`${statusStyle(b.status)} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`}
                      >
                        {b.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </DashboardShell>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`p-6 rounded-xl ${accent ? "bg-surface-container border-l-4 border-primary" : "bg-surface-container-low"}`}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-3">
        {label}
      </p>
      <p className="text-3xl font-headline text-on-surface">{value}</p>
    </div>
  );
}
