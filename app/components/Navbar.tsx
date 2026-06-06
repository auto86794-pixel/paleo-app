"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f8f6ef]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-2xl font-black text-[#7A9A2D]"
        >
          PaleoAI
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <Link href="/">🏠 Kezdőlap</Link>
          <Link href="/mealplan">🥑 Étrend készítés</Link>
          <Link href="/health">❤️ Egészség</Link>
          <Link href="/dashboard">📊 Dashboard</Link>
          <Link href="/profile">👤 Profil</Link>
        </nav>

        <Link
          href="/profile"
          className="hidden md:block rounded-full bg-[#7A9A2D] px-5 py-2 text-sm font-semibold text-white"
        >
          🚀 Kezdés
        </Link>

        {/* Mobil hamburger */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden text-3xl"
        >
          ☰
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />

          <div className="fixed right-0 top-0 h-full w-72 bg-white shadow-2xl p-6">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-xl">
                PaleoAI
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="mt-8 flex flex-col gap-5 font-semibold">
              <Link href="/" onClick={() => setOpen(false)}>
                🏠 Kezdőlap
              </Link>

              <Link href="/mealplan" onClick={() => setOpen(false)}>
                🥑 Étrend készítés
              </Link>

              <Link href="/health" onClick={() => setOpen(false)}>
                ❤️ Egészség
              </Link>

              <Link href="/dashboard" onClick={() => setOpen(false)}>
                📊 Dashboard
              </Link>

              <Link href="/profile" onClick={() => setOpen(false)}>
                👤 Profil
              </Link>

              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="mt-4 rounded-full bg-[#7A9A2D] px-5 py-3 text-center text-white"
              >
                🚀 Kezdés
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}