"use client";

import { useState, useEffect } from "react";

interface Workout {
  id: number;
  userId: number;
  type: string;
  date: string;
}

interface WorkoutExercise {
  id: number;
  exerciseId: number;
  exerciseName: string;
  sets: number;
  reps: number;
  weight: number;
}

interface SavedWorkoutsProps {
  onRefresh?: boolean;
}

export function SavedWorkouts({ onRefresh }: SavedWorkoutsProps) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(
    null
  );
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingExercises, setLoadingExercises] = useState(false);

  // Hent alle økter
  useEffect(() => {
    fetchWorkouts();
  }, [onRefresh]);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/workouts");
      if (response.ok) {
        const data = (await response.json()) as Workout[];
        setWorkouts(data);
      }
    } catch (error) {
      console.error("Feil ved henting av økter:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hent øvelser for valgt økt
  const handleWorkoutClick = async (workoutId: number) => {
    if (selectedWorkoutId === workoutId) {
      // Hvis samme økt klikkes, lukk den
      setSelectedWorkoutId(null);
      setExercises([]);
      return;
    }

    try {
      setLoadingExercises(true);
      setSelectedWorkoutId(workoutId);

      const response = await fetch(`/api/workoutExercises/${workoutId}`);
      if (response.ok) {
        const data = (await response.json()) as WorkoutExercise[];
        setExercises(data);
      }
    } catch (error) {
      console.error("Feil ved henting av øvelser:", error);
    } finally {
      setLoadingExercises(false);
    }
  };

  // Slett økt
  const handleDeleteWorkout = async (
    workoutId: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Ikke trigger onClick på kortet

    if (!confirm("Er du sikker på at du vil slette denne økten?")) {
      return;
    }

    try {
      const response = await fetch(`/api/workouts/${workoutId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setWorkouts(workouts.filter((w) => w.id !== workoutId));
        if (selectedWorkoutId === workoutId) {
          setSelectedWorkoutId(null);
          setExercises([]);
        }
      }
    } catch (error) {
      console.error("Feil ved sletting av økt:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Mine økter</h2>
        <p className="text-gray-500">Laster økter...</p>
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Mine økter</h2>
        <p className="text-gray-500">
          Ingen økter lagret ennå. Opprett din første økt!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Mine økter</h2>

      <div className="space-y-3">
        {workouts.map((workout) => (
          <div key={workout.id}>
            {/* Økt-kort */}
            <div
              onClick={() => handleWorkoutClick(workout.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedWorkoutId === workout.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {workout.type}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(workout.date).toLocaleDateString("nb-NO", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDeleteWorkout(workout.id, e)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                  >
                    Slett
                  </button>
                </div>
              </div>
            </div>

            {/* Øvelser (vises når økten er valgt) */}
            {selectedWorkoutId === workout.id && (
              <div className="ml-4 mt-2 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                {loadingExercises ? (
                  <p className="text-gray-500">Laster øvelser...</p>
                ) : exercises.length === 0 ? (
                  <p className="text-gray-500">Ingen øvelser i denne økten</p>
                ) : (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Øvelser:
                    </h4>
                    {exercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="flex items-center justify-between p-3 bg-white rounded border border-gray-200"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {exercise.exerciseName}
                          </p>
                        </div>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>
                            <strong>{exercise.sets}</strong> sett
                          </span>
                          <span>
                            <strong>{exercise.reps}</strong> reps
                          </span>
                          <span>
                            <strong>{exercise.weight}</strong> kg
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
