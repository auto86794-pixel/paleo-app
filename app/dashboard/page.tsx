"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../src/lib/supabase";

type Recipe = {
  id: number;
  meal_name: string;
  ingredients: string[] | null;
  instructions: string[] | null;
};

type Profile = {
  id: number;
  user_id: string;
  full_name: string | null;
  diabetes: boolean | null;
  insulin_resistance: boolean | null;
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [userName, setUserName] = useState("Felhasználó");

  const [lastGlucose, setLastGlucose] = useState<number | null>(null);
  const [trend, setTrend] = useState("→");

  const [dietName, setDietName] = useState("Paleo");
  const [dietDescription, setDietDescription] = useState(
    "Személyre szabott paleo étrend"
  );

  const [lastRecipe, setLastRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error(error);
        setHasProfile(false);
        return;
      }

      await Promise.all([
        loadProfile(user.id),
        loadLastGlucose(user.id),
        loadLastRecipe(user.id),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
        id,
        user_id,
        full_name,
        diabetes,
        insulin_resistance
      `
      )
      .eq("user_id", userId)
      .maybeSingle<Profile>();

    if (error) {
      console.error(error);
      setHasProfile(false);
      return;
    }

    if (!data) {
      setHasProfile(false);
      return;
    }

    setHasProfile(true);

    if (data.full_name) {
      setUserName(data.full_name);
    }

    if (data.diabetes) {
      setDietName("Paleo + Diabétesz");
      setDietDescription("2-es típusú cukorbetegség támogatás");
    } else if (data.insulin_resistance) {
      setDietName("Paleo + IR");
      setDietDescription("Inzulinrezisztencia támogatás");
    } else {
      setDietName("Paleo");
      setDietDescription("Személyre szabott paleo étrend");
    }
  };

  const loadLastGlucose = async (userId: string) => {
    const { data, error } = await supabase
      .from("glucose_logs")
      .select("fasting")
      .eq("user_id", userId)
      .not("fasting", "is", null)
      .order("created_at", { ascending: false })
      .limit(2);

    if (error) {
      console.error(error);
      return;
    }

    if (!data || data.length === 0) {
      return;
    }

    const latest = Number(data[0].fasting);
    setLastGlucose(latest);

    if (data.length >= 2) {
      const previous = Number(data[1].fasting);
      const diff = latest - previous;

      if (diff > 0.2) {
        setTrend("↑");
      } else if (diff < -0.2) {
        setTrend("↓");
      } else {
        setTrend("→");
      }
    }
  };

  const loadLastRecipe = async (userId: string) => {
    const { data, error } = await supabase
      .from("recipes")
      .select(
        `
        id,
        meal_name,
        ingredients,
        instructions
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error(error);
      return;
    }

    if (data && data.length > 0) {
      setLastRecipe(data[0] as Recipe);
    }
  };

  const glucoseColor =
    lastGlucose === null
      ? "text-[#111827]"
      : lastGlucose < 5.6
      ? "text-green-600"
      : lastGlucose < 7
      ? "text-yellow-600"
      : "text-red-600";

  const aiSummary =
    lastGlucose === null
      ? "Még nincs elegendő vércukor adat az elemzéshez."
      : lastGlucose < 5.6
      ? "A legutóbbi éhomi vércukorszinted kedvező tartományban van."
      : lastGlucose < 7
      ? "A legutóbbi érték enyhén emelkedett, érdemes figyelni az étkezésre és a mozgásra."
      : "A legutóbbi érték magasabb, érdemes rendszeresen követni és szükség esetén szakemberrel egyeztetni.";

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f6ef] px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-xl">
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
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-xl">
            <h1 className="text-4xl font-black text-[#111827]">
              👋 Üdv a PaleoAI-ban
            </h1>

            <p className="mt-4 text-[#6b7280]">
              A Dashboard használatához először töltsd ki a profilodat.
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
            Szia, {userName}! 👋
          </h1>

          <p className="mt-4 text-lg text-[#6b7280]">
            Itt látod a saját egészségügyi adataidat, étrendedet és AI
            ajánlásaidat.
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
                <p className={`mt-4 text-5xl font-black ${glucoseColor}`}>
                  {lastGlucose}
                </p>

                <p className="mt-1 text-sm text-[#6b7280]">mmol/L</p>

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

            <p className="mt-4 leading-7 text-[#6b7280]">{aiSummary}</p>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-xl">
            <h2 className="text-lg font-semibold text-[#111827]">
              🥗 Aktív étrend
            </h2>

            <p className="mt-4 text-3xl font-black text-[#111827]">
              {dietName}
            </p>

            <p className="mt-3 text-[#6b7280]">{dietDescription}</p>
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
                  {lastRecipe.ingredients?.length ?? 0} hozzávaló
                </p>

                <p className="text-[#6b7280]">
                  {lastRecipe.instructions?.length ?? 0} lépés
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
              A személyes bevásárlólista integráció hamarosan elérhető lesz.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-xl">
            <h2 className="text-lg font-semibold text-[#111827]">
              ❤️ Egészség
            </h2>

            <p className="mt-4 text-[#111827]">Személyes vércukor napló</p>

            <p className="mt-3 text-[#6b7280]">
              AI elemzés és grafikonok saját adatok alapján.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}