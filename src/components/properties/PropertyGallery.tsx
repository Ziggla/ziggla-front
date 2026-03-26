"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { PropertyImage } from "@/data/properties";

interface PropertyGalleryProps {
  propertyName: string;
  images?: PropertyImage[];
}

export default function PropertyGallery({ propertyName, images }: PropertyGalleryProps) {
  const main = images?.[0];
  const top = images?.[1];
  const btmLeft = images?.[2];
  const btmRight = images?.[3];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="grid grid-cols-12 gap-2 rounded-xl overflow-hidden"
      style={{ height: "520px" }}
    >
      {/* Main large image — 7 cols */}
      <div className="col-span-12 lg:col-span-7 relative overflow-hidden">
        {main ? (
          <Image
            src={main.src}
            alt={`${propertyName} — ${main.label}`}
            fill
            loading="eager"
            className="object-cover hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 1024px) 100vw, 58vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
            <span className="material-symbols-outlined text-on-surface/20 text-5xl">apartment</span>
          </div>
        )}
        <div className="absolute bottom-3 left-3 bg-background/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <span className="text-on-surface text-xs font-label">{main?.label ?? "Main View"}</span>
        </div>
      </div>

      {/* Right column — 5 cols, 2 rows */}
      <div className="col-span-12 lg:col-span-5 grid grid-rows-2 gap-2">
        <div className="relative overflow-hidden">
          {top ? (
            <Image
              src={top.src}
              alt={`${propertyName} — ${top.label}`}
              fill
              loading="eager"
              className="object-cover hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
              <span className="material-symbols-outlined text-on-surface/20 text-3xl">living</span>
            </div>
          )}
          <div className="absolute bottom-3 left-3 bg-background/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span className="text-on-surface text-xs font-label">{top?.label ?? "Living Area"}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative overflow-hidden">
            {btmLeft ? (
              <Image
                src={btmLeft.src}
                alt={`${propertyName} — ${btmLeft.label}`}
                fill
                loading="eager"
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="21vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                <span className="material-symbols-outlined text-on-surface/20 text-3xl">hot_tub</span>
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-background/70 backdrop-blur-sm px-2 py-1 rounded-full">
              <span className="text-on-surface text-xs font-label">{btmLeft?.label ?? "Jacuzzi"}</span>
            </div>
          </div>
          <div className="relative overflow-hidden">
            {btmRight ? (
              <Image
                src={btmRight.src}
                alt={`${propertyName} — ${btmRight.label}`}
                fill
                loading="eager"
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="21vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                <span className="material-symbols-outlined text-on-surface/20 text-3xl">bed</span>
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-background/70 backdrop-blur-sm px-2 py-1 rounded-full">
              <span className="text-on-surface text-xs font-label">{btmRight?.label ?? "Bedroom"}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
