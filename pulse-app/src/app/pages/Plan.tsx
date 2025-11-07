"use client";

import { useState } from "react";
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
}

export const Plan = () => {
  const [workoutType, setWorkoutType] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<
    SelectedExercise[]
  >([]);
  const [refreshWorkouts, setRefreshWorkouts] = useState(false);

  const handleSelectType = (type: string) => {
    setWorkoutType(type);
    setSelectedExercises([]); // Restarter valgte øvelser når type endres
  };

  const handleAddExercise = (exerciseId: number, exerciseName: string) => {
    // Sjekker om øvelsen er lagt inn fra før av..
    if (selectedExercises.some((ex) => ex.id === exerciseId)) {
      return;
    }

    setSelectedExercises([
      ...selectedExercises,
      {
        id: exerciseId,
        name: exerciseName,
        sets: 3,
        reps: 10,
        weight: 0,
      },
    ]);
  };

  const handleUpdateExercise = (
    id: number,
    field: "sets" | "reps" | "weight",
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
      // Sjekk først om vi har en bruker
      const usersResponse = await fetch("/api/users");
      if (!usersResponse.ok) {
        alert("Kunne ikke hente brukere");
        return;
      }
      const users = (await usersResponse.json()) as Array<{
        id: number;
        name: string;
      }>;
      console.log("Tilgjengelige brukere:", users);

      if (!users || users.length === 0) {
        alert("Ingen brukere funnet i databasen. Kjør seed-scriptet først!");
        return;
      }

      const userId = users[0].id; // Bruk første bruker

      // Først lagre workout
      const workoutData = {
        userId: userId,
        type: workoutType,
        date: new Date().toISOString().split("T")[0],
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
        alert("Økt lagret! 🎉");
      }
    } catch (error) {
      console.error("Failed to save workout:", error);
      alert("Noe gikk galt ved lagring av økt");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Treningsplanlegger
          </h1>
          <p className="text-xl text-gray-600">
            Velg type økt og bygg din treningsplan
          </p>
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
          <div>
            <SavedWorkouts onRefresh={refreshWorkouts} />
          </div>
        </div>
      </div>
    </div>
  );
};
