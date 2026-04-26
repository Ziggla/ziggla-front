"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import {
  getMe,
  updateMe,
  updatePreferences,
  type MeProfile,
} from "@/lib/api/users";
import { getHostProperties, type HostProperty } from "@/lib/api/analytics";
import { getBookingsByHost, type Booking } from "@/lib/api/bookings";
import Price from "@/components/Price";

export default function HostSettingsPage() {
  const [me, setMe] = useState<MeProfile | null>(null);
  const [properties, setProperties] = useState<HostProperty[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [prefsMsg, setPrefsMsg] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("");

  const [language, setLanguage] = useState<"en" | "fr">("en");
  const [notifBooking, setNotifBooking] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [notifMarketing, setNotifMarketing] = useState(true);

  useEffect(() => {
    Promise.all([getMe(), getHostProperties(), getBookingsByHost()])
      .then(([meData, props, bks]) => {
        setMe(meData);
        setFirstName(meData.first_name);
        setLastName(meData.last_name);
        setPhone(meData.phone ?? "");
        setNationality(meData.nationality ?? "");
        setLanguage(meData.language);
        setNotifBooking(meData.notif_booking_updates);
        setNotifSms(meData.notif_sms);
        setNotifMarketing(meData.notif_marketing);
        setProperties(props);
        setBookings(bks);
      })
      .catch(console.error);
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      const updated = await updateMe({
        first_name: firstName,
        last_name: lastName,
        phone: phone || undefined,
        nationality: nationality || undefined,
      });
      setMe(updated);
      setProfileMsg("Profile saved.");
    } catch (e) {
      setProfileMsg((e as Error).message);
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleSavePrefs(e: React.FormEvent) {
    e.preventDefault();
    setSavingPrefs(true);
    setPrefsMsg(null);
    try {
      await updatePreferences({
        language,
        notif_booking_updates: notifBooking,
        notif_sms: notifSms,
        notif_marketing: notifMarketing,
      });
      setPrefsMsg("Preferences saved.");
    } catch (e) {
      setPrefsMsg((e as Error).message);
    } finally {
      setSavingPrefs(false);
    }
  }

  const totalRevenue = bookings
    .filter((b) =>
      ["confirmed", "checked_in", "completed"].includes(b.status),
    )
    .reduce((acc, b) => acc + b.total, 0);

  return (
    <DashboardShell role="host" activeItem="settings">
      <main className="flex-1 bg-background px-8 py-10">
        <h1 className="font-headline text-3xl text-on-surface mb-2">Settings</h1>
        <p className="text-on-surface-variant text-sm mb-10">
          Manage your host profile, payout method, calendar integration and
          notification preferences.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 bg-surface-container-low rounded-xl p-8">
            <h2 className="font-headline text-xl mb-6">Profile</h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First name" value={firstName} onChange={setFirstName} />
                <Input label="Last name" value={lastName} onChange={setLastName} />
              </div>
              <Input
                label="Email"
                value={me?.email ?? ""}
                onChange={() => {}}
                disabled
                hint="Contact support to change your email."
              />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Phone" value={phone} onChange={setPhone} placeholder="+44 ..." />
                <Input label="Nationality (ISO)" value={nationality} onChange={setNationality} placeholder="GB" />
              </div>
              {profileMsg && (
                <p className={`text-sm ${profileMsg === "Profile saved." ? "text-primary" : "text-error"}`}>
                  {profileMsg}
                </p>
              )}
              <button
                type="submit"
                disabled={savingProfile}
                className="gold-gradient text-on-primary px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest disabled:opacity-40"
              >
                {savingProfile ? "Saving…" : "Save profile"}
              </button>
            </form>
          </section>

          <aside className="bg-surface-container-low rounded-xl p-8">
            <h2 className="font-headline text-xl mb-6">Account</h2>
            <div className="space-y-4 text-sm">
              <Stat label="Role" value={me?.role ?? "—"} />
              <Stat label="Active properties" value={String(properties.length)} />
              <Stat label="Lifetime bookings" value={String(bookings.length)} />
              <div>
                <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">
                  Lifetime revenue (paid)
                </p>
                <Price
                  amount={totalRevenue}
                  fractionDigits={2}
                  className="text-2xl font-headline text-primary"
                />
              </div>
            </div>
          </aside>

          <section className="lg:col-span-2 bg-surface-container-low rounded-xl p-8">
            <h2 className="font-headline text-xl mb-6">Preferences</h2>
            <form onSubmit={handleSavePrefs} className="space-y-5">
              <div>
                <label className="text-xs uppercase tracking-widest text-on-surface-variant mb-2 block">
                  Interface language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as "en" | "fr")}
                  className="bg-surface-container-high rounded-lg px-3 py-2 text-on-surface outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              <Toggle label="Booking updates" description="Email when a guest books, cancels or checks in." checked={notifBooking} onChange={setNotifBooking} />
              <Toggle label="SMS reminders" description="Text alerts the day before a check-in." checked={notifSms} onChange={setNotifSms} />
              <Toggle label="Marketing emails" description="Tips, product news, monthly performance digest." checked={notifMarketing} onChange={setNotifMarketing} />
              {prefsMsg && (
                <p className={`text-sm ${prefsMsg === "Preferences saved." ? "text-primary" : "text-error"}`}>
                  {prefsMsg}
                </p>
              )}
              <button
                type="submit"
                disabled={savingPrefs}
                className="gold-gradient text-on-primary px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest disabled:opacity-40"
              >
                {savingPrefs ? "Saving…" : "Save preferences"}
              </button>
            </form>
          </section>

          <aside className="bg-surface-container-low rounded-xl p-8">
            <h2 className="font-headline text-xl mb-6">Payouts</h2>
            <div className="space-y-3 text-sm">
              <Stat label="Method" value="SumUp" />
              <Stat label="Currency" value="EUR" />
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Payouts are managed by SumUp and settle automatically to the
                bank account linked to your merchant code.
              </p>
              <a
                href="https://me.sumup.com"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mt-2"
              >
                Open SumUp dashboard
                <span className="material-symbols-outlined text-base">open_in_new</span>
              </a>
            </div>
          </aside>

          <section className="lg:col-span-2 bg-surface-container-low rounded-xl p-8">
            <h2 className="font-headline text-xl mb-2">Google Calendar sync</h2>
            <p className="text-on-surface-variant text-sm mb-4">
              Confirmed bookings are pushed automatically as events on the
              shared <code>Ziggla Bookings</code> calendar via a service account.
              No per-host action is required.
            </p>
            <div className="bg-surface-container-high rounded-lg px-4 py-3 text-sm flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">check_circle</span>
              <span className="text-on-surface">Calendar integration is active.</span>
            </div>
          </section>

          <aside className="bg-surface-container-low rounded-xl p-8">
            <h2 className="font-headline text-xl mb-6">Security</h2>
            <p className="text-on-surface-variant text-sm mb-4">
              Need to change your password or sign out of every device?
            </p>
            <a
              href="/auth/forgot-password"
              className="block w-full text-center px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest text-on-surface hover:bg-surface-container transition-colors"
              style={{ border: "1px solid #4d4637" }}
            >
              Reset password
            </a>
          </aside>
        </div>
      </main>
    </DashboardShell>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-on-surface-variant mb-1 block">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-surface-container-high rounded-lg px-3 py-2.5 text-on-surface outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
      />
      {hint && <p className="text-on-surface-variant text-[11px] mt-1">{hint}</p>}
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-4 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 w-5 h-5 accent-primary"
      />
      <div>
        <p className="text-on-surface text-sm font-medium">{label}</p>
        <p className="text-on-surface-variant text-xs">{description}</p>
      </div>
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-on-surface-variant">{label}</p>
      <p className="text-on-surface font-medium capitalize">{value}</p>
    </div>
  );
}
