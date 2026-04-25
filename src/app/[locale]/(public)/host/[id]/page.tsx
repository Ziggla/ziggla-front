import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getUser } from "@/lib/api/users";
import { getProperties } from "@/lib/api/properties";

const SCORE_LABELS: Record<string, string> = {
  staff: "Staff",
  amenities: "Amenities",
  cleanliness: "Cleanliness",
  comfort: "Comfort",
  location: "Location",
  value: "Value",
  wifi: "WiFi",
};

const HOST_REVIEWS = [
  {
    initial: "S",
    name: "Sarah Jenkins",
    country: "🇺🇸 United States",
    text: "An exceptional host. The apartment in Putney was breathtaking and the concierge service arranged made our stay truly effortless.",
  },
  {
    initial: "L",
    name: "Laurent Dubois",
    country: "🇫🇷 France",
    text: "Impeccable cleanliness and attention to detail. Communication was seamless and professional. Highly recommended!",
  },
  {
    initial: "E",
    name: "Elena Rossi",
    country: "🇮🇹 Italy",
    text: "The location was perfect for exploring London. A great list of local hidden gems that we wouldn't have found otherwise.",
  },
  {
    initial: "D",
    name: "David Chen",
    country: "🇸🇬 Singapore",
    text: "Luxury at its finest. From the bedding to the WiFi speed, everything was top-tier. Truly a Superhost experience.",
  },
];

