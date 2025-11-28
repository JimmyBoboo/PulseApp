"use client";

interface SelectedExercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  minutes?: number;
  distance?: number;
}

interface WorkoutBuilderProps {
  selectedExercises: SelectedExercise[];
  onUpdateExercise: (
    id: number,
    field: "sets" | "reps" | "weight" | "minutes" | "distance",
    value: number
  ) => void;
  onRemoveExercise: (id: number) => void;
  onSaveWorkout: () => void;
  workoutType: string;
  buttonText?: string;
}

export function WorkoutBuilder({
  selectedExercises,
  onUpdateExercise,
  onRemoveExercise,
  onSaveWorkout,
  workoutType,
  buttonText = "Lagre økt",
}: WorkoutBuilderProps) {
  const isCardioExercise = (exerciseName: string) => {
    //ChatGPT genererte denne funksjonen, sjekker om en øvelse er cardio
    const cardioExercises = ["løping", "sykling", "roing"];
    return cardioExercises.some((cardio) =>
      exerciseName.toLowerCase().includes(cardio)
    );
  };

  if (selectedExercises.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Din {workoutType} økt</h2>

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

            {isCardioExercise(exercise.name) ? ( // KI (Claude Sonnet 4.5) genererte denne delen for cardio-øvelser fra linje 82-120
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Minutter
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={exercise.minutes || 30}
                    onChange={(e) =>
                      onUpdateExercise(
                        exercise.id,
                        "minutes",
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Kilometer
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={exercise.distance || 5}
                    onChange={(e) =>
                      onUpdateExercise(
                        exercise.id,
                        "distance",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Sett
                  </label>
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
                  <label className="block text-xs text-gray-600 mb-1">
                    Reps
                  </label>
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
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onSaveWorkout}
        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
}
