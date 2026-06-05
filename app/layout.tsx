import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PaleoAI",
  description: "AI alapú paleo étrendtervező",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="hu"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-[#f8f6ef] text-[#111827]">
        <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f8f6ef]/95 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
            <Link
              href="/"
              className="text-xl font-black text-[#7A9A2D] md:text-2xl"
            >
              PaleoAI
            </Link>

            <nav className="flex items-center gap-4 text-sm font-semibold text-black md:gap-8 md:text-base">
              <Link
                href="/profile"
                className="transition-colors hover:text-[#7A9A2D]"
              >
                Profil
              </Link>

              <Link
                href="/mealplan"
                className="transition-colors hover:text-[#7A9A2D]"
              >
                Étrend
              </Link>

              <Link
                href="/dashboard"
                className="transition-colors hover:text-[#7A9A2D]"
              >
                Dashboard
              </Link>
            </nav>

            <Link
              href="/profile"
              className="hidden rounded-full bg-[#7A9A2D] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#7A9A2D]/20 transition hover:bg-[#688626] md:block"
            >
              Ingyenes kezdés
            </Link>
          </div>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}