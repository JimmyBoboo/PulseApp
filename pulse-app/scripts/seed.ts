import {
  usersTable,
  exercisesTable,
  workoutExercises,
  workoutsTable,
  goalsTable,
  badges,
} from "../src/db/schema";

import { defineScript } from "rwsdk/worker";
import { drizzle } from "drizzle-orm/d1";
import { env as WorkerEnv } from "cloudflare:workers";

// Use DATABASE_URL from environment



export const seedData = async (env?: Env) => {
  try {
    const db = drizzle(env?.DB ?? WorkerEnv.DB);


  // 🗑️ SLETT GAMMEL DATA FØRST
  console.log("🗑️  Clearing existing data...");
  await db.delete(badges);
  await db.delete(workoutExercises);
  await db.delete(goalsTable);
  await db.delete(workoutsTable);
  await db.delete(exercisesTable);
  await db.delete(usersTable);
  console.log("✅ Old data cleared");

  // Opprett ny bruker
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

  // Opprett exercises
  const [pushUps, pullUps, squats] = await db
    .insert(exercisesTable)
    .values([{ name: "Push Ups" }, { name: "Pull Ups" }, { name: "Squats" }])
    .returning({ id: exercisesTable.id });

  // Opprett workout
  const [workout] = await db
    .insert(workoutsTable)
    .values({
      userId: user.id,
      type: "Full body",
      date: new Date().toISOString().slice(0, 10),
    })
    .returning({ id: workoutsTable.id });

  // Koble exercises til workout
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

  // Opprett goal
  await db.insert(goalsTable).values({
    userId: user.id,
    goalType: "Fat Loss",
    value: 50,
    status: "active",
    deadline: "2025-11-30",
  });

  // Opprett badge
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

  
