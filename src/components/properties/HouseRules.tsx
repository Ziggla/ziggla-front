import { useTranslations } from "next-intl";

interface HouseRulesProps {
  rules: string[];
  checkIn: string;
  checkOut: string;
  deposit: string;
}

const ruleIconMap: Record<string, string> = {
  "Adults only": "person",
  "No smoking": "smoke_free",
  "No parties or events": "celebration",
  "No pets": "pets",
};

export default function HouseRules({
  rules,
  checkIn,
  checkOut,
  deposit,
}: HouseRulesProps) {
  const t = useTranslations("propertyDetail");

  return (
    <div className="space-y-6">
      {/* Check-in / Check-out / Deposit */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container-high rounded-xl p-4">
          <div className="text-primary text-xs font-label font-semibold tracking-widest uppercase mb-1">
            {t("checkInLabel")}
          </div>
          <div className="text-on-surface font-body text-sm">{checkIn}</div>
        </div>
        <div className="bg-surface-container-high rounded-xl p-4">
          <div className="text-primary text-xs font-label font-semibold tracking-widest uppercase mb-1">
            {t("checkOutLabel")}
          </div>
          <div className="text-on-surface font-body text-sm">{checkOut}</div>
        </div>
        <div className="bg-surface-container-high rounded-xl p-4">
          <div className="text-primary text-xs font-label font-semibold tracking-widest uppercase mb-1">
            {t("depositLabel")}
          </div>
          <div className="text-on-surface font-body text-sm">{deposit}</div>
        </div>
      </div>

      {/* Rules list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rules.map((rule) => (
          <div
            key={rule}
            className="flex items-center gap-3 bg-error/5 rounded-xl px-4 py-3"
          >
            <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-error text-base">
                {ruleIconMap[rule] ?? "block"}
              </span>
            </div>
            <span className="text-on-surface font-body text-sm">{rule}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
