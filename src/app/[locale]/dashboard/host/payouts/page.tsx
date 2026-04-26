"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { getBookingsByHost, type Booking } from "@/lib/api/bookings";
import Price from "@/components/Price";

interface MonthlyRow {
  key: string;
  label: string;
  count: number;
  gross: number;
  fees: number;
  net: number;
}

const HOST_FEE_RATE = 0.12;

export default function HostPayoutsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookingsByHost()
      .then(setBookings)
      .catch((err) => console.error("Failed to load bookings", err))
      .finally(() => setLoading(false));
  }, []);

  const paid = useMemo(
    () =>
      bookings.filter((b) =>
        ["confirmed", "checked_in", "completed"].includes(b.status),
      ),
    [bookings],
  );

  const totals = useMemo(() => {
    const gross = paid.reduce((acc, b) => acc + b.total, 0);
    const fees = gross * HOST_FEE_RATE;
    return { gross, fees, net: gross - fees };
  }, [paid]);

  const months = useMemo<MonthlyRow[]>(() => {
    const map = new Map<string, MonthlyRow>();
    for (const b of paid) {
      const d = new Date(b.checkIn);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      });
      const row = map.get(key) ?? {
        key,
        label,
        count: 0,
        gross: 0,
        fees: 0,
        net: 0,
      };
      row.count += 1;
      row.gross += b.total;
      row.fees = row.gross * HOST_FEE_RATE;
      row.net = row.gross - row.fees;
      map.set(key, row);
    }
    return Array.from(map.values()).sort((a, b) => b.key.localeCompare(a.key));
  }, [paid]);

  return (
    <DashboardShell role="host" activeItem="payouts">
      <main className="flex-1 bg-background">
        <header className="sticky top-4 z-40 pointer-events-none">
          <div className="bg-surface-container-lowest/80 backdrop-blur-xl rounded-full mx-8 px-8 py-3 flex justify-between items-center shadow-2xl pointer-events-auto">
            <h1 className="font-headline text-xl text-on-surface italic pl-10">
              Payouts
            </h1>
            <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
              {paid.length} paid bookings
            </span>
          </div>
        </header>

        <div className="px-8 py-10">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card label="Gross revenue" amount={totals.gross} />
            <Card label="Platform fees (12%)" amount={totals.fees} />
            <Card label="Your net payout" amount={totals.net} accent />
          </section>

          <h2 className="font-headline text-2xl mb-6">Monthly breakdown</h2>
          <div className="bg-surface-container-low rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-high/50 text-xs uppercase tracking-widest text-on-surface-variant">
                  <th className="px-6 py-4">Month</th>
                  <th className="px-6 py-4 text-center">Bookings</th>
                  <th className="px-6 py-4">Gross</th>
                  <th className="px-6 py-4">Fees</th>
                  <th className="px-6 py-4">Net</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">
                      Loading…
                    </td>
                  </tr>
                )}
                {!loading && months.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">
                      No payouts yet.
                    </td>
                  </tr>
                )}
                {months.map((m, idx) => (
                  <tr
                    key={m.key}
                    style={{ backgroundColor: idx % 2 === 0 ? "#142032" : "#101c2e" }}
                  >
                    <td className="px-6 py-4 capitalize font-medium">{m.label}</td>
                    <td className="px-6 py-4 text-center">{m.count}</td>
                    <td className="px-6 py-4">
                      <Price amount={m.gross} fractionDigits={2} />
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      <Price amount={m.fees} fractionDigits={2} />
                    </td>
                    <td className="px-6 py-4 text-primary font-bold">
                      <Price amount={m.net} fractionDigits={2} />
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

function Card({
  label,
  amount,
  accent,
}: {
  label: string;
  amount: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`p-6 rounded-xl ${accent ? "bg-surface-container border-l-4 border-primary" : "bg-surface-container-low"}`}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-3">
        {label}
      </p>
      <Price
        amount={amount}
        fractionDigits={2}
        className={`text-3xl font-headline ${accent ? "text-primary" : "text-on-surface"}`}
      />
    </div>
  );
}
