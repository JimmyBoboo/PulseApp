import { sqliteTable, text, integer, real, int } from "drizzle-orm/sqlite-core";

// USERS TABLE
export const usersTable = sqliteTable("users", {
  id: int("id").primaryKey({
    autoIncrement: true,
  }),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

// EXERCISES TABLE
export const exercisesTable = sqliteTable("exercises", {
  id: int("id").primaryKey({
    autoIncrement: true,
  }),
  name: text("name").notNull().unique(),
});

// WORKOUTS TABLE
export const workoutsTable = sqliteTable("workouts", {
  id: int("id").primaryKey({
    autoIncrement: true,
  }),
  userId: int("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  date: text("date").notNull(),
  isCompleted: integer("is_completed", { mode: "boolean" })
    .notNull()
    .default(false),
});

// WORKOUT_EXERCISES TABLE
export const workoutExercises = sqliteTable("workout_exercises", {
  id: int("id").primaryKey({
    autoIncrement: true,
  }),
  workoutId: int("workout_id")
    .notNull()
    .references(() => workoutsTable.id, { onDelete: "cascade" }),
  exerciseId: int("exercise_id")
    .notNull()
    .references(() => exercisesTable.id, { onDelete: "restrict" }),
  sets: integer("sets").notNull().default(3),
  reps: integer("reps"),
  weight: real("weight"),
});

// GOALS TABLE
export const goalsTable = sqliteTable("goals", {
  id: int("id").primaryKey({
    autoIncrement: true,
  }),
  userId: int("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  deadline: text("deadline"),
  isCompleted: integer("is_completed", { mode: "boolean" })
    .notNull()
    .default(false),
  completedAt: text("completed_at"),
});

// BADGES TABLE
export const badges = sqliteTable("badges", {
  id: int("id").primaryKey({
    autoIncrement: true,
  }),
  userId: int("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
});

export const schema = {
  usersTable,
  exercisesTable,
  workoutsTable,
  workoutExercises,
  goalsTable,
  badges,
};

// Fikk beskjed av veileder om å få KI til oversette Vårt gamle PostgreSQL schema til Drizzle ORM SQLite schema.
