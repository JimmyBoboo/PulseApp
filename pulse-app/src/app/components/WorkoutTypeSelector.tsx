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
    <div className="bg-white rounded-md shadow-md p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-7 text-center">Treningsplanlegger</h2>
      <p className="text-gray-700 text-center mb-6">Velg type økt</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {workoutTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onSelectType(type.value)}
            type="button"
            className={`p-2 py-3 rounded-md border transition-all w-auto text-center    ${
              selectedType === type.value
                ? "border-[#f15000] bg-[rgba(241,80,0,0.08)] shadow-md"
                : "border-gray-200 hover:border-[#f15000] hover:bg-[rgba(241,80,0,0.02)]"
            }`}
          >
            <div className="font-semibold text-gray-800">{type.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
