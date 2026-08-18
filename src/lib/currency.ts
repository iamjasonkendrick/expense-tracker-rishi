export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP";

export const CURRENCY_CONFIG = {
  INR: { symbol: "₹", name: "Indian Rupee" },
  USD: { symbol: "$", name: "US Dollar" },
  EUR: { symbol: "€", name: "Euro" },
  GBP: { symbol: "£", name: "British Pound" },
};

// Format any number with the selected currency
export function formatCurrency(amount: number, currency: CurrencyCode): string {
  const config = CURRENCY_CONFIG[currency];
  return `${config.symbol}${amount.toFixed(2)}`;
}

// Get the saved currency from localStorage
export function getStoredCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "INR";
  const stored = localStorage.getItem("rupalytic_currency");
  return (stored as CurrencyCode) || "INR";
}

// Save currency to localStorage
export function saveCurrency(currency: CurrencyCode): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("rupalytic_currency", currency);
}
