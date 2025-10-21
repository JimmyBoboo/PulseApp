/**
 * Database Seed Script for PulseApp
 *
 * This script follows RedwoodSDK's recommended pattern for seeding databases.
 * It exports a default async function that will be run via `npm run seed`.
 *
 * RedwoodSDK uses 'rwsdk worker-run' which gives access to the app's environment,
 * including database connections and environment variables.
 */

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/postgres-js";
import {
  usersTable,
  exercisesTable,
  workoutExercises,
  workoutsTable,
  goalsTable,
  badges,
} from "./schema";

// Export default async function (required by RedwoodSDK's worker-run)
export default async () => {
  console.log("🌱 Starting database seeding...");

  // Database connection - bruker miljøvariabel eller fallback
  const connectionString =
    process.env.DATABASE_URL ||
    "postgresql://postgres:Kakemann123@localhost:5432/pulse";

  const pool = new Pool({ connectionString });
  const db = drizzle(pool);

  try {
    // Rydd opp først (valgfritt - fjern hvis du vil beholde eksisterende data)
    console.log("  → Clearing existing data...");
    await db.delete(workoutExercises);
    await db.delete(badges);
    await db.delete(goalsTable);
    await db.delete(workoutsTable);
    await db.delete(exercisesTable);
    await db.delete(usersTable);

    // 1. Lager mock data for bruker
    console.log("  → Creating user...");
    const [user] = await db
      .insert(usersTable)
      .values({
        name: "Jimmy",
        age: 21,
        email: "Jimmycool123@gmail.com",
        passwordHash: "HoleInOne123",
      })
      .returning({ id: usersTable.id });

    // 2. Setter inn øvelser
    console.log("  → Creating exercises...");
    const [PushUps, PullUps, Squats] = await db
      .insert(exercisesTable)
      .values([{ name: "Push Ups" }, { name: "Pull Ups" }, { name: "Squats" }])
      .returning({ id: exercisesTable.id });

    // 3. Setter inn en treningsøkt
    console.log("  → Creating workout session...");
    const [workout] = await db
      .insert(workoutsTable)
      .values({
        userId: user.id.toString(),
        type: "Full body",
        date: new Date().toISOString().slice(0, 10),
      })
      .returning({ id: workoutsTable.id });

    // 4. Knytter sammen øvelser til økten
    console.log("  → Linking exercises to workout...");
    await db.insert(workoutExercises).values([
      {
        workoutId: workout.id,
        exerciseId: PushUps.id,
        sets: 4,
        reps: 15,
        weight: null,
      },
      {
        workoutId: workout.id,
        exerciseId: PullUps.id,
        sets: 5,
        reps: 5,
        weight: null,
      },
      {
        workoutId: workout.id,
        exerciseId: Squats.id,
        sets: 4,
        reps: 20,
        weight: "50",
      },
    ]);

    // 5. Setter inn mål
    console.log("  → Creating goal...");
    await db.insert(goalsTable).values({
      userId: user.id.toString(),
      goalType: "Fat Loss",
      value: "50",
      status: "active",
      deadline: "2025-11-30",
    });

    // 6. Tildeler badge
    console.log("  → Awarding badge...");
    await db.insert(badges).values({
      userId: user.id.toString(),
      name: "First Workout Completed",
    });

    console.log("✔ Seeding completed successfully! 🎉");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error; // RedwoodSDK vil håndtere feilen
  } finally {
    await pool.end();
  }
};

/**
 * NOTATER:
 *
 * Type Conversion Issue:
 * Under oppretting av seeden fikk jeg opp en feilmelding på user.id i flere av insert kallene.
 * Feilmeldingen var vanskelig å tolke og pekte direkte ikke på årsaken.
 * Brukte KI for tidseffektivitet og fikk forslag om å konvertere user.id til string
 * ved bruk av toString() metoden.
 *
 * RedwoodSDK Pattern:
 * Følger RedwoodSDK sin anbefaling om å eksportere en default async function.
 * Dette gir tilgang til miljøvariabler via 'rwsdk worker-run' kommandoen.
 */
