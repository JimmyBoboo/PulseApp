'use client'
export const Login = () => {
  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/pulse_login.jpg')" }}>
      <main className="flex items-center justify-center min-h-screen px-4">
        <article
          className="w-full max-w-sm p-10 rounded-xl shadow-lg"
          style={{
            backgroundColor: "rgba(245, 110, 11, 0.7)",
          }}
        >
          <header className="text-center mb-8">
            <img
              src="/images/pulse_logo.png"
              alt="Pulse Logo"
              className="mx-auto mb-6"
              style={{ maxWidth: '200px' }}
            />
            <p className="text-xl text-white font-extrabold mb-4">DIN TRENING. DITT TEMPO. DIN PROGRESJON.</p>
          </header>

          <form className="space-y-4">
            <fieldset>
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Jimmybui1234@hotmail.com"
                className="w-full px-4 py-2 border-2 border-gray-600 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                style={{ borderColor: "#333" }}
              />
            </fieldset>

            <fieldset>
              <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">Password</label>
              <input
                id="password"
                type="password"
                placeholder="•••••"
                className="w-full px-4 py-2 border-2 border-gray-600 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                style={{ borderColor: "#333" }}
              />
            </fieldset>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Logg inn
            </button>
          </form>

          <footer className="text-center text-white text-sm mt-6">
            Har du ingen konto?{" "}
            <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Registrer deg her.
            </a>
          </footer>
        </article>
      </main>

      <footer className="bg-black text-white py-6 mt-0">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">© {new Date().getFullYear()} Pulse App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

//ChatGPT har bidratt mye med koden for login-siden, inkludert struktur, layout og design.
