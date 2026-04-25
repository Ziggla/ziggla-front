"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const router = useRouter();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adultsOnly, setAdultsOnly] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-background relative overflow-hidden">
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
        <svg
          className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[150%] h-auto text-primary opacity-50"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,64L48,96C96,128,192,192,288,197.3C384,203,480,149,576,138.7C672,128,768,160,864,165.3C960,171,1056,149,1152,144C1248,139,1344,149,1392,154.7L1440,160L1440,320L0,320Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Register Card */}
      <div className="relative w-full max-w-lg bg-surface-container-low p-10 rounded-xl">
        <div className="flex flex-col items-center mb-8">
          <Link
            href="/"
            className="text-3xl font-headline italic text-primary mb-4 tracking-tight"
          >
            ZIGGLA
          </Link>
          <h1 className="text-3xl font-headline text-on-surface mb-1">{t("title")}</h1>
          <p className="text-on-surface-variant text-xs font-label tracking-[0.2em] uppercase text-center">
            {t("joinCollective")}
          </p>
        </div>

        <form className="space-y-5" onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
          }
          if (!adultsOnly || !agreeTerms) {
            setError("Please confirm you are 18+ and agree to the terms");
            return;
          }
          setIsLoading(true);
          try {
            const user = await register(firstName, lastName, email, password);
            const redirect: Record<string, string> = { user: "/dashboard/user", host: "/dashboard/host", admin: "/dashboard/admin" };
            router.push(redirect[user.role] ?? "/");
          } catch (err) {
            setError(err instanceof Error ? err.message : "Registration failed");
          } finally {
            setIsLoading(false);
          }
        }}>
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest px-1">
                {t("firstName")}
              </label>
              <input
                className="w-full bg-surface-container-high border-none rounded-lg p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary/40 outline-none transition-all"
                placeholder="Alex"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest px-1">
                {t("lastName")}
              </label>
              <input
                className="w-full bg-surface-container-high border-none rounded-lg p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary/40 outline-none transition-all"
                placeholder="Mercer"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest px-1">
              {t("email")}
            </label>
            <input
              className="w-full bg-surface-container-high border-none rounded-lg p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary/40 outline-none transition-all"
              placeholder="name@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest">
                {t("password")}
              </label>
              <span className="text-[10px] text-on-surface-variant/60">{t("minChars")}</span>
            </div>
            <div className="relative">
              <input
                className="w-full bg-surface-container-high border-none rounded-lg p-4 pr-12 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary/40 outline-none transition-all"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
            {/* Strength Bar */}
            {password.length > 0 && (
              <div className="space-y-1 px-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        i <= strength ? strengthColors[strength] : "bg-surface-container-highest"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-on-surface-variant/60">
                  {strengthLabels[strength]}
                </p>
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
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

          {/* Checkboxes */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div
                className={`w-5 h-5 rounded shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                  adultsOnly
                    ? "bg-primary"
                    : "bg-surface-container-highest group-hover:bg-surface-container-highest/80"
                }`}
                onClick={() => setAdultsOnly(!adultsOnly)}
              >
                {adultsOnly && (
                  <span className="material-symbols-outlined text-on-primary text-xs" style={{ fontSize: "14px" }}>
                    check
                  </span>
                )}
              </div>
              <span className="text-sm text-on-surface-variant leading-snug">{t("adultsOnly")}</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group">
              <div
                className={`w-5 h-5 rounded shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                  agreeTerms
                    ? "bg-primary"
                    : "bg-surface-container-highest group-hover:bg-surface-container-highest/80"
                }`}
                onClick={() => setAgreeTerms(!agreeTerms)}
              >
                {agreeTerms && (
                  <span className="material-symbols-outlined text-on-primary text-xs" style={{ fontSize: "14px" }}>
                    check
                  </span>
                )}
              </div>
              <span className="text-sm text-on-surface-variant leading-snug">
                {t.rich("agreeTerms", {
                  terms: (chunks) => (
                    <Link href="/terms" className="text-primary hover:text-secondary underline underline-offset-2">
                      {chunks}
                    </Link>
                  ),
                  privacy: (chunks) => (
                    <Link href="/privacy" className="text-primary hover:text-secondary underline underline-offset-2">
                      {chunks}
                    </Link>
                  ),
                })}
              </span>
            </label>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-error font-medium px-1">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full gold-gradient py-4 rounded-lg font-label font-bold text-on-primary uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
          >
            {isLoading ? "Creating account…" : t("createAccount")}
          </button>

          {/* Divider */}
          <div className="relative flex items-center py-2">
            <div className="grow h-px bg-surface-variant" />
            <span className="shrink mx-4 text-xs font-label text-outline-variant uppercase tracking-widest">
              {t("orContinueWith")}
            </span>
            <div className="grow h-px bg-surface-variant" />
          </div>

          {/* Google */}
          <button
            type="button"
            className="w-full bg-surface-container-highest py-4 rounded-lg font-label font-semibold text-on-surface flex items-center justify-center gap-3 transition-all hover:bg-surface-bright active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm font-label text-on-surface-variant">
            {t("alreadyAccount")}{" "}
            <Link
              href="/auth/login"
              className="text-primary hover:text-secondary font-bold transition-colors ml-1 underline underline-offset-4 decoration-primary/30"
            >
              {t("signIn")}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
