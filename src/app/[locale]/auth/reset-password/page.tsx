"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function ResetPasswordPage() {
  const t = useTranslations("auth.resetPassword");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [updated, setUpdated] = useState(false);

  const getStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = getStrength(password);
  const strengthColors = ["bg-error", "bg-error", "bg-secondary", "bg-tertiary", "bg-primary"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  if (updated) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-20 bg-background relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none opacity-10 overflow-hidden">
          <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-auto text-primary" viewBox="0 0 1440 320">
            <path d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" fill="currentColor" />
          </svg>
        </div>
        <div className="relative w-full max-w-md bg-surface-container-low p-10 rounded-xl text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>
          <h1 className="text-3xl font-headline text-on-surface mb-3">{t("passwordUpdated")}</h1>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-8">{t("passwordUpdatedDesc")}</p>
          <Link
            href="/auth/login"
            className="inline-block w-full gold-gradient py-4 rounded-lg font-label font-bold text-on-primary uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98] text-center"
          >
            {t("signInNew")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-20 bg-background relative overflow-hidden">
      {/* Wave Background */}
      <div className="fixed inset-0 pointer-events-none opacity-10 overflow-hidden">
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-auto text-primary"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="relative w-full max-w-md bg-surface-container-low p-10 rounded-xl">
        {/* Icon */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 gold-gradient rounded-2xl flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-on-primary text-3xl">key</span>
          </div>
          <Link href="/" className="text-2xl font-headline italic text-primary mb-4 tracking-tight">
            ZIGGLA
          </Link>
          <h1 className="text-3xl font-headline text-on-surface mb-2 text-center">{t("title")}</h1>
          <p className="text-on-surface-variant text-sm font-label text-center leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setUpdated(true); }}>
          {/* New Password */}
          <div className="space-y-2">
            <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest px-1">
              {t("newPassword")}
            </label>
            <div className="relative">
              <input
                className="w-full bg-surface-container-high border-none rounded-lg p-4 pr-12 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary/40 outline-none transition-all"
                placeholder="••••••••"
                type={showNew ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-xl">
                  {showNew ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
            {/* Strength */}
            {password.length > 0 && (
              <div className="space-y-1 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-label">
                    {t("strengthLabel")}
                  </span>
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          i <= strength ? strengthColors[strength] : "bg-surface-container-highest"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-on-surface-variant/60">{strengthLabels[strength]}</span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest px-1">
              {t("confirmPassword")}
            </label>
            <div className="relative">
              <input
                className="w-full bg-surface-container-high border-none rounded-lg p-4 pr-12 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary/40 outline-none transition-all"
                placeholder="••••••••"
                type={showConfirm ? "text" : "password"}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-xl">
                  {showConfirm ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full gold-gradient py-4 rounded-lg font-label font-bold text-on-primary uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98]"
          >
            {t("updatePassword")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-xs font-label uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            {t("backToLogin")}
          </Link>
        </div>
      </div>
    </main>
  );
}
