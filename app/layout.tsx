import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "PaleoAI",
  description: "AI alapú paleo étrend és egészség asszisztens",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <body className="bg-[#f8f6ef] text-[#111827]">
        <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f8f6ef]/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="text-2xl font-black text-[#7A9A2D]"
            >
              PaleoAI
            </Link>

            <nav className="flex items-center gap-4 text-sm font-semibold text-black md:gap-8">
              <Link
                href="/"
                className="transition-colors hover:text-[#7A9A2D]"
              >
                🏠 Kezdőlap
              </Link>

              <Link
                href="/mealplan"
                className="transition-colors hover:text-[#7A9A2D]"
              >
                🥑 Étrend készítés
              </Link>

              <Link
                href="/health"
                className="transition-colors hover:text-[#7A9A2D]"
              >
                ❤️ Egészség
              </Link>

              <Link
                href="/dashboard"
                className="transition-colors hover:text-[#7A9A2D]"
              >
                📊 Dashboard
              </Link>

              <Link
                href="/profile"
                className="transition-colors hover:text-[#7A9A2D]"
              >
                👤 Profil
              </Link>
            </nav>

            <Link
              href="/profile"
              className="hidden rounded-full bg-[#7A9A2D] px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-[#6d8b28] md:block"
            >
              🚀 Kezdés
            </Link>
          </div>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}