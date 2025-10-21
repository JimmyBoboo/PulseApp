/**
 * Goals API Routes med Dummy Data
 */
import { route } from "rwsdk/router";

// Dummy data (in-memory)
let goals = [
  {
    id: "1",
    userId: "1",
    title: "Løp 5km",
    target: 5,
    current: 3,
    unit: "km",
    deadline: "2025-12-31",
    completed: false,
  },
  {
    id: "2",
    userId: "1",
    title: "Benkpress 100kg",
    target: 100,
    current: 80,
    unit: "kg",
    deadline: "2025-11-30",
    completed: false,
  },
  {
    id: "3",
    userId: "2",
    title: "Tren 3x per uke",
    target: 12,
    current: 8,
    unit: "økter",
    deadline: "2025-11-15",
    completed: false,
  },
];

// GET /api/goals - Hent alle goals
export const getAllGoals = route("/api/goals", async ({ request }) => {
  if (request.method === "GET") {
    return new Response(JSON.stringify(goals), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // POST /api/goals - Opprett ny goal
  if (request.method === "POST") {
    try {
      const body = (await request.json()) as any;
      const newGoal = {
        id: String(goals.length + 1),
        completed: false,
        current: 0,
        ...body,
      };
      goals.push(newGoal);
      return new Response(JSON.stringify(newGoal), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Ugyldig data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response("Method not allowed", { status: 405 });
});

// GET - Hent én goal by Id
export const getGoalById = route(
  "/api/goals/:id",
  async ({ request, params }) => {
    const goal = goals.find((g) => g.id === params.id);

    if (request.method === "GET") {
      if (!goal) {
        return new Response(JSON.stringify({ error: "Goal not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify(goal), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // PUT - Oppdater goal
    if (request.method === "PUT") {
      const index = goals.findIndex((g) => g.id === params.id);
      if (index === -1) {
        return new Response(JSON.stringify({ error: "Goal not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      try {
        const body = (await request.json()) as any;
        goals[index] = { ...goals[index], ...body };
        // Sjekk om målet er nådd
        if (goals[index].current >= goals[index].target) {
          goals[index].completed = true;
        }
        return new Response(JSON.stringify(goals[index]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: "Invalid data" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // DELETE - Slett goal
    if (request.method === "DELETE") {
      const index = goals.findIndex((g) => g.id === params.id);
      if (index === -1) {
        return new Response(JSON.stringify({ error: "Goal not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      goals.splice(index, 1);
      return new Response(JSON.stringify({ message: "Goal deleted" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Method not allowed", { status: 405 });
  }
);
