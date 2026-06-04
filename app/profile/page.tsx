"use client";

import { useState } from "react";
import { supabase } from "../../src/lib/supabase";

export default function ProfilePage() {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const [goal, setGoal] = useState("Fogyás");
  const [activity, setActivity] = useState("Közepes");

  const saveProfile = async () => {
    const { error } = await supabase.from("profiles").insert([
      {
        age: Number(age),
        weight: Number(weight),
        height: Number(height),
        goal,
        activity,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Hiba: " + error.message);
      return;
    }

    alert("Profil sikeresen mentve!");

    setAge("");
    setWeight("");
    setHeight("");
    setGoal("Fogyás");
    setActivity("Közepes");
  };

  return (
    <main className="min-h-screen bg-[#f8f6ef] py-20 px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center rounded-full border border-[#7A9A2D]/20 bg-white/70 px-4 py-2 text-sm font-medium text-[#7A9A2D] backdrop-blur-md">
            PaleoAI Profil
          </div>

          <h1 className="mt-6 text-5xl font-black text-[#111827]">
            Profil beállítása
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            Add meg adataidat, hogy az AI személyre szabott paleo étrendet
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
              onChange={(e) => setAge(e.target.value)}
              placeholder="Pl. 45"
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-black placeholder:text-stone-500 focus:border-[#7A9A2D] focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block font-semibold text-[#111827]">
              Testsúly (kg)
            </label>

            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Pl. 92"
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-black placeholder:text-stone-500 focus:border-[#7A9A2D] focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block font-semibold text-[#111827]">
              Magasság (cm)
            </label>

            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Pl. 182"
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-black placeholder:text-stone-500 focus:border-[#7A9A2D] focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block font-semibold text-[#111827]">
              Cél
            </label>

            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-black focus:border-[#7A9A2D] focus:outline-none"
            >
              <option>Fogyás</option>
              <option>Tömegnövelés</option>
              <option>Egészséges életmód</option>
            </select>
          </div>

          <div className="mb-8">
            <label className="mb-2 block font-semibold text-[#111827]">
              Aktivitási szint
            </label>

            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-black focus:border-[#7A9A2D] focus:outline-none"
            >
              <option>Alacsony</option>
              <option>Közepes</option>
              <option>Magas</option>
            </select>
          </div>

          <button
            onClick={saveProfile}
            className="w-full rounded-xl bg-[#7A9A2D] py-4 text-lg font-semibold text-white transition-all hover:bg-[#6d8b28] hover:shadow-lg"
          >
            Profil mentése
          </button>
        </div>
      </div>
    </main>
  );
}