export default function NavigationBar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-gray-900 to-black text-white shadow-lg">
      {/* Logo på venstre side */}
      <div className="flex items-center space-x-3">
        <img
          src="/images/pulse-logo.png"
          alt="Pulse logo"
          className="h-10 w-auto"
        />
        <span className="text-2xl font-bold tracking-wide">Pulse</span>
      </div>

      {/* Navigation links på høyre side */}
      <div className="flex items-center space-x-8">
        <a
          href="/"
          className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
        >
          Home
        </a>
        <a
          href="/stats"
          className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
        >
          Stats
        </a>
        <a
          href="/plan"
          className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
        >
          Plan
        </a>
        <a
          href="/profile"
          className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
        >
          Profile
        </a>
        <a
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
        >
          Login
        </a>
      </div>
    </nav>
  );
}
