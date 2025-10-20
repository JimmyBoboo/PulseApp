import { route } from "rwsdk/router";

// Dummy data
let exercises = [
  {
    id: "1",
    name: "Benkpress",
    category: "Bryst",
    description: "Press vekt fra brystet",
  },
  {
    id: "2",
    name: "Squats",
    category: "Ben",
    description: "Knebøy med vekt",
  },
  {
    id: "3",
    name: "Løping",
    category: "Kondisjon",
    description: "Løp utendørs eller på tredemølle",
  },
];

// GET /api/exercises - Hent alle exercises
export const getAllExercises = route("/api/exercises", async ({ request }) => {
  if (request.method === "GET") {
    return new Response(JSON.stringify(exercises), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // POST - Opprett ny exercise
  if (request.method === "POST") {
    try {
      const body = (await request.json()) as any;
      const newExercise = {
        id: String(exercises.length + 1),
        ...body,
      };
      exercises.push(newExercise);
      return new Response(JSON.stringify(newExercise), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Invalid data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response("Method not allowed", { status: 405 });
});

// GET - Hent én exercise
export const getExerciseById = route(
  "/api/exercises/:id",
  async ({ request, params }) => {
    if (request.method === "GET") {
      const exercise = exercises.find((e) => e.id === params.id);
      if (!exercise) {
        return new Response(JSON.stringify({ error: "Exercise not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify(exercise), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // PUT - Oppdater exercise
    if (request.method === "PUT") {
      const index = exercises.findIndex((e) => e.id === params.id);
      if (index === -1) {
        return new Response(JSON.stringify({ error: "Exercise not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      try {
        const body = (await request.json()) as any;
        exercises[index] = { ...exercises[index], ...body };
        return new Response(JSON.stringify(exercises[index]), {
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

    // DELETE - Slett exercise
    if (request.method === "DELETE") {
      const index = exercises.findIndex((e) => e.id === params.id);
      if (index === -1) {
        return new Response(JSON.stringify({ error: "Exercise not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      exercises.splice(index, 1);
      return new Response(JSON.stringify({ message: "Exercise deleted" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Method not allowed", { status: 405 });
  }
);
