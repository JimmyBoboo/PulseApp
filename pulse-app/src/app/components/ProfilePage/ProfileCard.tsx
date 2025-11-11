'use client'
import { useState } from 'react'
import { User } from './types'
import { ProfileAvatar } from './ProfileAvatar'

export const ProfileCard = ({ user, onEdit }: { user: User; onEdit?: (data: Partial<User>) => void }) => {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user.name)
  const [age, setAge] = useState(user.age ?? 0)

  function save() {
    onEdit?.({ name, age })
    setEditing(false)
  }

  return (
    <div className="bg-white rounded shadow p-6 flex flex-col items-center text-center">
      <ProfileAvatar name={user.name} size={90} />

      {!editing ? (
        <>
          <h2 className="font-bold mt-4">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>

          <div className="mt-4 text-sm text-gray-600">
            <div>Alder: {user.age ?? '-'}</div>
            <div>Medlem siden: {new Date(user.createdAt).toLocaleDateString()}</div>
          </div>

          <button
            className="mt-4 px-2 py-1 border rounded bg-[#f56e0b] hover:bg-[#f15000] text-white transition-colors duration-200 text-xs"
            onClick={() => setEditing(true)}
          >
            Rediger
          </button>
        </>
      ) : (
        <div className="mt-4 w-full">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-2 py-1 w-full text-center"
          />
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="border rounded px-2 py-1 w-full mt-2 text-center"
          />
          <div className="flex gap-2 mt-3 justify-center">
            <button
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
              onClick={save}
            >
              Lagre
            </button>
            <button
              className="border px-3 py-1 rounded hover:bg-gray-50 transition"
              onClick={() => setEditing(false)}
            >
              Avbryt
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ChatGPT har vært brukt til å bidra med mye av kodingen, inkludert layout, spacing, størrelser og fargekoder (OpenAI, 2025)