"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import DashboardShell from "@/components/layout/DashboardShell";
import {
  getBookingsByHost,
  type Booking,
  type BookingStatus,
} from "@/lib/api/bookings";
import { getHostProperties, type HostProperty } from "@/lib/api/analytics";
import { useAuth } from "@/lib/auth/AuthContext";
import Price from "@/components/Price";

const PAID: BookingStatus[] = ["confirmed", "checked_in", "completed"];
const OCCUPYING: BookingStatus[] = ["confirmed", "checked_in"];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
function daysInMonth(date: Date) {
  return endOfMonth(date).getDate();
}
function mondayIndex(date: Date) {
  // 0 = Monday … 6 = Sunday
  return (date.getDay() + 6) % 7;
}

export default function HostDashboardPage() {
  const t = useTranslations("dashboard.host");
  const locale = useLocale();
  const { user } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<HostProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));

  useEffect(() => {
    const hostId = user?.id ?? "";
    Promise.all([getBookingsByHost(hostId), getHostProperties()])
      .then(([bks, props]) => {
        setBookings(bks);
        setProperties(props);
      })
      .catch((err) => console.error("Failed to load host data", err))
      .finally(() => setIsLoading(false));
  }, [user]);

  // Metrics — restricted to paid bookings, current month
  const monthStart = cursor;
  const monthEnd = endOfMonth(cursor);

  const paidBookings = useMemo(
    () => bookings.filter((b) => PAID.includes(b.status)),
    [bookings],
  );

  const monthBookings = useMemo(
    () =>
      paidBookings.filter((b) => {
        const ci = new Date(b.checkIn);
        return ci >= monthStart && ci <= monthEnd;
      }),
    [paidBookings, monthStart, monthEnd],
  );

  const totalBookings = paidBookings.length;
  const revenue = monthBookings.reduce((acc, b) => acc + b.total, 0);

  // Occupancy = occupied nights / (totalProperties × nightsInMonth)
  const nightsInMonth = daysInMonth(cursor);
  const occupiedNights = useMemo(() => {
    let count = 0;
    for (const b of bookings) {
      if (!OCCUPYING.includes(b.status)) continue;
      const ci = new Date(b.checkIn);
      const co = new Date(b.checkOut);
      const overlapStart = ci > monthStart ? ci : monthStart;
      const overlapEnd = co < monthEnd ? co : monthEnd;
      const ms = overlapEnd.getTime() - overlapStart.getTime();
      if (ms > 0) count += Math.ceil(ms / 86_400_000);
    }
    return count;
  }, [bookings, monthStart, monthEnd]);

  const totalSlots = Math.max(1, properties.length) * nightsInMonth;
  const occupancy = Math.min(
    100,
    Math.round((occupiedNights / totalSlots) * 100),
  );

  const avgRating =
    properties.length > 0
      ? properties.reduce((acc, p) => acc + p.rating, 0) / properties.length
      : 0;

  // Calendar — mark days with at least one occupying booking
  const bookedDays = useMemo(() => {
    const set = new Set<number>();
    for (const b of bookings) {
      if (!OCCUPYING.includes(b.status)) continue;
      const ci = new Date(b.checkIn);
      const co = new Date(b.checkOut);
      const start = ci > monthStart ? ci : monthStart;
      const end = co < monthEnd ? co : monthEnd;
      for (
        let d = new Date(start);
        d < end;
        d.setDate(d.getDate() + 1)
      ) {
        set.add(d.getDate());
      }
    }
    return set;
  }, [bookings, monthStart, monthEnd]);

  const calendarCells: { day: number; outside?: boolean; booked?: boolean }[] =
    useMemo(() => {
      const cells: { day: number; outside?: boolean; booked?: boolean }[] = [];
      const offset = mondayIndex(monthStart);
      const prevMonthEnd = new Date(monthStart);
      prevMonthEnd.setDate(0);
      for (let i = offset - 1; i >= 0; i--) {
        cells.push({
          day: prevMonthEnd.getDate() - i,
          outside: true,
        });
      }
      for (let d = 1; d <= nightsInMonth; d++) {
        cells.push({ day: d, booked: bookedDays.has(d) });
      }
      while (cells.length % 7 !== 0) {
        cells.push({ day: cells.length - offset - nightsInMonth + 1, outside: true });
      }
      return cells;
    }, [monthStart, nightsInMonth, bookedDays]);

  const monthLabel = cursor.toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });

  const upcomingBookings = useMemo(
    () =>
      bookings
        .filter((b) =>
          ["pending", "confirmed", "checked_in"].includes(b.status),
        )
        .sort(
          (a, b) =>
            new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime(),
        ),
    [bookings],
  );

  const statusStyle = (status: string) => {
    if (status === "confirmed") return "bg-primary/20 text-primary";
    if (status === "pending") return "bg-secondary/20 text-secondary";
    if (status === "checked_in") return "bg-tertiary/20 text-tertiary";
    return "bg-surface-container-high text-on-surface-variant";
  };
  const statusLabel = (status: string) => {
    if (status === "confirmed") return t("statusConfirmed");
    if (status === "pending") return t("statusPending");
    if (status === "checked_in") return t("statusCheckedIn");
    return status;
  };

  function shiftMonth(delta: number) {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
  }

  return (
    <DashboardShell role="host" activeItem="dashboard">
      <main className="flex-1 p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none z-0">
          <svg className="w-full h-full text-primary fill-current" viewBox="0 0 400 800">
            <path d="M400,0 C350,100 250,150 200,300 C150,450 250,600 200,800 L400,800 Z"></path>
          </svg>
        </div>

        <header className="relative z-10 flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-headline font-bold text-on-surface mb-2">
              {t("bookingsOverview")}
            </h1>
            <p className="text-on-surface-variant font-body">{t("subtitle")}</p>
          </div>
        </header>

        <section className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-surface-container-low p-6 rounded-xl flex flex-col gap-1">
            <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
              {t("totalBookings")}
            </span>
            <span className="text-3xl font-headline font-bold text-on-surface">
              {totalBookings}
            </span>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl flex flex-col gap-1 border-l-4 border-primary">
            <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
              {t("revenue")}
            </span>
            <Price
              amount={revenue}
              fractionDigits={0}
              className="text-3xl font-headline font-bold text-primary"
            />
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
                {t("occupancy")}
              </span>
              <span className="text-lg font-bold text-primary">{occupancy}%</span>
            </div>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full"
                style={{ width: `${occupancy}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl flex flex-col gap-1">
            <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
              {t("avgRating")}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-headline font-bold text-on-surface">
                {avgRating.toFixed(1)}
              </span>
            </div>
          </div>
        </section>

        <div className="relative z-10 grid grid-cols-1 xl:grid-cols-3 gap-8">
          <section className="xl:col-span-2">
            <h2 className="text-2xl font-headline font-bold mb-6">
              {t("upcomingBookings")}
            </h2>
            <div className="bg-surface-container-low rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high/50 text-xs font-label uppercase tracking-widest text-on-surface-variant">
                    <th className="px-6 py-4">{t("guestName")}</th>
                    <th className="px-6 py-4">{t("property")}</th>
                    <th className="px-6 py-4">{t("checkIn")}</th>
                    <th className="px-6 py-4">{t("checkOut")}</th>
                    <th className="px-6 py-4 text-center">{t("nights")}</th>
                    <th className="px-6 py-4">{t("amount")}</th>
                    <th className="px-6 py-4">{t("status")}</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-body">
                  {isLoading && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-sm text-on-surface-variant"
                      >
                        Loading...
                      </td>
                    </tr>
                  )}
                  {!isLoading && upcomingBookings.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-sm text-on-surface-variant"
                      >
                        {t("noUpcoming")}
                      </td>
                    </tr>
                  )}
                  {upcomingBookings.map((b, idx) => (
                    <tr
                      key={b.id}
                      className="hover:bg-surface-container-high transition-colors"
                      style={{
                        backgroundColor: idx % 2 === 0 ? "#142032" : "#101c2e",
                      }}
                    >
                      <td className="px-6 py-5 font-bold">
                        {b.guest
                          ? `${b.guest.firstName} ${b.guest.lastName}`
                          : "—"}
                      </td>
                      <td className="px-6 py-5 text-on-surface-variant italic">
                        {b.property.name}
                      </td>
                      <td className="px-6 py-5">
                        {new Date(b.checkIn).toLocaleDateString(locale)}
                      </td>
                      <td className="px-6 py-5">
                        {new Date(b.checkOut).toLocaleDateString(locale)}
                      </td>
                      <td className="px-6 py-5 text-center">{b.nights}</td>
                      <td className="px-6 py-5 font-medium">
                        <Price amount={b.total} fractionDigits={2} />
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`${statusStyle(b.status)} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`}
                        >
                          {statusLabel(b.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="xl:col-span-1">
            <h2 className="text-2xl font-headline font-bold mb-6">
              {t("availabilityCalendar")}
            </h2>
            <div className="bg-surface-container-low rounded-xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <span className="font-headline text-lg font-bold capitalize">
                  {monthLabel}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => shiftMonth(-1)}
                    className="p-2 bg-surface-container-highest rounded-full text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">
                      chevron_left
                    </span>
                  </button>
                  <button
                    onClick={() => shiftMonth(1)}
                    className="p-2 bg-surface-container-highest rounded-full text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <div
                    key={i}
                    className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/50 py-2"
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {calendarCells.map((d, i) => (
                  <div
                    key={i}
                    className={`py-3 text-sm rounded-lg ${
                      d.outside
                        ? "text-on-surface-variant/30"
                        : d.booked
                          ? "bg-primary text-on-primary font-bold"
                          : "text-on-surface"
                    }`}
                  >
                    {d.day}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}
