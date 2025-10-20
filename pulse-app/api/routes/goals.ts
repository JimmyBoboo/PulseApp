import { route } from "rwsdk/router";

// Dummy data
let goals = [
  {
    id: 1,
    userId: 1,
    title: "Løp 5km",
    target: 5,
    current: 3,
    unit: "km",
    deadline: "2025-12-31",
    completed: false,
  },
  {
    id: 2,
    userId: 1,
    title: "Benkpress 100kg",
    target: 100,
    current: 80,
    unit: "kg",
    deadline: "2025-11-30",
    completed: false,
  },
  {
    id: 3,
    userId: 2,
    title: "Tren 3x per uke",
    target: 12,
    current: 8,
    unit: "økter",
    deadline: "2025-11-15",
    completed: false,
  },
];

export default route("/api/goals", {
  // GET  - Hent alle goals
  get: () => {
    return new Response(JSON.stringify(goals), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },

  // POST - Opprett ny goal
  post: async ({ request }) => {
    try {
      const body = await request.json();
      const newGoal = {
        id: goals.length > 0 ? Math.max(...goals.map((g) => g.id)) + 1 : 1,
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
  },
});

// GET - Hent én goal
export const getById = route("/api/goals/:id", {
  get: ({ params }) => {
    const goal = goals.find((g) => g.id === parseInt(params.id));
    if (!goal) {
      return new Response(JSON.stringify({ error: "Goal ikke funnet" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify(goal), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },

  // PUT - Oppdater goal
  put: async ({ request, params }) => {
    const index = goals.findIndex((g) => g.id === parseInt(params.id));
    if (index === -1) {
      return new Response(JSON.stringify({ error: "Goal ikke funnet" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    try {
      const body = await request.json();
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
      return new Response(JSON.stringify({ error: "Ugyldig data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  },

  // DELETE - Slett goal
  delete: ({ params }) => {
    const index = goals.findIndex((g) => g.id === parseInt(params.id));
    if (index === -1) {
      return new Response(JSON.stringify({ error: "Goal ikke funnet" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    goals.splice(index, 1);
    return new Response(JSON.stringify({ message: "Goal slettet" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
});
