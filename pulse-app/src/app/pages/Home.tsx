'use client'
import { useState } from 'react'
import { User, Activity, Badge } from '../components/ProfilePage/types'
import { ProfileCard } from '../components/ProfilePage/ProfileCard'
import { ActivitiesCard } from '../components/ProfilePage/ActivitiesCard'
import { BadgesCard } from '../components/ProfilePage/BadgesCard'

const MOCK_USER: User = {
  id: '1',
  name: 'Simen Kingsrød',
  email: 'simen@example.com',
  age: 29,
  createdAt: '2022-06-01',
  sessionsCount: 42,
  exercisesCount: 320,
  lastActivity: '2025-10-20',
}

const MOCK_ACTIVITIES: Activity[] = [
  { id: 'a1', date: '2025-10-20', type: 'STYRKE', duration: '34:32' },
  { id: 'a2', date: '2025-10-18', type: 'LØP', duration: '22:10' },
  { id: 'a3', date: '2025-10-15', type: 'SYKLING', duration: '45:15' },
  { id: 'a4', date: '2025-10-12', type: 'STYRKE', duration: '25:00' },
  { id: 'a5', date: '2025-10-10', type: 'LØP', duration: '20:30' },
]

const MOCK_BADGES: Badge[] = [
  { id: 'b1', title: 'Ukes-milen', description: 'Løp 10 km på 7 dager', icon: '👟' },
  { id: 'b2', title: 'Storløfter', description: '10 styrkeøkter', icon: '🏋️' },
  { id: 'b6', title: 'Mester-syklist', description: 'Syklet i 50 km', icon: '🚴' },
  { id: 'b7', title: 'Flittig løper', description: 'Løpt 100 km totalt', icon: '🏃' },
]

export const Home = () => {
  const [user, setUser] = useState(MOCK_USER)

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-100 p-8 flex justify-center">
        <div className="max-w-6xl w-full grid grid-cols-[1fr_3fr_1fr] gap-6">
          <section className="flex flex-col space-y-6">
            <ProfileCard user={user} onEdit={(data) => setUser({ ...user, ...data })} />
            <section className="w-full max-w-sm bg-white rounded shadow p-4 text-center">
              <h3 className="font-bold mb-2">Statistikk</h3>
              <p className="text-gray-500 text-sm">Kommer snart…</p>
            </section>
          </section>

          <section className="flex flex-col space-y-6">
            <ActivitiesCard activities={MOCK_ACTIVITIES} />
          </section>

          <section className="flex flex-col space-y-6">
            <BadgesCard badges={MOCK_BADGES} />
            <section
              className="w-full bg-white rounded shadow p-4"
              style={{
                backgroundImage: "url('/images/pulse_background.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100px',
              }}
            ></section>
          </section>
        </div>
      </main>

      <footer className="bg-black text-white py-6 mt-0">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">© {new Date().getFullYear()} Pulse App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

//ChatGPT er brukt til å hjelpe med layout, spacing, størrelser, fargekoder og generell struktur på siden. (OpenAI, 2025)
