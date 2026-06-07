"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../src/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] =
    useState(false);

  const login = async () => {
    try {
      setLoading(true);

      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        alert(error.message);
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Bejelentkezési hiba.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f6ef] px-6 py-20">
      <div className="mx-auto max-w-md">
        <div className="rounded-[2rem] bg-white p-8 shadow-xl">
          <div className="mb-8 text-center">
            <p className="font-bold uppercase tracking-[0.3em] text-[#7A9A2D]">
              PaleoAI
            </p>

            <h1 className="mt-3 text-4xl font-black text-[#111827]">
              Bejelentkezés
            </h1>

            <p className="mt-3 text-[#6b7280]">
              Jelentkezz be a fiókodba.
            </p>
          </div>

          <div className="space-y-5">
            <input
              type="email"
              placeholder="Email cím"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-xl border border-stone-300 px-4 py-3 text-black"
            />

            <input
              type="password"
              placeholder="Jelszó"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full rounded-xl border border-stone-300 px-4 py-3 text-black"
            />

            <button
              onClick={login}
              disabled={loading}
              className="w-full rounded-xl bg-[#7A9A2D] py-4 font-bold text-white"
            >
              {loading
                ? "Bejelentkezés..."
                : "Bejelentkezés"}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-[#6b7280]">
            Nincs még fiókod?{" "}
            <Link
              href="/register"
              className="font-bold text-[#7A9A2D]"
            >
              Regisztráció
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}