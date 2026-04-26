import { getTranslations } from "next-intl/server";
import PropertyMap from "@/components/maps/PropertyMap";
import ContactForm from "@/components/contact/ContactForm";

export default async function ContactPage() {
  const t = await getTranslations("contact");

  const infoCards = [
    {
      icon: "location_on",
      title: t("addressTitle"),
      lines: [t("address")],
    },
    {
      icon: "mail",
      title: t("emailTitle"),
      lines: [t("emailConcierge"), t("emailSupport")].filter(Boolean),
    },
    {
      icon: "phone",
      title: t("phoneTitle"),
      lines: [t("phone1"), t("phone2")].filter(Boolean),
    },
    {
      icon: "schedule",
      title: t("hoursTitle"),
      lines: [t("hours1"), t("hours2")],
    },
  ];

  const subjects = [
    t("subjectViewing"),
    t("subjectLeasing"),
    t("subjectMaintenance"),
    t("subjectPress"),
    t("subjectOther"),
  ];

  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-16">
        <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-3">
          {t("subtitle")}
        </p>
        <h1 className="text-5xl lg:text-7xl font-headline text-on-surface mb-6">{t("title")}</h1>
        <div className="w-16 h-0.5 gold-gradient mb-6" />
        <p className="text-on-surface-variant text-lg leading-relaxed max-w-xl">{t("intro")}</p>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Contact Form (5/12) */}
          <div className="lg:col-span-5">
            <div className="bg-surface-container-low p-8 rounded-xl">
              <h2 className="text-xl font-headline text-on-surface mb-6">{t("sendMessage")}</h2>
              <ContactForm subjects={subjects} />
            </div>
          </div>

          {/* Right: Info Cards + CTA (7/12) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Info Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              {infoCards.map((card, idx) => (
                <div key={idx} className="bg-surface-container-low p-6 rounded-xl">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-primary text-base">{card.icon}</span>
                  </div>
                  <p className="text-xs uppercase tracking-widest text-primary font-bold mb-2">{card.title}</p>
                  {card.lines.map((line, lineIdx) => (
                    <p key={lineIdx} className="text-sm text-on-surface-variant leading-relaxed">{line}</p>
                  ))}
                </div>
              ))}
            </div>

            {/* CTA Card */}
            <div className="bg-surface-container p-8 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: "160px" }}>
                  calendar_month
                </span>
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold mb-2">{t("tourTitle")}</p>
              <h3 className="text-2xl font-headline text-on-surface mb-3">{t("tourTitle")}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">{t("tourDesc")}</p>
              <button className="gold-gradient text-on-primary px-8 py-3 rounded-lg font-label font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
                {t("scheduleBtn")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mt-16">
        <PropertyMap
          latitude={51.4778}
          longitude={-0.2057}
          address="800 Fulham Road, Putney, London SW6 5SL"
          className="h-96"
        />
        <div className="mt-4">
          <p className="text-on-surface font-bold">800 Fulham Road</p>
          <p className="text-on-surface-variant text-sm">Putney, London SW6 5SL</p>
        </div>
      </section>
    </main>
  );
}
