"use client";

import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function Register() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name || !lastName || !email || !password || !password2 || !age) {
      //Ki (Claude Sonnet 4.,5 genererte linjene fra 22-62)
      //Dette var for å spare tid og få en fungerende registreringsside raskt..
      setError("Vennligst fyll ut alle feltene");
      setLoading(false);
      return;
    }

    if (password !== password2) {
      setError("Passordene matcher ikke");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Passordet må være minst 6 tegn");
      setLoading(false);
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      setError("Ugyldig alder");
      setLoading(false);
      return;
    }

    const success = await register(
      `${name} ${lastName}`,
      email,
      password,
      ageNum
    );
    setLoading(false);

    if (success) {
      window.location.href = "/login";
    } else {
      setError("Kunne ikke opprette bruker. Email kan allerede være i bruk.");
    }
  }

  return (
    <main
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/images/pulse_background_2.png')" }}
    >
      <article
        className="w-full max-w-sm p-10 rounded-xl shadow-lg backdrop-blur-md"
        style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      >
        <header className="text-center mb-10">
          <img
            src="/images/pulse_logo.png"
            alt="Pulse Logo"
            className="mx-auto mb-6"
            style={{ maxWidth: "200px" }}
          />
          <p className="text-xl text-white font-extrabold tracking-wide">
            Opprett konto
          </p>
        </header>

        {error && (
          <div className="bg-red-500 text-white px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm text-white font-semibold">
              Fornavn
            </label>
            <input
              id="name"
              type="text"
              placeholder="Simen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-700 bg-white outline-none"
              required
            />
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <label
              htmlFor="lastName"
              className="text-sm text-white font-semibold"
            >
              Etternavn
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Kingsrød"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-700 bg-white outline-none"
              required
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-700 bg-white outline-none"
              required
            />
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <label htmlFor="age" className="text-sm text-white font-semibold">
              Alder
            </label>
            <input
              id="age"
              type="number"
              placeholder="25"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-700 bg-white outline-none"
              required
            />
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm text-white font-semibold"
            >
              Passord
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-700 bg-white outline-none"
              required
            />
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <label
              htmlFor="password2"
              className="text-sm text-white font-semibold"
            >
              Bekreft passord
            </label>
            <input
              id="password2"
              type="password"
              placeholder="••••••"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-700 bg-white outline-none"
              required
            />
          </fieldset>

          <button
            type="submit"
            className="w-full py-2 rounded-lg font-medium bg-orange-600 text-white hover:bg-orange-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Registrerer..." : "Registrer bruker"}
          </button>
        </form>

        <footer className="text-center text-white text-sm mt-8">
          Har du konto?{" "}
          <a
            href="/login"
            className="text-orange-400 hover:text-orange-300 font-medium"
          >
            Logg inn her.
          </a>
        </footer>
      </article>
    </main>
  );
}

//Deler av denne koden er generert med hjelp fra Chat
