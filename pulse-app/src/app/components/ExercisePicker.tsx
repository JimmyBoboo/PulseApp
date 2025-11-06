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

// Øvelser kategorisert etter type
const exercisesByType: Record<string, string[]> = {
  Strength: [
    "Benkpress",
    "Markløft",
    "Knebøy",
    "Skulderpress",
    "Biceps curl",
    "Triceps dips",
  ],
  Cardio: [
    "Løping",
    "Sykling",
    "Roing",
    "Burpees",
    "Jumping jacks",
    "Mountain climbers",
  ],
  "Full body": [
    "Knebøy",
    "Markløft",
    "Benkpress",
    "Pull-ups",
    "Burpees",
    "Planken",
  ],
  "Upper body": [
    "Benkpress",
    "Skulderpress",
    "Pull-ups",
    "Rows",
    "Biceps curl",
    "Triceps extensions",
  ],
  "Lower body": [
    "Knebøy",
    "Markløft",
    "Lunges",
    "Leg press",
    "Calf raises",
    "Hamstring curls",
  ],
  HIIT: [
    "Burpees",
    "Jump squats",
    "Mountain climbers",
    "High knees",
    "Sprint intervals",
    "Box jumps",
  ],
  Yoga: [
    "Downward dog",
    "Warrior pose",
    "Tree pose",
    "Child's pose",
    "Sun salutation",
    "Pigeon pose",
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

  // Finn øvelser som matcher foreslåtte øvelser
  const matchingExercises = exercises.filter((ex) =>
    suggestedExercises.some((suggested) =>
      ex.name.toLowerCase().includes(suggested.toLowerCase())
    )
  );

  if (loading) {
    return <p className="text-gray-500">Laster øvelser...</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">
        Velg øvelser for {workoutType}
      </h2>

      {matchingExercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {matchingExercises.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => onAddExercise(exercise.id, exercise.name)}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
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
