"use client";

export const BASE_CURRENCY = "EUR";
const CACHE_KEY = "ziggla_display_currency_v1";
const CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12h

export interface DisplayCurrency {
  code: string;
  symbol: string;
  rate: number; // BASE_CURRENCY → code
  fetchedAt: number;
}

const SYMBOLS: Record<string, string> = {
  EUR: "€",
  GBP: "£",
  USD: "$",
  CAD: "$",
  AUD: "$",
  CHF: "CHF",
  JPY: "¥",
  CNY: "¥",
  SEK: "kr",
  NOK: "kr",
  DKK: "kr",
  PLN: "zł",
  CZK: "Kč",
  HUF: "Ft",
};

const SUPPORTED = Object.keys(SYMBOLS);

function readCache(): DisplayCurrency | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DisplayCurrency;
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(value: DisplayCurrency) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(CACHE_KEY, JSON.stringify(value));
}

async function detectCurrencyFromIp(): Promise<string> {
  try {
    const res = await fetch("https://ipapi.co/json/", { cache: "no-store" });
    if (!res.ok) throw new Error("ipapi failed");
    const data = (await res.json()) as { currency?: string };
    const code = data.currency?.toUpperCase();
    if (code && SUPPORTED.includes(code)) return code;
  } catch {
    // ignore
  }
  return BASE_CURRENCY;
}

async function fetchFxRate(target: string): Promise<number> {
  if (target === BASE_CURRENCY) return 1;
  try {
    const res = await fetch(
      `https://api.frankfurter.dev/v1/latest?base=${BASE_CURRENCY}&symbols=${target}`,
      { cache: "no-store" },
    );
    if (!res.ok) throw new Error("fx failed");
    const data = (await res.json()) as { rates?: Record<string, number> };
    const rate = data.rates?.[target];
    if (rate && Number.isFinite(rate)) return rate;
  } catch {
    // ignore
  }
  return 1;
}

export async function resolveDisplayCurrency(): Promise<DisplayCurrency> {
  const cached = readCache();
  if (cached) return cached;
  const code = await detectCurrencyFromIp();
  const rate = await fetchFxRate(code);
  const value: DisplayCurrency = {
    code,
    symbol: SYMBOLS[code] ?? code + " ",
    rate,
    fetchedAt: Date.now(),
  };
  writeCache(value);
  return value;
}

export function formatPrice(
  amountInBase: number,
  display: DisplayCurrency | null,
  opts: { fractionDigits?: number } = {},
): string {
  const fd = opts.fractionDigits ?? (Number.isInteger(amountInBase) ? 0 : 2);
  if (!display) {
    return `€${amountInBase.toLocaleString("en-GB", {
      minimumFractionDigits: fd,
      maximumFractionDigits: fd,
    })}`;
  }
  const converted = amountInBase * display.rate;
  return `${display.symbol}${converted.toLocaleString("en-GB", {
    minimumFractionDigits: fd,
    maximumFractionDigits: fd,
  })}`;
}
