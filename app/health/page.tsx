"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useEffect, useState } from "react";
import { supabase } from "../../src/lib/supabase";

type GlucoseLog = {
  
  id: number;
  user_id: string;
  created_at: string;

  fasting: number | null;
  breakfast_after: number | null;
  lunch_after: number | null;
  dinner_after: number | null;

  note: string | null;
};


export default function HealthPage() {
  const [fasting, setFasting] = useState("");
  const [breakfastAfter, setBreakfastAfter] = useState("");
  const [lunchAfter, setLunchAfter] = useState("");
  const [dinnerAfter, setDinnerAfter] = useState("");
  const [note, setNote] = useState("");

  const [logs, setLogs] = useState<GlucoseLog[]>([]);
  const [loading, setLoading] = useState(false);

  const [analysis, setAnalysis] = useState("");
  const [analysisLoading, setAnalysisLoading] =
    useState(false);

  const loadLogs = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data, error } = await supabase
    .from("glucose_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(error);
    return;
  }

  setLogs(data || []);

  };

  useEffect(() => {
     const init = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    await loadLogs();
  };

  init();
}, []);
  

  const saveLog = async () => {
  try {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Először jelentkezz be.");
      return;
    }

    const { error } = await supabase
      .from("glucose_logs")
      .insert([
        {
          user_id: user.id,

          fasting: fasting
            ? Number(fasting)
            : null,

          breakfast_after:
            breakfastAfter
              ? Number(breakfastAfter)
              : null,

          lunch_after: lunchAfter
            ? Number(lunchAfter)
            : null,

          dinner_after:
            dinnerAfter
              ? Number(dinnerAfter)
              : null,

          note,
        },
      ]);
          
        

      if (error) {
        alert(error.message);
        return;
      }

      setFasting("");
      setBreakfastAfter("");
      setLunchAfter("");
      setDinnerAfter("");
      setNote("");

      await loadLogs();

      alert("Vércukor napló mentve.");
    } catch (error) {
      console.error(error);
      alert("Mentési hiba.");
    } finally {
      setLoading(false);
    }
  };

  const generateAnalysis = async () => {
    try {
      setAnalysisLoading(true);

      const res = await fetch(
        "/api/health/analyze",
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (!res.ok || data.error) {
        alert(data.error || "Elemzési hiba.");
        return;
      }

      setAnalysis(data.analysis);
    } catch (error) {
      console.error(error);
      alert("Elemzési hiba.");
    } finally {
      setAnalysisLoading(false);
    }
  };

  const chartData = logs
    .slice()
    .reverse()
    .map((log) => ({
      date: new Date(log.created_at).toLocaleDateString(
        "hu-HU"
      ),
      fasting: log.fasting,
    }));

  return (
    <main className="min-h-screen bg-[#f8f6ef] px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="font-bold uppercase tracking-[0.3em] text-[#7A9A2D]">
            PaleoAI
          </p>

          <h1 className="mt-3 text-5xl font-black text-[#111827]">
            ❤️ Egészség
          </h1>

          <p className="mt-4 text-lg text-[#6b7280]">
            Vércukor értékek nyomon követése és
            elemzése.
          </p>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-xl">
          <h2 className="mb-6 text-2xl font-black text-[#111827]">
            Új vércukor bejegyzés
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="number"
              step="0.1"
              placeholder="Éhgyomri"
              value={fasting}
              onChange={(e) =>
                setFasting(e.target.value)
              }
              className="rounded-xl border border-stone-300 px-4 py-3 text-black"
            />

            <input
              type="number"
              step="0.1"
              placeholder="Reggeli után"
              value={breakfastAfter}
              onChange={(e) =>
                setBreakfastAfter(e.target.value)
              }
              className="rounded-xl border border-stone-300 px-4 py-3 text-black"
            />

            <input
              type="number"
              step="0.1"
              placeholder="Ebéd után"
              value={lunchAfter}
              onChange={(e) =>
                setLunchAfter(e.target.value)
              }
              className="rounded-xl border border-stone-300 px-4 py-3 text-black"
            />

            <input
              type="number"
              step="0.1"
              placeholder="Vacsora után"
              value={dinnerAfter}
              onChange={(e) =>
                setDinnerAfter(e.target.value)
              }
              className="rounded-xl border border-stone-300 px-4 py-3 text-black"
            />
          </div>

          <textarea
            placeholder="Megjegyzés..."
            value={note}
            onChange={(e) =>
              setNote(e.target.value)
            }
            className="rounded-xl border border-stone-300 px-4 py-3 text-black"
          />

          <button
            onClick={saveLog}
            disabled={loading}
            className="mt-6 rounded-full bg-[#7A9A2D] px-8 py-4 font-bold text-white transition hover:bg-[#6d8b28]"
          >
            {loading ? "Mentés..." : "Mentés"}
          </button>
        </div>

        <div className="mt-10 rounded-[2rem] bg-white p-8 shadow-xl">
          <h2 className="mb-6 text-2xl font-black text-[#111827]">
            📈 Vércukor trend
          </h2>

          <div className="h-[320px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="date" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="fasting"
                  stroke="#7A9A2D"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8">
            <button
              onClick={generateAnalysis}
              disabled={analysisLoading}
              className="rounded-full bg-[#7A9A2D] px-6 py-3 font-bold text-white transition hover:bg-[#6d8b28]"
            >
              {analysisLoading
                ? "Elemzés..."
                : "🤖 AI Vércukor Elemzés"}
            </button>
          </div>
        </div>

        {analysis && (
          <div className="mt-10 rounded-[2rem] bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-black text-[#111827]">
              🤖 AI Elemzés
            </h2>

            <p className="mt-4 whitespace-pre-line leading-8 text-[#4b5563]">
              {analysis}
            </p>
          </div>
        )}

        <div className="mt-10 rounded-[2rem] bg-white p-8 shadow-xl">
          <h2 className="mb-6 text-2xl font-black text-[#111827]">
            📊 Korábbi bejegyzések
          </h2>

          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="rounded-2xl bg-[#f8f6ef] p-5"
              >
                <p className="font-bold text-[#111827]">
                  {new Date(
                    log.created_at
                  ).toLocaleDateString("hu-HU")}
                </p>

                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  <p>
                    Éhgyomri: {log.fasting ?? "-"}
                  </p>
                  <p>
                    Reggeli után:{" "}
                    {log.breakfast_after ?? "-"}
                  </p>
                  <p>
                    Ebéd után: {log.lunch_after ?? "-"}
                  </p>
                  <p>
                    Vacsora után:{" "}
                    {log.dinner_after ?? "-"}
                  </p>
                </div>

                {log.note && (
                  <p className="mt-3 text-sm text-[#6b7280]">
                    {log.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
