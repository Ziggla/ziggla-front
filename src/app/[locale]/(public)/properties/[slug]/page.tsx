import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getPropertyBySlug } from "@/lib/api/properties";
import PropertyGallery from "@/components/properties/PropertyGallery";
import AmenitiesList from "@/components/properties/AmenitiesList";
import HouseRules from "@/components/properties/HouseRules";
import BookingForm from "@/components/properties/BookingForm";
import PropertyMap from "@/components/maps/PropertyMap";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return {};
  return {
    title: `${property.name} | ZIGGLA`,
    description: `${property.type} · ${property.size}m² · ${property.address}. Rating: ${property.rating}/10.`,
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const t = await getTranslations("propertyDetail");
  const bookingT = await getTranslations("booking");

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {/* Gallery */}
        <PropertyGallery propertyName={property.name} images={property.images} />

        {/* Main content grid */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Property details - 8 cols */}
          <div className="lg:col-span-8 space-y-12">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-primary/20 text-primary text-xs font-label font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
                      {t("verifiedLuxury")}
                    </span>
                    <span className="bg-surface-container text-on-surface-variant text-xs font-label px-3 py-1 rounded-full">
                      {property.size} {t("sqm")}
                    </span>
                    <span className="bg-surface-container text-on-surface-variant text-xs font-label px-3 py-1 rounded-full">
                      {property.type}
                    </span>
                  </div>
                  <h1 className="font-headline text-3xl md:text-4xl font-light text-primary">
                    {property.name}
                  </h1>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">
                      star
                    </span>
                    <span className="font-label font-bold text-on-surface text-2xl">
                      {property.rating}
                    </span>
                    <span className="text-on-surface-variant text-sm">
                      / 10
                    </span>
                  </div>
                  <div className="text-on-surface-variant text-xs mt-1">
                    {property.reviewCount} {t("reviews")}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-on-surface-variant text-sm">
                <span className="material-symbols-outlined text-base">
                  location_on
                </span>
                <span className="font-body">{property.address}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-headline text-2xl font-light text-on-surface mb-4">
                {t("theEssence")}
              </h2>
              <div className="h-px w-16 bg-linear-to-r from-primary/60 to-transparent mb-4" />
              <p className="text-on-surface-variant font-body text-base leading-relaxed">
                Welcome to {property.name} — a stunning {property.type.toLowerCase()} set in the
                heart of Putney, London. Spanning {property.size}m², this
                meticulously curated space combines bold contemporary design
                with premium amenities for an unforgettable stay. The
                signature jacuzzi tub, fully equipped kitchen, and panoramic
                city views make this one of London&apos;s most coveted short-stay
                destinations.
              </p>
            </div>

            {/* Scores */}
            <div>
              <h2 className="font-headline text-2xl font-light text-on-surface mb-6">
                {t("reviews")}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                {Object.entries(property.scores).map(([key, value]) => {
                  const labelMap: Record<string, string> = {
                    staff: t("staffScore"),
                    amenities: t("amenitiesScore"),
                    cleanliness: t("cleanlinessScore"),
                    comfort: t("comfortScore"),
                    value: t("valueScore"),
                    location: t("locationScore"),
                    wifi: t("wifiScore"),
                  };
                  return (
                    <div key={key} className="bg-surface-container-high rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-on-surface-variant text-xs font-label uppercase tracking-wide">
                          {labelMap[key] ?? key}
                        </span>
                        <span className="text-primary font-label font-bold text-lg">
                          {value}
                        </span>
                      </div>
                      <div className="h-1 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(value / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Guest reviews */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.reviews.map((review, index) => (
                  <div
                    key={index}
                    className="bg-surface-container-high rounded-xl p-5"
                  >
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span
                          key={s}
                          className="material-symbols-outlined text-primary text-sm"
                        >
                          star
                        </span>
                      ))}
                    </div>
                    <p className="text-on-surface font-body text-sm leading-relaxed mb-3 italic">
                      &ldquo;{review.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary text-xs font-label font-semibold">
                          {review.author[0]}
                        </span>
                      </div>
                      <div>
                        <div className="text-on-surface font-label font-medium text-xs">
                          {review.author}
                        </div>
                        <div className="text-on-surface-variant text-xs">
                          {review.country}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="font-headline text-2xl font-light text-on-surface mb-6">
                {t("highEndAmenities")}
              </h2>
              <AmenitiesList amenities={property.amenities} />
            </div>

            {/* House Rules */}
            <div>
              <h2 className="font-headline text-2xl font-light text-on-surface mb-6">
                {bookingT("houseRules")}
              </h2>
              <HouseRules
                rules={property.rules}
                checkIn={property.checkIn}
                checkOut={property.checkOut}
                deposit={property.deposit}
              />
            </div>

            {/* Location */}
            <div>
              <h2 className="font-headline text-2xl font-light text-on-surface mb-4">
                {t("location")}
              </h2>
              <p className="text-on-surface-variant font-body text-sm mb-4">
                {t("fromTube")}
              </p>
              <PropertyMap
                latitude={property.latitude}
                longitude={property.longitude}
                placeId={property.placeId}
                address={property.address}
              />
              <p className="text-on-surface-variant text-sm mt-3">
                {property.address}
              </p>
            </div>
          </div>

          {/* Right: Booking form - 4 cols */}
          <div className="lg:col-span-4">
            <BookingForm property={property} />
          </div>
        </div>
      </div>
    </main>
  );
}
