"use client";

import { useEffect, useState } from "react";


type MealPlanDay = {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  calories?: number;
  protein?: number;
};

type MealPlan = {
  days: MealPlanDay[];
  shoppingList: string[];
};

export default function MealPlanPage() {
  const [loading, setLoading] = useState(false);
  const [mealplan, setMealplan] = useState<MealPlan | null>(null);

  

  const [loadingMessage, setLoadingMessage] = useState(
    "📊 Kalóriaszükséglet számítása..."
  );
const [recipes, setRecipes] = useState<Record<string, any>>({});
const [recipeLoading, setRecipeLoading] = useState<string | null>(null);

  const totalCalories =
    mealplan?.days.reduce((sum, day) => sum + (day.calories ?? 0), 0) ?? 0;

  const totalProtein =
    mealplan?.days.reduce((sum, day) => sum + (day.protein ?? 0), 0) ?? 0;

  const ingredientCount = mealplan?.shoppingList.length ?? 0;

  const weeklyTargetCalories = 15400;

  const completionPercent =
    mealplan && weeklyTargetCalories > 0
      ? Math.min(Math.round((totalCalories / weeklyTargetCalories) * 100), 100)
      : 0;

  const generateMealPlan = async () => {
    try {
      setLoading(true);

      setLoadingMessage("📊 Kalóriaszükséglet számítása...");

      const t1 = setTimeout(() => {
        setLoadingMessage("🥩 Paleo étrend összeállítása...");
      }, 1500);

      const t2 = setTimeout(() => {
        setLoadingMessage("🛒 Bevásárlólista generálása...");
      }, 3000);

      const res = await fetch("/api/mealplan", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        alert(data.error || "Hiba történt.");
        return;
      }

      setMealplan(data.mealplan);
    } catch (error) {
      console.error(error);
      alert("Hiba történt az étrend generálása közben.");
    }  finally {
  setLoading(false);
}
    
  };

const regenerateDay = async (dayName: string) => {
  if (!mealplan) return;

  try {
    const res = await fetch("/api/mealplan/day", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        day: dayName,
      }),
    });

    const newDay = await res.json();

    if (!res.ok || newDay.error) {
      throw new Error(newDay.error || "Generálási hiba");
    }

    setMealplan({
      ...mealplan,
      days: mealplan.days.map((day) =>
        day.day === dayName ? newDay : day
      ),
    });
  } catch (error) {
    console.error(error);
    alert("Nem sikerült újragenerálni a napot.");
  }
};

