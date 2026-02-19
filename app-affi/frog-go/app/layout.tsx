import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";
import { LanguageProvider } from "@/lib/i18n";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Frog AI - Analyse Graphique IA Avancée",
  description: "Analyse graphique de trading professionnelle propulsée par Frog AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} antialiased bg-frog-darker text-white`}
      >
        <LanguageProvider>
          <Analytics />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
