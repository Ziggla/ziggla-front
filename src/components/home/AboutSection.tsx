"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const stats = [
  { value: "2", key: "apartments" },
  { value: "110+", key: "guests" },
  { value: "9.2", key: "location" },
];

export default function AboutSection() {
  const t = useTranslations("about");

  return (
    <section id="about" className="bg-surface py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="inline-block text-primary text-xs font-label font-semibold tracking-[0.3em] uppercase mb-6 opacity-80">
            Ziggla
          </span>
          <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-light text-on-surface leading-tight mb-6">
            {t("title")}
          </h2>
        </motion.div>

        {/* Gold divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mb-8 h-px w-24 bg-linear-to-r from-transparent via-primary to-transparent"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-on-surface-variant font-body text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
        >
          {t("description")}
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 grid grid-cols-3 gap-8"
        >
          {stats.map((stat) => (
            <div key={stat.key} className="text-center">
              <div className="font-headline text-4xl md:text-5xl font-light text-primary text-glow mb-2">
                {stat.value}
              </div>
              <div className="text-on-surface-variant text-xs font-label tracking-widest uppercase">
                {t(`stats.${stat.key}`)}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
