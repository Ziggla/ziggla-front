"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import {
  getPropertyAvailability,
  getPropertyBySlug,
  type AvailabilityRange,
} from "@/lib/api/properties";
import type { Property } from "@/data/properties";

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function mondayIndex(d: Date) {
  return (d.getDay() + 6) % 7;
}

export default function PropertyCalendarPage() {
  const params = useParams();
  const slug = String(params.slug);
  const [property, setProperty] = useState<Property | null>(null);
  const [ranges, setRanges] = useState<AvailabilityRange[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));

  useEffect(() => {
    let cancelled = false;
    Promise.all([getPropertyBySlug(slug), getPropertyAvailability(slug)])
      .then(([p, r]) => {
        if (cancelled) return;
        setProperty(p);
        setRanges(r);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const monthStart = cursor;
  const monthEnd = endOfMonth(cursor);
  const nightsInMonth = monthEnd.getDate();

  const bookedDays = useMemo(() => {
    const map = new Map<number, AvailabilityRange>();
    for (const r of ranges) {
      const ci = new Date(r.check_in);
      const co = new Date(r.check_out);
      const start = ci > monthStart ? ci : monthStart;
      const end = co < monthEnd ? co : monthEnd;
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        map.set(d.getDate(), r);
      }
    }
    return map;
  }, [ranges, monthStart, monthEnd]);

  const cells = useMemo(() => {
    const items: { day: number; outside?: boolean; ref?: AvailabilityRange }[] = [];
    const offset = mondayIndex(monthStart);
    const prev = new Date(monthStart);
    prev.setDate(0);
    for (let i = offset - 1; i >= 0; i--)
      items.push({ day: prev.getDate() - i, outside: true });
    for (let d = 1; d <= nightsInMonth; d++)
      items.push({ day: d, ref: bookedDays.get(d) });
    while (items.length % 7 !== 0)
      items.push({
        day: items.length - offset - nightsInMonth + 1,
        outside: true,
      });
    return items;
  }, [monthStart, nightsInMonth, bookedDays]);

  const monthLabel = cursor.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <DashboardShell role="host" activeItem="properties">
      <main className="flex-1 bg-background px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/dashboard/host/properties"
              className="text-on-surface-variant text-xs uppercase tracking-widest hover:text-on-surface"
            >
              ← Properties
            </Link>
            <h1 className="font-headline text-3xl text-on-surface mt-2">
              {property?.name ?? "Calendar"}
            </h1>
            <p className="text-on-surface-variant text-sm mt-1">
              {ranges.length} active booking{ranges.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-on-surface-variant">Loading…</p>
        ) : !property ? (
          <p className="text-error">Property not found.</p>
        ) : (
          <div className="bg-surface-container-low rounded-xl p-6 max-w-3xl">
            <div className="flex justify-between items-center mb-6">
              <span className="font-headline text-lg font-bold capitalize">
                {monthLabel}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCursor(
                      new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1),
                    )
                  }
                  className="p-2 bg-surface-container-highest rounded-full text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-base">
                    chevron_left
                  </span>
                </button>
                <button
                  onClick={() =>
                    setCursor(
                      new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1),
                    )
                  }
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
              {cells.map((c, i) => (
                <div
                  key={i}
                  title={c.ref?.reference}
                  className={`py-4 text-sm rounded-lg ${
                    c.outside
                      ? "text-on-surface-variant/30"
                      : c.ref
                        ? "bg-primary text-on-primary font-bold"
                        : "text-on-surface bg-surface-container-high/50"
                  }`}
                >
                  {c.day}
                </div>
              ))}
            </div>
            <div className="flex gap-6 mt-6 text-xs text-on-surface-variant">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-primary" /> Booked
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-surface-container-high/50" />
                Available
              </span>
            </div>

            {ranges.length > 0 && (
              <ul className="mt-8 space-y-2 text-sm">
                {ranges.map((r, i) => (
                  <li
                    key={i}
                    className="flex justify-between bg-surface-container px-4 py-2 rounded-lg"
                  >
                    <span className="font-mono text-primary text-xs">
                      {r.reference}
                    </span>
                    <span className="text-on-surface-variant">
                      {new Date(r.check_in).toLocaleDateString()} →{" "}
                      {new Date(r.check_out).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </DashboardShell>
  );
}
