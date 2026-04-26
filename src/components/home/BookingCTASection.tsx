"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { getProperties, type Property } from "@/lib/api/properties";

export default function BookingCTASection() {
  const t = useTranslations("booking");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    let cancelled = false;
    getProperties()
      .then((p) => {
        if (!cancelled) setProperties(p);
      })
      .catch(() => {
        /* empty options on failure */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="booking"
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #c9a84c 0%, #e6c364 40%, #f0c110 70%, #c9a84c 100%)",
      }}
    >
      {/* Decorative overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-10 pointer-events-none"
      >
        <div
          className="absolute w-full h-px bg-white/30"
          style={{ top: "30%", transform: "rotate(-6deg) scaleX(1.5)" }}
        />
        <div
          className="absolute w-full h-px bg-white/20"
          style={{ top: "50%", transform: "rotate(-6deg) scaleX(1.5)" }}
        />
        <div
          className="absolute w-full h-px bg-white/10"
          style={{ top: "70%", transform: "rotate(-6deg) scaleX(1.5)" }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-light text-on-primary mb-4">
            {t("title")}
          </h2>
          <p className="text-on-primary/70 font-body text-base md:text-lg max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-background/20 backdrop-blur-sm rounded-xl p-6 lg:p-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Check-in */}
            <div className="flex flex-col gap-1.5">
              <label className="text-on-primary/80 text-xs font-label font-semibold tracking-widest uppercase">
                {t("checkIn")}
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="bg-background/30 text-on-primary font-body text-sm px-4 py-3 rounded-lg placeholder:text-on-primary/50 outline-none focus:ring-2 focus:ring-on-primary/30 transition-all duration-200"
              />
            </div>

            {/* Check-out */}
            <div className="flex flex-col gap-1.5">
              <label className="text-on-primary/80 text-xs font-label font-semibold tracking-widest uppercase">
                {t("checkOut")}
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="bg-background/30 text-on-primary font-body text-sm px-4 py-3 rounded-lg placeholder:text-on-primary/50 outline-none focus:ring-2 focus:ring-on-primary/30 transition-all duration-200"
              />
            </div>

            {/* Property select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-on-primary/80 text-xs font-label font-semibold tracking-widest uppercase">
                {t("property")}
              </label>
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="bg-background/30 text-on-primary font-body text-sm px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-on-primary/30 transition-all duration-200 cursor-pointer"
              >
                <option value="" className="bg-background text-on-surface">
                  — Select —
                </option>
                {properties.map((p) => (
                  <option
                    key={p.slug}
                    value={p.slug}
                    className="bg-background text-on-surface"
                  >
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* CTA button */}
            <div className="flex flex-col justify-end">
              <button className="bg-background text-on-background text-xs font-label font-semibold tracking-widest uppercase px-6 py-3 rounded-lg hover:bg-surface-container transition-colors duration-200">
                {t("cta")}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
