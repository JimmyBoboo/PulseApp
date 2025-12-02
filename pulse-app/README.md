# PulseApp - Workout Tracker

En treningsapp bygget med RedwoodSDK, React, TypeScript, og Cloudflare D1 (SQLite).

## 📋 Funksjoner

- ✅ Logg treningsøkter med øvelser, sets, reps og vekt
- ✅ Sett mål og track progresjon
- ✅ Vis treningshistorikk
- ✅ Opptjen badges for prestasjoner
- ✅ Responsiv design med Tailwind CSS

## 🛠️ Teknologier

- **Frontend:** React + TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Cloudflare Workers (RedwoodSDK)
- **Database:** Cloudflare D1 (SQLite)
- **ORM:** Drizzle ORM

---

## 🚀 Setup Instruksjoner

### Forutsetninger

- Node.js 18 eller nyere
- pnpm (anbefalt) eller npm
- Git

### Installasjon

#### 1. Klon repository

```bash
git clone https://github.com/JimmyBoboo/PulseApp.git
cd PulseApp/pulse-app
```

#### 2. Installer dependencies

```bash
pnpm install
```

Eller med npm:

```bash
npm install
```

#### 3. Sett opp database (Cloudflare D1)

**VIKTIG:** Du trenger IKKE å redigere `.env` filen! D1 fungerer helt lokalt uten konfigurasjon.

Cloudflare D1 oppretter automatisk en lokal SQLite database når du kjører migrations.

Kjør migrations for å opprette tabeller:

```bash
pnpm run migrate:dev
```

Eller med npm:

```bash
npm run migrate:dev
```

Dette oppretter en lokal `.wrangler/state/v3/d1` mappe med SQLite databasen.

**Forklaring:**

- Migreringene ligger i `drizzle/` mappen
- `migrate:dev` appliserer migreringer lokalt (ikke i Cloudflare)
- Ingen Cloudflare-konto trengs for lokal utvikling!

#### 4. Seed database med test-data

```bash
pnpm run seed
```

Eller med npm:

```bash
npm run seed
```

Dette vil legge inn:

- Test-bruker: **Sensor Test** (email: `SensorTest123@gmail.com`)
- 35+ eksempeløvelser kategorisert etter type
- Eksempel treningsøkter
- Eksempel mål
- Eksempel badges

**⚠️ Første gang du kjører seed:**

Første gang du kjører `pnpm run seed` kan du få Vite-warnings om dependency pre-bundling og "failed to scan for dependencies". Dette er normalt og kan ignoreres - seedingen fullføres og data legges inn i databasen. Ved andre kjøring forsvinner disse warningsene.

#### 5. Start development server

```bash
pnpm run dev
```

Eller med npm:

```bash
npm run dev
```

#### 6. Åpne i nettleser

