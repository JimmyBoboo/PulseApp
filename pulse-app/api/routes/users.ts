/**
 * Users API Routes med Dummy Data
 */
import { route } from "rwsdk/router";

// Dummy data (in-memory)
let users = [
  {
    id: "1",
    name: "Jimmy Hansen",
    email: "jimmy@example.com",
    createdAt: "2025-01-15",
  },
  {
    id: "2",
    name: "Anna Larsen",
    email: "anna@example.com",
    createdAt: "2025-02-20",
  },
];

// GET /api/users - Hent alle users
export const getAllUsers = route("/api/users", async ({ request }) => {
  // GET - Hent alle users
  if (request.method === "GET") {
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // POST - Oppretter ny user
  if (request.method === "POST") {
    try {
      const body = (await request.json()) as any;
      const newUser = {
        id: String(users.length + 1),
        ...body,
        createdAt: new Date().toISOString().split("T")[0],
      };
      users.push(newUser);
      return new Response(JSON.stringify(newUser), {
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

// GET - Hent én user by Id
export const getUserById = route(
  "/api/users/:id",
  async ({ request, params }) => {
    if (request.method === "GET") {
      const user = users.find((u) => u.id === params.id);
      if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify(user), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // PUT - Oppdater user
    if (request.method === "PUT") {
      const index = users.findIndex((u) => u.id === params.id);
      if (index === -1) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      try {
        const body = (await request.json()) as any;
        users[index] = { ...users[index], ...body };
        return new Response(JSON.stringify(users[index]), {
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

    // DELETE - Slett user
    if (request.method === "DELETE") {
      const index = users.findIndex((u) => u.id === params.id);
      if (index === -1) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      users.splice(index, 1);
      return new Response(JSON.stringify({ message: "User deleted" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Method not allowed", { status: 405 });
  }
);
