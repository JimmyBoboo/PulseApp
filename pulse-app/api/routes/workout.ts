/**
 * Workouts API Routes med Dummy Data
 */
import { route } from "rwsdk/router";

// Dummy data
let workouts = [
  {
    id: "1",
    userId: "1",
    type: "Styrke",
    reps: 10,
    vekt: 60,
    tid: 30,
    dato: "2025-10-10",
  },
  {
    id: "2",
    userId: "1",
    type: "Kondisjon",
    tid: 45,
    dato: "2025-10-12",
  },
  {
    id: "3",
    userId: "2",
    type: "Styrke",
    reps: 12,
    vekt: 50,
    tid: 25,
    dato: "2025-10-15",
  },
];

//Prøvde her å gjøre om til et mer redwoodsdk typ, men må finne ut hvordan.
// For workout.ts eksporterer ikke GetAllWorkouts. Lar den ligge, og jobber med dette neste gang...

// route("/api/workouts", async ({ request }) => {
//   get: () => {
//     return new Response(JSON.stringify(workouts), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   };
//   post: () => {
//     return new Response("Not implemented", { status: 501 });
//   };
// });

// GET - Hent alle workouts
export const getAllWorkouts = route("/api/workouts", async ({ request }) => {
  if (request.method === "GET") {
    return new Response(JSON.stringify(workouts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // POST - Opprett ny workout
  if (request.method === "POST") {
    try {
      const body = (await request.json()) as any;
      const newWorkout = {
        id: String(workouts.length + 1),
        ...body,
      };
      workouts.push(newWorkout);
      return new Response(JSON.stringify(newWorkout), {
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

// GET Hent én workout by Id
export const getWorkoutById = route(
  "/api/workouts/:id",
  async ({ request, params }) => {
    if (request.method === "GET") {
      const workout = workouts.find((w) => w.id === params.id);
      if (!workout) {
        return new Response(JSON.stringify({ error: "Workout not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify(workout), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // DELETE - Sletter workout
    if (request.method === "DELETE") {
      const index = workouts.findIndex((w) => w.id === params.id);
      if (index === -1) {
        return new Response(JSON.stringify({ error: "Workout not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      workouts.splice(index, 1);
      return new Response(JSON.stringify({ message: "Workout deleted" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Method not allowed", { status: 405 });
  }
);
