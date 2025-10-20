import { route } from "rwsdk/router";

// Dummy data
let workouts = [
  {
    id: 1,
    userId: 1,
    type: "Styrke",
    reps: 10,
    vekt: 60,
    tid: 30,
    dato: "2025-10-10",
  },
  { id: 2, userId: 1, type: "Kondisjon", tid: 45, dato: "2025-10-12" },
  {
    id: 3,
    userId: 2,
    type: "Styrke",
    reps: 12,
    vekt: 50,
    tid: 25,
    dato: "2025-10-15",
  },
];

export default route("/api/workouts", {
  // GET - Henter alle workouts
  get: () => {
    return new Response(JSON.stringify(workouts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },

  // POST Opprett ny workout
  post: async ({ request }) => {
    try {
      const body = await request.json();
      const newWorkout = {
        id:
          workouts.length > 0 ? Math.max(...workouts.map((w) => w.id)) + 1 : 1,
        ...body,
      };
      workouts.push(newWorkout);
      return new Response(JSON.stringify(newWorkout), {
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

// GET - Hent én workout
export const getById = route("/api/workouts/:id", {
  get: ({ params }) => {
    const workout = workouts.find((w) => w.id === parseInt(params.id));
    if (!workout) {
      return new Response(JSON.stringify({ error: "Workout ikke funnet" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify(workout), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },

  // DELETE - Slett workout
  delete: ({ params }) => {
    const index = workouts.findIndex((w) => w.id === parseInt(params.id));
    if (index === -1) {
      return new Response(JSON.stringify({ error: "Workout ikke funnet" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    workouts.splice(index, 1);
    return new Response(JSON.stringify({ message: "Workout slettet" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
});
