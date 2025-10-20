import { route } from "rwsdk/router";

// Dummy data
let exercises = [
  {
    id: 1,
    name: "Benkpress",
    category: "Bryst",
    description: "Press vekt fra brystet",
  },
  { id: 2, name: "Squats", category: "Ben", description: "Knebøy med vekt" },
  {
    id: 3,
    name: "Løping",
    category: "Kondisjon",
    description: "Løp utendørs eller på tredemølle",
  },
];

// GET /api/exercises - Hent alle exercises
export const GET = route("/", async (req) => {
  return Response.json(exercises);
});

// GET /api/exercises/:id - Hent én exercise
export const GETById = route("/:id", async (req, { id }) => {
  const exercise = exercises.find((e) => e.id === parseInt(id));
  if (!exercise) {
    return Response.json({ error: "Exercise ikke funnet" }, { status: 404 });
  }
  return Response.json(exercise);
});

// POST /api/exercises - Opprett ny exercise
export const POST = route("/", async (req) => {
  const body = await req.json();
  const newExercise = {
    id: exercises.length > 0 ? Math.max(...exercises.map((e) => e.id)) + 1 : 1,
    ...body,
  };
  exercises.push(newExercise);
  return Response.json(newExercise, { status: 201 });
});

// PUT /api/exercises/:id - Oppdater exercise
export const PUT = route("/:id", async (req, { id }) => {
  const index = exercises.findIndex((e) => e.id === parseInt(id));
  if (index === -1) {
    return Response.json({ error: "Exercise ikke funnet" }, { status: 404 });
  }
  const body = await req.json();
  exercises[index] = { ...exercises[index], ...body };
  return Response.json(exercises[index]);
});

// DELETE /api/exercises/:id - Slett exercise
export const DELETE = route("/:id", async (req, { id }) => {
  const index = exercises.findIndex((e) => e.id === parseInt(id));
  if (index === -1) {
    return Response.json({ error: "Exercise ikke funnet" }, { status: 404 });
  }
  exercises.splice(index, 1);
  return Response.json({ message: "Exercise slettet" });
});
