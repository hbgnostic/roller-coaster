"use client";

import { useState, useRef } from "react";
import { useMode } from "@/lib/ModeContext";
import { coasterFacts, kidFacts } from "@/lib/data";

export default function FactSpinner() {
  const { kidMode } = useMode();
  const facts = kidMode ? kidFacts : coasterFacts;
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [currentFact, setCurrentFact] = useState<string | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setCurrentFact(null);

    const extraSpins = 3 + Math.random() * 3; // 3-6 full rotations
    const randomAngle = Math.random() * 360;
    const totalDeg = extraSpins * 360 + randomAngle;
    const newRotation = rotation + totalDeg;
    setRotation(newRotation);

    // Pick fact based on where it lands
    const factIndex = Math.floor((randomAngle / 360) * facts.length) % facts.length;

    setTimeout(() => {
      setSpinning(false);
      setCurrentFact(facts[factIndex]);
    }, 3000);
  };

  const segmentCount = 12;
  const segmentAngle = 360 / segmentCount;
  const colors = [
    "#7c3aed", "#ec4899", "#f43f5e", "#f97316", "#eab308",
    "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#d946ef",
    "#f43f5e", "#14b8a6",
  ];

  return (
    <section id="facts" className="py-20 px-4 max-w-2xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-black text-center mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        {kidMode ? "🎡 Spin for a Fun Fact!" : "Did You Know?"}
      </h2>
      <p className="text-center text-purple-300 mb-10">
        {kidMode ? "Spin the wheel and learn something AWESOME!" : "Spin the wheel for a random roller coaster fact"}
      </p>

      {/* Wheel */}
      <div className="relative mx-auto" style={{ width: 280, height: 280 }}>
        {/* Pointer */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
          <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-pink-400 drop-shadow-lg" />
        </div>

        {/* Spinning wheel */}
        <div
          ref={wheelRef}
          className="w-full h-full rounded-full border-4 border-purple-500/30 overflow-hidden relative"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? "transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {Array.from({ length: segmentCount }).map((_, i) => {
              const startAngle = (i * segmentAngle * Math.PI) / 180;
              const endAngle = ((i + 1) * segmentAngle * Math.PI) / 180;
              const x1 = 100 + 100 * Math.cos(startAngle);
              const y1 = 100 + 100 * Math.sin(startAngle);
              const x2 = 100 + 100 * Math.cos(endAngle);
              const y2 = 100 + 100 * Math.sin(endAngle);
              return (
                <path
                  key={i}
                  d={`M100,100 L${x1},${y1} A100,100 0 0,1 ${x2},${y2} Z`}
                  fill={colors[i]}
                  opacity={0.7}
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth="0.5"
                />
              );
            })}
            {/* Center */}
            <circle cx="100" cy="100" r="20" fill="#1e1b4b" stroke="#a855f7" strokeWidth="2" />
            <text x="100" y="105" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
              🎢
            </text>
          </svg>
        </div>
      </div>

      {/* Spin button */}
      <div className="text-center mt-8">
        <button
          onClick={spin}
          disabled={spinning}
          className="px-10 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-lg hover:from-pink-400 hover:to-purple-400 disabled:opacity-50 transition-all shadow-lg shadow-pink-500/25 active:scale-95"
        >
          {spinning ? (kidMode ? "Spinning...! 🌀" : "Spinning...") : (kidMode ? "🎰 SPIN!" : "Spin the Wheel")}
        </button>
      </div>

      {/* Fact display */}
      {currentFact && (
        <div className="mt-8 p-6 bg-gray-900/80 border border-purple-500/20 rounded-2xl text-center animate-fade-in">
          <p className="text-lg text-purple-100 leading-relaxed">{currentFact}</p>
        </div>
      )}
    </section>
  );
}
