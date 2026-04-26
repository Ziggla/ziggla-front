"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

type RoleTab = "user" | "host";

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const redirectTo = searchParams.get("redirect") ?? "";

  const [role, setRole] = useState<RoleTab>("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const REDIRECT: Record<string, string> = {
    user: "/dashboard/user",
    host: "/dashboard/host",
    admin: "/dashboard/admin",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const user = await login(email, password, rememberMe);
      // Admins can sign in from any tab; otherwise the selected tab must match.
      if (user.role !== "admin" && user.role !== role) {
        const expected = user.role === "host" ? "Host" : "Guest";
        setError(`This account is a ${expected}. Switch to the ${expected} tab to continue.`);
        return;
      }
      router.push(redirectTo || (REDIRECT[user.role] ?? "/"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  function handleRoleChange(tab: RoleTab) {
    setRole(tab);
    setError("");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-20 bg-background relative overflow-hidden">
      {/* Wave Background */}
      <div className="fixed inset-0 pointer-events-none opacity-10 overflow-hidden">
        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-auto text-primary" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" fill="currentColor" />
        </svg>
      </div>

      <div className="relative w-full max-w-md bg-surface-container-low p-10 rounded-xl">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="text-3xl font-headline italic text-primary mb-6 tracking-tight">
            ZIGGLA
          </Link>
          <h1 className="text-4xl font-headline text-on-surface mb-2">{t("welcomeBack")}</h1>
          <p className="text-on-surface-variant text-sm font-label tracking-wide uppercase text-center">
            {t("subtitle")}
          </p>
        </div>

        {/* Role toggle (user / host) */}
        <div className="relative flex bg-surface-container-high rounded-lg p-1 mb-8">
          <motion.div
            aria-hidden
            className="absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-md bg-primary"
            animate={{ x: role === "user" ? 0 : "100%" }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
          />
          {(["user", "host"] as RoleTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleRoleChange(tab)}
              className={`relative z-10 flex-1 py-2.5 rounded-md text-xs font-bold uppercase tracking-widest transition-colors ${
                role === tab ? "text-on-primary" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {tab === "user" ? "Guest" : "Host"}
            </button>
          ))}
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest px-1">
              {t("email")}
            </label>
            <input
              className="w-full bg-surface-container-high text-on-surface py-4 px-5 rounded-lg focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-outline-variant outline-none border-none"
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
              <Link
                href="/auth/forgot-password"
                className="text-xs font-label text-primary hover:text-secondary transition-colors uppercase tracking-widest"
              >
                {t("forgotPasswordLink")}
              </Link>
            </div>
            <div className="relative">
              <input
                className="w-full bg-surface-container-high text-on-surface py-4 px-5 pr-12 rounded-lg focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-outline-variant outline-none border-none"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
          </div>

          {/* Remember me */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className={`w-5 h-5 rounded shrink-0 flex items-center justify-center transition-all ${
                rememberMe
                  ? "bg-primary"
                  : "bg-surface-container-highest hover:bg-surface-container-highest/80"
              }`}
              onClick={() => setRememberMe(!rememberMe)}
            >
              {rememberMe && (
                <span className="material-symbols-outlined text-on-primary text-xs" style={{ fontSize: "14px" }}>
                  check
                </span>
              )}
            </div>
            <span className="text-sm text-on-surface-variant">Keep me signed in for 30 days</span>
          </label>

          {/* Error */}
          {error && (
            <p className="text-xs text-error font-medium px-1">{error}</p>
          )}

          {/* Sign In */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full gold-gradient py-4 rounded-lg font-label font-bold text-on-primary uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
          >
            {isLoading ? "Signing in…" : t("signIn")}
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
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>
        </form>

        <div className="mt-8 text-center space-y-3">
          <p className="text-sm font-label text-on-surface-variant">
            {t("newToZiggla")}{" "}
            <Link href="/auth/register" className="text-primary hover:text-secondary font-bold transition-colors ml-1 underline underline-offset-4 decoration-primary/30">
              {t("createAccount")}
            </Link>
          </p>
          <Link
            href="/auth/admin"
            className="block text-xs text-on-surface-variant/40 hover:text-on-surface-variant transition-colors tracking-widest uppercase"
          >
            Admin portal →
          </Link>
        </div>
      </div>
    </main>
  );
}
