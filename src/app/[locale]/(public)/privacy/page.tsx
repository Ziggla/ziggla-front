import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function PrivacyPage() {
  const t = await getTranslations("privacy");

  const sections = [
    {
      id: "collect",
      navKey: t("navCollect"),
      title: t("collectTitle"),
      text: t("collectText"),
    },
    {
      id: "use",
      navKey: t("navUse"),
      title: t("useTitle"),
      text: t("useText"),
    },
    {
      id: "security",
      navKey: t("navSecurity"),
      title: t("securityTitle"),
      text: t("securityText"),
    },
    {
      id: "rights",
      navKey: t("navRights"),
      title: t("rightsTitle"),
      text: t("rightsText"),
    },
    {
      id: "cookies",
      navKey: t("navCookies"),
      title: t("cookiesTitle"),
      text: t("cookiesText"),
    },
  ];

  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-5xl lg:text-7xl font-headline text-on-surface mb-4">{t("title")}</h1>
          <div className="w-16 h-0.5 gold-gradient mb-4" />
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold">{t("lastUpdated")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sticky TOC Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-28">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <Link
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-all group"
                  >
                    <span className="w-1 h-4 bg-surface-container-highest rounded-full group-hover:bg-primary transition-colors" />
                    {section.navKey}
                  </Link>
                ))}
                <Link
                  href="#contact"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-all group"
                >
                  <span className="w-1 h-4 bg-surface-container-highest rounded-full group-hover:bg-primary transition-colors" />
                  {t("navContact")}
                </Link>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-9 space-y-12">
            {/* Intro */}
            <div className="bg-surface-container-low p-8 rounded-xl">
              <p className="text-on-surface leading-relaxed text-base">{t("intro")}</p>
            </div>

            {/* Sections */}
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-1 h-8 gold-gradient rounded-full" />
                  <h2 className="text-2xl font-headline text-on-surface">{section.title}</h2>
                </div>
                <p className="text-on-surface-variant leading-relaxed pl-5">{section.text}</p>
              </section>
            ))}

            {/* Contact Section */}
            <section id="contact" className="scroll-mt-28">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-1 h-8 gold-gradient rounded-full" />
                <h2 className="text-2xl font-headline text-on-surface">{t("contactTitle")}</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed pl-5 mb-4">{t("contactText")}</p>
              <div className="ml-5 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-base">mail</span>
                  <span className="text-on-surface">{t("contactEmail")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-base">location_on</span>
                  <span className="text-on-surface">{t("contactAddress")}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
