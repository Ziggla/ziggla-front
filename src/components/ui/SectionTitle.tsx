"use client";

import { motion } from "framer-motion";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  goldAccent?: boolean;
}

export default function SectionTitle({
  title,
  subtitle,
  centered = true,
  goldAccent = false,
}: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`mb-12 ${centered ? "text-center" : ""}`}
    >
      <h2
        className={`font-headline text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-4 ${
          goldAccent ? "text-primary text-glow" : "text-on-surface"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-on-surface-variant font-body text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
      <div
        className={`mt-6 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent ${
          centered ? "mx-auto" : ""
        } w-48`}
      />
    </motion.div>
  );
}
