import Link from "next/link";

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#f8f6ef] text-[#111827]">
      <section className="relative mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2">
        <div className="absolute left-[-120px] top-20 h-72 w-72 rounded-full bg-[#7A9A2D]/20 blur-3xl" />
        <div className="absolute right-[-120px] top-32 h-96 w-96 rounded-full bg-[#d9b382]/30 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-6 inline-flex rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-[#7A9A2D] backdrop-blur-xl">
            🥑 AI Powered • Paleo Certified
          </div>

          <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-[#7A9A2D]">
            Paleo étrend
          </p>

          <h1 className="max-w-2xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
            Mesterséges intelligenciával.
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-[#4b5563]">
            Személyre szabott étrend, bevásárlólista és napi ajánlások
            másodpercek alatt. Fogyáshoz, izomépítéshez vagy egészségesebb
            életmódhoz.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/profile"
              className="rounded-full bg-[#7A9A2D] px-8 py-4 text-center font-semibold text-white shadow-lg shadow-[#7A9A2D]/20 hover:bg-[#688626]"
            >
              Ingyenes kezdés
            </Link>

            <Link
              href="/mealplan"
              className="rounded-full border border-[#d8cdbd] bg-white/60 px-8 py-4 text-center font-semibold text-[#111827] backdrop-blur-xl hover:bg-white"
            >
              Demo megtekintése
            </Link>
          </div>

          <div className="mt-12 grid max-w-xl grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-black text-[#111827]">12 kg</div>
              <div className="text-sm text-[#6b7280]">átlagos cél</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#111827]">94%</div>
              <div className="text-sm text-[#6b7280]">elégedettség</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#111827]">3500+</div>
              <div className="text-sm text-[#6b7280]">étrend</div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="absolute -left-6 top-10 rounded-2xl bg-white/75 px-5 py-4 shadow-xl backdrop-blur-xl">
            <div className="text-sm font-semibold text-[#6b7280]">AI elemzés</div>
            <div className="text-2xl font-black text-[#7A9A2D]">98%</div>
          </div>

          <div className="absolute -right-3 bottom-20 rounded-2xl bg-white/75 px-5 py-4 shadow-xl backdrop-blur-xl">
            <div className="text-sm font-semibold text-[#6b7280]">Paleo score</div>
            <div className="text-2xl font-black text-[#7A9A2D]">100%</div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/70 p-4 shadow-2xl backdrop-blur-2xl">
            <div className="rounded-[1.5rem] bg-[#111827] p-5 text-white">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="text-sm text-white/50">Mai ajánlás</div>
                  <div className="text-2xl font-bold">Paleo Dashboard</div>
                </div>
                <div className="rounded-full bg-[#7A9A2D] px-4 py-2 text-sm font-bold">
                  LIVE
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-2xl bg-white/10 p-5">
                  <div className="mb-2 text-sm text-white/50">Reggeli</div>
                  <div className="font-semibold">Tojás avokádóval és friss zöldségekkel</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/10 p-5">
                    <div className="text-sm text-white/50">Kalória</div>
                    <div className="mt-2 text-2xl font-black">2180</div>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-5">
                    <div className="text-sm text-white/50">Fehérje</div>
                    <div className="mt-2 text-2xl font-black">165g</div>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#7A9A2D] p-5">
                  <div className="text-sm text-white/80">Következő étkezés</div>
                  <div className="mt-2 text-xl font-black">Csirkemell édesburgonyával</div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-8 left-10 w-40 rounded-[2rem] border border-white/70 bg-white/80 p-3 shadow-xl backdrop-blur-xl">
            <div className="rounded-[1.5rem] bg-[#f8f6ef] p-4">
              <div className="text-xs font-semibold text-[#6b7280]">Mobil nézet</div>
              <div className="mt-3 h-2 rounded-full bg-[#7A9A2D]" />
              <div className="mt-3 h-2 w-2/3 rounded-full bg-[#d9b382]" />
              <div className="mt-3 h-12 rounded-xl bg-white" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/70 bg-white/70 p-8 shadow-sm backdrop-blur-xl">
            <div className="text-4xl">🥩</div>
            <div className="mt-5 text-4xl font-black">5000+</div>
            <p className="mt-2 text-[#6b7280]">Generált paleo étrend</p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/70 p-8 shadow-sm backdrop-blur-xl">
            <div className="text-4xl">🤖</div>
            <div className="mt-5 text-4xl font-black">AI alapú</div>
            <p className="mt-2 text-[#6b7280]">Személyre szabott ajánlások</p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/70 p-8 shadow-sm backdrop-blur-xl">
            <div className="text-4xl">📈</div>
            <div className="mt-5 text-4xl font-black">94%</div>
            <p className="mt-2 text-[#6b7280]">Felhasználói elégedettség</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 text-center">
          <p className="font-bold uppercase tracking-[0.3em] text-[#7A9A2D]">
            Hogyan működik?
          </p>
          <h2 className="mt-4 text-4xl font-black md:text-5xl">
            Három lépés, és kész az étrended.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["1", "Profil kitöltése", "Add meg a célodat, testsúlyodat és aktivitási szintedet."],
            ["2", "AI elemzés", "A rendszer személyre szabott igények alapján dolgozik."],
            ["3", "Étrend generálása", "Megkapod a heti étrendet és a bevásárlólistát."],
          ].map(([step, title, text]) => (
            <div
              key={step}
              className="rounded-3xl border border-white/70 bg-white/70 p-8 shadow-sm backdrop-blur-xl"
            >
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7A9A2D] text-xl font-black text-white">
                {step}
              </div>
              <h3 className="text-2xl font-black">{title}</h3>
              <p className="mt-4 leading-7 text-[#6b7280]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-28">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#111827] p-12 text-center text-white shadow-2xl">
          <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-[#7A9A2D]/30 blur-3xl" />
          <div className="relative z-10">
            <p className="font-bold uppercase tracking-[0.3em] text-[#9fbd54]">
              PaleoAI
            </p>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              Kezdd el a személyre szabott paleo étrendet.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-white/70">
              Töltsd ki a profilodat, és generálj heti étrendet pár kattintással.
            </p>
            <Link
              href="/profile"
              className="mt-8 inline-block rounded-full bg-white px-8 py-4 font-bold text-[#111827]"
            >
              Ingyenes kezdés
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}