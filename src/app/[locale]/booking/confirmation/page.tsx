"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const STAIRCASE =
  "https://mjduzgj5bbgoqbn6.public.blob.vercel-storage.com/luxury-properties/staircase-yellow-led-wmAz6DzsliK70xHBv5IEaNhlfRBSLJ.jpg";

export default function BookingConfirmationPage() {
  const t = useTranslations("confirmation");

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center">
      <div className="max-w-2xl w-full text-center">
        {/* Success Icon */}
        <div className="mb-10 flex flex-col items-center">
          <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full" style={{ border: "4px solid rgba(230,195,100,0.2)", transform: "scale(1.1)" }}></div>
            <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center text-on-primary">
              <span
                className="material-symbols-outlined text-4xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
          </div>
          <h1 className="font-headline text-5xl md:text-5xl text-on-surface mb-3">
            {t("title")}
          </h1>
          <p className="font-mono text-primary tracking-widest text-sm bg-primary/10 px-4 py-1.5 rounded-full inline-block">
            REF-ZIGGLA-2025-XBVZ
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-surface-container rounded-xl p-8 mb-12 text-left relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 opacity-10 pointer-events-none">
            <svg fill="none" height="400" viewBox="0 0 400 400" width="400" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 200C50 150 150 150 200 200C250 250 350 250 400 200V400H0V200Z" fill="url(#gold_grad)"></path>
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="gold_grad" x1="0" x2="400" y1="200" y2="400">
                  <stop stopColor="#e6c364"></stop>
                  <stop offset="1" stopColor="#ffd65b"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            <div className="w-full md:w-1/3 h-48 md:h-auto rounded-lg overflow-hidden relative">
              <Image
                src={STAIRCASE}
                alt="The Gilded Atelier"
                loading="eager"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <span className="font-label text-xs uppercase tracking-[0.2em] text-primary mb-2 block">
                  {t("curatedStay")}
                </span>
                <h2 className="font-headline text-2xl mb-4 text-on-surface">
                  {t("propertyName")}
                </h2>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-on-surface-variant text-xs uppercase tracking-wider">
                      {t("checkIn")}
                    </p>
                    <p className="font-medium text-on-surface">Oct 14, 2025</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant text-xs uppercase tracking-wider">
                      {t("checkOut")}
                    </p>
                    <p className="font-medium text-on-surface">Oct 19, 2025</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-on-surface-variant text-xs uppercase tracking-wider">
                      {t("location")}
                    </p>
                    <p className="font-medium text-on-surface">Putney, London</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="text-left mb-16">
          <h3 className="font-headline text-xl mb-8 pl-4" style={{ borderLeft: "4px solid #e6c364" }}>
            {t("whatNext")}
          </h3>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="bg-surface-container-high p-3 rounded-lg text-primary shrink-0">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div>
                <h4 className="font-medium text-on-surface">{t("step1Title")}</h4>
                <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">
                  {t("step1Desc")}
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="bg-surface-container-high p-3 rounded-lg text-primary shrink-0">
                <span className="material-symbols-outlined">concierge</span>
              </div>
              <div>
                <h4 className="font-medium text-on-surface">{t("step2Title")}</h4>
                <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">
                  {t("step2Desc")}
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="bg-surface-container-high p-3 rounded-lg text-primary shrink-0">
                <span className="material-symbols-outlined">key</span>
              </div>
              <div>
                <h4 className="font-medium text-on-surface">{t("step3Title")}</h4>
                <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">
                  {t("step3Desc")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard/user"
            className="gold-gradient text-on-primary px-10 py-4 rounded font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            {t("viewBooking")}
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
          <Link
            href="/"
            className="text-on-surface px-10 py-4 rounded font-medium hover:bg-surface-container transition-all"
            style={{ border: "1px solid #4d4637" }}
          >
            {t("backHome")}
          </Link>
        </div>
      </div>
    </main>
  );
}
