"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { locationDistances } from "@/data/properties";
import Image from "next/image";

export default function LocationSection() {
  const t = useTranslations("location");

  return (
    <section
      id="location"
      className="bg-surface-container-low py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text + distances */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="inline-block text-primary text-xs font-label font-semibold tracking-[0.3em] uppercase mb-6 opacity-80">
              Location
            </span>
            <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-light text-on-surface leading-tight mb-6">
              {t("title")}
            </h2>
            <div className="h-px w-24 bg-linear-to-r from-primary/60 to-transparent mb-6" />
            <p className="text-on-surface-variant font-body text-base leading-relaxed mb-10">
              {t("description")}
            </p>

            {/* Distances */}
            <div className="space-y-4">
              {locationDistances.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-xl">
                      {item.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className="text-on-surface font-body text-sm">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-primary font-label font-semibold text-sm">
                    {item.distance}
                  </span>
                </motion.div>
              ))}
            </div>

          </motion.div>

          {/* Right: Map placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative rounded-xl overflow-hidden aspect-square lg:aspect-auto lg:h-180 bg-surface-container-high"
          >
            {/* Map placeholder with stylized content */}
            <Image
              src="/images/Putney.png"
              alt="Map placeholder"
              width={1200}
              height={800}
              className="w-full h-full object-cover rounded-lg filter opacity-80"
            />
            <motion.a
              href="https://maps.google.com/?q=800+Fulham+Road,+London+SW6+5SL"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="absolute inset-0 flex items-center justify-center text-primary transition-opacity duration-200"
            >
              <span className="material-symbols-outlined h-5 text-64 text-yellow-400 drop-shadow-lg text-base">
                location_on
              </span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
