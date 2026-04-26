"use client";

import { useState, useEffect, useMemo } from "react";
import { Link } from "@/i18n/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import PropertyCard from "@/components/dashboard/PropertyCard";
import { getHostProperties, type HostProperty, type HostPropertyStatus } from "@/lib/api/analytics";
import { deleteProperty, updateProperty } from "@/lib/api/properties";
import { getBookingsByHost, type Booking } from "@/lib/api/bookings";
import Price from "@/components/Price";

const PAID = ["confirmed", "checked_in", "completed"];
const OCCUPYING = ["confirmed", "checked_in"];

export default function HostPropertiesPage() {
  const [properties, setProperties] = useState<HostProperty[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([getHostProperties(), getBookingsByHost()])
      .then(([props, bks]) => {
        setProperties(props);
        setBookings(bks);
      })
      .catch((err) => console.error("Failed to load host data", err))
      .finally(() => setIsLoading(false));
  }, []);

  function handleStatusChange(id: string, status: HostPropertyStatus) {
    const prev = properties;
    setProperties((p) => p.map((x) => (x.id === id ? { ...x, status } : x)));
    updateProperty(id, { is_active: status === "active" }).catch((err) => {
      console.error("Failed to update status", err);
      setProperties(prev);
    });
  }

  function handleDelete(id: string) {
    const prev = properties;
    setProperties((p) => p.filter((x) => x.id !== id));
    deleteProperty(id).catch((err) => {
      console.error("Failed to delete property", err);
      setProperties(prev);
    });
  }

  const { totalRevenue, avgOccupancy } = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const nightsInMonth = monthEnd.getDate();

    const revenue = bookings
      .filter((b) => {
        if (!PAID.includes(b.status)) return false;
        const ci = new Date(b.checkIn);
        return ci >= monthStart && ci <= monthEnd;
      })
      .reduce((acc, b) => acc + b.total, 0);

    let occupiedNights = 0;
    for (const b of bookings) {
      if (!OCCUPYING.includes(b.status)) continue;
      const ci = new Date(b.checkIn);
      const co = new Date(b.checkOut);
      const start = ci > monthStart ? ci : monthStart;
      const end = co < monthEnd ? co : monthEnd;
      const ms = end.getTime() - start.getTime();
      if (ms > 0) occupiedNights += Math.ceil(ms / 86_400_000);
    }
    const totalSlots = Math.max(1, properties.length) * nightsInMonth;
    const occupancy = Math.min(100, Math.round((occupiedNights / totalSlots) * 100));

    return { totalRevenue: revenue, avgOccupancy: occupancy };
  }, [bookings, properties]);

  return (
    <DashboardShell role="host" activeItem="properties">
      <main className="flex-1 bg-background">
        {/* Sticky header */}
        <header className="sticky top-4 z-40 pointer-events-none">
          <div className="bg-[#030e20]/80 backdrop-blur-xl rounded-full mx-8 px-8 py-3 flex justify-between items-center shadow-2xl pointer-events-auto">
            <h1 className="font-headline text-xl text-on-surface italic">My Properties</h1>
            <Link
              href="/dashboard/host/properties/new"
              className="gold-gradient text-on-primary px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Add Property
            </Link>
          </div>
        </header>

        <div className="px-8 py-10">
          {/* Stats strip */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-surface-container-low p-6 rounded-xl relative group overflow-hidden">
              <span
                className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700 material-symbols-outlined select-none"
                style={{ fontSize: "80px" }}
              >
                apartment
              </span>
              <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-3">Total Properties</p>
              <p className="text-4xl font-headline text-on-surface">{properties.length}</p>
            </div>

            <div
              className="bg-surface-container p-6 rounded-xl relative group overflow-hidden"
              style={{ boxShadow: "0 0 0 1px rgba(230,195,100,0.12)" }}
            >
              <span
                className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700 material-symbols-outlined text-primary select-none"
                style={{ fontSize: "80px" }}
              >
                donut_large
              </span>
              <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Avg Occupancy</p>
              <p className="text-4xl font-headline text-on-surface mb-3">{avgOccupancy}%</p>
              <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${avgOccupancy}%` }} />
              </div>
            </div>

            <div className="bg-surface-container-low p-6 rounded-xl relative group overflow-hidden">
              <span
                className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700 material-symbols-outlined select-none"
                style={{ fontSize: "80px" }}
              >
                account_balance_wallet
              </span>
              <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-3">Revenue This Month</p>
              <Price
                amount={totalRevenue}
                fractionDigits={0}
                className="text-4xl font-headline text-primary"
              />
            </div>
          </section>

          {/* Property list */}
          {isLoading ? (
            <p className="text-sm text-on-surface-variant py-12 text-center">Loading…</p>
          ) : properties.length > 0 ? (
            <div className="space-y-6">
              {properties.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-on-surface-variant text-4xl">apartment</span>
              </div>
              <p className="font-headline text-2xl text-on-surface mb-2">No properties yet</p>
              <p className="text-sm text-on-surface-variant mb-8">
                Add your first listing to start welcoming guests.
              </p>
              <Link
                href="/dashboard/host/properties/new"
                className="gold-gradient text-on-primary px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">add</span>
                Add your first property
              </Link>
            </div>
          )}
        </div>
      </main>
    </DashboardShell>
  );
}
