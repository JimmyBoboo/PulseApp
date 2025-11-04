import { route } from "rwsdk/router";
import { db } from "../../src/lib/db";
import { badges } from "../../src/db/schema";
import { eq } from "drizzle-orm";

// GET /api/badges - Hent alle badges
export const getAllBadges = route("/api/badges", async ({ request }) => {
  if (request.method === "GET") {
    try {
      const allBadges = await db.select().from(badges);
      return new Response(JSON.stringify(allBadges), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching badges:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch badges" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // POST - Tildeler en ny badge
  if (request.method === "POST") {
    try {
      const body = (await request.json()) as any;
      const newBadge = await db
        .insert(badges)
        .values({
          userId: body.userId,
          name: body.name,
        })
        .returning();

      return new Response(JSON.stringify(newBadge[0]), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error creating badge:", error);
      return new Response(JSON.stringify({ error: "Invalid data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response("Method not allowed", { status: 405 });
});

// GET - Hent en badge
export const getBadgeById = route(
  "/api/badges/:id",
  async ({ request, params }) => {
    if (request.method === "GET") {
      try {
        const badge = await db
          .select()
          .from(badges)
          .where(eq(badges.id, parseInt(params.id)))
          .limit(1);

        if (!badge || badge.length === 0) {
          return new Response(JSON.stringify({ error: "Badge not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify(badge[0]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error fetching badge:", error);
        return new Response(
          JSON.stringify({ error: "Failed to fetch badge" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // DELETE - Slett badge
    if (request.method === "DELETE") {
      try {
        const deleted = await db
          .delete(badges)
          .where(eq(badges.id, parseInt(params.id)))
          .returning();

        if (!deleted || deleted.length === 0) {
          return new Response(JSON.stringify({ error: "Badge not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ message: "Badge deleted" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error deleting badge:", error);
        return new Response(
          JSON.stringify({ error: "Failed to delete badge" }),
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
