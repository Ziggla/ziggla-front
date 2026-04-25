"use client";

import { useEffect, useState } from "react";
import {
  resolveDisplayCurrency,
  formatPrice,
  DisplayCurrency,
} from "@/lib/currency";

interface PriceProps {
  amount: number;
  fractionDigits?: number;
  className?: string;
}

let cachedPromise: Promise<DisplayCurrency> | null = null;

export default function Price({ amount, fractionDigits, className }: PriceProps) {
  const [display, setDisplay] = useState<DisplayCurrency | null>(null);

  useEffect(() => {
    if (!cachedPromise) cachedPromise = resolveDisplayCurrency();
    cachedPromise.then(setDisplay).catch(() => setDisplay(null));
  }, []);

  return (
    <span className={className}>
      {formatPrice(amount, display, { fractionDigits })}
    </span>
  );
}
