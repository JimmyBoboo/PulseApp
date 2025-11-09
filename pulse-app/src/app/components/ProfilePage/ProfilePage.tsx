import { useState } from 'react'
import { User, Activity, Badge } from './types'
import { ProfileCard } from './ProfileCard'
import { ActivitiesCard } from './ActivitiesCard'
import { BadgesCard } from './BadgesCard'

const MOCK_USER: User = {
  id: '1',
  name: 'Simen Kingsrød',
  email: 'simen@example.com',
  age: 29,
  createdAt: '2022-06-01',
  sessionsCount: 42,
  exercisesCount: 320,
  lastActivity: '2025-10-20'
}

const MOCK_ACTIVITIES: Activity[] = [
  { id: 'a1', date: '2025-10-20', type: 'STYRKE', duration: '34:32' },
  { id: 'a2', date: '2025-10-18', type: 'LØP', duration: '22:10' },
]

const MOCK_BADGES: Badge[] = [
  { id: 'b1', title: 'Ukes-milen', description: 'Løp 10 km på 7 dager', icon: '👟' },
  { id: 'b2', title: 'Storløfter', description: '10 styrkeøkter', icon: '🏋️' },
]

export const ProfilePage = () => {
  const [user, setUser] = useState(MOCK_USER)
  function handleEdit(data: Partial<User>) {
    setUser({ ...user, ...data })
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen grid gap-6 lg:grid-cols-3">
      <ProfileCard user={user} onEdit={handleEdit} />
      <ActivitiesCard activities={MOCK_ACTIVITIES} />
      <BadgesCard badges={MOCK_BADGES} />
    </div>
  )
}
