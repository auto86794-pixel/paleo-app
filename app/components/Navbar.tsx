"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f8f6ef]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-2xl font-black text-[#7A9A2D]">
          PaleoAI
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-[#111827] md:flex">
          <Link href="/" className="transition hover:text-[#7A9A2D]">
            🏠 Kezdőlap
          </Link>
          <Link href="/mealplan" className="transition hover:text-[#7A9A2D]">
            🥑 Étrend készítés
          </Link>
          <Link href="/health" className="transition hover:text-[#7A9A2D]">
            ❤️ Egészség
          </Link>
          <Link href="/dashboard" className="transition hover:text-[#7A9A2D]">
            📊 Dashboard
          </Link>
          <Link href="/profile" className="transition hover:text-[#7A9A2D]">
            👤 Profil
          </Link>
        </nav>

        <Link
          href="/profile"
          className="hidden rounded-full bg-[#7A9A2D] px-5 py-2 text-sm font-bold text-white shadow-lg transition hover:bg-[#6d8b28] md:block"
        >
          🚀 Kezdés
        </Link>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Menü megnyitása"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-3xl font-black text-[#111827] shadow-md md:hidden"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[999] md:hidden">
          <button
            type="button"
            aria-label="Menü bezárása"
            onClick={closeMenu}
            className="absolute inset-0 h-full w-full bg-black/60"
          />

          <aside className="absolute right-0 top-0 h-dvh w-[82vw] max-w-[340px] overflow-y-auto border-l border-stone-200 bg-[#f8f6ef] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                onClick={closeMenu}
                className="text-3xl font-black text-[#7A9A2D]"
              >
                PaleoAI
              </Link>

              <button
                type="button"
                onClick={closeMenu}
                aria-label="Menü bezárása"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-3xl font-black text-[#111827] shadow-md"
              >
                ×
              </button>
            </div>

            <nav className="mt-10 flex flex-col gap-4 text-[#111827]">
              <Link
                href="/"
                onClick={closeMenu}
                className="rounded-2xl bg-white px-5 py-4 text-lg font-bold shadow-sm"
              >
                🏠 Kezdőlap
              </Link>

              <Link
                href="/mealplan"
                onClick={closeMenu}
                className="rounded-2xl bg-white px-5 py-4 text-lg font-bold shadow-sm"
              >
                🥑 Étrend készítés
              </Link>

              <Link
                href="/health"
                onClick={closeMenu}
                className="rounded-2xl bg-white px-5 py-4 text-lg font-bold shadow-sm"
              >
                ❤️ Egészség
              </Link>

              <Link
                href="/dashboard"
                onClick={closeMenu}
                className="rounded-2xl bg-white px-5 py-4 text-lg font-bold shadow-sm"
              >
                📊 Dashboard
              </Link>

              <Link
                href="/profile"
                onClick={closeMenu}
                className="rounded-2xl bg-white px-5 py-4 text-lg font-bold shadow-sm"
              >
                👤 Profil
              </Link>
            </nav>

            <Link
              href="/profile"
              onClick={closeMenu}
              className="mt-8 block rounded-full bg-[#7A9A2D] px-6 py-4 text-center text-lg font-black text-white shadow-lg"
            >
              🥑 Étrend készítése
            </Link>
          </aside>
        </div>
      )}
    </header>
  );
}