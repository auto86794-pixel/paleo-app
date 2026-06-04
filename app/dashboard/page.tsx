export default function DashboardPage() {
  return (
    <main className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">
        Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 p-6 rounded-xl">
          <h2 className="text-lg font-semibold">
            Napi kalória
          </h2>

          <p className="text-3xl font-bold mt-4">
            2200
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl">
          <h2 className="text-lg font-semibold">
            Fehérje
          </h2>

          <p className="text-3xl font-bold mt-4">
            180g
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl">
          <h2 className="text-lg font-semibold">
            Paleo pontszám
          </h2>

          <p className="text-3xl font-bold mt-4">
            95%
          </p>
        </div>
      </div>
    </main>
  );
}