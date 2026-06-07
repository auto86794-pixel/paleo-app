"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";

export default function Navbar() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUserEmail(session?.user?.email ?? null);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserEmail(session?.user?.email ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setUserEmail(null);
    setOpen(false);

    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-[#f8f6ef]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="text-2xl font-black text-[#7A9A2D]"
        >
          PaleoAI
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-[#111827] md:flex">
          <Link href="/">🏠 Kezdőlap</Link>

          <Link href="/mealplan">
            🥑 Étrend készítés
          </Link>

          <Link href="/health">
            ❤️ Egészség
          </Link>

          <Link href="/dashboard">
            📊 Dashboard
          </Link>

          <Link href="/profile">
            👤 Profil
          </Link>
        </nav>

        {userEmail ? (
          <div className="hidden items-center gap-3 md:flex">
            <span className="max-w-[220px] truncate text-sm text-stone-500">
              {userEmail}
            </span>

            <button
              onClick={handleLogout}
              className="rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
            >
              🚪 Kijelentkezés
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="hidden rounded-full bg-[#7A9A2D] px-5 py-2 text-sm font-bold text-white md:block"
          >
            🚀 Bejelentkezés
          </Link>
        )}

        <button
          onClick={() => setOpen(true)}
          className="text-3xl font-black text-[#111827] md:hidden"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 top-0 h-full w-80 bg-[#f8f6ef] p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-[#7A9A2D]">
                PaleoAI
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="text-3xl font-black text-[#111827]"
              >
                ×
              </button>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <Link
                href="/"
                onClick={() => setOpen(false)}
              >
                🏠 Kezdőlap
              </Link>

              <Link
                href="/mealplan"
                onClick={() => setOpen(false)}
              >
                🥑 Étrend készítés
              </Link>

              <Link
                href="/health"
                onClick={() => setOpen(false)}
              >
                ❤️ Egészség
              </Link>

              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
              >
                📊 Dashboard
              </Link>

              <Link
                href="/profile"
                onClick={() => setOpen(false)}
              >
                👤 Profil
              </Link>
            </div>

            {userEmail ? (
              <>
                <div className="mt-8 rounded-xl bg-white p-4">
                  <p className="text-sm text-stone-500">
                    Bejelentkezve:
                  </p>

                  <p className="mt-1 break-all font-semibold">
                    {userEmail}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="mt-4 w-full rounded-full border border-red-200 py-3 font-bold text-red-600"
                >
                  🚪 Kijelentkezés
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-8 block rounded-full bg-[#7A9A2D] py-3 text-center font-bold text-white"
              >
                🚀 Bejelentkezés
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}