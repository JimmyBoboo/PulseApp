import { route } from "rwsdk/router";
import { db } from "../../src/lib/db";
import { exercisesTable } from "../../src/db/schema";
import { eq } from "drizzle-orm";

// GET /api/exercises - Hent alle exercises
export const getAllExercises = route("/api/exercises", async ({ request }) => {
  if (request.method === "GET") {
    try {
      const allExercises = await db.select().from(exercisesTable);
      return new Response(JSON.stringify(allExercises), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching exercises:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch exercises" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  // POST - Opprett ny exercise
  if (request.method === "POST") {
    try {
      const body = (await request.json()) as any;
      const newExercise = await db
        .insert(exercisesTable)
        .values({
          ...body,
        })
        .returning();

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
      try {
        const exercise = await db
          .select()
          .from(exercisesTable)
          .where(eq(exercisesTable.id, parseInt(params.id)))
          .limit(1);

        if (!exercise || exercise.length === 0) {
          return new Response(JSON.stringify({ error: "Exercise not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify(exercise[0]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error fetching exercise:", error);
        return new Response(
          JSON.stringify({ error: "Failed to fetch exercise" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // PUT - Oppdater exercise
    if (request.method === "PUT") {
      try {
        const body = (await request.json()) as any;
        const updated = await db
          .update(exercisesTable)
          .set(body)
          .where(eq(exercisesTable.id, parseInt(params.id)))
          .returning();

        if (!updated || updated.length === 0) {
          return new Response(JSON.stringify({ error: "Exercise not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify(updated[0]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error updating exercise:", error);
        return new Response(JSON.stringify({ error: "Invalid data" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // DELETE - Slett exercise
    if (request.method === "DELETE") {
      try {
        const deleted = await db
          .delete(exercisesTable)
          .where(eq(exercisesTable.id, parseInt(params.id)))
          .returning();

        if (!deleted || deleted.length === 0) {
          return new Response(JSON.stringify({ error: "Exercise not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ message: "Exercise deleted" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error deleting exercise:", error);
        return new Response(
          JSON.stringify({ error: "Failed to delete exercise" }),
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
