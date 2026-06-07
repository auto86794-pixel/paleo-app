"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../src/lib/supabase";

export default function ProfilePage() {
  const router = useRouter();
const [fullName, setFullName] = useState("");

  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const [gender, setGender] = useState("Férfi");

  const [goal, setGoal] = useState("Fogyás");
  const [activity, setActivity] = useState("Közepes");

  const [insulinResistance, setInsulinResistance] =
    useState(false);

  const [diabetes, setDiabetes] =
    useState(false);

  const [glutenFree, setGlutenFree] =
    useState(false);

  const [lactoseFree, setLactoseFree] =
    useState(false);
    useEffect(() => {
  loadProfile();
}, []);

const loadProfile = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) return;

  setFullName(data.full_name ?? "");
  setAge(String(data.age ?? ""));
  setWeight(String(data.weight ?? ""));
  setHeight(String(data.height ?? ""));
  setGender(data.gender ?? "Férfi");
  setGoal(data.goal ?? "Fogyás");
  setActivity(data.activity ?? "Közepes");

  setInsulinResistance(
    data.insulin_resistance ?? false
  );

  setDiabetes(data.diabetes ?? false);

  setGlutenFree(
    data.gluten_free ?? false
  );

  setLactoseFree(
    data.lactose_free ?? false
  );
};

  const saveProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Először jelentkezz be.");

        router.push("/login");

        return;
      }

      const { error } = await supabase
  .from("profiles")
  .upsert(
    {
      user_id: user.id,

      full_name: fullName,

      age: Number(age),
      weight: Number(weight),
      height: Number(height),

      gender,

      goal,
      activity,

      insulin_resistance:
        insulinResistance,

      diabetes,

      gluten_free: glutenFree,

      lactose_free: lactoseFree,
    },
    {
      onConflict: "user_id",
    }
  );
          
        

      if (error) {
        console.error(error);

        alert(
          "Mentési hiba: " +
            error.message
        );

        return;
      }

      alert("Profil sikeresen mentve.");

      router.push("/mealplan?autogen=1");
    } catch (error) {
      console.error(error);

      alert(
        "Váratlan hiba történt."
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f6ef] px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center rounded-full border border-[#7A9A2D]/20 bg-white/70 px-4 py-2 text-sm font-medium text-[#7A9A2D] backdrop-blur-md">
            PaleoAI Profil
          </div>

          <h1 className="mt-6 text-5xl font-black text-[#111827]">
            Profil beállítása
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            Add meg adataidat,
            hogy az AI személyre
            szabott paleo étrendet
            készíthessen.
          </p>
        </div>

        <div className="rounded-3xl border border-white/60 bg-white/70 p-8 shadow-xl backdrop-blur-xl">
          <div className="mb-6">
            <label className="mb-2 block font-semibold text-[#111827]">
              Életkor
            </label>

            <input
              type="number"
              value={age}
              onChange={(e) =>
                setAge(
                  e.target.value
                )
              }
              placeholder="Pl. 45"
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-black"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block font-semibold text-[#111827]">
              Testsúly (kg)
            </label>

            <input
              type="number"
              value={weight}
              onChange={(e) =>
                setWeight(
                  e.target.value
                )
              }
              placeholder="Pl. 92"
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-black"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block font-semibold text-[#111827]">
              Magasság (cm)
            </label>

            <input
              type="number"
              value={height}
              onChange={(e) =>
                setHeight(
                  e.target.value
                )
              }
              placeholder="Pl. 182"
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-black"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block font-semibold text-[#111827]">
              Nem
            </label>

            <select
              value={gender}
              onChange={(e) =>
                setGender(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-black"
            >
              <option>
                Férfi
              </option>

              <option>
                Nő
              </option>
            </select>
          </div>

          <div className="mb-6">
            <label className="mb-2 block font-semibold text-[#111827]">
              Cél
            </label>

            <select
              value={goal}
              onChange={(e) =>
                setGoal(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-black"
            >
              <option>
                Fogyás
              </option>

              <option>
                Tömegnövelés
              </option>

              <option>
                Egészséges életmód
              </option>
            </select>
          </div>

          <div className="mb-6">
            <label className="mb-2 block font-semibold text-[#111827]">
              Aktivitási szint
            </label>

            <select
              value={activity}
              onChange={(e) =>
                setActivity(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-black"
            >
              <option>
                Alacsony
              </option>

              <option>
                Közepes
              </option>

              <option>
                Magas
              </option>
            </select>
          </div>

          <div className="mb-8">
            <label className="mb-4 block font-semibold text-[#111827]">
              Egészségügyi állapotok
            </label>

            <div className="rounded-xl border border-stone-200 bg-white p-4">
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={
                      insulinResistance
                    }
                    onChange={(e) =>
                      setInsulinResistance(
                        e.target.checked
                      )
                    }
                  />

                  <span>
                    Inzulinrezisztencia
                  </span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={
                      diabetes
                    }
                    onChange={(e) =>
                      setDiabetes(
                        e.target.checked
                      )
                    }
                  />

                  <span>
                    2-es típusú
                    cukorbetegség
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="mb-4 block font-semibold text-[#111827]">
              Ételérzékenységek
            </label>

            <div className="rounded-xl border border-stone-200 bg-white p-4">
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={
                      glutenFree
                    }
                    onChange={(e) =>
                      setGlutenFree(
                        e.target.checked
                      )
                    }
                  />

                  <span>
                    Gluténmentes
                  </span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={
                      lactoseFree
                    }
                    onChange={(e) =>
                      setLactoseFree(
                        e.target.checked
                      )
                    }
                  />

                  <span>
                    Laktózmentes
                  </span>
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={saveProfile}
            className="w-full rounded-xl bg-[#7A9A2D] py-4 text-lg font-semibold text-white transition-all hover:bg-[#6d8b28]"
          >
            Profil mentése
          </button>
        </div>
      </div>
    </main>
  );
}
