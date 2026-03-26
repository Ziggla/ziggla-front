import { useTranslations } from "next-intl";
import { properties } from "@/data/properties";
import PropertyCard from "@/components/properties/PropertyCard";
import SectionTitle from "@/components/ui/SectionTitle";

export default function PropertiesSection() {
  const t = useTranslations("properties");

  return (
    <section
      id="properties"
      className="bg-surface-container-low py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionTitle title={t("title")} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {properties.map((property, index) => (
            <PropertyCard
              key={property.slug}
              property={property}
              index={index}
              className={index === 1 ? "lg:mt-24" : ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
