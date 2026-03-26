"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "@/lib/auth/AuthContext";
import UserAvatar from "@/components/ui/UserAvatar";

export default function Navbar() {
  const t = useTranslations("nav");
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleLogout() {
    logout();
    setIsMobileOpen(false);
    router.push("/");
  }

  const dashboardHref =
    user?.role === "admin"
      ? "/dashboard/admin"
      : user?.role === "host"
        ? "/dashboard/host"
        : "/dashboard/user";

  const navLinks = [
    { href: "/properties", label: t("properties") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-surface/90 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="font-headline text-xl lg:text-2xl tracking-[0.2em] text-primary text-glow font-light"
          >
            ZIGGLA
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-on-surface/70 text-xs tracking-widest uppercase font-label font-medium hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4 lg:gap-6">
            <LanguageSwitcher />

            {isLoading ? (
              /* ── Loading: placeholder to avoid layout shift ── */
              <div className="hidden sm:block w-8 h-8 rounded-full bg-surface-container-high animate-pulse" />
            ) : user ? (
              /* ── Authenticated: avatar + name → dashboard ── */
              <Link
                href={dashboardHref}
                className="hidden sm:flex items-center gap-2.5 group"
              >
                <UserAvatar
                  avatarUrl={user.avatarUrl}
                  initials={user.initials}
                  size={32}
                  className="group-hover:border-primary transition-colors"
                />
                <span className="text-xs font-label font-medium text-on-surface/80 group-hover:text-primary transition-colors max-w-[100px] truncate">
                  {user.firstName || user.email.split("@")[0]}
                </span>
              </Link>
            ) : (
              /* ── Guest: sign in link ── */
              <Link
                href="/auth/login"
                className="hidden sm:inline-flex items-center gap-1.5 text-on-surface/70 text-xs font-label font-medium tracking-widest uppercase hover:text-primary transition-colors duration-200"
              >
                <span className="material-symbols-outlined text-sm">person</span>
                {t("signIn")}
              </Link>
            )}

            <Link
              href="/#booking"
              className="hidden sm:inline-flex items-center justify-center gold-gradient text-on-primary text-xs font-label font-semibold tracking-widest uppercase px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity duration-200"
            >
              {t("bookNow")}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden flex flex-col gap-1.5 p-1"
              aria-label="Toggle menu"
            >
              <span
                className={`block h-px w-6 bg-on-surface transition-all duration-300 ${
                  isMobileOpen ? "rotate-45 translate-y-2.5" : ""
                }`}
              />
              <span
                className={`block h-px w-6 bg-on-surface transition-all duration-300 ${
                  isMobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-px w-6 bg-on-surface transition-all duration-300 ${
                  isMobileOpen ? "-rotate-45 -translate-y-2.5" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-surface-container/95 backdrop-blur-xl`}
      >
        <nav className="flex flex-col gap-1 px-6 py-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className="text-on-surface/70 text-sm tracking-widest uppercase font-label font-medium hover:text-primary transition-colors duration-200 py-3"
            >
              {link.label}
            </a>
          ))}

          {!isLoading && user ? (
            <>
              {/* Mobile: user info */}
              <div className="flex items-center gap-3 py-3 border-t border-surface-variant mt-1">
                <UserAvatar avatarUrl={user.avatarUrl} initials={user.initials} size={32} />
                <div>
                  <p className="text-sm font-label font-semibold text-on-surface">
                    {user.firstName ? `${user.firstName} ${user.lastName}` : user.email}
                  </p>
                  <p className="text-xs text-on-surface-variant capitalize">{user.role}</p>
                </div>
              </div>
              <Link
                href={dashboardHref}
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-2 text-on-surface/70 text-sm tracking-widest uppercase font-label font-medium hover:text-primary transition-colors duration-200 py-3"
              >
                <span className="material-symbols-outlined text-sm">dashboard</span>
                Dashboard
              </Link>
              <button
                onClick={() => { handleLogout(); setIsMobileOpen(false); }}
                className="flex items-center gap-2 text-error text-sm tracking-widest uppercase font-label font-medium py-3"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-2 text-on-surface/70 text-sm tracking-widest uppercase font-label font-medium hover:text-primary transition-colors duration-200 py-3"
            >
              <span className="material-symbols-outlined text-sm">person</span>
              {t("signIn")}
            </Link>
          )}

          <Link
            href="/#booking"
            onClick={() => setIsMobileOpen(false)}
            className="mt-3 inline-flex items-center justify-center gold-gradient text-on-primary text-xs font-label font-semibold tracking-widest uppercase px-5 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            {t("bookNow")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
