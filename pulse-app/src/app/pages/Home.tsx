export const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="container mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-red-800">
            Welcome to Pulse
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your personal fitness tracking companion
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <a
            href="/stats"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">Track Stats</h3>
            <p className="text-gray-600">
              View your workout history and progress
            </p>
          </a>

          <a
            href="/plan"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">Plan Workouts</h3>
            <p className="text-gray-600">Schedule and organize your training</p>
          </a>

          <a
            href="/profile"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">Your Profile</h3>
            <p className="text-gray-600">Manage your account and goals</p>
          </a>
        </div>
      </div>
    </div>
  );
};
