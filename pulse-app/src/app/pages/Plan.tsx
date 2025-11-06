"use client";

import { useState } from "react";
import { WorkoutTypeSelector } from "@/app/components/WorkoutTypeSelector";
import { ExercisePicker } from "@/app/components/ExercisePicker";
import { WorkoutBuilder } from "@/app/components/WorkoutBuilder";

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

  const handleSelectType = (type: string) => {
    setWorkoutType(type);
    setSelectedExercises([]); // Reset exercises when changing type
  };

  const handleAddExercise = (exerciseId: number, exerciseName: string) => {
    // Sjekk om øvelsen allerede er lagt til
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
      // Først lagre workout
      const workoutResponse = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 1, // Hardcoded for now
          type: workoutType,
          date: new Date().toISOString().split("T")[0],
        }),
      });

      if (workoutResponse.ok) {
        const workout = (await workoutResponse.json()) as { id: number };

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

        // Reset state
        setWorkoutType("");
        setSelectedExercises([]);
        alert("Økt lagret! 🎉");
      }
    } catch (error) {
      console.error("Failed to save workout:", error);
      alert("Noe gikk galt ved lagring av økt");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Treningsplanlegger
          </h1>
          <p className="text-xl text-gray-600">
            Velg type økt og bygg din treningsplan
          </p>
        </div>

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
      </div>
    </div>
  );
};
