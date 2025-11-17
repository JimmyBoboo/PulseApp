'use client'
import { useEffect, useState } from 'react'

export default function Navigationbar() {

  const navLinks = [
    { href: '/', label: 'Hjem' },

    { href: '/stats', label: 'Statistikk' },

    { href: '/log-workout', label: 'Logg økt' },

    { href: '/plan', label: 'Plan' },

    { href: '/profile', label: 'Profil' },
  ]

  
  return (
     <nav className="flex items-center justify-between bg-black px-8 py-4 text-white shadow-md">
      <a href="/" className="flex items-center gap-2">
        <img
          src="/images/pulse_logo.png"
          alt="Pulse logo"
          className="h-9 w-auto object-contain align-middle"
        />
      </a>
      <div className="flex items-center gap-12 ml-auto"></div>
      <ul className="flex gap-8 mr-4">
        {navLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="font-medium text-gray-300 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </a>
          </li>
        ))}
  
      </ul>
      <a
        href="/login"
        className="bg-[#f56e0b] hover:bg-[#f15000] px-4 py-2 transition-colors duration-200 font-semibold text-white ml-4 rounded-md flex items-center justify-center"
      >
        Logg inn
      </a>
    </nav>
    
  )
}

