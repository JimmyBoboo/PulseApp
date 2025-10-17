import { integer, pgTable, varchar, uuid, timestamp, PgInteger, numeric, date } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255}).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true}).defaultNow().notNull(),
});

export const exersicesTable = pgTable("exercises", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true}).defaultNow().notNull(),
})

export const workoutsTable = pgTable("workouts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50}).notNull(),
  date: date("date").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true}).defaultNow().notNull(),
});

export const workoutExercises = pgTable("workout_exercises", {
  id: uuid("id").defaultRandom().primaryKey(),
  workoutId: uuid("workout_id").notNull().references(() => workoutsTable.id, { onDelete: "cascade" }),
  exerciseId: uuid("exercise_id").notNull().references(() => exersicesTable.id, { onDelete: "restrict" }),
  sets: integer("sets").notNull().default(3),
  reps: integer("reps"),
  weight: numeric("weight", {precision: 10, scale: 2}),

});

export const goalsTable = pgTable("goals", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  goalType: varchar("goal_type", { length: 50}).notNull(),
  value: numeric("value", {precision: 12, scale: 2}).notNull(),
  status: varchar("status", { length: 30}).notNull().default("active"),
  deadline: date("deadline")
})

export const badges = pgTable("badges", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  name: varchar("name", {length: 80 }).notNull(),
  awardedAt: timestamp("awarded_at", { withTimezone: true}).defaultNow().notNull(),
})
