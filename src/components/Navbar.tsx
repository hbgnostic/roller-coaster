"use client";

const navItems = [
  { href: "#timeline", label: "History", emoji: "🕰️", color: "from-red-500 to-orange-500" },
  { href: "#builder", label: "Build", emoji: "🎨", color: "from-orange-500 to-yellow-500" },
  { href: "#trivia", label: "Quiz", emoji: "🧠", color: "from-yellow-500 to-amber-500" },
  { href: "#cards", label: "Cards", emoji: "🃏", color: "from-amber-500 to-orange-500" },
  { href: "#chat", label: "Ask AI", emoji: "🤖", color: "from-orange-500 to-red-500" },
  { href: "#facts", label: "Facts", emoji: "💡", color: "from-red-500 to-amber-500" },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-gray-950/90 backdrop-blur-lg border-b border-amber-500/20">
      <div className="max-w-6xl mx-auto px-2 py-2">
        {/* Logo */}
        <div className="flex items-center justify-center mb-2">
          <a href="#" className="text-lg font-black bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
            🎢 CoasterVerse
          </a>
        </div>

        {/* Navigation blocks - horizontal scroll on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide justify-center">
          {/* Contest - Special highlighted block */}
          <a
            href="#contest"
            className="flex-shrink-0 flex flex-col items-center justify-center px-3 py-2 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-gray-900 font-bold text-xs shadow-lg hover:scale-105 transition-transform animate-pulse"
          >
            <span className="text-lg">🏆</span>
            <span>Win!</span>
          </a>

          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`flex-shrink-0 flex flex-col items-center justify-center px-3 py-2 rounded-xl bg-gradient-to-br ${item.color} text-white font-bold text-xs shadow-md hover:scale-105 transition-transform`}
            >
              <span className="text-lg">{item.emoji}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