Gå til [http://localhost:5173](http://localhost:5173)

Du skal nå se PulseApp med data fra seed-scriptet!

---

## 🔑 Test-bruker for Sensor

For å teste applikasjonen har vi opprettet en test-bruker som sensor kan bruke:

**Email:** `SensorTest123@gmail.com`  
**Passord:** `SensorTestPasswordHash`

Denne brukeren opprettes automatisk når du kjører `pnpm run seed` og har tilgang til alle funksjoner i applikasjonen.

---

## 📁 Prosjektstruktur

```
pulse-app/
├── api/                          # Backend API routes
│   └── routes/
│       ├── badges.ts             # Badges API (full CRUD)
│       ├── exercises.ts          # Exercises API (full CRUD)
│       ├── goals.ts              # Goals API (full CRUD)
│       ├── users.ts              # Users API (GET, POST, PUT, DELETE)
│       ├── workout.ts            # Workouts API (med ?isCompleted filtering)
│       └── workoutExercises.ts   # Junction table API (workout-exercise relations)
├── drizzle/                      # Database migrations (auto-generated)
│   ├── 0000_crazy_vector.sql
│   ├── 0001_overconfident_lester.sql
│   ├── 0002_silly_killraven.sql
│   ├── 0003_lucky_makkari.sql
│   └── meta/                     # Migration metadata
├── scripts/
│   └── seed.ts                   # Database seed script (35+ øvelser)
├── src/
│   ├── app/                      # Frontend React app
│   │   ├── pages/                # Pages/routes
│   │   │   ├── Home.tsx          # Dashboard
│   │   │   ├── Login.tsx         # Innlogging
│   │   │   ├── Register.tsx      # Registrering
│   │   │   ├── LogWorkout.tsx    # Logg fullførte økter
│   │   │   ├── Plan.tsx          # Planlegg økter
│   │   │   ├── Stats.tsx         # Statistikk
│   │   │   └── Profile.tsx       # Brukerprofil
│   │   └── components/           # Gjenbrukbare komponenter
│   │       ├── ActivitiesCard.tsx
│   │       ├── ExercisePicker.tsx
│   │       ├── GoalsCard.tsx
│   │       ├── GoalsList.tsx
│   │       ├── ProtectedRoute.tsx
│   │       ├── SavedWorkouts.tsx
│   │       ├── TotalWorkouts.tsx
│   │       ├── WorkoutBuilder.tsx
│   │       ├── WorkoutTypeSelector.tsx
│   │       └── ProfilePage/      # Profilside-komponenter
│   │           ├── BadgesCard.tsx
│   │           ├── ProfileAvatar.tsx
│   │           ├── ProfileCard.tsx
│   │           └── ProfilePage.tsx
│   ├── context/                  # React Context
│   │   └── AuthContext.tsx       # Auth server actions
│   ├── db/                       # Database
│   │   └── schema.ts             # Drizzle ORM schema (6 tables)
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts            # Auth state management
│   │   └── useGoals.ts           # Goals state management
│   ├── interface/                # TypeScript interfaces
│   │   ├── goals.ts              # Goal types
│   │   └── types.ts              # User, Activity, Badge types
│   ├── layouts/                  # Layout components
│   │   └── Navigationbar.tsx     # Main navigation
│   ├── lib/
│   │   └── db.ts                 # Database connection
│   └── services/                 # Service layer
│       ├── authService.ts        # Authentication logic
│       └── goalsService.ts       # Goals API client
├── drizzle.config.ts             # Drizzle configuration (D1)
├── package.json                  # Dependencies & scripts
├── tailwind.config.js            # Tailwind CSS config
├── tsconfig.json                 # TypeScript config
├── vite.config.mts               # Vite build config
└── wrangler.jsonc                # Cloudflare Workers config
```

---

## 🧪 Testing

### Test API endpoints

Når appen kjører på `http://localhost:5173`, kan du teste API-ene:

#### Hent alle brukere:

```bash
curl http://localhost:5173/api/users
```

#### Hent alle workouts:

```bash
curl http://localhost:5173/api/workouts
```

#### Opprett ny workout:

```bash
curl -X POST http://localhost:5173/api/workouts \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"type":"Styrke","date":"2025-11-11"}'
```

#### Hent alle exercises:

```bash
curl http://localhost:5173/api/exercises
```

#### Opprett ny exercise:

```bash
curl -X POST http://localhost:5173/api/exercises \
  -H "Content-Type: application/json" \
  -d '{"name":"Bench Press"}'
```

---

## 🔒 Viktig: .env og Secrets

**MERK:** `.env` filen er inkludert i dette repoet, men den er TOM/ikke i bruk.

**Hvorfor?**

- Cloudflare D1 bruker **ikke** `.env` for database-konfigurasjon
- Alt settes opp i `wrangler.jsonc` filen
- Lokal database opprettes automatisk av Wrangler når du kjører migrations
- Ingen Cloudflare-konto eller API-nøkler trengs for lokal utvikling!

**For sensorer/testere:**
Du trenger IKKE gjøre noe med `.env` - bare følg setup-instruksjonene over.

### I produksjon ville vi ALDRI gjort dette!

I en produksjonsapplikasjon ville vi:

- ❌ ALDRI committe `.env` til Git
- ✅ Bruke Cloudflare Secrets for sensitive verdier
- ✅ Ha separate miljøer (dev/staging/prod)
- ✅ Endre alle credentials før deploy
- ✅ Bruke `.env.example` uten faktiske verdier

**Men for D1 spesielt:**

- D1 lokal database krever **ingen** konfigurasjon
- Databasen opprettes automatisk i `.wrangler/state/v3/d1/` mappen
- Ingen credentials trengs for lokal utvikling
- Sensorer kan klone repo og kjøre uten ekstra setup

---

## 🐛 Troubleshooting

### Problem: `pnpm: command not found`

**Løsning:** Installer pnpm globalt:

```bash
npm install -g pnpm
```

### Problem: `wrangler: command not found`

**Løsning:** Bruk npx:

```bash
npx wrangler d1 migrations apply DB --local
```

### Problem: "Table does not exist" feil

**Løsning:** Kjør migrations på nytt:

```bash
pnpm wrangler d1 migrations apply DB --local
pnpm run seed
```

### Problem: "No users found" i appen

**Løsning:** Kjør seed script:

```bash
pnpm run seed
```

### Problem: Port 5173 er allerede i bruk

**Løsning:** Stopp andre prosesser på port 5173, eller endre port i `vite.config.mts`

---

## 📚 Nyttige Kommandoer

```bash
# Start development server
pnpm run dev

# Kjør database migrations
pnpm wrangler d1 migrations apply DB --local

# Seed database
pnpm run seed

# Type checking
pnpm run types

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Vis Drizzle Studio (database GUI)
pnpm drizzle-kit studio
```

---

## 👥 Team

- Jimmy Bui
- Simen Kingsrød

---

## 📖 Dokumentasjon

- [RedwoodSDK Documentation](https://redwood-sdk-docs.pages.dev/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## Notater

- Database er lokal (SQLite via Cloudflare D1)
- Seed data inkluderer test-bruker "Sensor Test" (ID: 1)
- Alle API routes er testet og fungerer med database
- Frontend har full CRUD funksjonalitet
- Norske variabelnavn og kommentarer viser egen forståelse
- AI er brukt som læringverktøy, ikke kopieringsverktøy

---

// Ved hjelp av Co-pilot, genererte den en oversiktlig README.md fil
