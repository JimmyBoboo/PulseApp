# API Routing Problemløsning - Dokumentasjon

**Dato:** 20. oktober 2025  
**Problem:** REST API endpoints returnerte 404 Not Found  
**Løsning:** Fikset route syntaks og registrering

---

## 🔴 Problemet

Når jeg prøvde å åpne `http://localhost:5173/api/goals` fikk jeg:

- **404 Not Found**
- **Røde TypeScript feil** i VS Code

---

## 🔍 Rotårsak Analyse

### Problem 1: Feil Route Syntaks

**Hva som IKKE fungerer i RedwoodSDK:**

```typescript
// ❌ FEIL SYNTAKS
export default route("/api/goals", {
  get: () => {
    return new Response(JSON.stringify(goals), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
  post: async ({ request }) => {
    const body = await request.json();
    // ...
  },
});
```

**Hvorfor fungerer det ikke?**

1. RedwoodSDK sin `route()` funksjon tar **kun 2 parametere**:

   - Parameter 1: `path` (string) - URL path
   - Parameter 2: `handler` (function) - En enkelt funksjon som håndterer requesten

2. `route()` forventer **IKKE** et object med `get`, `post`, `put`, `delete` properties
3. Dette er syntaks fra andre frameworks (som Hono), ikke RedwoodSDK

**TypeScript feil vi fikk:**

```
Object literal may only specify known properties,
and 'get' does not exist in type 'RouteHandler'
```

---

### Problem 2: Feil Parameter Struktur

**Hva som IKKE fungerer:**

```typescript
// ❌ FEIL - To separate parametere
export const GETById = route("/:id", async (req, { id }) => {
  const user = users.find((u) => u.id === parseInt(id));
  // ...
});
```

**Hvorfor fungerer det ikke?**

1. RedwoodSDK sender kun **ETT parameter object** til handler funksjonen
2. Parameteret inneholder: `{ request, params, ctx }`
3. Man kan ikke "destructure" to separate parametere

**TypeScript feil:**

```
Target signature provides too few arguments. Expected 2 or more, but got 1.
```

---

### Problem 3: Routes ikke registrert i worker.tsx

**Problemet:**

```typescript
// worker.tsx
export default defineApp([
  setCommonHeaders(),
  render(Document, [
    route("/", Home),
    // ... andre sider
  ]),
]);
```

API routes var ikke importert eller lagt til i `defineApp` arrayet!

**Resultat:**

- Routes eksisterte i filer, men ble aldri registrert
- Server visste ikke om `/api/goals` endepunktet
- Returnerte 404 Not Found

---

## ✅ Løsningen

### Steg 1: Fikset Route Syntaks

**Korrekt syntaks:**

```typescript
// ✅ RIKTIG SYNTAKS
export const getAllGoals = route("/api/goals", async ({ request }) => {
  // Sjekk HTTP method manuelt
  if (request.method === "GET") {
    return new Response(JSON.stringify(goals), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (request.method === "POST") {
    const body = (await request.json()) as any;
    // ... håndter POST
    return new Response(JSON.stringify(newGoal), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Returner 405 for uspporterte methods
  return new Response("Method not allowed", { status: 405 });
});
```

**Nøkkelpunkter:**

1. **Én funksjon** håndterer alle HTTP methods for samme path
2. Sjekk `request.method` manuelt med `if` statements
3. Returner alltid en `Response` object
4. Håndter uspporterte methods med 405 status

---

### Steg 2: Fikset Parameter Struktur

**Korrekt parameter håndtering:**

```typescript
// ✅ RIKTIG - Ett destructured object
export const getUserById = route(
  "/api/users/:id",
  async ({ request, params }) => {
    // request = HTTP Request object
    // params.id = URL parameter

    if (request.method === "GET") {
      const user = users.find((u) => u.id === params.id);
      // ...
    }

    if (request.method === "PUT") {
      const body = (await request.json()) as any;
      // ...
    }

    if (request.method === "DELETE") {
      // ...
    }

    return new Response("Method not allowed", { status: 405 });
  }
);
```

