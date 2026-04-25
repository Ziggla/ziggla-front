"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Property } from "@/data/properties";
import Price from "@/components/Price";

interface PropertyCardProps {
  property: Property;
  index?: number;
  className?: string;
}

export default function PropertyCard({
  property,
  index = 0,
  className = "",
}: PropertyCardProps) {
  const t = useTranslations("properties");

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
      className={`group relative overflow-hidden rounded-xl bg-surface-container-high ${className}`}
    >
      {/* Cover image */}
      <div className="relative w-full overflow-hidden" style={{ height: "320px" }}>
        <Image
          src={property.coverImage}
          alt={property.name}
          fill
          loading="eager"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        {/* Rating badge */}
        <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-sm">
            star
          </span>
          <span className="text-on-surface font-label font-semibold text-sm">
            {property.rating}
          </span>
        </div>

        {/* Jacuzzi badge */}
        <div className="absolute top-4 right-4 bg-primary/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-sm">
            hot_tub
          </span>
          <span className="text-primary font-label font-medium text-xs tracking-wide">
            {t("jacuzzi")}
          </span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="gold-gradient text-on-primary text-xs font-label font-semibold tracking-widest uppercase px-6 py-3 rounded-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {t("viewDetails")}
          </span>
        </div>
      </div>

      {/* Card content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="font-headline text-xl font-light text-primary leading-tight">
            {property.name}
          </h3>
          <div className="shrink-0 text-right">
            <Price
              amount={property.pricePerNight}
              className="text-on-surface font-label font-semibold text-lg"
            />
            <div className="text-on-surface-variant text-xs">{t("perNight")}</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-on-surface-variant text-sm mb-4">
          <span className="material-symbols-outlined text-base">
            location_on
          </span>
          <span className="font-body text-xs">{property.address}</span>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="bg-surface-container px-3 py-1 rounded-full text-xs font-label text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-primary">
              square_foot
            </span>
            {property.size} m²
          </span>
          <span className="bg-surface-container px-3 py-1 rounded-full text-xs font-label text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-primary">
              bed
            </span>
            {property.type}
          </span>
          <span className="bg-surface-container px-3 py-1 rounded-full text-xs font-label text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-primary">
              location_city
            </span>
            {t("cityView")}
          </span>
        </div>

        <Link
          href={`/properties/${property.slug}`}
          className="block w-full text-center gold-gradient text-on-primary text-xs font-label font-semibold tracking-widest uppercase px-5 py-3 rounded-full hover:opacity-90 transition-opacity duration-200"
        >
          {t("viewDetails")}
        </Link>
      </div>
    </motion.div>
  );
}
