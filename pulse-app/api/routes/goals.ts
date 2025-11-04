/**
 * Goals API Routes - Koblet til Database
 */
import { route } from "rwsdk/router";
import { db } from "../../src/lib/db";
import { goalsTable } from "../../src/db/schema";
import { eq } from "drizzle-orm";

// GET /api/goals - Hent alle goals
export const getAllGoals = route("/api/goals", async ({ request }) => {
  if (request.method === "GET") {
    try {
      const allGoals = await db.select().from(goalsTable);
      return new Response(JSON.stringify(allGoals), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching goals:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch goals" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // POST /api/goals - Opprett ny goal
  if (request.method === "POST") {
    try {
      const body = (await request.json()) as any;
      const newGoal = await db
        .insert(goalsTable)
        .values({
          userId: body.userId,
          goalType: body.goalType,
          value: body.value,
          status: body.status || "active",
          deadline: body.deadline || null,
        })
        .returning();

      return new Response(JSON.stringify(newGoal[0]), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error creating goal:", error);
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
    if (request.method === "GET") {
      try {
        const goal = await db
          .select()
          .from(goalsTable)
          .where(eq(goalsTable.id, parseInt(params.id)))
          .limit(1);

        if (!goal || goal.length === 0) {
          return new Response(JSON.stringify({ error: "Goal not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify(goal[0]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error fetching goal:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch goal" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // PUT - Oppdater goal
    if (request.method === "PUT") {
      try {
        const body = (await request.json()) as any;
        const updated = await db
          .update(goalsTable)
          .set(body)
          .where(eq(goalsTable.id, parseInt(params.id)))
          .returning();

        if (!updated || updated.length === 0) {
          return new Response(JSON.stringify({ error: "Goal not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify(updated[0]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error updating goal:", error);
        return new Response(JSON.stringify({ error: "Invalid data" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // DELETE - Slett goal
    if (request.method === "DELETE") {
      try {
        const deleted = await db
          .delete(goalsTable)
          .where(eq(goalsTable.id, parseInt(params.id)))
          .returning();

        if (!deleted || deleted.length === 0) {
          return new Response(JSON.stringify({ error: "Goal not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ message: "Goal deleted" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error deleting goal:", error);
        return new Response(
          JSON.stringify({ error: "Failed to delete goal" }),
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
