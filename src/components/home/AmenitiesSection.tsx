"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionTitle from "@/components/ui/SectionTitle";

const amenityItems = [
  { icon: "hot_tub", key: "jacuzzi" },
  { icon: "wifi", key: "wifi" },
  { icon: "kitchen", key: "kitchen" },
  { icon: "ac_unit", key: "ac" },
  { icon: "location_city", key: "cityView" },
  { icon: "local_laundry_service", key: "laundry" },
  { icon: "tv", key: "tv" },
  { icon: "bed", key: "linens" },
];

export default function AmenitiesSection() {
  const t = useTranslations("amenities");

  return (
    <section id="amenities" className="bg-surface py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="inline-block text-primary text-xs font-label font-semibold tracking-[0.3em] uppercase mb-6 opacity-80">
              Amenities
            </span>
            <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-light text-on-surface leading-tight mb-6">
              {t("title")}
            </h2>
            <div className="h-px w-24 bg-linear-to-r from-primary/60 to-transparent mb-6" />
            <p className="text-on-surface-variant font-body text-base md:text-lg leading-relaxed">
              {t("description")}
            </p>
          </motion.div>

          {/* Right: Icon grid */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4"
          >
            {amenityItems.map((item, index) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-surface-container-high rounded-xl p-5 flex flex-col items-center gap-3 text-center hover:bg-surface-container-highest transition-colors duration-200"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    {item.icon}
                  </span>
                </div>
                <span className="text-on-surface font-label text-xs font-medium tracking-wide leading-tight">
                  {t(`items.${item.key}`)}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
