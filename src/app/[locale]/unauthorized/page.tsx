"use client";

import { Link } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

export default function UnauthorizedPage() {
  const { user } = useAuth();

  const isGuest = !user;
  const title = isGuest ? "Sign in to continue" : "Access restricted";
  const description = isGuest
    ? "You need to be logged in to view this page."
    : "You don't have permission to access this page. This area is reserved for a different account type.";

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-5 overflow-hidden">
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-auto text-primary"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L0,320Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="relative text-center max-w-lg">
        <p className="text-8xl font-headline text-primary/20 mb-2 select-none">
          {isGuest ? "401" : "403"}
        </p>
        <div className="w-12 h-0.5 gold-gradient mx-auto mb-8" />

        <Link href="/" className="text-2xl font-headline italic text-primary tracking-tight mb-8 block">
          ZIGGLA
        </Link>

        <div className="inline-flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full mb-6">
          <span className="material-symbols-outlined text-primary text-base">
            {isGuest ? "lock" : "shield"}
          </span>
          <span className="text-xs font-label text-on-surface-variant uppercase tracking-widest">
            {isGuest ? "Authentication required" : "Unauthorized"}
          </span>
        </div>

        <h1 className="text-3xl font-headline text-on-surface mb-4">{title}</h1>
        <p className="text-on-surface-variant text-sm leading-relaxed mb-10">{description}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isGuest ? (
            <Link
              href="/auth/login"
              className="gold-gradient px-8 py-3 rounded-lg font-label font-bold text-on-primary uppercase tracking-widest text-sm hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
          ) : (
            <Link
              href={
                user.role === "host"
                  ? "/dashboard/host"
                  : user.role === "admin"
                    ? "/dashboard/admin"
                    : "/dashboard/user"
              }
              className="gold-gradient px-8 py-3 rounded-lg font-label font-bold text-on-primary uppercase tracking-widest text-sm hover:opacity-90 transition-opacity"
            >
              Go to Dashboard
            </Link>
          )}
          <Link
            href="/"
            className="px-8 py-3 rounded-lg font-label font-semibold text-on-surface-variant bg-surface-container-high uppercase tracking-widest text-sm hover:bg-surface-bright transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
