"use client";

import { useEffect, useState } from "react";
import { useMode } from "@/lib/ModeContext";

export default function Hero() {
  const { kidMode, toggleMode } = useMode();
  const [carPos, setCarPos] = useState(0);

  useEffect(() => {
    let frame: number;
    const animate = () => {
      setCarPos((p) => (p + 0.3) % 100);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // SVG track path
  const trackD =
    "M0,200 C80,200 100,50 180,50 S280,200 360,200 S460,50 540,50 S640,200 720,200 S820,50 900,50 S1000,200 1080,200";

  // Get point on path at percentage t (0–100)
  const getPoint = (t: number) => {
    const len = 1080;
    const x = (t / 100) * len;
    return { x, y: 125 + 75 * Math.sin((x / len) * Math.PI * 4) };
  };

  const car = getPoint(carPos);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-red-950/30 to-gray-950" />

      {/* SVG Track */}
      <div className="relative w-full max-w-4xl mx-auto mb-8">
        <svg viewBox="0 0 1080 300" className="w-full h-auto">
          {/* Track supports */}
          {[180, 360, 540, 720, 900].map((x, i) => (
            <line
              key={i}
              x1={x}
              y1={i % 2 === 0 ? 50 : 200}
              x2={x}
              y2={280}
              stroke="#7c2d12"
              strokeWidth="3"
              opacity="0.4"
            />
          ))}
          {/* Track */}
          <path
            d={trackD}
            fill="none"
            stroke="url(#trackGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Track rails */}
          <path
            d={trackD}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeDasharray="8 4"
            opacity="0.5"
          />
          {/* Neon glow */}
          <path
            d={trackD}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="12"
            opacity="0.15"
            filter="url(#glow)"
          />
          {/* Coaster car */}
          <g transform={`translate(${car.x - 15}, ${car.y - 18})`}>
            <rect x="0" y="8" width="30" height="16" rx="4" fill="#f43f5e" />
            <rect x="2" y="0" width="10" height="10" rx="2" fill="#fbbf24" />
            <rect x="18" y="0" width="10" height="10" rx="2" fill="#fbbf24" />
            <circle cx="6" cy="28" r="4" fill="#e2e8f0" />
            <circle cx="24" cy="28" r="4" fill="#e2e8f0" />
          </g>
          <defs>
            <linearGradient id="trackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>

      {/* Title */}
      <div className="relative text-center z-10">
        <h1 className="text-6xl md:text-8xl font-black tracking-tight bg-gradient-to-r from-amber-400 via-yellow-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
          CoasterVerse
        </h1>
        <p className="text-xl md:text-2xl text-amber-200 mt-2 font-light">
          Your Universe of Thrills
        </p>
        <div className="mt-6 inline-block bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl px-6 py-3">
          <p className="text-2xl md:text-3xl font-bold text-yellow-300">
            {kidMode ? "🎂 Happy 38th Birthday! 🎉" : "Happy 38th Lap Around the Sun!"}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="mt-8">
          <button
            onClick={toggleMode}
            className="relative inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all duration-300"
            style={{
              borderColor: kidMode ? "#f59e0b" : "#dc2626",
              backgroundColor: kidMode ? "rgba(245,158,11,0.1)" : "rgba(220,38,38,0.1)",
            }}
          >
            <span className="text-sm font-bold uppercase tracking-wider" style={{ color: kidMode ? "#fbbf24" : "#f87171" }}>
              {kidMode ? "🚀 Rocket Mode" : "🔧 Dad Mode"}
            </span>
            <div
              className="w-12 h-6 rounded-full relative transition-colors duration-300"
              style={{ backgroundColor: kidMode ? "#f59e0b" : "#dc2626" }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300"
                style={{ transform: kidMode ? "translateX(26px)" : "translateX(2px)" }}
              />
            </div>
          </button>
        </div>

        {/* Scroll hint */}
        <div className="mt-12 animate-bounce">
          <svg className="w-6 h-6 text-amber-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
