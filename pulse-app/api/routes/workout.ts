/**
 * Workouts API Routes - Koblet til Database
 */
import { route } from "rwsdk/router";
import { db } from "../../src/lib/db";
import { workoutsTable, workoutExercises } from "../../src/db/schema";
import { eq } from "drizzle-orm";

// GET - Hent alle workouts
export const getAllWorkouts = route("/api/workouts", async ({ request }) => {
  if (request.method === "GET") {
    try {
      const allWorkouts = await db.select().from(workoutsTable);
      return new Response(JSON.stringify(allWorkouts), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching workouts:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch workouts" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  // POST - Opprett ny workout
  if (request.method === "POST") {
    try {
      const body = (await request.json()) as any;
      console.log("Received workout data:", body);

      const newWorkout = await db
        .insert(workoutsTable)
        .values({
          userId: body.userId,
          type: body.type,
          date: body.date,
        })
        .returning();

      console.log("Workout created:", newWorkout[0]);

      return new Response(JSON.stringify(newWorkout[0]), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error creating workout:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return new Response(
        JSON.stringify({ error: "Invalid data", details: String(error) }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  return new Response("Method not allowed", { status: 405 });
});

// GET Hent én workout by Id
export const getWorkoutById = route(
  "/api/workouts/:id",
  async ({ request, params }) => {
    if (request.method === "GET") {
      try {
        const workout = await db
          .select()
          .from(workoutsTable)
          .where(eq(workoutsTable.id, parseInt(params.id)))
          .limit(1);

        if (!workout || workout.length === 0) {
          return new Response(JSON.stringify({ error: "Workout not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify(workout[0]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error fetching workout:", error);
        return new Response(
          JSON.stringify({ error: "Failed to fetch workout" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // DELETE - Sletter workout
    if (request.method === "DELETE") {
      try {
        const deleted = await db
          .delete(workoutsTable)
          .where(eq(workoutsTable.id, parseInt(params.id)))
          .returning();

        if (!deleted || deleted.length === 0) {
          return new Response(JSON.stringify({ error: "Workout not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ message: "Workout deleted" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error deleting workout:", error);
        return new Response(
          JSON.stringify({ error: "Failed to delete workout" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    return new Response("Method not allowed", { status: 405 });
  }
);
