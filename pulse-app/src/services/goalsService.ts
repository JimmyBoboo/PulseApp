import type { Goal, NewGoalInput } from "@/types/goals";

export const goalsService = {
  async fetchAll(): Promise<Goal[]> {
    const response = await fetch("/api/goals");
    if (!response.ok) throw new Error("Failed to fetch goals");
    return response.json();
  },

  async create(userId: number, goalData: NewGoalInput): Promise<Goal> {
    const response = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        description: goalData.description,
        deadline: goalData.deadline || null,
      }),
    });
    if (!response.ok) throw new Error("Failed to create goal");
    return response.json();
  },
  async update(goalId: number, updates: Partial<Goal>): Promise<Goal> {
    const Response = await fetch(`/api/goals/${goalId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!Response.ok) throw new Error("Failed to update goal");
    return Response.json();
  },

  async delete(goalId: number): Promise<void> {
    const response = await fetch(`/api/goals/${goalId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete goal");
  },
};
