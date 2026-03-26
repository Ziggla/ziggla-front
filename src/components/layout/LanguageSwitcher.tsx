"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  function switchLocale() {
    const nextLocale = locale === "en" ? "fr" : "en";
    startTransition(() => {
      router.replace(
        // @ts-expect-error - dynamic pathname
        { pathname, params },
        { locale: nextLocale }
      );
    });
  }

  return (
    <button
      onClick={switchLocale}
      disabled={isPending}
      className="text-on-surface/70 text-xs tracking-widest cursor-pointer hover:text-primary transition-colors duration-200 uppercase font-label font-medium disabled:opacity-50"
      aria-label="Switch language"
    >
      {locale === "en" ? "FR" : "EN"}
    </button>
  );
}
