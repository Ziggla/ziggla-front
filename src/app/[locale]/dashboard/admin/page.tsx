"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import DashboardShell from "@/components/layout/DashboardShell";
import { getAdminBookings, type Booking } from "@/lib/api/bookings";
import { getUsers, type User } from "@/lib/api/users";
import { getAnalytics, type Analytics } from "@/lib/api/analytics";
import { useAuth } from "@/lib/auth/AuthContext";
import UserAvatar from "@/components/ui/UserAvatar";

type FilterTab = "all" | "confirmed" | "pending" | "cancelled";

type BookingRow = {
  id: string;
  property: string;
  image: string;
  host: string;
  guest: string;
  status: string;
  amount: string;
};

type UserRow = {
  initials: string;
  bg: string;
  name: string;
  email: string;
  role: string;
  roleColor: string;
  bookings: number;
  lastActive: string;
};

type PropertyRow = {
  name: string;
  image: string;
  rating: string;
  stars: number;
  occupancy: number;
  revenue: string;
};

type ChartBar = {
  height: string;
  month: string;
  highlight: boolean;
};

function toBookingRow(b: Booking): BookingRow {
  return {
    id: `#${b.reference}`,
    property: b.property.name,
    image: b.property.coverImage,
    host: b.host ? `${b.host.firstName} ${b.host.lastName.charAt(0)}.` : "—",
    guest: b.guest ? `${b.guest.firstName} ${b.guest.lastName}` : "—",
    status: b.status,
    amount: `£${b.total.toFixed(2)}`,
  };
}

function toUserRow(u: User): UserRow {
  return {
    initials: u.initials,
    bg: u.avatarBg,
    name: `${u.firstName} ${u.lastName}`,
    email: u.email,
    role: u.role,
    roleColor: u.role === "host" ? "text-primary" : "text-on-surface-variant",
    bookings: u.bookingsCount,
    lastActive: u.lastActive,
  };
}

