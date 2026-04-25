"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth.forgotPassword");

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
        {/* Back link */}
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-xs font-label uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors mb-8"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          {t("backToSignIn")}
        </Link>

        {/* Icon */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 gold-gradient rounded-2xl flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-on-primary text-3xl">lock_reset</span>
          </div>
          <Link href="/" className="text-2xl font-headline italic text-primary mb-4 tracking-tight">
            ZIGGLA
          </Link>
          <h1 className="text-3xl font-headline text-on-surface mb-2 text-center">{t("title")}</h1>
          <p className="text-on-surface-variant text-sm font-label text-center leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest px-1">
              {t("emailLabel")}
            </label>
            <input
              className="w-full bg-surface-container-high border-none rounded-lg p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary/40 outline-none transition-all"
              placeholder="name@example.com"
              type="email"
            />
          </div>

          <button
            type="submit"
            className="w-full gold-gradient py-4 rounded-lg font-label font-bold text-on-primary uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98]"
          >
            {t("sendResetLink")}
          </button>
        </form>

        {/* Spam note */}
        <div className="mt-6 flex items-start gap-3 bg-surface-container-high rounded-lg p-4">
          <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">info</span>
          <p className="text-xs text-on-surface-variant leading-relaxed">{t("spamNote")}</p>
        </div>

        {/* Footer links */}
        <div className="mt-8 pt-6 flex justify-center gap-6" style={{ borderTop: "1px solid rgba(77,70,55,0.15)" }}>
          <Link href="/privacy" className="text-xs text-on-surface-variant/60 hover:text-primary transition-colors uppercase tracking-widest font-label">
            Privacy
          </Link>
          <Link href="/privacy" className="text-xs text-on-surface-variant/60 hover:text-primary transition-colors uppercase tracking-widest font-label">
            Terms
          </Link>
          <Link href="/contact" className="text-xs text-on-surface-variant/60 hover:text-primary transition-colors uppercase tracking-widest font-label">
            Contact
          </Link>
        </div>
      </div>
    </main>
  );
}
