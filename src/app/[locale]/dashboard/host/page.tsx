"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import DashboardShell from "@/components/layout/DashboardShell";
import { getBookingsByHost, type Booking } from "@/lib/api/bookings";
import { useAuth } from "@/lib/auth/AuthContext";

const KITCHEN =
  "https://mjduzgj5bbgoqbn6.public.blob.vercel-storage.com/luxury-properties/kitchen-fish-floor-5jLtHgPkTgI3uswTZOlk5Uf7WE9M4i.jpg";

type CalendarDay = { day: string; outside?: boolean; booked?: boolean };

const calendarDays: CalendarDay[] = [
  { day: "30", outside: true },
  ...Array.from({ length: 9 }, (_, i): CalendarDay => ({ day: String(i + 1) })),
  ...Array.from({ length: 7 }, (_, i): CalendarDay => ({ day: String(i + 10), booked: true })),
  ...Array.from({ length: 15 }, (_, i): CalendarDay => ({ day: String(i + 17) })),
  { day: "1", outside: true },
  { day: "2", outside: true },
  { day: "3", outside: true },
];

type BookingRow = {
  guest: string;
  property: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  amount: string;
  status: string;
  bg: string;
};

function toBookingRow(b: Booking, idx: number): BookingRow {
  return {
    guest: `${b.guest.firstName} ${b.guest.lastName}`,
    property: b.property.name,
    checkIn: b.checkIn,
    checkOut: b.checkOut,
    nights: b.nights,
    amount: `£${b.total.toFixed(2)}`,
    status: b.status,
    bg: idx % 2 === 0 ? "#142032" : "#101c2e",
  };
}

export default function HostDashboardPage() {
  const t = useTranslations("dashboard.host");
  const { user } = useAuth();
  const [currentMonth] = useState("October 2024");
  const [bookingRows, setBookingRows] = useState<BookingRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hostId = user?.id ?? "usr-host-001";
    getBookingsByHost(hostId)
      .then((data) => setBookingRows(data.map(toBookingRow)))
      .catch((err) => console.error("Failed to load host bookings", err))
      .finally(() => setIsLoading(false));
  }, [user]);

  const statusStyle = (status: string) => {
    if (status === "confirmed") return "bg-primary/20 text-primary";
    if (status === "pending") return "bg-secondary/20 text-secondary";
    return "bg-tertiary/20 text-tertiary";
  };

  const statusLabel = (status: string) => {
    if (status === "confirmed") return t("statusConfirmed");
    if (status === "pending") return t("statusPending");
    return t("statusCheckedIn");
  };

  return (
    <DashboardShell role="host" activeItem="dashboard">
      <main className="flex-1 p-8 lg:p-12 relative overflow-hidden">
        {/* Background wave */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none z-0">
          <svg className="w-full h-full text-primary fill-current" viewBox="0 0 400 800">
            <path d="M400,0 C350,100 250,150 200,300 C150,450 250,600 200,800 L400,800 Z"></path>
          </svg>
        </div>

        {/* Header */}
        <header className="relative z-10 flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-headline font-bold text-on-surface mb-2">
              {t("bookingsOverview")}
            </h1>
            <p className="text-on-surface-variant font-body">{t("subtitle")}</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-surface-container-high px-6 py-3 rounded text-sm font-bold flex items-center gap-2 transition-colors hover:bg-surface-container-highest">
              <span className="material-symbols-outlined text-sm">download</span>
              {t("exportData")}
            </button>
          </div>
        </header>

        {/* Metrics Row */}
        <section className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-surface-container-low p-6 rounded-xl flex flex-col gap-1">
            <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
              {t("totalBookings")}
            </span>
            <span className="text-3xl font-headline font-bold text-on-surface">8</span>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl flex flex-col gap-1 border-l-4 border-primary">
            <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
              {t("revenue")}
            </span>
            <span className="text-3xl font-headline font-bold text-primary">£3,200</span>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
                {t("occupancy")}
              </span>
              <span className="text-lg font-bold text-primary">78%</span>
            </div>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[78%]"></div>
            </div>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl flex flex-col gap-1">
            <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
              {t("avgRating")}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-headline font-bold text-on-surface">8.8</span>
              <div className="flex text-primary">
                {[1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
                <span className="material-symbols-outlined text-sm">star_half</span>
              </div>
            </div>
          </div>
        </section>

        {/* Table + Calendar */}
        <div className="relative z-10 grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Bookings Table */}
          <section className="xl:col-span-2">
            <h2 className="text-2xl font-headline font-bold mb-6">{t("upcomingBookings")}</h2>
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
                    <th className="px-6 py-4 text-right">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-body">
                  {isLoading && (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-sm text-on-surface-variant">
                        Loading...
                      </td>
                    </tr>
                  )}
                  {bookingRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-surface-container-high transition-colors"
                      style={{ backgroundColor: row.bg }}
                    >
                      <td className="px-6 py-5 font-bold">{row.guest}</td>
                      <td className="px-6 py-5 text-on-surface-variant italic">{row.property}</td>
                      <td className="px-6 py-5">{row.checkIn}</td>
                      <td className="px-6 py-5">{row.checkOut}</td>
                      <td className="px-6 py-5 text-center">{row.nights}</td>
                      <td className="px-6 py-5 font-medium">{row.amount}</td>
                      <td className="px-6 py-5">
                        <span className={`${statusStyle(row.status)} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
                          {statusLabel(row.status)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right space-x-2">
                        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-xl">visibility</span>
                        </button>
                        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-xl">chat_bubble</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Calendar */}
          <section className="xl:col-span-1">
            <h2 className="text-2xl font-headline font-bold mb-6">{t("availabilityCalendar")}</h2>
            <div className="bg-surface-container-low rounded-xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <span className="font-headline text-lg font-bold">{currentMonth}</span>
                <div className="flex gap-2">
                  <button className="p-2 bg-surface-container-highest rounded-full text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-base">chevron_left</span>
                  </button>
                  <button className="p-2 bg-surface-container-highest rounded-full text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-base">chevron_right</span>
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
                {calendarDays.map((d, i) => (
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
              <div className="mt-8 flex items-center gap-4 p-4 bg-surface-container-high rounded-lg">
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 relative">
                  <Image
                    src={KITCHEN}
                    alt="Next Check-in"
                    loading="eager"
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-label uppercase tracking-widest text-primary">
                    {t("nextCheckIn")}
                  </p>
                  <p className="text-sm font-bold">The Glass Loft · Julianne M.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}
