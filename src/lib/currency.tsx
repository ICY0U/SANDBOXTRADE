"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type CurrencyCode = "GBP" | "USD" | "EUR";

export type Currency = {
  code: CurrencyCode;
  symbol: string;
  steamCode: string;
  label: string;
};

export const CURRENCIES: Currency[] = [
  { code: "GBP", symbol: "£", steamCode: "2", label: "£ GBP" },
  { code: "USD", symbol: "$", steamCode: "1", label: "$ USD" },
  { code: "EUR", symbol: "€", steamCode: "3", label: "€ EUR" },
];

// Exchange rates relative to GBP (since Steam gives us GBP prices by default from UK)
type Rates = Record<CurrencyCode, number>;

const DEFAULT_RATES: Rates = {
  GBP: 1,
  USD: 1.27, // fallback approximations
  EUR: 1.17,
};

type CurrencyCtx = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (gbpCents: number) => string;
  rates: Rates;
  loading: boolean;
};

const CurrencyContext = createContext<CurrencyCtx>({
  currency: CURRENCIES[0],
  setCurrency: () => {},
  formatPrice: () => "",
  rates: DEFAULT_RATES,
  loading: false,
});

async function fetchRates(): Promise<Rates> {
  try {
    // Free exchange rate API — no key needed
    const res = await fetch(
      "https://api.exchangerate-api.com/v4/latest/GBP",
      { next: { revalidate: 3600 } } // cache for 1 hour
    );
    if (!res.ok) throw new Error("Rate fetch failed");
    const data = await res.json();
    return {
      GBP: 1,
      USD: data.rates?.USD ?? DEFAULT_RATES.USD,
      EUR: data.rates?.EUR ?? DEFAULT_RATES.EUR,
    };
  } catch {
    // Try backup API
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/GBP");
      if (!res.ok) throw new Error();
      const data = await res.json();
      return {
        GBP: 1,
        USD: data.rates?.USD ?? DEFAULT_RATES.USD,
        EUR: data.rates?.EUR ?? DEFAULT_RATES.EUR,
      };
    } catch {
      return DEFAULT_RATES;
    }
  }
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
  const [rates, setRates] = useState<Rates>(DEFAULT_RATES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRates().then((r) => {
      setRates(r);
      setLoading(false);
    });
  }, []);

  const formatPrice = useCallback(
    (gbpCents: number) => {
      const gbpAmount = gbpCents / 100;
      const converted = gbpAmount * rates[currency.code];
      return `${currency.symbol}${converted.toFixed(2)}`;
    },
    [currency, rates]
  );

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, rates, loading }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
