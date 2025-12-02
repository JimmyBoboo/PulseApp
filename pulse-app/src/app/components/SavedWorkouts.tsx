"use client";

import { useState, useEffect } from "react";

interface Workout {
  id: number;
  userId: number;
  type: string;
  date: string;
  isCompleted: boolean;
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

  useEffect(() => {
    fetchWorkouts();
  }, [onRefresh]);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/workouts?isCompleted=false");
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

  const handleWorkoutClick = async (workoutId: number) => {
    if (selectedWorkoutId === workoutId) {
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

  const handleDeleteWorkout = async (
    workoutId: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

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
      <div className="bg-white rounded-md shadow-md p-6 max-w-3xl w-full mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Mine økter</h2>
        <p className="text-gray-500">Laster økter...</p>
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="bg-white rounded-md shadow-md p-6 max-w-3xl w-full mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Mine økter</h2>
        <p className="text-gray-700 text-center mb-6">
          Ingen økter lagret ennå. Opprett din første økt!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md shadow-md p-6 max-w-3xl w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Mine økter</h2>

      <div className="space-y-3">
        {workouts.map((workout) => (
          <div key={workout.id}>
            {/* Økt-kort */}
            <div
              onClick={() => handleWorkoutClick(workout.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedWorkoutId === workout.id
                  ? "border-[#f15000] bg-[rgba(241,80,0,0.08)] shadow-md"
                  : "border-gray-200 hover:border-[#f15000] hover:bg-[rgba(241,80,0,0.02)]"
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
              <div className="mx-auto mt-2 p-4 bg-[rgba(241,80,0,0.00)] rounded-md border border-gray-300 max-w-3xl shadow-sm">
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
