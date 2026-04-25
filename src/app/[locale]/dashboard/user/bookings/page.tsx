"use client";

import { useState, useEffect } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import StayCard, { type Stay, type BookingStatus } from "@/components/dashboard/StayCard";
import { getBookings, toBookingListItem, cancelMyBooking } from "@/lib/api/bookings";
import { useTranslations } from "next-intl";
import Price from "@/components/Price";

type FilterTab = "all" | "upcoming" | "past" | "cancelled";

const TAB_KEYS: FilterTab[] = ["all", "upcoming", "past", "cancelled"];

const UPCOMING_STATUSES: BookingStatus[] = ["confirmed", "checked_in"];
const PAST_STATUSES: BookingStatus[] = ["completed"];
const PAID_STATUSES: BookingStatus[] = ["confirmed", "checked_in", "completed"];

function filterStays(stays: Stay[], tab: FilterTab): Stay[] {
  if (tab === "upcoming")  return stays.filter((s) => UPCOMING_STATUSES.includes(s.status));
  if (tab === "past")      return stays.filter((s) => PAST_STATUSES.includes(s.status));
  if (tab === "cancelled") return stays.filter((s) => s.status === "cancelled");
  return stays;
}

export default function UserBookingsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [stays, setStays] = useState<Stay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations("dashboard.bookings");

  useEffect(() => {
    getBookings("usr-001")
      .then((bookings) => {
        const mapped: Stay[] = bookings.map((b) => {
          const item = toBookingListItem(b);
          return {
            id: item.id,
            reference: item.reference,
            propertyName: item.property.name,
            propertyLocation: item.property.neighborhood,
            propertyImage: item.property.coverImage,
            checkIn: item.checkIn,
            checkOut: item.checkOut,
            nights: item.nights,
            guests: item.guestsCount,
            total: `${item.total.toFixed(2)}`,
            totalAmount: item.total,
            status: item.status,
            hasReview: item.hasReview,
          };
        });
        setStays(mapped);
      })
      .catch((err) => console.error("Failed to load bookings", err))
      .finally(() => setIsLoading(false));
  }, []);

  const visible = filterStays(stays, activeTab);

  const totalSpent = stays
    .filter((s) => PAID_STATUSES.includes(s.status))
    .reduce((acc, s) => acc + s.totalAmount, 0);

  const upcomingCount = stays.filter((s) => UPCOMING_STATUSES.includes(s.status)).length;

  function handleCancel(id: string) {
    const previous = stays;
    setStays((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "cancelled" as BookingStatus } : s))
    );
    cancelMyBooking(id).catch((err) => {
      console.error("Failed to cancel booking", err);
      setStays(previous);
    });
  }

  return (
    <DashboardShell role="user" activeItem="bookings">
      <main className="flex-1 bg-background">
        {/* Header */}
        <header className="sticky top-4 z-40 pointer-events-none">
          <div className="bg-surface-container-lowest/80 backdrop-blur-xl rounded-full mx-8 px-8 py-3 flex justify-between items-center shadow-2xl pointer-events-auto">
            <h1 className="font-headline text-xl text-on-surface italic pl-10">{t("title")}</h1>
            <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
              {t("countLabel", { count: stays.length })}
            </span>
          </div>
        </header>

        <div className="px-8 py-10">

          {/* Stats */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-surface-container-low p-8 rounded-xl relative group overflow-hidden">
              <span
                className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700 material-symbols-outlined select-none"
                style={{ fontSize: "96px" }}
              >
                luggage
              </span>
              <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-4">{t("totalStays")}</p>
              <p className="text-4xl font-headline text-on-surface">{stays.length}</p>
            </div>
            <div
              className="bg-surface-container p-8 rounded-xl relative group overflow-hidden"
              style={{ boxShadow: "0 0 0 1px rgba(230,195,100,0.12)" }}
            >
              <span
                className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700 material-symbols-outlined text-primary select-none"
                style={{ fontSize: "96px" }}
              >
                event_available
              </span>
              <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">{t("upcoming")}</p>
              <p className="text-4xl font-headline text-on-surface">{upcomingCount}</p>
            </div>
            <div className="bg-surface-container-low p-8 rounded-xl relative group overflow-hidden">
              <span
                className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700 material-symbols-outlined select-none"
                style={{ fontSize: "96px" }}
              >
                account_balance_wallet
              </span>
              <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-4">{t("totalSpent")}</p>
              <Price
                amount={totalSpent}
                fractionDigits={2}
                className="text-4xl font-headline text-primary"
              />
            </div>
          </section>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
            {TAB_KEYS.map((tabKey) => {
              const count =
                tabKey === "all" ? stays.length : filterStays(stays, tabKey).length;
              return (
                <button
                  key={tabKey}
                  onClick={() => setActiveTab(tabKey)}
                  className={`shrink-0 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                    activeTab === tabKey
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                  }`}
                >
                  {t(`tabs.${tabKey}`)}
                  <span
                    className={`text-[9px] px-5 py-0.5 rounded-full font-bold ${
                      activeTab === tabKey
                        ? "bg-on-primary/20 text-on-primary"
                        : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Booking List */}
          {isLoading ? (
            <p className="text-sm text-on-surface-variant py-12 text-center">{t("loading")}</p>
          ) : visible.length > 0 ? (
            <div className="space-y-5">
              {visible.map((stay) => (
                <StayCard key={stay.id} stay={stay} onCancel={handleCancel} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-on-surface-variant text-2xl">
                  luggage
                </span>
              </div>
              <p className="font-headline text-xl text-on-surface mb-2">{t("empty.title")}</p>
              <p className="text-sm text-on-surface-variant">{t(`empty.${activeTab}`)}</p>
            </div>
          )}
        </div>
      </main>
    </DashboardShell>
  );
}
