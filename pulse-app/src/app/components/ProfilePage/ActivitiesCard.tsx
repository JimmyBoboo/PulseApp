import { Activity } from "./types";

export const ActivitiesCard = ({ activities }: { activities: Activity[] }) => {
  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="font-bold mb-3">Dine aktiviteter</h3>
      {activities.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">
          Ingen aktiviteter ennå
        </p>
      ) : (
        <div>
          {activities.map((a) => (
            <div
              key={a.id}
              className="flex justify-between border-b py-2 text-sm"
            >
              <span className="text-gray-600">
                {new Date(a.date).toLocaleDateString("no-NO")}
              </span>
              <span className="font-medium text-gray-800">{a.type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
