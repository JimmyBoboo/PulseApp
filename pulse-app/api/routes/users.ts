/**
 * Users API Routes - Koblet til Database
 */
import { route } from "rwsdk/router";
import { db } from "../../src/lib/db";
import { usersTable } from "../../src/db/schema";
import { eq } from "drizzle-orm";

// GET /api/users - Hent alle users
export const getAllUsers = route("/api/users", async ({ request }) => {
  // GET - Hent alle users
  if (request.method === "GET") {
    try {
      const allUsers = await db.select().from(usersTable);
      return new Response(JSON.stringify(allUsers), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch users" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // POST - Oppretter ny user
  if (request.method === "POST") {
    try {
      const body = (await request.json()) as any;
      const newUser = await db
        .insert(usersTable)
        .values({
          name: body.name,
          age: body.age,
          email: body.email,
          passwordHash: body.passwordHash,
        })
        .returning();

      return new Response(JSON.stringify(newUser[0]), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error creating user:", error);
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
      try {
        const user = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.id, parseInt(params.id)))
          .limit(1);

        if (!user || user.length === 0) {
          return new Response(JSON.stringify({ error: "User not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify(user[0]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch user" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // PUT - Oppdater user
    if (request.method === "PUT") {
      try {
        const body = (await request.json()) as any;
        const updated = await db
          .update(usersTable)
          .set(body)
          .where(eq(usersTable.id, parseInt(params.id)))
          .returning();

        if (!updated || updated.length === 0) {
          return new Response(JSON.stringify({ error: "User not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify(updated[0]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error updating user:", error);
        return new Response(JSON.stringify({ error: "Invalid data" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // DELETE - Slett user
    if (request.method === "DELETE") {
      try {
        const deleted = await db
          .delete(usersTable)
          .where(eq(usersTable.id, parseInt(params.id)))
          .returning();

        if (!deleted || deleted.length === 0) {
          return new Response(JSON.stringify({ error: "User not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ message: "User deleted" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error deleting user:", error);
        return new Response(
          JSON.stringify({ error: "Failed to delete user" }),
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
