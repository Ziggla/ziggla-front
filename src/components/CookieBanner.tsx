"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";

const COOKIE_KEY = "ziggla_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
    >
      <div className="max-w-4xl mx-auto bg-surface-container border border-surface-variant rounded-xl p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="flex items-start gap-4 flex-1">
          <span className="material-symbols-outlined text-primary text-2xl shrink-0 mt-0.5">
            cookie
          </span>
          <div>
            <p className="text-sm text-on-surface font-label font-semibold mb-1">
              We use cookies
            </p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              We use essential cookies to keep you signed in and improve your experience.
              By clicking "Accept", you agree to our{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              . This site is GDPR compliant.
            </p>
          </div>
        </div>

        <div className="flex gap-3 shrink-0 w-full sm:w-auto">
          <button
            onClick={decline}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-xs font-label font-semibold text-on-surface-variant bg-surface-container-high hover:bg-surface-bright transition-colors uppercase tracking-widest"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-xs font-label font-bold text-on-primary gold-gradient hover:opacity-90 transition-opacity uppercase tracking-widest"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
