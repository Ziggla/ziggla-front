import { Link } from "@/i18n/navigation";

interface ComingSoonProps {
  backHref: string;
  backLabel: string;
}

export default function ComingSoon({ backHref, backLabel }: ComingSoonProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen px-8 text-center">
      <div className="relative mb-8">
        <span
          className="material-symbols-outlined text-primary/10"
          style={{ fontSize: "160px" }}
        >
          construction
        </span>
        <span
          className="material-symbols-outlined text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ fontSize: "56px", fontVariationSettings: "'FILL' 1" }}
        >
          auto_awesome
        </span>
      </div>

      <h1 className="font-headline text-4xl text-on-surface mb-3">Coming Soon</h1>
      <p className="text-on-surface-variant font-body max-w-sm leading-relaxed mb-10">
        This section is currently in development. Check back soon for updates.
      </p>

      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-xs font-label uppercase tracking-widest text-primary hover:opacity-80 transition-opacity"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        {backLabel}
      </Link>
    </div>
  );
}
