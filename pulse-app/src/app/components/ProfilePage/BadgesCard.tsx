import { Badge } from './types'

export const BadgesCard = ({ badges }: { badges: Badge[] }) => (
  <div className="bg-white rounded shadow p-4">
    <h3 className="font-bold mb-3">Dine badges</h3>
    {badges.map((b) => (
      <div key={b.id} className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-200">{b.icon}</div>
        <div>
          <div className="font-semibold">{b.title}</div>
          <div className="text-xs text-gray-500">{b.description}</div>
        </div>
      </div>
    ))}
  </div>
)
