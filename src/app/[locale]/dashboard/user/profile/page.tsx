"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiFetch } from "@/lib/api/client";

interface RawProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  nationality?: string | null;
  language?: "en" | "fr" | null;
  notif_booking_updates?: boolean;
  notif_sms?: boolean;
  notif_marketing?: boolean;
}

export default function UserProfilePage() {
  const t = useTranslations("dashboard.user.profile");
  const { user } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("GB");
  const [bookingUpdates, setBookingUpdates] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [marketing, setMarketing] = useState(true);
  const [activeLang, setActiveLang] = useState<"EN" | "FR">("EN");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    apiFetch<RawProfile>("/users/me")
      .then((p) => {
        setFirstName(p.first_name ?? "");
        setLastName(p.last_name ?? "");
        setEmail(p.email ?? "");
        setPhone(p.phone ?? "");
        setNationality(p.nationality ?? "GB");
        setActiveLang(p.language === "fr" ? "FR" : "EN");
        setBookingUpdates(p.notif_booking_updates ?? true);
        setSmsNotifs(p.notif_sms ?? false);
        setMarketing(p.notif_marketing ?? true);
      })
      .catch((err) => console.error("Failed to load profile", err));
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    apiFetch("/users/me", {
      method: "PATCH",
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        phone,
        nationality,
      }),
    })
      .catch((err) => console.error("Failed to save profile", err))
      .finally(() => setIsSaving(false));
  }

  function handlePreferenceChange(patch: Record<string, unknown>) {
    apiFetch("/users/me/preferences", {
      method: "PATCH",
      body: JSON.stringify(patch),
    }).catch((err) => console.error("Failed to update preferences", err));
  }

  return (
    <DashboardShell role="user" activeItem="profile">
      <main className="flex-1 bg-background">
        {/* Header */}
        <header className="sticky top-4 z-40 pointer-events-none mb-2">
          <div className="bg-[#030e20]/80 backdrop-blur-xl rounded-full mx-8 px-8 py-3 flex justify-between items-center pointer-events-auto">
            <h1 className="font-headline text-xl text-on-surface italic pl-10">{t("title")}</h1>
            <Link
              href="/dashboard/user"
              className="text-xs font-label uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-8 py-8">
          {/* Overline */}
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold mb-1">
              {t("overline")}
            </p>
            <h2 className="text-3xl font-headline text-on-surface">{t("title")}</h2>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left: Personal Details */}
            <div className="xl:col-span-2">
              <div className="bg-surface-container-low p-8 rounded-xl">
                <h3 className="text-sm uppercase tracking-widest text-on-surface-variant font-label mb-1">
                  {t("personalDetails")}
                </h3>
                <p className="text-on-surface-variant/60 text-xs mb-6">{t("profileDesc")}</p>

                {/* Avatar */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-primary/30">
                      <Image
                        src={user?.avatarUrl ?? "/images/avatar-default.svg"}
                        alt={user?.initials ?? "?"}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <span className="material-symbols-outlined text-white text-lg">upload</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">
                      {user ? `${user.firstName} ${user.lastName}`.trim() || user.email : "—"}
                    </p>
                    <p className="text-xs text-primary uppercase tracking-widest font-bold">Premium Member</p>
                  </div>
                </div>

                <form className="space-y-5" onSubmit={handleSave}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest px-1">
                        {t("firstName")}
                      </label>
                      <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-surface-container-high border-none rounded-lg p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary/40 outline-none transition-all"
                        type="text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest px-1">
                        {t("lastName")}
                      </label>
                      <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-surface-container-high border-none rounded-lg p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary/40 outline-none transition-all"
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest px-1">
                      {t("email")}
                    </label>
                    <input
                      value={email}
                      readOnly
                      disabled
                      className="w-full bg-surface-container-high/50 border-none rounded-lg p-4 text-on-surface-variant/60 outline-none cursor-not-allowed"
                      type="email"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest px-1">
                        {t("phone")}
                      </label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-surface-container-high border-none rounded-lg p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary/40 outline-none transition-all"
                        type="tel"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest px-1">
                        {t("nationality")}
                      </label>
                      <select
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        className="w-full bg-surface-container-high border-none rounded-lg p-4 text-on-surface focus:ring-1 focus:ring-primary/40 outline-none transition-all appearance-none"
                      >
                        <option value="GB">United Kingdom</option>
                        <option value="FR">France</option>
                        <option value="US">United States</option>
                        <option value="DE">Germany</option>
                        <option value="ES">Spain</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="gold-gradient text-on-primary px-8 py-3 rounded-lg font-label font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {t("saveChanges")}
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Preferences + Security */}
            <div className="space-y-6">
              {/* Preferences */}
              <div className="bg-surface-container-low p-6 rounded-xl">
                <h3 className="text-sm uppercase tracking-widest text-on-surface-variant font-label mb-4">
                  {t("preferencesTitle")}
                </h3>

                {/* Language toggle */}
                <div className="mb-5">
                  <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest mb-1">
                    {t("language")}
                  </p>
                  <p className="text-[10px] text-on-surface-variant/60 mb-3">{t("languageDesc")}</p>
                  <div className="flex gap-2">
                    {(["EN", "FR"] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setActiveLang(lang);
                          handlePreferenceChange({ language: lang.toLowerCase() });
                        }}
                        className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                          activeLang === lang
                            ? "gold-gradient text-on-primary"
                            : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notifications */}
                <div>
                  <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest mb-3">
                    {t("notificationsLabel")}
                  </p>
                  <div className="space-y-3">
                    {[
                      { label: t("bookingUpdates"), value: bookingUpdates, set: setBookingUpdates, key: "notif_booking_updates" },
                      { label: t("smsNotifs"), value: smsNotifs, set: setSmsNotifs, key: "notif_sms" },
                      { label: t("marketing"), value: marketing, set: setMarketing, key: "notif_marketing" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm text-on-surface">{item.label}</span>
                        <button
                          onClick={() => {
                            const next = !item.value;
                            item.set(next);
                            handlePreferenceChange({ [item.key]: next });
                          }}
                          className={`w-10 h-6 rounded-full transition-all relative ${
                            item.value ? "bg-primary" : "bg-surface-container-highest"
                          }`}
                        >
                          <span
                            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                              item.value ? "left-5" : "left-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="bg-surface-container-low p-6 rounded-xl">
                <h3 className="text-sm uppercase tracking-widest text-on-surface-variant font-label mb-4">
                  {t("securityTitle")}
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/auth/reset-password"
                    className="flex items-center justify-between p-3 bg-surface-container-high rounded-lg hover:bg-surface-container-highest transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-on-surface-variant text-base">lock</span>
                      <span className="text-sm text-on-surface">{t("changePassword")}</span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary text-base transition-colors">
                      chevron_right
                    </span>
                  </Link>

                  <div className="flex items-center justify-between p-3 bg-surface-container-high rounded-lg">
                    <div className="flex items-center gap-3">
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      <span className="text-sm text-on-surface">Google</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-primary font-bold uppercase tracking-widest">{t("googleConnected")}</span>
                      <button className="text-[10px] text-on-surface-variant/60 hover:text-error transition-colors uppercase tracking-widest">
                        {t("disconnect")}
                      </button>
                    </div>
                  </div>

                  <button className="w-full flex items-center gap-3 p-3 bg-surface-container-high rounded-lg hover:bg-error/10 transition-colors group text-left">
                    <span className="material-symbols-outlined text-error/60 group-hover:text-error text-base transition-colors">
                      delete_forever
                    </span>
                    <span className="text-sm text-error/60 group-hover:text-error transition-colors">{t("deleteAccount")}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </DashboardShell>
  );
}
