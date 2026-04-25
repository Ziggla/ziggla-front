"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

export default function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background gradient orbs */}
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-tertiary/5 blur-3xl" />
      </div>

      {/* Gold wave lines overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden pointer-events-none opacity-10"
      >
        <div
          className="absolute w-full h-px bg-linear-to-r from-transparent via-primary to-transparent"
          style={{ top: "35%", transform: "rotate(-8deg) scaleX(1.5)" }}
        />
        <div
          className="absolute w-full h-px bg-linear-to-r from-transparent via-primary/60 to-transparent"
          style={{ top: "50%", transform: "rotate(-8deg) scaleX(1.5)" }}
        />
        <div
          className="absolute w-full h-px bg-linear-to-r from-transparent via-primary/30 to-transparent"
          style={{ top: "65%", transform: "rotate(-8deg) scaleX(1.5)" }}
        />
      </div>

      {/* Main content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        <motion.div variants={itemVariants}>
          <span className="inline-block text-primary text-xs font-label font-semibold tracking-[0.3em] uppercase mb-6 opacity-80">
            London · Putney
          </span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="mb-2">
          <span className="block font-headline text-5xl md:text-7xl lg:text-8xl font-light text-on-surface leading-tight">
            {t("line1")}
          </span>
          <span className="block font-headline text-5xl md:text-7xl lg:text-8xl font-light italic text-primary text-glow leading-tight">
            {t("line2")}
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-8 text-on-surface-variant font-body text-base md:text-lg max-w-xl mx-auto leading-relaxed"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div variants={itemVariants} className="mt-10">
          <Link
            href="/properties"
            className="inline-flex items-center gap-3 gold-gradient text-on-primary text-xs font-label font-semibold tracking-[0.2em] uppercase px-8 py-4 rounded-full hover:opacity-90 transition-opacity duration-200"
          >
            {t("cta")}
            <span className="material-symbols-outlined text-base">
              arrow_forward
            </span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-primary text-xs font-label tracking-[0.3em] uppercase">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-primary/60 to-transparent" />
      </motion.div>
    </section>
  );
}
