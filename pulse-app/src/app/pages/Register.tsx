'use client'

import { useState } from 'react'

export default function Register() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => setLoading(false), 800)
  }

  return (
    <main
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/images/pulse_background_2.png')" }}
    >
      <article
        className="w-full max-w-sm p-10 rounded-xl shadow-lg backdrop-blur-md"
        style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      >
        <header className="text-center mb-10">
          <img
            src="/images/pulse_logo.png"
            alt="Pulse Logo"
            className="mx-auto mb-6"
            style={{ maxWidth: '200px' }}
          />
          <p className="text-xl text-white font-extrabold tracking-wide">
            Opprett konto
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">

          <fieldset className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm text-white font-semibold">
              Navn
            </label>
            <input
              id="name"
              type="text"
              placeholder="Simen Kingsrød"
              className="px-4 py-2 rounded-lg border border-gray-700 bg-white outline-none"
            />
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm text-white font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="simenki@hiof.no"
              className="px-4 py-2 rounded-lg border border-gray-700 bg-white outline-none"
            />
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm text-white font-semibold">
              Passord
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••"
              className="px-4 py-2 rounded-lg border border-gray-700 bg-white outline-none"
            />
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <label htmlFor="password2" className="text-sm text-white font-semibold">
              Bekreft passord
            </label>
            <input
              id="password2"
              type="password"
              placeholder="••••••"
              className="px-4 py-2 rounded-lg border border-gray-700 bg-white outline-none"
            />
          </fieldset>

          <button
            type="submit"
            className="w-full py-2 rounded-lg font-medium bg-orange-600 text-white hover:bg-orange-700 transition"
            disabled={loading}
          >
            {loading ? 'Laster...' : 'Registrer bruker'}
          </button>

        </form>

        <footer className="text-center text-white text-sm mt-8">
          Har du konto?{' '}
          <a href="/login" className="text-orange-400 hover:text-orange-300 font-medium">
            Logg inn her.
          </a>
        </footer>
      </article>
    </main>
  )
}

//Deler av denne koden er generert med hjelp fra Chat