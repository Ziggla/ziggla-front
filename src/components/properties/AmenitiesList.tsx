"use client";

import { motion } from "framer-motion";

const amenityIconMap: Record<string, string> = {
  "Jacuzzi/Whirlpool": "hot_tub",
  "WiFi 66Mb/s": "wifi",
  WiFi: "wifi",
  "Full Kitchen": "kitchen",
  "Air Conditioning": "ac_unit",
  "City View": "location_city",
  "Washing Machine": "local_laundry_service",
  "Flat Screen TV": "tv",
  "Coffee Machine": "coffee",
  Dishwasher: "dishwasher",
  Microwave: "microwave",
  Fridge: "kitchen",
  Dryer: "dry_cleaning",
  Heating: "thermostat",
  "Private Entrance": "door_front",
  "24h Security": "security",
  "Robes & Slippers": "dry_cleaning",
  Hairdryer: "air",
};

interface AmenitiesListProps {
  amenities: string[];
}

export default function AmenitiesList({ amenities }: AmenitiesListProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {amenities.map((amenity, index) => (
        <motion.div
          key={amenity}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 * index }}
          className="flex items-center gap-3 bg-surface-container-high rounded-xl px-4 py-3"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-base">
              {amenityIconMap[amenity] ?? "check_circle"}
            </span>
          </div>
          <span className="text-on-surface font-body text-xs leading-tight">
            {amenity}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