export default async function HostProfilePage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const [host, allProperties] = await Promise.all([getUser(id), getProperties()]);

  if (!host || host.role !== "host") notFound();

  const properties = allProperties.filter((p) => p.hostId === id);

  // Aggregate scores across all host properties
  const scoreMap: Record<string, number[]> = {};
  for (const p of properties) {
    for (const [key, val] of Object.entries(p.scores)) {
      if (val == null) continue;
      if (!scoreMap[key]) scoreMap[key] = [];
      scoreMap[key].push(val as number);
    }
  }
  const scores = Object.entries(scoreMap).map(([key, vals]) => ({
    key,
    label: SCORE_LABELS[key] ?? key,
    value: parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)),
  }));

  return (
    <main
      className="pt-24 pb-32"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(230,195,100,0.04) 0%, transparent 60%), #071325",
      }}
    >
      {/* ── Hero ── */}
      <section className="relative z-10 max-w-3xl mx-auto text-center px-6 mb-16 lg:mb-20">
        {/* Avatar */}
        <div className="relative inline-block mb-6">
          <div
            className="w-24 h-24 lg:w-28 lg:h-28 rounded-lg flex items-center justify-center text-2xl lg:text-3xl font-headline font-bold text-on-primary mx-auto"
            style={{
              background: "linear-gradient(135deg, #e6c364, #c9a84c)",
              border: "2px solid #e6c364",
            }}
          >
            {host.initials}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-secondary text-on-secondary px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase">
            PRO
          </div>
        </div>

        <h1 className="font-headline text-4xl lg:text-5xl italic font-light mb-2 tracking-tight text-on-surface">
          {host.firstName} {host.lastName}
        </h1>
        <p className="text-secondary font-label tracking-widest uppercase text-xs mb-2">
          Verified Ziggla Host · Putney, London
        </p>
        {host.memberSince && (
          <p className="text-on-surface-variant text-xs mb-4">Hosting since {host.memberSince}</p>
        )}

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { icon: "verified_user", label: "Identity Verified" },
            { icon: "workspace_premium", label: "Superhost", filled: true },
            { icon: "schedule", label: "Responds within 1 hour" },
          ].map(({ icon, label, filled }) => (
            <div
              key={label}
              className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-xl"
            >
              <span
                className="material-symbols-outlined text-primary text-sm"
                style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {icon}
              </span>
              <span className="text-xs font-medium">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 mb-20 lg:mb-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 rounded-xl overflow-hidden bg-outline-variant/10">
          {[
            { value: String(host.guestsWelcomed ?? 94), label: "Guests welcomed" },
            { value: null, label: `${host.averageRating ?? 8.8} / 10 Average` },
            { value: String(host.totalStaysHosted ?? 47), label: "Total stays hosted" },
            { value: `${host.responseRate ?? 98}%`, label: "Response rate" },
          ].map(({ value, label }, i) => (
            <div
              key={label}
              className={`bg-surface-container-low p-6 lg:p-8 text-center
                ${i % 2 === 0 ? "border-r border-outline-variant/10" : ""}
                ${i < 2 ? "border-b lg:border-b-0 border-outline-variant/10" : ""}
                ${i < 3 ? "lg:border-r lg:border-outline-variant/10" : ""}
              `}
            >
              {value ? (
                <p className="text-primary font-headline text-2xl lg:text-3xl mb-1">{value}</p>
              ) : (
                <div className="flex justify-center gap-0.5 mb-1">
                  {[1, 2, 3, 4].map((s) => (
                    <span
                      key={s}
                      className="material-symbols-outlined text-primary text-base lg:text-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                  <span
                    className="material-symbols-outlined text-primary text-base lg:text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star_half
                  </span>
                </div>
              )}
              <p className="text-on-surface-variant text-[10px] uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Two-column: About + Scores ── */}
      <section className="relative z-10 mb-24 lg:mb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-16 items-start">

          {/* Left */}
          <div className="space-y-16 lg:mt-16">
            {/* About */}
            <div>
              <h2 className="font-headline text-2xl lg:text-3xl italic mb-6">
                About {host.firstName}
              </h2>
              <p className="text-on-surface/80 leading-relaxed text-base lg:text-lg mb-8">
                {host.bio}
              </p>
              {host.languages && (
                <div className="flex flex-wrap items-center gap-3 mb-10">
                  <span className="text-xs uppercase tracking-widest text-on-surface-variant">
                    Languages:
                  </span>
                  {host.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-3 py-1 bg-surface-container-high rounded text-xs font-medium"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              )}
              <Link
                href={`mailto:${host.email}`}
                className="gold-gradient text-on-primary font-bold px-6 lg:px-8 py-3 lg:py-4 rounded-lg inline-flex items-center gap-3 hover:opacity-90 transition-all"
                style={{ boxShadow: "0 20px 40px rgba(230,195,100,0.1)" }}
              >
                <span className="material-symbols-outlined">mail</span>
                Message {host.firstName}
              </Link>
            </div>

            {/* Properties */}
            {properties.length > 0 && (
              <div>
                <h2 className="font-headline text-xl lg:text-2xl italic mb-8">
                  Properties by {host.firstName}
                </h2>
                <div className="space-y-6">
                  {properties.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/properties/${p.slug}`}
                      className="group bg-surface-container rounded-xl overflow-hidden hover:bg-surface-container-high transition-colors flex flex-col sm:flex-row"
                    >
                      <div className="overflow-hidden shrink-0 h-48 sm:h-auto sm:w-48 lg:w-64">
                        <Image
                          src={p.coverImage}
                          alt={p.name}
                          width={256}
                          height={192}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div className="p-6 lg:p-8 flex flex-col justify-between flex-1">
                        <div>
                          <h3 className="font-headline text-lg lg:text-xl mb-1">{p.name}</h3>
                          <p className="text-on-surface-variant text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-xs">location_on</span>
                            {p.neighborhood}, London
                          </p>
                        </div>
                        <div className="flex justify-between items-end mt-4">
                          <p className="text-primary font-bold text-lg">
                            £{p.pricePerNight}
                            <span className="text-on-surface-variant text-xs font-normal"> / night</span>
                          </p>
                          <span className="material-symbols-outlined text-primary">
                            arrow_forward_ios
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — Scores */}
          <div className="lg:sticky lg:top-32 lg:mt-16">
            <div
              className="bg-surface-container-high rounded-xl p-6 lg:p-8"
              style={{
                boxShadow:
                  "0 0 0 1px rgba(230,195,100,0.05), 0 40px 80px rgba(0,0,0,0.3)",
              }}
            >
              <h3 className="font-headline text-xl italic mb-8 pb-4 border-b border-outline-variant/10">
                Guest Scores
              </h3>
              <div className="space-y-6 mb-10">
                {scores.map(({ key, label, value }) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between text-xs font-medium uppercase tracking-wider">
                      <span className="text-on-surface">{label}</span>
                      <span className="text-primary">{value}</span>
                    </div>
                    <div className="h-1.5 bg-background rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(value / 10) * 100}%`,
                          background: key === "wifi" ? "#ffd65b" : "#e6c364",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-surface p-6 rounded-lg text-center">
                <p className="text-on-surface-variant text-[10px] uppercase tracking-[0.2em] mb-1">
                  Overall Rating
                </p>
                <p className="font-headline text-5xl text-primary">
                  {host.averageRating ?? 8.8}{" "}
                  <span className="text-xl text-on-surface-variant font-body">/ 10</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="relative z-10 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h2 className="font-headline text-3xl lg:text-4xl italic mb-12 text-center mt-16">
            What guests say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {HOST_REVIEWS.map(({ initial, name, country, text }) => (
              <div
                key={name}
                className="bg-surface-container p-6 lg:p-8 rounded-xl"
                style={{ borderLeft: "2px solid rgba(230,195,100,0.2)" }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-primary shrink-0">
                      {initial}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{name}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">
                        {country}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 shrink-0">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className="material-symbols-outlined text-primary text-xs"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>
                <p className="italic font-headline text-base lg:text-lg leading-relaxed text-on-surface/90">
                  &ldquo;{text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
