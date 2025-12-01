"use client";

import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { WorkoutTypeSelector } from "../components/WorkoutTypeSelector";
import { ExercisePicker } from "../components/ExercisePicker";
import { WorkoutBuilder } from "../components/WorkoutBuilder";

interface SelectedExercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  minutes?: number;
  distance?: number;
}

interface CompletedWorkout {
  id: number;
  type: string;
  date: string;
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    weight: number;
  }>;
}

export const LogWorkout = () => {
  const { user } = useAuth();
  const [workoutType, setWorkoutType] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<
    SelectedExercise[]
  >([]);
  const [completedWorkouts, setCompletedWorkouts] = useState<
    CompletedWorkout[]
  >([]);

  // Setter dagens dato som default
  const idag = new Date().toISOString().split("T")[0];
  const [workoutDate, setWorkoutDate] = useState(idag);

  const handleSelectType = (type: string) => {
    setWorkoutType(type);
    setSelectedExercises([]);
  };
  // Sjekker her om øvelsen er lagt til
  const handleAddExercise = (exerciseId: number, exerciseName: string) => {
    const finnesAllerede = selectedExercises.find((ex) => ex.id === exerciseId);
    if (finnesAllerede) {
      return;
    }

    // Sjekk om det er cardio-øvelse
    const isCardio = ["løping", "sykling", "roing"].some((cardio) =>
      exerciseName.toLowerCase().includes(cardio)
    );

    // Legger til en ny øvelsle med default verdier
    const nyOvelse = {
      id: exerciseId,
      name: exerciseName,
      sets: isCardio ? 0 : 3,
      reps: isCardio ? 0 : 10,
      weight: isCardio ? 0 : 0,
      minutes: isCardio ? 30 : undefined,
      distance: isCardio ? 5 : undefined,
    };

    setSelectedExercises([...selectedExercises, nyOvelse]);
  };

  const handleUpdateExercise = (
    id: number,
    field: "sets" | "reps" | "weight" | "minutes" | "distance",
    value: number
  ) => {
    const oppdatert = selectedExercises.map((ex) => {
      if (ex.id === id) {
        return { ...ex, [field]: value };
      }
      return ex;
    });
    setSelectedExercises(oppdatert);
  };

  const handleRemoveExercise = (id: number) => {
    const filtrert = selectedExercises.filter((ex) => ex.id !== id);
    setSelectedExercises(filtrert);
  };

  const handleLogWorkout = async () => {
    try {
      if (!user) {
        alert("Du må være logget inn for å logge en økt");
        return;
      }

      const userId = user.id;

      // Lagre workout
      const workoutData = {
        userId: userId,
        type: workoutType,
        date: workoutDate,
        isCompleted: true,
      };

      const workoutResponse = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workoutData),
      });

      if (!workoutResponse.ok) {
        alert("Feil ved lagring av økt");
        return;
      }

      const workout: any = await workoutResponse.json();

      // Lagre alle øvelsene
      for (let i = 0; i < selectedExercises.length; i++) {
        const exercise = selectedExercises[i];
        await fetch("/api/workoutExercises", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workoutId: workout.id,
            exerciseId: exercise.id,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
          }),
        });
      }

      // Legg til i listen
      const nyOkt = {
        id: workout.id,
        type: workoutType,
        date: workoutDate,
        exercises: selectedExercises,
      };
      setCompletedWorkouts([nyOkt, ...completedWorkouts]);

      // Reset alt
      setWorkoutType("");
      setSelectedExercises([]);
      setWorkoutDate(new Date().toISOString().split("T")[0]);
      alert("Økt logget!");
    } catch (error) {
      console.error("Feil:", error);
      alert("Noe gikk galt");
    }
  };

  return (
    <div className="min-h-screen bg-[#EEEEEE] py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-7 text-center">
            Logg Treningsøkt
          </h1>
          <p className="text-gray-700 text-center mb-6">
            Registrer økten du har fullført
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Datovelger */}
            <div className="bg-white rounded-md shadow-md p-6 max-w-3xl mx-auto">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Velg dato
              </h2>
              <input
                type="date"
                value={workoutDate}
                onChange={(e) => setWorkoutDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#f15000]"
              />
            </div>

            {/* Velg type */}
            <WorkoutTypeSelector
              selectedType={workoutType}
              onSelectType={handleSelectType}
            />

            {/* Velg øvelser */}
            {workoutType && (
              <ExercisePicker
                workoutType={workoutType}
                onAddExercise={handleAddExercise}
              />
            )}

            {/* Workout builder */}
            {workoutType && (
              <WorkoutBuilder
                selectedExercises={selectedExercises}
                onUpdateExercise={handleUpdateExercise}
                onRemoveExercise={handleRemoveExercise}
                onSaveWorkout={handleLogWorkout}
                workoutType={workoutType}
                buttonText="Logg Økt"
              />
            )}
          </div>

          {/* Liste over økter jeg har logget */}
          <div>
            <div className="bg-white rounded-md shadow-md p-6 max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Nylig loggede økter
              </h2>

              {completedWorkouts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Ingen loggede økter ennå
                </p>
              ) : (
                <div className="space-y-4">
                  {completedWorkouts.map((workout) => (
                    <div
                      key={workout.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-lg text-gray-800">
                          {workout.type}
                        </h3>
                        <span className="text-sm text-gray-600">
                          {new Date(workout.date).toLocaleDateString("no-NO")}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium mb-1">Øvelser:</p>
                        <ul className="list-disc list-inside">
                          {workout.exercises.map((ex, idx) => (
                            <li key={idx}>
                              {ex.name} - {ex.sets} sett x {ex.reps} reps
                              {ex.weight > 0 && ` @ ${ex.weight}kg`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
