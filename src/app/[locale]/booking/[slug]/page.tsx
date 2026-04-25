"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

const LIVING_ROOM =
  "https://mjduzgj5bbgoqbn6.public.blob.vercel-storage.com/luxury-properties/living-room-yellow-BlzWRvJ05uw2wxeDobW7VshHs0zAJE.jpg";

export default function BookingPage() {
  const t = useTranslations("bookingPage");
  const [agreed, setAgreed] = useState(false);
  const searchParams = useSearchParams();

  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const guests = searchParams.get("guests") ?? "2";
  const nights = Number(searchParams.get("nights") ?? 0);
  const total = Number(searchParams.get("total") ?? 0);
  const pricePerNight = Number(searchParams.get("pricePerNight") ?? 0);
  const propertyName = searchParams.get("propertyName") ?? "";

  return (
    <main className="max-w-7xl mx-auto px-6 pt-18 pb-24">
      <header className="mb-12">
        <h1 className="font-headline text-on-surface mb-2" style={{ fontSize: "3.5rem" }}>
          {t("title")}
        </h1>
        <p className="text-on-surface-variant font-body text-lg max-w-2xl">
          {t("subtitle")}
        </p>
      </header>

      <div className="grid grid-cols-12 gap-12 items-start">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-12">
          {/* Property Summary Card */}
          <section className="bg-surface-container-low rounded-xl overflow-hidden flex flex-col md:flex-row shadow-sm">
            <div className="md:w-1/3 h-64 md:h-auto overflow-hidden relative">
              <Image
                src={LIVING_ROOM}
                alt="Gold Dust Loft"
                loading="eager"
                fill
                className="object-cover hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="md:w-2/3 p-8 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-primary font-label text-xs uppercase tracking-widest mb-1 block">
                    {t("featuredApartment")}
                  </span>
                  <h2 className="font-headline text-2xl text-on-surface">
                    {propertyName || t("propertyName")}
                  </h2>
                </div>
                <div className="flex items-center gap-1 bg-surface-container-highest px-3 py-1 rounded-full">
                  <span
                    className="material-symbols-outlined text-primary text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="text-on-surface text-sm font-bold">4.9</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">calendar_today</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase">{t("checkIn")}</span>
                    <span className="text-sm font-bold text-on-surface">{checkIn || "—"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">calendar_month</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase">{t("checkOut")}</span>
                    <span className="text-sm font-bold text-on-surface">{checkOut || "—"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">group</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase">{t("guests")}</span>
                    <span className="text-sm font-bold text-on-surface">{guests} Adults</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Gold Divider */}
          <div className="relative h-px bg-outline-variant/30 overflow-hidden">
            <div className="absolute inset-0 bg-primary/20 animate-pulse"></div>
            <div className="absolute left-0 top-0 h-full w-24 bg-primary"></div>
          </div>

          {/* Guest Details Form */}
          <section>
            <h3 className="font-headline text-2xl mb-8">{t("guestDetails")}</h3>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-label text-xs text-on-surface-variant ml-1 uppercase tracking-widest">
                  {t("firstName")}
                </label>
                <input
                  className="w-full bg-surface-container-high rounded-lg p-4 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all border-none outline-none"
                  placeholder="Julian"
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label className="font-label text-xs text-on-surface-variant ml-1 uppercase tracking-widest">
                  {t("lastName")}
                </label>
                <input
                  className="w-full bg-surface-container-high rounded-lg p-4 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all border-none outline-none"
                  placeholder="Vandervall"
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label className="font-label text-xs text-on-surface-variant ml-1 uppercase tracking-widest">
                  {t("email")}
                </label>
                <input
                  className="w-full bg-surface-container-high rounded-lg p-4 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all border-none outline-none"
                  placeholder="julian@example.com"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <label className="font-label text-xs text-on-surface-variant ml-1 uppercase tracking-widest">
                  {t("phone")}
                </label>
                <input
                  className="w-full bg-surface-container-high rounded-lg p-4 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all border-none outline-none"
                  placeholder="+44 20 7946 0958"
                  type="tel"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="font-label text-xs text-on-surface-variant ml-1 uppercase tracking-widest">
                  {t("specialRequests")}
                </label>
                <textarea
                  className="w-full bg-surface-container-high rounded-lg p-4 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all border-none outline-none resize-none"
                  placeholder={t("specialRequestsPlaceholder")}
                  rows={4}
                />
              </div>
            </form>
          </section>

          {/* Secure Payment Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl">lock</span>
              <h3 className="font-headline text-2xl">{t("securePayment")}</h3>
            </div>
            <div className="bg-surface-container p-8 rounded-xl space-y-6 shadow-lg border-l-4 border-primary">
              <div className="flex justify-between items-center pb-4" style={{ borderBottom: "1px solid rgba(77,70,55,0.2)" }}>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant">credit_card</span>
                  <span className="text-on-surface font-medium">{t("cardLabel")}</span>
                </div>
                <div className="flex gap-2 opacity-60">
                  <span className="material-symbols-outlined">payments</span>
                  <span className="material-symbols-outlined">account_balance_wallet</span>
                </div>
              </div>
              {/* SumUp Widget Placeholder */}
              <div className="bg-[#142032] p-8 rounded-lg flex flex-col items-center justify-center min-h-[200px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <div className="flex items-center gap-1 text-[10px] text-primary/60 font-label tracking-tighter">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    SUMUP ENCRYPTED
                  </div>
                </div>
                <div className="w-full max-w-sm space-y-6">
                  <div className="space-y-1">
                    <div className="h-2 w-24 bg-outline-variant/30 rounded"></div>
                    <div className="h-12 w-full bg-surface-container-highest/50 rounded flex items-center px-4 justify-between" style={{ border: "1px solid rgba(230,195,100,0.2)" }}>
                      <div className="flex gap-2">
                        <div className="h-1 w-8 bg-primary/40 rounded"></div>
                        <div className="h-1 w-8 bg-primary/40 rounded"></div>
                        <div className="h-1 w-8 bg-primary/40 rounded"></div>
                      </div>
                      <span className="material-symbols-outlined text-primary">credit_card</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-10 bg-surface-container-highest/30 rounded"></div>
                    <div className="h-10 bg-surface-container-highest/30 rounded"></div>
                  </div>
                </div>
                <p className="mt-8 text-on-surface-variant text-xs text-center">
                  {t("paymentSecureNote")}
                </p>
              </div>
            </div>
          </section>

          {/* Terms + CTA */}
          <div className="space-y-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <button
                onClick={() => setAgreed(!agreed)}
                className={`w-5 h-5 mt-0.5 rounded-sm flex items-center justify-center transition-colors shrink-0 ${
                  agreed ? "bg-primary" : "border-2 border-outline-variant"
                }`}
              >
                {agreed && (
                  <span
                    className="material-symbols-outlined text-on-primary text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check
                  </span>
                )}
              </button>
              <span className="text-sm text-on-surface-variant leading-relaxed">
                {t("termsAgreement")}
              </span>
            </label>
            <Link
              href="/booking/confirmation"
              className="w-full gold-gradient text-on-primary font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                encrypted
              </span>
              {t("confirmPay")}
            </Link>
          </div>
        </div>

        {/* Right Column: Booking Summary */}
        <aside className="col-span-12 lg:col-span-4 lg:sticky lg:top-32 space-y-6">
          <div className="bg-surface-container-low rounded-xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
            <h3 className="font-headline text-2xl mb-6 pb-4" style={{ borderBottom: "1px solid rgba(77,70,55,0.2)" }}>
              {t("bookingSummary")}
            </h3>
            <div className="space-y-4 mb-8">
              {nights > 0 && (
                <div className="flex justify-between text-on-surface-variant font-body">
                  <span>£{pricePerNight} x {nights} {t("nights")}</span>
                  <span className="text-on-surface">£{total.toLocaleString()}</span>
                </div>
              )}
            </div>
            <div className="flex justify-between items-end mb-8">
              <div className="flex flex-col">
                <span className="text-xs uppercase text-on-surface-variant tracking-widest font-label">
                  {t("totalAmount")}
                </span>
                <span className="text-4xl font-headline text-primary">
                  {total > 0 ? `£${total.toLocaleString()}` : "—"}
                </span>
              </div>
              <span className="text-xs text-on-surface-variant mb-1 italic">GBP</span>
            </div>
            <Link
              href="/booking/confirmation"
              className="w-full gold-gradient text-on-primary font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                encrypted
              </span>
              {t("confirmPay")}
            </Link>
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="flex items-center gap-4 grayscale opacity-40">
                <span className="material-symbols-outlined text-4xl">payments</span>
                <div className="h-6 w-px bg-on-surface-variant"></div>
                <span className="font-bold text-lg tracking-tighter">SumUp</span>
              </div>
              <p className="text-[10px] text-center text-on-surface-variant leading-relaxed px-4">
                {t("termsFooter")}
              </p>
            </div>
          </div>

          <div className="bg-surface-container-highest/20 rounded-xl p-6 flex items-start gap-4">
            <span className="material-symbols-outlined text-primary">info</span>
            <div>
              <h4 className="font-bold text-sm mb-1">{t("flexibleCancellation")}</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {t("cancellationNote")}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
