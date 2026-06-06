"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../src/lib/supabase";

type Recipe = {
  id: number;
  meal_name: string;
  ingredients: string[];
  instructions: string[];
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  const [hasProfile, setHasProfile] =
    useState(false);

  const [lastGlucose, setLastGlucose] =
    useState<number | null>(null);

  const [trend, setTrend] = useState("→");

  const [dietName, setDietName] =
    useState("Paleo");

  const [dietDescription, setDietDescription] =
    useState("Személyre szabott paleo étrend");

  const [lastRecipe, setLastRecipe] =
    useState<Recipe | null>(null);

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      setLoading(true);

      await Promise.all([
        loadProfile(),
        loadLastGlucose(),
        loadLastRecipe(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("id", { ascending: false })
      .limit(1);

    if (error) {
      console.error(error);
      return;
    }

    if (!data || data.length === 0) {
      setHasProfile(false);
      return;
    }

    setHasProfile(true);

    const profile = data[0];

    if (profile.diabetes) {
      setDietName("Paleo + Diabétesz");
      setDietDescription(
        "2-es típusú cukorbetegség támogatás"
      );
    } else if (
      profile.insulin_resistance
    ) {
      setDietName("Paleo + IR");
      setDietDescription(
        "Inzulinrezisztencia támogatás"
      );
    } else {
      setDietName("Paleo");
      setDietDescription(
        "Személyre szabott paleo étrend"
      );
    }
  };

  const loadLastGlucose = async () => {
    const { data, error } = await supabase
      .from("glucose_logs")
      .select("fasting")
      .not("fasting", "is", null)
      .order("created_at", {
        ascending: false,
      })
      .limit(2);

    if (error) {
      console.error(error);
      return;
    }

    if (!data || data.length === 0) {
      return;
    }

    setLastGlucose(data[0].fasting);

    if (data.length >= 2) {
      const latest = Number(data[0].fasting);
      const previous = Number(data[1].fasting);

      if (latest > previous) {
        setTrend("↑");
      } else if (latest < previous) {
        setTrend("↓");
      } else {
        setTrend("→");
      }
    }
  };

  const loadLastRecipe = async () => {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .limit(1);

    if (error) {
      console.error(error);
      return;
    }

    if (data && data.length > 0) {
      setLastRecipe(data[0]);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f6ef] px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[2rem] bg-white p-10 shadow-xl text-center">
            <h1 className="text-3xl font-black text-[#111827]">
              PaleoAI betöltése...
            </h1>
          </div>
        </div>
      </main>
    );
  }

  if (!hasProfile) {
    return (
      <main className="min-h-screen bg-[#f8f6ef] px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-[2rem] bg-white p-10 shadow-xl text-center">
            <h1 className="text-4xl font-black text-[#111827]">
              👋 Üdv a PaleoAI-ban
            </h1>

            <p className="mt-4 text-[#6b7280]">
              A Dashboard használatához
              először töltsd ki a profilodat.
            </p>

            <Link
              href="/profile"
              className="mt-8 inline-block rounded-full bg-[#7A9A2D] px-8 py-4 font-bold text-white"
            >
              🚀 Profil kitöltése
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f6ef] px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <p className="font-bold uppercase tracking-[0.3em] text-[#7A9A2D]">
            PaleoAI
          </p>

          <h1 className="mt-3 text-5xl font-black text-[#111827]">
            Dashboard
          </h1>

          <p className="mt-4 text-lg text-[#6b7280]">
            Egészségügyi adatok,
            étrend és AI ajánlások egy helyen.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-8 shadow-xl">
            <h2 className="text-lg font-semibold text-[#111827]">
              📊 Utolsó vércukor
            </h2>

            {lastGlucose === null ? (
              <>
                <p className="mt-4 text-[#6b7280]">
                  Még nincs vércukor adat.
                </p>

                <Link
                  href="/health"
                  className="mt-4 inline-block font-bold text-[#7A9A2D]"
                >
                  ➕ Első mérés rögzítése
                </Link>
              </>
            ) : (
              <>
                <p className="mt-4 text-5xl font-black text-[#111827]">
                  {lastGlucose} mmol/L
                </p>

                <p className="mt-3 font-bold text-[#7A9A2D]">
                  Trend: {trend}
                </p>
              </>
            )}
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-xl">
            <h2 className="text-lg font-semibold text-[#111827]">
              🤖 AI Elemzés
            </h2>

            <p className="mt-4 leading-7 text-[#6b7280]">
              Az AI egészségügyi
              összefoglaló hamarosan itt jelenik meg.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-xl">
            <h2 className="text-lg font-semibold text-[#111827]">
              🥗 Aktív étrend
            </h2>

            <p className="mt-4 text-3xl font-black text-[#111827]">
              {dietName}
            </p>

            <p className="mt-3 text-[#6b7280]">
              {dietDescription}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-8 shadow-xl">
            <h2 className="text-lg font-semibold text-[#111827]">
              🍳 Legutóbbi recept
            </h2>

            {lastRecipe ? (
              <>
                <p className="mt-4 text-xl font-bold text-[#111827]">
                  {lastRecipe.meal_name}
                </p>

                <p className="mt-3 text-[#6b7280]">
                  {lastRecipe.ingredients?.length ?? 0}
                  {" "}hozzávaló
                </p>

                <p className="text-[#6b7280]">
                  {lastRecipe.instructions?.length ?? 0}
                  {" "}lépés
                </p>
              </>
            ) : (
              <>
                <p className="mt-4 text-[#6b7280]">
                  Még nincs mentett recept.
                </p>

                <Link
                  href="/mealplan"
                  className="mt-4 inline-block font-bold text-[#7A9A2D]"
                >
                  🥑 Első étrend készítése
                </Link>
              </>
            )}
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-xl">
            <h2 className="text-lg font-semibold text-[#111827]">
              🛒 Bevásárlólista
            </h2>

            <p className="mt-4 text-[#6b7280]">
              Bevásárlólista integráció
              következik.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-xl">
            <h2 className="text-lg font-semibold text-[#111827]">
              ❤️ Egészség
            </h2>

            <p className="mt-4 text-[#111827]">
              Vércukor napló
            </p>

            <p className="mt-3 text-[#6b7280]">
              AI elemzés és grafikonok
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}