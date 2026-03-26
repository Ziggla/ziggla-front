import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function TermsPage() {
  const t = await getTranslations("terms");

  const sections = [
    { id: "intro", nav: t("nav1"), title: t("s1Title") },
    { id: "booking", nav: t("nav2"), title: t("s2Title") },
    { id: "responsibilities", nav: t("nav3"), title: t("s3Title") },
    { id: "cancellation", nav: t("nav4"), title: t("s4Title") },
    { id: "liability", nav: t("nav5"), title: t("s5Title") },
    { id: "governing", nav: t("nav6"), title: t("s6Title") },
  ];

  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-5xl lg:text-7xl font-headline text-on-surface mb-4">
            {t("title")}
          </h1>
          <div className="w-16 h-0.5 gold-gradient mb-4" />
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold">
            {t("lastUpdated")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sticky TOC Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-28">
              <p className="text-xs uppercase tracking-[0.15em] text-on-surface-variant font-label mb-4 px-4">
                {t("onThisPage")}
              </p>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-all group"
                  >
                    <span className="w-1 h-4 bg-surface-container-highest rounded-full group-hover:bg-primary transition-colors" />
                    {section.nav}
                  </a>
                ))}
                <Link
                  href="/contact"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-all group"
                >
                  <span className="w-1 h-4 bg-surface-container-highest rounded-full group-hover:bg-primary transition-colors" />
                  {t("contactLegal")}
                </Link>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-9 space-y-12">
            {/* Section 1 – Introduction */}
            <section id="intro" className="scroll-mt-28 bg-surface-container-low p-8 rounded-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-1 h-8 gold-gradient rounded-full" />
                <h2 className="text-2xl font-headline text-on-surface">{t("s1Title")}</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed mb-4">{t("s1p1")}</p>
              <p className="text-on-surface-variant leading-relaxed">{t("s1p2")}</p>
            </section>

            {/* Section 2 – Booking & Payments */}
            <section id="booking" className="scroll-mt-28 bg-surface-container-low p-8 rounded-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-1 h-8 gold-gradient rounded-full" />
                <h2 className="text-2xl font-headline text-on-surface">{t("s2Title")}</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed mb-4">{t("s2intro")}</p>
              <ul className="space-y-3 pl-2">
                {[t("s2b1"), t("s2b2"), t("s2b3")].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-on-surface-variant">
                    <span className="text-primary mt-0.5 select-none">●</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 3 – Guest Responsibilities */}
            <section id="responsibilities" className="scroll-mt-28 bg-surface-container-low p-8 rounded-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-1 h-8 gold-gradient rounded-full" />
                <h2 className="text-2xl font-headline text-on-surface">{t("s3Title")}</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed mb-4">{t("s3intro")}</p>
              <ul className="space-y-3 pl-2">
                {[t("s3b1"), t("s3b2"), t("s3b3")].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-on-surface-variant">
                    <span className="text-primary mt-0.5 select-none">●</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 4 – Cancellation Policy */}
            <section id="cancellation" className="scroll-mt-28 bg-surface-container-low p-8 rounded-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-1 h-8 gold-gradient rounded-full" />
                <h2 className="text-2xl font-headline text-on-surface">{t("s4Title")}</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed mb-6">{t("s4intro")}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface-container p-6 rounded-lg border-l-2 border-primary/50">
                  <h3 className="font-label font-semibold text-on-surface mb-2">
                    {t("s4standardTitle")}
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {t("s4standardText")}
                  </p>
                </div>
                <div className="bg-surface-container p-6 rounded-lg border-l-2 border-primary/50">
                  <h3 className="font-label font-semibold text-on-surface mb-2">
                    {t("s4signatureTitle")}
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {t("s4signatureText")}
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 – Limitation of Liability */}
            <section id="liability" className="scroll-mt-28 bg-surface-container-low p-8 rounded-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-1 h-8 gold-gradient rounded-full" />
                <h2 className="text-2xl font-headline text-on-surface">{t("s5Title")}</h2>
              </div>
              <blockquote className="border-l-4 border-primary pl-5 mb-6 italic text-on-surface-variant">
                {t("s5quote")}
              </blockquote>
              <p className="text-on-surface-variant leading-relaxed">{t("s5p")}</p>
            </section>

            {/* Section 6 – Governing Law */}
            <section id="governing" className="scroll-mt-28 bg-surface-container-low p-8 rounded-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-1 h-8 gold-gradient rounded-full" />
                <h2 className="text-2xl font-headline text-on-surface">{t("s6Title")}</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">{t("s6p")}</p>
            </section>

            {/* Contact Legal */}
            <div className="flex items-center gap-3 text-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-base">gavel</span>
              <span>{t("contactLegal")}</span>
              <Link href="/contact" className="text-primary hover:underline font-medium">
                {t("contactLegalLink")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
