import { getTranslations } from "next-intl/server";

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
      lines: [t("emailConcierge"), t("emailSupport")],
    },
    {
      icon: "phone",
      title: t("phoneTitle"),
      lines: [t("phone1"), t("phone2")],
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
              <form className="space-y-5" action="#">
                <div className="space-y-2">
                  <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest px-1">
                    {t("fullName")}
                  </label>
                  <input
                    className="w-full bg-surface-container-high border-none rounded-lg p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary/40 outline-none transition-all"
                    placeholder="Alex Mercer"
                    type="text"
                    name="fullName"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest px-1">
                    {t("email")}
                  </label>
                  <input
                    className="w-full bg-surface-container-high border-none rounded-lg p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary/40 outline-none transition-all"
                    placeholder="name@example.com"
                    type="email"
                    name="email"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest px-1">
                    {t("subject")}
                  </label>
                  <select
                    className="w-full bg-surface-container-high border-none rounded-lg p-4 text-on-surface focus:ring-1 focus:ring-primary/40 outline-none transition-all appearance-none"
                    name="subject"
                  >
                    <option value="">— Select —</option>
                    {subjects.map((subject, idx) => (
                      <option key={idx} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest px-1">
                    {t("message")}
                  </label>
                  <textarea
                    className="w-full bg-surface-container-high border-none rounded-lg p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary/40 outline-none transition-all resize-none"
                    placeholder={t("messagePlaceholder")}
                    rows={5}
                    name="message"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full gold-gradient py-4 rounded-lg font-label font-bold text-on-primary uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98]"
                >
                  {t("sendBtn")}
                </button>
              </form>
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

      {/* Map Placeholder */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mt-16">
        <div
          className="w-full h-64 bg-surface-container-low rounded-xl flex items-center justify-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary" />
          </div>
          <div className="text-center z-10">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                location_on
              </span>
            </div>
            <p className="text-on-surface font-bold">800 Fulham Road</p>
            <p className="text-on-surface-variant text-sm">Putney, London SW6 5SL</p>
          </div>
        </div>
      </section>
    </main>
  );
}
