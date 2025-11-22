import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User, Activity, Badge } from "../../../interface/types";
import { ProfileCard } from "./ProfileCard";
import { ActivitiesCard } from "../ActivitiesCard";
import { BadgesCard } from "./BadgesCard";
import { GoalsCard } from "../GoalsCard";

const MOCK_BADGES: Badge[] = [
  {
    id: "b1",
    title: "Ukes-milen",
    description: "Løp 10 km på 7 dager",
    icon: "👟",
  },
  { id: "b2", title: "Storløfter", description: "10 styrkeøkter", icon: "🏋️" },
];

export const ProfilePage = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      setUser({
        id: authUser.id.toString(),
        name: authUser.name,
        email: authUser.email,
        age: authUser.age,
        createdAt: "2024-01-01",
        sessionsCount: 0,
        exercisesCount: 0,
        lastActivity: "",
      });
    }

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

          // Ta bare de 10 første
          const activities10 = allActivities.slice(0, 10);
          setActivities(activities10);

          // Oppdater stats
          setUser((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              sessionsCount: workouts.length,
              lastActivity:
                workouts.length > 0 ? activities10[0].date : prev.lastActivity,
            };
          });
        }
      } catch (error) {
        console.error("Failed to fetch workouts:", error);
      }
      setLoading(false);
    }

    fetchWorkouts();
  }, [authUser]);

  function handleEdit(data: Partial<User>) {
    if (user) {
      setUser({ ...user, ...data });
    }
  }

  if (loading || !user) {
    return (
      <div className="p-8 bg-gray-100 min-h-screen grid gap-6 lg:grid-cols-3">
        <div className="text-center col-span-3">Laster...</div>
      </div>
    );
  }
  return (
    <div className="p-8 bg-gradient-to-br min-h-screen grid gap-6 lg:grid-cols-3">
      <ProfileCard user={user} onEdit={handleEdit} />
      <ActivitiesCard activities={activities} />
      <GoalsCard />
      <BadgesCard badges={MOCK_BADGES} />
    </div>
  );
};
