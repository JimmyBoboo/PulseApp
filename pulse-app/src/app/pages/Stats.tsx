"use client";

import { useState, useEffect } from "react";

export const Stats = () => {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Henter alle øktene
    async function fetchWorkouts() {
      try {
        const response = await fetch("/api/workouts");
        if (response.ok) {
          const data: any = await response.json();

          // Sorter etter dato (nyeste først)
          const sortert = data.sort((a: any, b: any) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA;
          });

          setWorkouts(sortert);
        }
      } catch (error) {
        console.error("Feil ved henting av økter:", error);
      }
      setLoading(false);
    }

    fetchWorkouts();
  }, []);

  // Enkel statistikk
  const totalOkter = workouts.length;

  // Finne ut mest brukte type økt
  const typeTeller: any = {};
  workouts.forEach((w) => {
    if (typeTeller[w.type]) {
      typeTeller[w.type]++;
    } else {
      typeTeller[w.type] = 1;
    }
  });

  let mestBruktType = "";
  let maxAntall = 0;
  for (const type in typeTeller) {
    if (typeTeller[type] > maxAntall) {
      maxAntall = typeTeller[type];
      mestBruktType = type;
    }
  }
  // ------------------- UI -------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <p className="text-center">Laster...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Treningsstatistikk
          </h1>
          <p className="text-xl text-gray-600">
            Oversikt over dine treningsøkter
          </p>
        </div>

        {/* Statistikk-kortet */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Totalt antall økter
            </h3>
            <p className="text-4xl font-bold text-blue-600">{totalOkter}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Mest brukte type
            </h3>
            <p className="text-4xl font-bold text-green-600">
              {mestBruktType || "-"}
            </p>
          </div>
        </div>

        {/* Tabellen */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Alle økter
            </h2>

            {workouts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Ingen økter registrert ennå
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Dato
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Type
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        ID
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {workouts.map((workout) => (
                      <tr
                        key={workout.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          {new Date(workout.date).toLocaleDateString("no-NO")}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {workout.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          #{workout.id}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

//Brukte Co-pilot for å hjelpe til med UI design, hvordan man skal strukturere siden og lage statistikk logikken. Spurte hvordan man får ting på riktig plass. (GitHub, 2025)
