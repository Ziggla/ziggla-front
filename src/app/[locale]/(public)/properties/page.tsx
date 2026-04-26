import { getTranslations } from "next-intl/server";
import { getProperties } from "@/lib/api/properties";
import PropertyCard from "@/components/properties/PropertyCard";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("properties");
  return {
    title: `${t("title")} — ZIGGLA`,
    description:
      "Discover our two unique luxury apartments in the heart of Putney, London.",
  };
}

export default async function PropertiesPage() {
  const t = await getTranslations("properties");
  const properties = await getProperties().catch(() => []);

  return (
    <main className="min-h-screen bg-background pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-primary text-xs font-label font-semibold tracking-[0.3em] uppercase mb-4 opacity-80">
            Putney, London
          </span>
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-light text-on-surface mb-4">
            {t("title")}
          </h1>
          <div className="mx-auto h-px w-24 bg-linear-to-r from-transparent via-primary/40 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {properties.map((property, index) => (
            <PropertyCard
              key={property.slug}
              property={property}
              index={index}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
