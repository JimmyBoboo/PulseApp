"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGoals } from "@/hooks/useGoals";
import type { NewGoalInput } from "@/interface/goals";

export const GoalsCard = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState<NewGoalInput>({
    description: "",
    deadline: null,
  });

  const { goals, loading, error, addGoal, toggleComplete, deleteGoal } =
    useGoals(user?.id || null);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.description.trim()) return;

    await addGoal(newGoal);
    setNewGoal({ description: "", deadline: null });
    setShowForm(false);
  };

  const handleDeleteGoal = async (goalId: number) => {
    if (!confirm("Er du sikker på at du vil slette dette målet?")) return;
    await deleteGoal(goalId);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("no-NO");
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">Laster mål...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Mine Mål</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          {showForm ? "Avbryt" : "+ Nytt Mål"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddGoal} className="mb-4 p-4 bg-gray-50 rounded">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Beskrivelse
            </label>
            <input
              type="text"
              value={newGoal.description}
              onChange={(e) =>
                setNewGoal({ ...newGoal, description: e.target.value })
              }
              placeholder="F.eks. Ønsker å gå ned 15kg"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frist
            </label>
            <input
              type="date"
              value={newGoal.deadline || ""}
              onChange={(e) =>
                setNewGoal({ ...newGoal, deadline: e.target.value || null })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Legg til
          </button>
        </form>
      )}

      <div className="space-y-3">
        {goals.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Ingen mål er satt enda. Sett i gang!
          </p>
        ) : (
          goals.map((goal) => (
            <div
              key={goal.id}
              className={`p-4 border rounded-lg ${
                goal.isCompleted
                  ? "bg-green-50 border-green-300"
                  : "bg-white border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      goal.isCompleted
                        ? "line-through text-gray-500"
                        : "text-gray-800"
                    }`}
                  >
                    {goal.description}
                  </p>
                  {goal.deadline && (
                    <p className="text-sm text-gray-600 mt-1">
                      Frist: {formatDate(goal.deadline)}
                    </p>
                  )}
                  {goal.isCompleted && goal.completedAt && (
                    <p className="text-sm text-green-600 mt-1">
                      Fullført: {formatDate(goal.completedAt)}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => toggleComplete(goal.id)} // KI genererte denne button funksjonen.
                    className={`px-3 py-1 text-sm rounded ${
                      goal.isCompleted
                        ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
                        : "bg-green-500 text-white hover:bg-green-600"
                    } transition`}
                  >
                    {goal.isCompleted ? "Angre" : "Fullfør"}
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Slett
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
