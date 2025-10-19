export const Stats = () => {
  return (
    <div className="container mx-auto px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Stats</h1>
        <p className="text-xl text-gray-600 mb-8">
          Here you can view your fitness statistics and progress over time.
        </p>
      </div>

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center text-gray-500">
          <p className="mb-4">Statistics and charts will be displayed here</p>
          <ul className="text-left space-y-2 inline-block">
            <li>✓ Workout history</li>
            <li>✓ Progress charts</li>
            <li>✓ Exercise tracking</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
