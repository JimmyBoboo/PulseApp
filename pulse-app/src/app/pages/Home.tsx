"use client";
import { useState, useEffect } from "react";
import { User, Activity, Badge } from "../../interface/types";
import { ProfileCard } from "../components/ProfilePage/ProfileCard";
import { ActivitiesCard } from "../components/ActivitiesCard";
import { BadgesCard } from "../components/ProfilePage/BadgesCard";
import { GoalsList } from "../components/GoalsList";

const MOCK_USER: User = {
  id: "1",
  name: "Simen Kingsrød",
  email: "simen@example.com",
  age: 29,
  createdAt: "2022-06-01",
  sessionsCount: 42,
  exercisesCount: 320,
  lastActivity: "2025-10-20",
};

const MOCK_BADGES: Badge[] = [
  {
    id: "b1",
    title: "Ukes-milen",
    description: "Løp 10 km på 7 dager",
    icon: "👟",
  },
  { id: "b2", title: "Storløfter", description: "10 styrkeøkter", icon: "🏋️" },
  {
    id: "b6",
    title: "Mester-syklist",
    description: "Syklet i 50 km",
    icon: "🚴",
  },
  {
    id: "b7",
    title: "Flittig løper",
    description: "Løpt 100 km totalt",
    icon: "🏃",
  },
];

export const Home = () => {
  const [user, setUser] = useState(MOCK_USER);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hent økter fra databasen
    async function fetchWorkouts() {
      try {
        const response = await fetch("/api/workouts?isCompleted=true");
        if (response.ok) {
          const workouts: any = await response.json();

          // Lag activities fra workouts
          const allActivities = workouts.map((workout: any) => {
            return {
              id: workout.id.toString(),
              date: workout.date,
              type: workout.type,
              duration: "-",
            };
          });

          // Sorter etter dato (nyeste først)
          allActivities.sort((a: any, b: any) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA;
          });

          // Tar bare de 5 første
          const activities5 = allActivities.slice(0, 5);
          setActivities(activities5);

          // Oppdater bruker stats
          setUser((prev) => {
            return {
              ...prev,
              sessionsCount: workouts.length,
              lastActivity:
                workouts.length > 0 ? activities5[0].date : prev.lastActivity,
            };
          });
        }
      } catch (error) {
        console.error("Feil ved henting av økter:", error);
      }
      setLoading(false);
    }

    fetchWorkouts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow bg-gray-100 p-8 flex justify-center">
          <p className="text-center">Laster...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 flex justify-center">
        <div className="max-w-6xl w-full grid grid-cols-[1fr_3fr_1fr] gap-6">
          <section className="flex flex-col space-y-6">
            <ProfileCard
              user={user}
              onEdit={(data) => setUser({ ...user, ...data })}
            />
            <section className="w-full max-w-sm bg-white rounded shadow p-4 text-center">
              <h3 className="font-bold mb-2">Statistikk</h3>
              <p className="text-gray-500 text-sm">Kommer snart…</p>
            </section>
          </section>

          <section className="flex flex-col space-y-6">
            <ActivitiesCard activities={activities} />
          </section>

          <section className="flex flex-col space-y-6">
            <BadgesCard badges={MOCK_BADGES} />
            <GoalsList />
            <section
              className="w-full bg-white rounded shadow p-4"
              style={{
                backgroundImage: "url('/images/pulse_background.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "100px",
              }}
            ></section>
          </section>
        </div>
      </main>

      <footer className="bg-black text-white py-6 mt-0">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Pulse App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

//ChatGPT er brukt til å hjelpe med layout, spacing, størrelser, fargekoder og generell struktur på siden. (OpenAI, 2025)
