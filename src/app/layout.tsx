import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/contexts/currency-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { cn } from "@/lib/utils";

const playfairDisplayHeading = Playfair_Display({ subsets: ["latin"], variable: "--font-heading" });

const lora = Lora({ subsets: ["latin"], variable: "--font-serif" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rupalytic | Master Your Money",
  description: "Professional expense tracking built with Next.js, Neon, and Better Auth.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-serif",
        lora.variable,
        playfairDisplayHeading.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <CurrencyProvider>
            {children}
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}