const generateRecipe = async (meal: string) => {
  if (recipes[meal]) return;

  try {
    setRecipeLoading(meal);

    const res = await fetch("/api/recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        meal,
      }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      alert(data.error || "Recept generálási hiba.");
      return;
    }

    setRecipes((prev) => ({
      ...prev,
      [meal]: data.recipe,
    }));
  } catch (error) {
    console.error(error);
    alert("Nem sikerült a recept generálása.");
  } finally {
    setRecipeLoading(null);
  }
};

  useEffect(() => {
  const params = new URLSearchParams(
    window.location.search
  );

  const autogen = params.get("autogen");

  if (autogen === "1" && !mealplan && !loading) {
    generateMealPlan();
  }
}, [mealplan, loading]);;

  const exportPdf = async () => {
    if (!mealplan) return;

    try {
      const res = await fetch("/api/mealplan/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mealplan),
      });

      if (!res.ok) {
        throw new Error("PDF export hiba.");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "paleoai-mealplan.pdf";

      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("PDF export hiba.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f6ef] px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 font-bold uppercase tracking-[0.3em] text-[#7A9A2D]">
              PaleoAI
            </p>

            <h1 className="text-5xl font-black text-[#111827]">
              Személyre szabott Paleo étrend
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-[#6b7280]">
              Generálj személyre szabott paleo étrendet és automatikus
              bevásárlólistát.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={generateMealPlan}
              disabled={loading}
              className="rounded-full bg-[#7A9A2D] px-8 py-4 font-semibold text-white shadow-lg shadow-[#7A9A2D]/20 transition hover:bg-[#688626] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Generálás..." : "Étrend generálása"}
            </button>

            <button
              type="button"
              onClick={exportPdf}
              disabled={!mealplan}
              className="rounded-full border border-[#7A9A2D] px-8 py-4 font-semibold text-[#7A9A2D] transition hover:bg-[#eef4df] disabled:cursor-not-allowed disabled:opacity-40"
            >
              PDF Export
            </button>
          </div>
        </div>

        {loading && (
          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-10 shadow-xl">
            <h2 className="text-3xl font-black text-[#111827]">
              🤖 PaleoAI dolgozik...
            </h2>

            <p className="mt-4 text-lg text-[#6b7280]">
              {loadingMessage}
            </p>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full animate-pulse rounded-full bg-[#7A9A2D]" />
            </div>
          </div>
        )}

        {!mealplan && !loading && (
          <div className="rounded-[2rem] border border-white/70 bg-white/80 p-10 shadow-xl backdrop-blur-xl">
            <h2 className="text-3xl font-black text-[#111827]">
              Készen áll az étrended?
            </h2>

            <p className="mt-4 max-w-2xl text-[#6b7280]">
              A rendszer a legutóbb mentett profilod alapján készít heti paleo
              étrendet. Előbb töltsd ki a profilt, majd kattints a generálásra.
            </p>
          </div>
        )}

        {mealplan && (
          <>
            <div className="mb-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-[2rem] bg-white/90 p-6 shadow-xl">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#6b7280]">
                  Heti kalória
                </p>

                <h3 className="mt-2 text-3xl font-black text-[#111827]">
                  🔥 {totalCalories.toLocaleString()} kcal
                </h3>
              </div>

              <div className="rounded-[2rem] bg-white/90 p-6 shadow-xl">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#6b7280]">
                  Heti fehérje
                </p>

                <h3 className="mt-2 text-3xl font-black text-[#111827]">
                  💪 {totalProtein.toLocaleString()} g
                </h3>
              </div>

              <div className="rounded-[2rem] bg-white/90 p-6 shadow-xl">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#6b7280]">
                  Alapanyagok
                </p>

                <h3 className="mt-2 text-3xl font-black text-[#111827]">
                  🛒 {ingredientCount}
                </h3>
              </div>
            </div>

            <div className="mb-10 rounded-[2rem] bg-white/90 p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-black text-[#111827]">
                  Heti cél teljesülése
                </h3>

                <span className="font-bold text-[#7A9A2D]">
                  {completionPercent}%
                </span>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-[#e5e7eb]">
                <div
                  className="h-full rounded-full bg-[#7A9A2D] transition-all duration-700"
                  style={{
                    width: `${completionPercent}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-sm text-[#6b7280]">
                {totalCalories.toLocaleString()} /{" "}
                {weeklyTargetCalories.toLocaleString()} kcal
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
              <section>
                <div className="mb-8">
                  <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#7A9A2D]">
                     PaleoAI ajánlás
                  </p>

                  <h2 className="mt-2 text-4xl font-black text-[#111827]">
                    A Te Egyedi Paleo Étrended
                  </h2>
                </div>

                <div className="space-y-6">
                  {mealplan.days.map((day) => (
                    <article
                      key={day.day}
                      className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-3xl font-black text-[#111827]">
                          {day.day}
                        </h3>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                             
  onClick={() => regenerateDay(day.day)}
  className="rounded-full bg-[#eef4df] px-4 py-2 text-sm font-bold text-[#7A9A2D] transition hover:bg-[#dfecc9]"
>
  🔄 Újragenerálás
</button>
                          {typeof day.calories === "number" && (
                            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-700">
                              🔥 {day.calories} kcal
                            </span>
                          )}

                          {typeof day.protein === "number" && (
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
                              💪 {day.protein} g protein
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-8 grid gap-6 md:grid-cols-3">
                        <div className="rounded-3xl bg-[#f8f6ef] p-5">
                          <p className="mb-3 font-bold text-[#111827]">
                            🥚 Reggeli
                          </p>

                          <p className="leading-7 text-[#4b5563]">
                            {day.breakfast}
                          </p>
                          <p className="leading-7 text-[#4b5563]">
  {day.breakfast}
</p>

<button
 
  type="button"
  onClick={() => generateRecipe(day.breakfast)}
  className="mt-3 rounded-full bg-[#7A9A2D] px-4 py-2 text-sm font-bold text-white cursor-pointer"
>
  📖 Recept

</button>

{recipeLoading === day.breakfast && (
  <p className="mt-3 text-sm text-gray-500">
    🤖 Recept generálása...
  </p>
)}

{recipes[day.breakfast] && (
  <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-4">
    <h4 className="font-bold text-[#111827]">
      🥗 Hozzávalók
    </h4>

    <ul className="mt-2 list-disc pl-5 text-[#4b5563]">
      {recipes[day.breakfast].ingredients?.map(
        (item: string, index: number) => (
          <li key={index}>{item}</li>
        )
      )}
    </ul>

    <h4 className="mt-4 font-bold text-[#111827]">
      👨‍🍳 Elkészítés
    </h4>

    <ol className="mt-2 list-decimal pl-5 text-[#4b5563]">
      {recipes[day.breakfast].instructions?.map(
        (step: string, index: number) => (
          <li key={index}>{step}</li>
        )
      )}
    </ol>
  </div>
)}

                        </div>

                        <div className="rounded-3xl bg-[#f8f6ef] p-5">
                          <p className="mb-3 font-bold text-[#111827]">
                            🥩 Ebéd
                          </p>

                          <p className="leading-7 text-[#4b5563]">
                            {day.lunch}
                          </p>
                        </div>

                        <div className="rounded-3xl bg-[#f8f6ef] p-5">
                          <p className="mb-3 font-bold text-[#111827]">
                            🥗 Vacsora
                          </p>

                          <p className="leading-7 text-[#4b5563]">
                            {day.dinner}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <aside className="sticky top-8 h-fit rounded-[2rem] border border-white/70 bg-white/95 p-7 shadow-xl backdrop-blur-xl">
                <h2 className="text-2xl font-black text-[#111827]">
                  🛒 Bevásárlólista
                </h2>

                <div className="mt-6 space-y-3">
                  {mealplan.shoppingList.map((item, index) => (
                    <label
                      key={`${item}-${index}`}
                      className="flex cursor-pointer items-center gap-3 rounded-2xl bg-[#f8f6ef] px-4 py-3 transition hover:bg-[#eef4df]"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-[#7A9A2D]"
                      />

                      <span className="text-[#374151]">{item}</span>
                    </label>
                  ))}
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  );
}