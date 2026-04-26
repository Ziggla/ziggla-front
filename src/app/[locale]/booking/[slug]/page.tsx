"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams, useParams } from "next/navigation";
import { getPropertyBySlug, type Property } from "@/lib/api/properties";
import {
  createBooking,
  createSumupCheckout,
  cancelMyBooking,
} from "@/lib/api/bookings";
import SumupCardWidget from "@/components/booking/SumupCardWidget";
import Price from "@/components/Price";
import { useAuth } from "@/lib/auth/AuthContext";

export default function BookingPage() {
  const t = useTranslations("bookingPage");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [checkout, setCheckout] = useState<{ id: string; reference: string; bookingId: string } | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const slug = String(params.slug);
  const { user } = useAuth();
  const [useAccount, setUseAccount] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getPropertyBySlug(slug).then((p) => {
      if (!cancelled) setProperty(p);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  function toggleUseAccount() {
    if (!user) return;
    const next = !useAccount;
    setUseAccount(next);
    if (next) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      setEmail(user.email ?? "");
      setPhone((user as { phone?: string }).phone ?? phone);
    }
  }

  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const guests = searchParams.get("guests") ?? "2";
  const nights = Number(searchParams.get("nights") ?? 0);
  const total = Number(searchParams.get("total") ?? 0);
  const pricePerNight = Number(searchParams.get("pricePerNight") ?? 0);
  const propertyName = searchParams.get("propertyName") ?? "";

  async function handleConfirm() {
    if (!agreed || submitting) return;
    setError(null);
    if (!firstName || !lastName || !email || !checkIn || !checkOut) {
      setError(t("errorMissingFields"));
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setError(t("errorInvalidDates"));
      return;
    }
    setSubmitting(true);
    try {
      const propertyForBooking = property ?? (await getPropertyBySlug(slug));
      if (!propertyForBooking) throw new Error("Property not found");
      const booking = await createBooking({
        property_id: propertyForBooking.id,
        check_in: checkIn,
        check_out: checkOut,
        guests_count: Number(guests),
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || undefined,
        special_requests: specialRequests || undefined,
      });
      const co = await createSumupCheckout(booking.id);
      setCheckout({
        id: co.checkout_id,
        reference: booking.reference,
        bookingId: booking.id,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  const handlePaid = useCallback(() => {
    if (checkout) router.push(`/booking/confirmation?ref=${checkout.reference}`);
  }, [checkout, router]);

  const handlePaymentError = useCallback(
    (msg: string) => {
      setError(msg);
      // Clean up the unpaid booking + checkout so the user can retry without
      // collisions on the same dates.
      if (checkout) {
        cancelMyBooking(checkout.bookingId).catch(() => {
          /* swallow — server will also expire it after 30 min */
        });
      }
      setCheckout(null);
    },
    [checkout],
  );

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
              {property && (
                <Image
                  src={property.coverImage}
                  alt={property.name}
                  loading="eager"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              )}
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
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <h3 className="font-headline text-2xl">{t("guestDetails")}</h3>
              {user && (
                <label className="flex items-center gap-2 cursor-pointer text-sm text-on-surface-variant hover:text-on-surface">
                  <input
                    type="checkbox"
                    checked={useAccount}
                    onChange={toggleUseAccount}
                    className="accent-primary"
                  />
                  {t("useMyAccount")}
                </label>
              )}
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-label text-xs text-on-surface-variant ml-1 uppercase tracking-widest">
                  {t("firstName")}
                </label>
                <input
                  className="w-full bg-surface-container-high rounded-lg p-4 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all border-none outline-none"
                  placeholder="Julian"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
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
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
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
              <div className="bg-white rounded-lg p-6 min-h-50">
                {checkout ? (
                  <>
                    <SumupCardWidget
                      checkoutId={checkout.id}
                      locale={locale === "fr" ? "fr-FR" : "en-GB"}
                      onSuccess={handlePaid}
                      onError={handlePaymentError}
                    />
                    <button
                      type="button"
                      onClick={() => handlePaymentError("")}
                      className="mt-4 text-slate-500 text-xs hover:text-slate-700 underline"
                    >
                      {t("cancelPayment")}
                    </button>
                  </>
                ) : (
                  <p className="text-slate-500 text-sm text-center py-12">
                    {t("paymentWillAppear")}
                  </p>
                )}
              </div>
              <p className="text-on-surface-variant text-xs text-center">
                {t("paymentSecureNote")}
              </p>
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
            {error && (
              <p className="text-error text-sm font-body" role="alert">
                {error}
              </p>
            )}
            {!checkout && (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!agreed || submitting}
                className="w-full gold-gradient text-on-primary font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  encrypted
                </span>
                {submitting ? t("submitting") : t("proceedToPayment")}
              </button>
            )}
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
                  <span className="flex items-center gap-1">
                    <Price amount={pricePerNight} /> x {nights} {t("nights")}
                  </span>
                  <Price amount={total} className="text-on-surface" />
                </div>
              )}
            </div>
            <div className="flex justify-between items-end mb-8">
              <div className="flex flex-col">
                <span className="text-xs uppercase text-on-surface-variant tracking-widest font-label">
                  {t("totalAmount")}
                </span>
                <span className="text-4xl font-headline text-primary">
                  {total > 0 ? <Price amount={total} /> : "—"}
                </span>
              </div>
              <span className="text-xs text-on-surface-variant mb-1 italic">
                {t("chargedInEur")}
              </span>
            </div>
            {!checkout && (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!agreed || submitting}
                className="w-full gold-gradient text-on-primary font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  encrypted
                </span>
                {submitting ? t("submitting") : t("proceedToPayment")}
              </button>
            )}
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
