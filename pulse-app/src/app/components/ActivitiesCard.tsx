import { Activity } from "../../interface/types";

export const ActivitiesCard = ({ activities }: { activities: Activity[] }) => {
  return (
    <section className="bg-white rounded shadow p-6">
      <h3 className="text-xl font-bold text-gray-800 text-center mb-6">Fullførte økter</h3>

      {activities.length === 0 ? (
        <p className="text-gray-700 text-center mb-6 p-4">
          Ingen aktiviteter ennå
        </p>
      ) : (
        <ul className="space-y-2">
          {activities.map((a) => (
            <li
              key={a.id}
              className="flex justify-between items-center py-3 px-4 border border-gray-300 rounded-md text-sm transition-all"
            >
              <span className="text-gray-600 font-medium text-sm w-1/3">
                {new Date(a.date).toLocaleDateString("no-NO")}
              </span>
              <div className="flex flex-col items-center w-1/3">
                <span className="font-semibold text-gray-800 text-base">
                  {a.type}
                </span>
              </div>
              <span className="text-gray-600 font-semibold text-base w-1/3 text-right">
                {a.duration}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
