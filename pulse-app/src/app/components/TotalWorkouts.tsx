"use client";
import React, { useEffect, useState } from "react";

interface TotalWorkoutsProps {
  workouts?: any[];
}

const TotalWorkouts: React.FC<TotalWorkoutsProps> = ({ workouts = [] }) => {
  const [totalOkter, setTotalOkter] = useState<number>(0);

  useEffect(() => {
    if (workouts.length > 0) {
      setTotalOkter(workouts.length);
    } else {
      async function fetchWorkouts() {
        try {
          const response = await fetch("/api/workouts?isCompleted=true");
          if (response.ok) {
            const data: any = await response.json();
            setTotalOkter(data.length);
          }
        } catch (error) {
          console.error("Error fetching workouts:", error);
        }
      }
      fetchWorkouts();
    }
  }, [workouts]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4 text-center">
        Totalt antall økter
      </h2>
      <div className="text-center mb-4">
        <p className="text-4xl font-bold text-[#f56e0b]">{totalOkter}</p>
      </div>
    </div>
  );
};

export default TotalWorkouts;

//Utviklet ved hjelp av Co-pilot (GitHub, 2025)
