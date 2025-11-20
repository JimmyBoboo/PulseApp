import { useState, useEffect } from "react";
import { goalsService } from "@/services/goalsService";
import type { Goal, NewGoalInput } from "@/types/goals";

export const useGoals = (userId: number | null) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const data = await goalsService.fetchAll();
      setGoals(data);
      setError(null);
    } catch (err) {
      setError("Feil ved henting av målet");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (goalData: NewGoalInput) => {
    if (!userId) {
      setError("Ingen bruker er funnet");
      return;
    }

    try {
      const newGoal = await goalsService.create(userId, goalData);
      setGoals([...goals, newGoal]);
      setError(null);
    } catch (err) {
      setError("Feil ved oppretting av målet");
      console.error(err);
    }
  };

  const toggleComplete = async (goalId: number) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    try {
      const updatedGoal = await goalsService.update(goalId, {
        isCompleted: !goal.isCompleted,
        completedAt: !goal.isCompleted ? new Date().toISOString() : null,
      });
      setGoals(goals.map((g) => (g.id === goalId ? updatedGoal : g)));
      setError(null);
    } catch (err) {
      setError("Feil ved oppdatering av målet");
      console.error(err);
    }
  };

  const deleteGoal = async (goalId: number) => {
    try {
      await goalsService.delete(goalId);
      setGoals(goals.filter((g) => g.id !== goalId));
      setError(null);
    } catch (err) {
      setError("Feil ved sletting av målet");
      console.error(err);
    }
  };

  return {
    goals,
    loading,
    error,
    addGoal,
    toggleComplete,
    deleteGoal,
  };
};
