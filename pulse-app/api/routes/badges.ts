import { route } from "rwsdk/router";

// Dummy data
let badges = [
  {
    id: "1",
    userId: "1",
    name: "First Workout",
    description: "Fullført første treningsøkt",
    awardedAt: "2025-10-10",
  },
  {
    id: "2",
    userId: "1",
    name: "10 Workouts",
    description: "Fullført 10 treningsøkter",
    awardedAt: "2025-10-15",
  },
  {
    id: "3",
    userId: "2",
    name: "First Goal",
    description: "Satt første mål",
    awardedAt: "2025-10-12",
  },
];

// GET /api/badges - Hent alle badges
export const getAllBadges = route("/api/badges", async ({ request }) => {
  if (request.method === "GET") {
    return new Response(JSON.stringify(badges), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // POST - Tildeler en ny badge
  if (request.method === "POST") {
    try {
      const body = (await request.json()) as any;
      const newBadge = {
        id: String(badges.length + 1),
        ...body,
        awardedAt: new Date().toISOString().split("T")[0],
      };
      badges.push(newBadge);
      return new Response(JSON.stringify(newBadge), {
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

// GET - Hent en badge
export const getBadgeById = route(
  "/api/badges/:id",
  async ({ request, params }) => {
    if (request.method === "GET") {
      const badge = badges.find((b) => b.id === params.id);
      if (!badge) {
        return new Response(JSON.stringify({ error: "Badge not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify(badge), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // DELETE - Slett badge
    if (request.method === "DELETE") {
      const index = badges.findIndex((b) => b.id === params.id);
      if (index === -1) {
        return new Response(JSON.stringify({ error: "Badge not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      badges.splice(index, 1);
      return new Response(JSON.stringify({ message: "Badge deleted" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Method not allowed", { status: 405 });
  }
);
