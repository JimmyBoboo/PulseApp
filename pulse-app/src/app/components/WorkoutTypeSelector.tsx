"use client";

interface WorkoutTypeSelectorProps {
  selectedType: string;
  onSelectType: (type: string) => void;
}

export const workoutTypes = [
  { value: "Strength", label: "Styrke" },
  { value: "Cardio", label: "Kondisjon" },
  { value: "Full body", label: "Helkropp" },
  { value: "Upper body", label: "Overkropp" },
  { value: "Lower body", label: "Underkropp" },
];

export function WorkoutTypeSelector({
  selectedType,
  onSelectType,
}: WorkoutTypeSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Velg type økt</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {workoutTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onSelectType(type.value)}
            type="button"
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedType === type.value
                ? "border-blue-600 bg-blue-50 shadow-md"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="font-semibold text-gray-800">{type.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
