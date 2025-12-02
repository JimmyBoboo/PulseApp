import { route } from "rwsdk/router";
import { db } from "../../src/lib/db";
import { workoutExercises, exercisesTable } from "../../src/db/schema";
import { eq } from "drizzle-orm";

export const getWorkoutExercises = route(
  "/api/workoutExercises/:workoutId",
  async ({ request, params }) => {
    if (request.method === "GET") {
      try {
        const exercises = await db
          .select({
            id: workoutExercises.id,
            exerciseId: workoutExercises.exerciseId,
            exerciseName: exercisesTable.name,
            sets: workoutExercises.sets,
            reps: workoutExercises.reps,
            weight: workoutExercises.weight,
          })
          .from(workoutExercises)
          .innerJoin(
            exercisesTable,
            eq(workoutExercises.exerciseId, exercisesTable.id)
          )
          .where(eq(workoutExercises.workoutId, parseInt(params.workoutId)));

        return new Response(JSON.stringify(exercises), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error fetching workout exercises:", error);
        return new Response(
          JSON.stringify({ error: "Failed to fetch workout exercises" }),
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

export const addExerciseToWorkout = route(
  "/api/workoutExercises",
  async ({ request }) => {
    if (request.method === "POST") {
      try {
        const body = (await request.json()) as any;
        console.log("Adding exercise to workout:", body);

        const newWorkoutExercise = await db
          .insert(workoutExercises)
          .values({
            workoutId: body.workoutId,
            exerciseId: body.exerciseId,
            sets: body.sets,
            reps: body.reps,
            weight: body.weight,
          })
          .returning();

        console.log("Exercise added:", newWorkoutExercise[0]);

        return new Response(JSON.stringify(newWorkoutExercise[0]), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error adding exercise to workout:", error);
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
  }
);

export const deleteWorkoutExercise = route(
  "/api/workoutExercises/:id",
  async ({ request, params }) => {
    if (request.method === "DELETE") {
      try {
        await db
          .delete(workoutExercises)
          .where(eq(workoutExercises.id, parseInt(params.id)));

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error deleting workout exercise:", error);
        return new Response(JSON.stringify({ error: "Failed to delete" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response("Method not allowed", { status: 405 });
  }
);
