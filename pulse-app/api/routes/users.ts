import { route } from "rwsdk/router";

// Dummy data
let users = [
  {
    id: 1,
    name: "Jimmy Hansen",
    email: "jimmy@example.com",
    createdAt: "2025-01-15",
  },
  {
    id: 2,
    name: "Anna Larsen",
    email: "anna@example.com",
    createdAt: "2025-02-20",
  },
];

// GET /api/users - Hent alle users
export const GET = route("/", async (req) => {
  return Response.json(users);
});

// GET /api/users/:id - Hent én user
export const GETById = route("/:id", async (req, { id }) => {
  const user = users.find((u) => u.id === parseInt(id));
  if (!user) {
    return Response.json({ error: "User ikke funnet" }, { status: 404 });
  }
  return Response.json(user);
});

// POST /api/users - Opprett ny user
export const POST = route("/", async (req) => {
  const body = await req.json();
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
    ...body,
    createdAt: new Date().toISOString().split("T")[0],
  };
  users.push(newUser);
  return Response.json(newUser, { status: 201 });
});

// PUT /api/users/:id - Oppdater user
export const PUT = route("/:id", async (req, { id }) => {
  const index = users.findIndex((u) => u.id === parseInt(id));
  if (index === -1) {
    return Response.json({ error: "User ikke funnet" }, { status: 404 });
  }
  const body = await req.json();
  users[index] = { ...users[index], ...body };
  return Response.json(users[index]);
});

// DELETE /api/users/:id - Slett user
export const DELETE = route("/:id", async (req, { id }) => {
  const index = users.findIndex((u) => u.id === parseInt(id));
  if (index === -1) {
    return Response.json({ error: "User ikke funnet" }, { status: 404 });
  }
  users.splice(index, 1);
  return Response.json({ message: "User slettet" });
});
