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

export const seedData = async (env?: any) => {
  try {
    const db = drizzle(env?.DB ?? WorkerEnv.DB);

    console.log("🌱 Starting seed...");

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

    console.log("✅ Created exercises");

    // Opprett workout
    const [workout] = await db
      .insert(workoutsTable)
      .values({
        userId: user.id,
        type: "Full body",
        date: new Date().toISOString().slice(0, 10),
      })
      .returning({ id: workoutsTable.id });

    console.log("✅ Created workout:", workout.id);

    // Koble exercises til workout
    await db.insert(workoutExercises).values([
      {
        workoutId: workout.id,
        exerciseId: pushUps.id,
        sets: 4,
        reps: 15,
        weight: null,
      },
      {
        workoutId: workout.id,
        exerciseId: pullUps.id,
        sets: 5,
        reps: 5,
        weight: null,
      },
      {
        workoutId: workout.id,
        exerciseId: squats.id,
        sets: 4,
        reps: 20,
        weight: 50,
      },
    ]);

    console.log("✅ Created workout exercises");

    // Opprett goal
    await db.insert(goalsTable).values({
      userId: user.id,
      goalType: "Fat Loss",
      value: 50,
      status: "active",
      deadline: "2025-11-30",
    });

    console.log("✅ Created goal");

    // Opprett badge
    await db.insert(badges).values({
      userId: user.id,
      name: "First Workout Completed",
    });

    console.log("✅ Created badge");

    // Hent badges for å verifisere (UTEN .all())
    const result = await db.select().from(badges);

    console.log("✅ Seeding complete - Created", result.length, "badges");
    console.log("🌱 Finished seeding");

    return result;
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
};

export default defineScript(async ({ env }) => {
  try {
    await seedData(env);
    return Response.json({
      success: true,
      message: "Database seeded successfully",
    });
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to seed database",
    });
  }
});
