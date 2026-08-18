"use client";

import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { type CurrencyCode, getStoredCurrency, saveCurrency } from "@/lib/currency";

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("INR");

  useEffect(() => {
    // Load from localStorage on mount
    setCurrencyState(getStoredCurrency());
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    saveCurrency(code);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
