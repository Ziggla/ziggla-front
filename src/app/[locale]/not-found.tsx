import { Link } from "@/i18n/navigation";

export default function NotFound() {

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-5 overflow-hidden">
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-auto text-primary"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L0,320Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="relative text-center max-w-lg">
        <p className="text-8xl font-headline text-primary/20 mb-2 select-none">404</p>
        <div className="w-12 h-0.5 gold-gradient mx-auto mb-8" />

        <Link href="/" className="text-2xl font-headline italic text-primary tracking-tight mb-8 block">
          ZIGGLA
        </Link>

        <h1 className="text-3xl font-headline text-on-surface mb-4">Page not found</h1>
        <p className="text-on-surface-variant text-sm leading-relaxed mb-10">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="gold-gradient px-8 py-3 rounded-lg font-label font-bold text-on-primary uppercase tracking-widest text-sm hover:opacity-90 transition-opacity"
          >
            Back to Home
          </Link>
          <Link
            href="/properties"
            className="px-8 py-3 rounded-lg font-label font-semibold text-on-surface-variant bg-surface-container-high uppercase tracking-widest text-sm hover:bg-surface-bright transition-colors"
          >
            Browse Properties
          </Link>
        </div>
      </div>
    </main>
  );
}
