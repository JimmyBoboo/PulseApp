import { useGoals } from "../../hooks/useGoals";

export const GoalsList = () => {
  const { goals, loading, error } = useGoals(1);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("no-NO");
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded shadow p-4">
        <h3 className="font-bold text-lg mb-3">Mine Mål</h3>
        <p className="text-gray-500 text-sm">Laster...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded shadow p-4">
        <h3 className="font-bold text-lg mb-3">Mine Mål</h3>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded shadow p-4">
      <h3 className="font-bold text-lg mb-3">Mine Mål</h3>
      {goals.length === 0 ? (
        <p className="text-gray-500 text-sm">Ingen mål enda.</p>
      ) : (
        <div className="space-y-2">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className={`p-3 rounded border ${
                goal.isCompleted
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  goal.isCompleted
                    ? "line-through text-gray-500"
                    : "text-gray-800"
                }`}
              >
                {goal.description}
              </p>
              {goal.deadline && !goal.isCompleted && (
                <p className="text-xs text-gray-600 mt-1">
                  Frist: {formatDate(goal.deadline)}
                </p>
              )}
              {goal.isCompleted && goal.completedAt && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ Fullført {formatDate(goal.completedAt)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