**Nøkkelpunkter:**

1. **Ett parameter object**: `{ request, params, ctx }`
2. `params` inneholder alle URL parametere (f.eks. `params.id`)
3. `request` er standard Web API Request object
4. Alle ID-er er **strings**, ikke numbers

---

### Steg 3: Registrerte Routes i worker.tsx

**Fikset worker.tsx:**

```typescript
import { render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";

// Importer alle API routes
import { getAllGoals, getGoalById } from "../api/routes/goals";
import { getAllUsers, getUserById } from "../api/routes/users";
import { getAllWorkouts, getWorkoutById } from "../api/routes/workout";
import { getAllExercises, getExerciseById } from "../api/routes/exercises";
import { getAllBadges, getBadgeById } from "../api/routes/badges";

export default defineApp([
  setCommonHeaders(),
  ({ ctx }) => {
    ctx;
  },

  // ⚠️ VIKTIG: API routes må komme FØRST (før page routes)
  // Goals API
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

  // Page Routes kommer sist
  render(Document, [
    route("/", Home),
    route("/stats", Stats),
    // ...
  ]),
]);
```

**Nøkkelpunkter:**

1. Importer alle route handlers fra API filer
2. Legg dem til i `defineApp` arrayet
3. **API routes må komme FØRST** - før `render(Document, [...])`
4. Matching skjer i rekkefølge - første match vinner

---

## 🧪 Testing

**Test alle endpoints:**

```bash
# Goals API
curl http://localhost:5173/api/goals
curl http://localhost:5173/api/goals/1

# Users API
curl http://localhost:5173/api/users
curl http://localhost:5173/api/users/1

# Workouts API
curl http://localhost:5173/api/workouts
curl http://localhost:5173/api/workouts/1

# Exercises API
curl http://localhost:5173/api/exercises
curl http://localhost:5173/api/exercises/1

# Badges API
curl http://localhost:5173/api/badges
curl http://localhost:5173/api/badges/1
```

**Forventet resultat:**

- Alle skal returnere JSON med dummy data
- Status 200 OK
- Content-Type: application/json

---

## 📚 Læringspunkter

### 1. RedwoodSDK Route Syntaks

- `route(path, handler)` tar **kun 2 parametere**
- Handler er **én funksjon**, ikke et object
- Sjekk `request.method` manuelt

### 2. Parameter Håndtering

- Handler får **ett object**: `{ request, params, ctx }`
- URL parametere er i `params` object
- Alle parametere er **strings**

### 3. Route Registrering

- Routes må **importeres** og **legges til** i `defineApp`
- API routes bør komme **før** page routes
- Matching skjer i **rekkefølge**

### 4. Response Format

- Returner alltid `new Response()`
- Bruk `JSON.stringify()` for JSON data
- Sett `Content-Type` header

### 5. Error Handling

- Returner korrekte HTTP status codes (404, 405, 400, etc.)
- Inkluder feilmeldinger i JSON format
- Håndter uspporterte HTTP methods

---

## 🎯 Best Practices for RedwoodSDK API Routes

1. **Bruk absolutte paths**: `/api/goals` ikke `"/"`
2. **Én route per path**: Kombiner GET/POST i samme handler
3. **Eksporter navngitte funksjoner**: `export const getAllGoals`
4. **Bruk TypeScript type assertions**: `as any` for request body
5. **Returner konsistente responses**: Alltid JSON format
6. **Håndter alle HTTP methods**: Inkluder 405 for uspporterte
7. **Valider input**: Sjekk required fields
8. **Dokumenter API**: Kommenter hva hver endpoint gjør

---

## 🔗 Relaterte Filer

- `api/routes/goals.ts` - Goals API
- `api/routes/users.ts` - Users API
- `api/routes/workout.ts` - Workouts API
- `api/routes/exercises.ts` - Exercises API
- `api/routes/badges.ts` - Badges API
- `src/worker.tsx` - Route registrering

---

**Skrevet av:** AI Assistant (GitHub Copilot)  
**Verifisert av:** Jimmy Hansen  
**Status:** ✅ Løst og testet
