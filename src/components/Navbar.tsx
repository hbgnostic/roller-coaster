"use client";

import { useState } from "react";
import { useMode } from "@/lib/ModeContext";

const links = [
  { href: "#timeline", label: "Timeline" },
  { href: "#builder", label: "Builder" },
  { href: "#trivia", label: "Trivia" },
  { href: "#chat", label: "AI Chat" },
  { href: "#cards", label: "Cards" },
  { href: "#facts", label: "Facts" },
];

export default function Navbar() {
  const { kidMode, toggleMode } = useMode();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-gray-950/80 backdrop-blur-lg border-b border-purple-500/10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="text-lg font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          CoasterVerse
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-purple-300 hover:text-pink-400 transition-colors">
              {l.label}
            </a>
          ))}
          <button
            onClick={toggleMode}
            className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all"
            style={{
              borderColor: kidMode ? "#fbbf24" : "#a855f7",
              color: kidMode ? "#fbbf24" : "#a855f7",
            }}
          >
            {kidMode ? "🧒 Kid" : "🔧 Eng"}
          </button>
        </div>

        {/* Hamburger */}
        <button className="md:hidden text-purple-300" onClick={() => setOpen(!open)}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-gray-950/95 backdrop-blur-lg border-b border-purple-500/10 px-4 pb-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm text-purple-300 hover:text-pink-400 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={() => { toggleMode(); setOpen(false); }}
            className="mt-2 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border"
            style={{
              borderColor: kidMode ? "#fbbf24" : "#a855f7",
              color: kidMode ? "#fbbf24" : "#a855f7",
            }}
          >
            {kidMode ? "🧒 Kid Mode" : "🔧 Engineer Mode"}
          </button>
        </div>
      )}
    </nav>
  );
}
