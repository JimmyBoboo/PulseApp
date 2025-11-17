import { render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";

import { Document } from "@/app/Document";
import { setCommonHeaders } from "@/app/headers";
import { Home } from "@/app/pages/Home";
import { About } from "@/app/pages/About";
import { Stats } from "@/app/pages/Stats";
import { Plan } from "@/app/pages/Plan";
import { Profile } from "@/app/pages/Profile";
import { Login } from "@/app/pages/Login";
import { LogWorkout } from "@/app/pages/LogWorkout";
import Register from "@/app/pages/Register";

// Import API Routes
import { getAllGoals, getGoalById } from "../api/routes/goals";
import { getAllUsers, getUserById } from "../api/routes/users";
import { getAllWorkouts, getWorkoutById } from "../api/routes/workout";
import { getAllExercises, getExerciseById } from "../api/routes/exercises";
import { getAllBadges, getBadgeById } from "../api/routes/badges";
import {
  getWorkoutExercises,
  addExerciseToWorkout,
  deleteWorkoutExercise,
} from "../api/routes/workoutExercises";

export type AppContext = {};

export default defineApp([
  setCommonHeaders(),
  ({ ctx }) => {
    // setup ctx here
    ctx;
  },

  // API Routes
  getAllGoals,
  getGoalById,

  // Users API
  getAllUsers,
  getUserById,

  // Workouts API
  getAllWorkouts,
  getWorkoutById,

  // Exercises API
  getAllExercises,
  getExerciseById,

  // Badges API
  getAllBadges,
  getBadgeById,

  // Workout Exercises API
  getWorkoutExercises,
  addExerciseToWorkout,
  deleteWorkoutExercise,

  // Page Routes
  render(Document, [
    route("/", Home),
    route("/about", About),
    route("/stats", Stats),
    route("/plan", Plan),
    route("/profile", Profile),
    route("/login", Login),
    route("/log-workout", LogWorkout),
    route("/register", Register),
  ]),
]);
