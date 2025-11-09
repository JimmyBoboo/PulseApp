import { Activity } from './types'

export const ActivitiesCard = ({ activities }: { activities: Activity[] }) => (
  <div className="bg-white rounded shadow p-4">
    <h3 className="font-bold mb-3">Simens aktiviteter</h3>
    {activities.map((a) => (
      <div key={a.id} className="flex justify-between border-b py-1 text-sm">
        <span>{new Date(a.date).toLocaleDateString()}</span>
        <span>{a.type}</span>
        <span>{a.duration}</span>
      </div>
    ))}
  </div>
)
