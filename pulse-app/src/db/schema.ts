import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// USERS TABLE
export const usersTable = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .default(sql`lower(hex(randomblob(16)))`),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

// EXERCISES TABLE
export const exercisesTable = sqliteTable("exercises", {
  id: text("id")
    .primaryKey()
    .default(sql`lower(hex(randomblob(16)))`),
  name: text("name").notNull().unique(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

// WORKOUTS TABLE
export const workoutsTable = sqliteTable("workouts", {
  id: text("id")
    .primaryKey()
    .default(sql`lower(hex(randomblob(16)))`),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  date: text("date").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

// WORKOUT_EXERCISES TABLE
export const workoutExercises = sqliteTable("workout_exercises", {
  id: text("id")
    .primaryKey()
    .default(sql`lower(hex(randomblob(16)))`),
  workoutId: text("workout_id")
    .notNull()
    .references(() => workoutsTable.id, { onDelete: "cascade" }),
  exerciseId: text("exercise_id")
    .notNull()
    .references(() => exercisesTable.id, { onDelete: "restrict" }),
  sets: integer("sets").notNull().default(3),
  reps: integer("reps"),
  weight: real("weight"),
});

// GOALS TABLE
export const goalsTable = sqliteTable("goals", {
  id: text("id")
    .primaryKey()
    .default(sql`lower(hex(randomblob(16)))`),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  goalType: text("goal_type").notNull(),
  value: real("value").notNull(),
  status: text("status").notNull().default("active"),
  deadline: text("deadline"),
});

// BADGES TABLE
export const badges = sqliteTable("badges", {
  id: text("id")
    .primaryKey()
    .default(sql`lower(hex(randomblob(16)))`),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  awardedAt: text("awarded_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const schema = {
  usersTable,
  exercisesTable,
  workoutsTable,
  workoutExercises,
  goalsTable,
  badges,
};
