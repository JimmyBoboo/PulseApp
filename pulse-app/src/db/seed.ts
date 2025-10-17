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

//Koble database connection
const pool = new Pool({
  connectionString: "postgresql://postgres:Kakemann123@localhost:5432/pulse",
});

const db = drizzle(pool);

async function seed() {
  console.log("Starting Seeding..");

  //Lager mock data for bruker, sett inn
  const [user] = await db
    .insert(usersTable)
    .values({
      name: "Jimmy",
      age: 21,
      email: "Jimmycool123@gmail.com",
      passwordHash: "HoleInOne123",
    })
    .returning({ id: usersTable.id });

  //Setter inn ovelser
  const [PushUps, PullUps, Squats] = await db
    .insert(exercisesTable)
    .values([{ name: "Push Ups" }, { name: "Pull Ups" }, { name: "Squats" }])
    .returning({ id: exercisesTable.id });

  //Setter inn en treningsokt
  const [workout] = await db
    .insert(workoutsTable)
    .values({
      userId: user.id.toString(),
      type: "Full body",
      date: new Date().toISOString().slice(0, 10),
    })
    .returning({ id: workoutsTable.id });

  //Knytter sammen ovelser til okten
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
  //Setter inn mal
  await db.insert(goalsTable).values({
    userId: user.id.toString(),
    goalType: "Fat Loss",
    value: "50",
    status: "active",
    deadline: "2025-11-30",
  });
  //Tildeler badge
  await db.insert(badges).values({
    userId: user.id.toString(),
    name: "First Workout Completed",
  });

  console.log("Seeding is done.");
  await pool.end();
}

seed().catch((error) => {
  console.error("Error during seeding", error);
  pool.end();
});

// Under oppretting av seeden fikk jeg opp en feilmelding på user.id i flere av insert kallene.
// Feilmeldingen var vanskelig å tolke og pekte direkte ikke på årsaken.
// Brukte KI for tidseffektivitet og fikk forslag om å konvertere user.id til string ved bruk av toString() metoden.
