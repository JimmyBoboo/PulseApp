"use client";

import { useState } from "react";

interface SelectedExercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

interface WorkoutBuilderProps {
  selectedExercises: SelectedExercise[];
  onUpdateExercise: (
    id: number,
    field: "sets" | "reps" | "weight",
    value: number
  ) => void;
  onRemoveExercise: (id: number) => void;
  onSaveWorkout: () => void;
  workoutType: string;
}

export function WorkoutBuilder({
  selectedExercises,
  onUpdateExercise,
  onRemoveExercise,
  onSaveWorkout,
  workoutType,
}: WorkoutBuilderProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  if (selectedExercises.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Din {workoutType} økt</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dato for økt
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        {selectedExercises.map((exercise) => (
          <div
            key={exercise.id}
            className="p-4 border border-gray-200 rounded-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
              <button
                onClick={() => onRemoveExercise(exercise.id)}
                className="text-red-500 hover:text-red-700"
              >
                Fjern
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Sett</label>
                <input
                  type="number"
                  min="1"
                  value={exercise.sets}
                  onChange={(e) =>
                    onUpdateExercise(
                      exercise.id,
                      "sets",
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Reps</label>
                <input
                  type="number"
                  min="1"
                  value={exercise.reps}
                  onChange={(e) =>
                    onUpdateExercise(
                      exercise.id,
                      "reps",
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Kg</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={exercise.weight}
                  onChange={(e) =>
                    onUpdateExercise(
                      exercise.id,
                      "weight",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onSaveWorkout}
        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Lagre økt
      </button>
    </div>
  );
}
