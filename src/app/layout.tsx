import type { Metadata } from "next";
import { CurrencyProvider } from "@/lib/currency";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "S&Box Market — Buy & Sell S&Box Skins",
  description: "The marketplace for S&Box skins and items. Browse prices, compare deals, and trade securely.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <CurrencyProvider>{children}</CurrencyProvider>
      </body>
    </html>
  );
}