export default function AdminDashboardPage() {
  const t = useTranslations("dashboard.admin");
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [bookingRows, setBookingRows] = useState<BookingRow[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [chartBars, setChartBars] = useState<ChartBar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminBookings(), getUsers(), getAnalytics()])
      .then(([bookings, rawUsers, analytics]: [Booking[], User[], Analytics]) => {
        setBookingRows(bookings.map(toBookingRow));
        const displayUsers = rawUsers
          .filter((u) => u.role === "guest" || u.role === "host")
          .slice(0, 3)
          .map(toUserRow);
        setUsers(displayUsers);
        setProperties(
          analytics.occupancy.map((o) => ({
            name: o.propertyName,
            image: o.coverImage,
            rating: o.rating.toFixed(1),
            stars: o.stars,
            occupancy: o.rate,
            revenue: `£${o.revenue.toLocaleString("en-GB")}`,
          }))
        );
        setChartBars(
          analytics.revenue.monthly.map((m) => ({
            height: `${m.heightPercent}%`,
            month: m.month,
            highlight: m.highlight,
          }))
        );
      })
      .catch((err) => console.error("Failed to load admin data", err))
      .finally(() => setIsLoading(false));
  }, []);

  const statusStyle = (status: string) => {
    if (status === "confirmed") return "bg-green-500/10 text-green-400";
    if (status === "pending") return "bg-primary/10 text-primary";
    return "bg-error/10 text-error";
  };

  const statusLabel = (status: string) => {
    if (status === "confirmed") return t("statusConfirmed");
    if (status === "pending") return t("statusPending");
    return t("statusCancelled");
  };

  const filteredBookings =
    activeFilter === "all"
      ? bookingRows
      : bookingRows.filter((b) => b.status === activeFilter);

  return (
    <DashboardShell role="admin" activeItem="dashboard">
      <main className="flex-1 p-8 relative">
        {/* Header */}
        <header className="sticky top-0 z-40 mb-10">
          <div className="bg-[#0e1c30]/80 backdrop-blur-xl rounded-full px-8 py-3 flex justify-between items-center shadow-2xl">
            <div>
              <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight">
                {t("executiveDashboard")}
              </h2>
              <p className="text-xs text-on-surface-variant font-medium">{t("dashboardSubtitle")}</p>
            </div>
            <div className="flex items-center gap-6">
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-on-surface transition-colors">
                search
              </span>
              <button className="gold-gradient hover:opacity-90 text-on-primary px-6 py-2 rounded-full text-sm font-bold transition-all scale-95 active:scale-90">
                {t("exportReport")}
              </button>
              <UserAvatar avatarUrl={user?.avatarUrl} initials={user?.initials ?? "?"} size={40} />
            </div>
          </div>
        </header>

        {/* Metric Cards */}
        <section className="grid grid-cols-4 gap-6 mb-10">
          <div className="bg-surface-container-low p-6 rounded-xl flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                {t("totalRevenue")}
              </span>
              <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-3xl font-bold text-primary">£12,400</h3>
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold">
                  <span className="material-symbols-outlined text-[12px]">trending_up</span>
                  +12%
                </div>
              </div>
              <div className="h-8 w-20 flex items-end gap-1">
                {[40, 60, 50, 80].map((h, i) => (
                  <div
                    key={i}
                    className={`w-2 rounded-t-sm ${i === 3 ? "bg-primary" : "bg-primary/20"}`}
                    style={{ height: `${h}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                {t("totalBookings")}
              </span>
              <span className="material-symbols-outlined text-primary">confirmation_number</span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-on-surface">47</h3>
              <div className="mt-2 text-[10px] text-on-surface-variant font-medium">{t("last30Days")}</div>
            </div>
            <div className="mt-4 h-1 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="w-[65%] h-full bg-primary"></div>
            </div>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                {t("activeUsers")}
              </span>
              <span className="material-symbols-outlined text-primary">person_play</span>
            </div>
            <h3 className="text-3xl font-bold text-on-surface">32</h3>
            <div className="flex -space-x-2 mt-4">
              {["SJ", "MV", "DC"].map((initials, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-[8px] font-bold text-on-surface border border-surface"
                >
                  {initials}
                </div>
              ))}
              <div className="w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center text-[8px] font-bold border border-surface">
                +29
              </div>
            </div>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                {t("properties")}
              </span>
              <span className="material-symbols-outlined text-primary">apartment</span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-on-surface">2</h3>
              <p className="text-[10px] text-primary font-medium mt-1">{t("bothHighDemand")}</p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-[10px] text-on-surface-variant">{t("fullySynchronized")}</span>
            </div>
          </div>
        </section>

        {/* Revenue Chart */}
        <section className="mb-10">
          <div className="bg-surface-container-low p-8 rounded-xl shadow-xl">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h4 className="font-headline text-xl font-bold text-on-surface mb-1">
                  {t("revenueOverview")}
                </h4>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest">
                  {t("last6Months")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-[10px] text-on-surface font-medium uppercase tracking-tighter">
                  {t("grossEarnings")}
                </span>
              </div>
            </div>
            <div className="relative h-64 w-full flex items-end justify-between pb-0" style={{ borderBottom: "1px solid #2a3548" }}>
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="border-t border-on-surface w-full"></div>
                ))}
              </div>
              {chartBars.map((bar, i) => (
                <div key={i} className="flex flex-col items-center group flex-1">
                  <div
                    className="w-full rounded-t-lg transition-all duration-500 relative"
                    style={{
                      height: bar.height,
                      background: bar.highlight
                        ? "rgba(230,195,100,0.3)"
                        : "rgba(230,195,100,0.1)",
                    }}
                  >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span
                    className={`text-[10px] mt-4 font-bold ${
                      bar.highlight ? "text-on-surface" : "text-on-surface-variant"
                    }`}
                  >
                    {bar.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Bookings */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-headline text-xl font-bold text-on-surface">
              {t("recentBookings")}
            </h4>
            <div className="flex bg-surface-container-high p-1 rounded-full">
              {(["all", "confirmed", "pending", "cancelled"] as FilterTab[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeFilter === filter
                      ? "bg-primary text-on-primary"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {t(`filter_${filter}`)}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-surface-container-low rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container">
                <tr>
                  {[t("bookingId"), t("colProperty"), t("host"), t("guest"), t("colStatus"), t("colAmount")].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant/30">
                {isLoading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-on-surface-variant">
                      Loading...
                    </td>
                  </tr>
                )}
                {filteredBookings.map((row, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-highest/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-on-surface">{row.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded overflow-hidden relative shrink-0">
                          <Image src={row.image} alt={row.property} loading="eager" fill className="object-cover" sizes="32px" />
                        </div>
                        <span className="text-sm font-bold text-on-surface">{row.property}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{row.host}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{row.guest}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusStyle(row.status)}`}>
                        {statusLabel(row.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-on-surface">{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 bg-surface-container flex justify-center">
              <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-secondary transition-colors">
                {t("viewAllBookings")}
              </button>
            </div>
          </div>
        </section>

        {/* Portfolio + Users Split */}
        <section className="grid grid-cols-12 gap-6 mb-20">
          {/* Portfolio */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            <h4 className="font-headline text-xl font-bold text-on-surface">{t("portfolioPerformance")}</h4>
            <div className="grid grid-cols-1 gap-6">
              {isLoading && (
                <p className="text-sm text-on-surface-variant py-6 text-center">Loading...</p>
              )}
              {properties.map((prop, idx) => (
                <div
                  key={idx}
                  className="bg-surface-container-low p-5 rounded-xl flex gap-5 group hover:shadow-2xl hover:shadow-primary/5 transition-all"
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden relative shrink-0">
                    <Image src={prop.image} alt={prop.name} loading="eager" fill className="object-cover" sizes="96px" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h5 className="text-sm font-bold text-on-surface">{prop.name}</h5>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex text-primary">
                          {Array.from({ length: prop.stars }).map((_, i) => (
                            <span
                              key={i}
                              className="material-symbols-outlined text-xs"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              star
                            </span>
                          ))}
                          {prop.stars < 5 && (
                            <span className="material-symbols-outlined text-xs">star</span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-on-surface-variant">{prop.rating}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                        <span className="text-on-surface-variant">{t("occupancyLabel")}</span>
                        <span className="text-primary">{prop.occupancy}%</span>
                      </div>
                      <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${prop.occupancy}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-on-surface">{prop.revenue} {t("revenue")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Management */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            <h4 className="font-headline text-xl font-bold text-on-surface">{t("userManagement")}</h4>
            <div className="bg-surface-container-low rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-surface-container">
                  <tr>
                    {[t("userCol"), t("roleCol"), t("bookingsCol"), t("lastActiveCol"), ""].map((h, i) => (
                      <th
                        key={i}
                        className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-variant/20">
                  {isLoading && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-sm text-on-surface-variant">
                        Loading...
                      </td>
                    </tr>
                  )}
                  {users.map((user, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-highest/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full ${user.bg} flex items-center justify-center text-xs font-bold ${
                              user.bg === "bg-primary-container" ? "text-on-primary" : "text-on-surface"
                            }`}
                          >
                            {user.initials}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface">{user.name}</p>
                            <p className="text-[10px] text-on-surface-variant">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-[10px] font-bold uppercase ${user.roleColor}`}>
                        {user.role}
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface">{user.bookings}</td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant">{user.lastActive}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-on-surface-variant hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-lg">edit_square</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 bg-surface-container flex justify-between items-center">
                <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">
                  {t("showingUsers")}
                </span>
                <div className="flex gap-2">
                  <button className="p-1 rounded bg-surface-container-high text-on-surface-variant opacity-30" disabled>
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button className="p-1 rounded bg-surface-container-high text-on-surface-variant">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </DashboardShell>
  );
}
