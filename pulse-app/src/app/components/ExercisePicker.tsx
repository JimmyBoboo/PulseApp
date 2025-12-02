"use client";

import { useState, useEffect } from "react";

interface Exercise {
  id: number;
  name: string;
}

interface ExercisePickerProps {
  workoutType: string;
  onAddExercise: (exerciseId: number, exerciseName: string) => void;
}

// Øvelser kategorisert etter type - matcher øvelser fra seed.ts // Co-pilot genererte øvelsene.
const exercisesByType: Record<string, string[]> = {
  Strength: [
    "Benkpress",
    "Deadlift",
    "Squats",
    "Shoulder Press",
    "Bicep Curls",
    "Tricep",
    "Pull Ups",
    "Bent Over Row",
    "Dips",
  ],
  Cardio: ["Løping", "Sykling", "Roing", "Jumping Jacks"],
  "Full body": [
    "Squats",
    "Deadlift",
    "Benkpress",
    "Pull Ups",
    "Plank",
    "Push Ups",
    "Dips",
    "Sit Ups",
  ],
  "Upper body": [
    "Benkpress",
    "Incline Benkpress",
    "Shoulder Press",
    "Pull Ups",
    "Bent Over Row",
    "Lat Pulldown",
    "T-Bar Row",
    "Bicep Curls",
    "Hammer Curls",
    "Tricep Extensions",
    "Tricep Pushdown",
    "Dips",
    "Push Ups",
    "Flyes",
    "Lateral Raises",
    "Front Raises",
    "Rear Delt Flyes",
  ],
  "Lower body": [
    "Squats",
    "Deadlift",
    "Lunges",
    "Leg Press",
    "Leg Curl",
    "Leg Extension",
    "Calf Raises",
  ],
};

export function ExercisePicker({
  workoutType,
  onAddExercise,
}: ExercisePickerProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch("/api/exercises");
        if (response.ok) {
          const data = (await response.json()) as Exercise[];
          setExercises(data);
        }
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const suggestedExercises = exercisesByType[workoutType] || [];

  const matchingExercises = exercises.filter((ex) =>
    suggestedExercises.some((suggested) =>
      ex.name.toLowerCase().includes(suggested.toLowerCase())
    )
  );

  if (loading) {
    return <p className="text-gray-500">Laster øvelser...</p>;
  }

  return (
    <div className="bg-white rounded-md shadow-md p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Velg øvelser for {workoutType}
      </h2>

      {matchingExercises.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
          {matchingExercises.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => onAddExercise(exercise.id, exercise.name)}
              className={`py-3 px-3 rounded-md border transition-all w-full text-center 
                border-gray-300 hover:border-[#f15000] hover:bg-[rgba(241,80,0,0.08)] 
              `}
            >
              <div className="font-semibold text-gray-800">{exercise.name}</div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Ingen øvelser funnet for denne typen økt.
          </p>
          <p className="text-sm text-gray-500">
            Foreslåtte øvelser: {suggestedExercises.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
