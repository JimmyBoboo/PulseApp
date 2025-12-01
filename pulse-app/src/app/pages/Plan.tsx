"use client";

import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { WorkoutTypeSelector } from "../components/WorkoutTypeSelector";
import { ExercisePicker } from "../components/ExercisePicker";
import { WorkoutBuilder } from "../components/WorkoutBuilder";
import { SavedWorkouts } from "../components/SavedWorkouts";

interface SelectedExercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  minutes?: number;
  distance?: number;
}

export const Plan = () => {
  const { user } = useAuth();
  const [workoutType, setWorkoutType] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<
    SelectedExercise[]
  >([]);
  const [refreshWorkouts, setRefreshWorkouts] = useState(false);

  const handleSelectType = (type: string) => {
    setWorkoutType(type);
    setSelectedExercises([]);
  };

  const handleAddExercise = (exerciseId: number, exerciseName: string) => {
    if (selectedExercises.some((ex) => ex.id === exerciseId)) {
      return;
    }

    // Sjekk om det er cardio-øvelse
    const isCardio = ["løping", "sykling", "roing"].some(
      (
        cardio // Fikk denne generert av ChatGPT
      ) => exerciseName.toLowerCase().includes(cardio)
    );

    setSelectedExercises([
      ...selectedExercises,
      {
        id: exerciseId,
        name: exerciseName,
        sets: isCardio ? 0 : 3,
        reps: isCardio ? 0 : 10,
        weight: isCardio ? 0 : 0,
        minutes: isCardio ? 30 : undefined,
        distance: isCardio ? 5 : undefined,
      },
    ]);
  };

  const handleUpdateExercise = (
    id: number,
    field: "sets" | "reps" | "weight" | "minutes" | "distance",
    value: number
  ) => {
    setSelectedExercises(
      selectedExercises.map((ex) =>
        ex.id === id ? { ...ex, [field]: value } : ex
      )
    );
  };

  const handleRemoveExercise = (id: number) => {
    setSelectedExercises(selectedExercises.filter((ex) => ex.id !== id));
  };

  const handleSaveWorkout = async () => {
    try {
      if (!user) {
        alert("Du må være innlogget for å lagre en økt");
        return;
      }

      const userId = user.id;

      // Først lagre workout
      const workoutData = {
        userId: userId,
        type: workoutType,
        date: new Date().toISOString().split("T")[0],
        isCompleted: false,
      };

      console.log("Sender workout data:", workoutData);

      const workoutResponse = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workoutData),
      });

      console.log("Workout response status:", workoutResponse.status);

      if (!workoutResponse.ok) {
        const errorText = await workoutResponse.text();
        console.error("Workout response error:", errorText);
        alert(`Feil ved lagring av økt: ${errorText}`);
        return;
      }

      if (workoutResponse.ok) {
        const workout = (await workoutResponse.json()) as { id: number };
        console.log("Workout lagret med ID:", workout.id);

        // Så lagre alle øvelsene til workout
        for (const exercise of selectedExercises) {
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

        // Tilbakestill state etter lagring
        setWorkoutType("");
        setSelectedExercises([]);
        setRefreshWorkouts(!refreshWorkouts); // Trigger refresh av SavedWorkouts
        alert("Økten er lagret!");
      }
    } catch (error) {
      console.error("Failed to save workout:", error);
      alert("Noe gikk galt ved lagring av økt");
    }
  };

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: "#EEEEEE" }}>
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Venstre kolonne: Opprett ny økt */}
          <div className="space-y-6">
            {/* Steg 1: Velg type økt */}
            <WorkoutTypeSelector
              selectedType={workoutType}
              onSelectType={handleSelectType}
            />

            {/* Steg 2: Velg øvelser (vises bare når type er valgt) */}
            {workoutType && (
              <ExercisePicker
                workoutType={workoutType}
                onAddExercise={handleAddExercise}
              />
            )}

            {/* Steg 3: Bygg workout med sets/reps/weight */}
            {workoutType && (
              <WorkoutBuilder
                selectedExercises={selectedExercises}
                onUpdateExercise={handleUpdateExercise}
                onRemoveExercise={handleRemoveExercise}
                onSaveWorkout={handleSaveWorkout}
                workoutType={workoutType}
              />
            )}
          </div>

          {/* Høyre kolonne: Lagrede økter */}
          <div className="flex justify-center">
            <SavedWorkouts onRefresh={refreshWorkouts} />
          </div>
        </div>
      </div>
    </div>
  );
};
