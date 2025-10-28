import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  usersTable,
  exercisesTable,
  workoutExercises,
  workoutsTable,
  goalsTable,
  badges,
} from "../src/db/schema";

// Use DATABASE_URL from environment
const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:Kakemann123@postgres:5432/pulse";

console.log(
  "🔌 Connecting to:",
  connectionString.includes("@postgres:") ? "Docker network" : "localhost"
);

const pool = new Pool({ connectionString });
const db = drizzle(pool);

async function seed() {
  console.log("🌱 Starting seed...");

  const [user] = await db
    .insert(usersTable)
    .values({
      name: "Jimmy",
      age: 21,
      email: "Jimmycool123@gmail.com",
      passwordHash: "HoleInOne123",
    })
    .returning({ id: usersTable.id });

  console.log("✅ Created user:", user.id);

  const [pushUps, pullUps, squats] = await db
    .insert(exercisesTable)
    .values([{ name: "Push Ups" }, { name: "Pull Ups" }, { name: "Squats" }])
    .returning({ id: exercisesTable.id });

  const [workout] = await db
    .insert(workoutsTable)
    .values({
      userId: user.id,
      type: "Full body",
      date: new Date().toISOString().slice(0, 10),
    })
    .returning({ id: workoutsTable.id });

  await db.insert(workoutExercises).values([
    {
      workoutId: workout.id.toString(),
      exerciseId: pushUps.id.toString(),
      sets: 4,
      reps: 15,
      weight: null,
    },
    {
      workoutId: workout.id.toString(),
      exerciseId: pullUps.id.toString(),
      sets: 5,
      reps: 5,
      weight: null,
    },
    {
      workoutId: workout.id.toString(),
      exerciseId: squats.id.toString(),
      sets: 4,
      reps: 20,
      weight: 50,
    },
  ]);

  await db.insert(goalsTable).values({
    userId: user.id,
    goalType: "Fat Loss",
    value: 50,
    status: "active",
    deadline: "2025-11-30",
  });

  await db.insert(badges).values({
    userId: user.id,
    name: "First Workout Completed",
  });

  console.log("✅ Seeding complete");
}

seed()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
