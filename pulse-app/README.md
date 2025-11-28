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
pnpm wrangler d1 migrations apply DB --local
```

Eller med npm:

```bash
npx wrangler d1 migrations apply DB --local
```

Dette oppretter en lokal `.wrangler/state/v3/d1` mappe med SQLite databasen.

**Forklaring:**

- `DB` er binding-navnet fra `wrangler.jsonc`
- `--local` betyr at databasen kjører lokalt (ikke i Cloudflare)
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

- Test-bruker (Jimmy)
- Eksempeløvelser (Push Ups, Pull Ups, Squats, etc.)
- Eksempel treningsøkter
- Eksempel mål
- Eksempel badges

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
│       ├── users.ts              # User API (GET, POST, DELETE)
│       ├── workouts.ts           # Workouts API
│       ├── exercises.ts          # Exercises API (full CRUD)
│       ├── goals.ts              # Goals API
│       ├── badges.ts             # Badges API
│       └── workoutExercises.ts   # Workout-Exercise relation API
├── src/
│   ├── app/                      # Frontend React app
│   │   ├── pages/                # Pages/routes
│   │   │   ├── Home.tsx
│   │   │   ├── LogWorkout.tsx
│   │   │   ├── Stats.tsx
│   │   │   └── Profile.tsx
│   │   └── components/           # Reusable components
│   │       ├── WorkoutTypeSelector.tsx
│   │       ├── ExercisePicker.tsx
│   │       └── WorkoutBuilder.tsx
│   ├── db/                       # Database
│   │   └── schema.ts             # Drizzle ORM schema
│   └── lib/
│       └── db.ts                 # Database connection
├── scripts/
│   └── seed.ts                   # Database seed script
├── drizzle/                      # Database migrations
├── wrangler.toml                 # Cloudflare Workers config
├── .env                          # Environment variables (inkludert for testing)
└── package.json
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
