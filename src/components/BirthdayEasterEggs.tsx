"use client";

import { useState, useEffect } from "react";

export function FirstVisitConfetti() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const key = "coasterverse_visited";
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, "true");
      setShow(true);
      setTimeout(() => setShow(false), 5000);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 80 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-10px",
            width: `${6 + Math.random() * 8}px`,
            height: `${6 + Math.random() * 8}px`,
            borderRadius: Math.random() > 0.5 ? "50%" : "0",
            backgroundColor: [
              "#f43f5e", "#fbbf24", "#22c55e", "#3b82f6", "#a855f7",
              "#ec4899", "#06b6d4", "#f97316",
            ][i % 8],
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
}

export function HiddenClickEasterEgg() {
  const [clicks, setClicks] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  const handleClick = () => {
    const next = clicks + 1;
    setClicks(next);
    if (next >= 38) {
      setUnlocked(true);
      setTimeout(() => setUnlocked(false), 6000);
      setClicks(0);
    }
  };

  return (
    <>
      {/* Hidden clickable element in footer */}
      <button
        onClick={handleClick}
        className="inline-block opacity-60 hover:opacity-100 transition-opacity cursor-default"
        title={clicks > 0 ? `${38 - clicks} more...` : ""}
        aria-label="Hidden easter egg"
      >
        🎢
      </button>

      {/* Easter egg animation */}
      {unlocked && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="animate-scale-in text-center">
            <div className="text-8xl animate-bounce mb-4">🎂</div>
            <div className="bg-gray-900/95 border-2 border-yellow-400 rounded-2xl px-8 py-6 shadow-2xl shadow-yellow-500/20">
              <p className="text-3xl font-black bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                HAPPY 38TH!
              </p>
              <p className="text-purple-300 mt-2">
                38 clicks for 38 years — you found the secret!
              </p>
              <div className="flex justify-center gap-2 mt-3">
                {["🎢", "🎪", "🎠", "🎡", "🎆"].map((e, i) => (
                  <span key={i} className="text-2xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                    {e}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/* Firework confetti */}
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-5px",
                width: `${4 + Math.random() * 6}px`,
                height: `${4 + Math.random() * 6}px`,
                borderRadius: "50%",
                backgroundColor: ["#fbbf24", "#f43f5e", "#a855f7", "#22c55e", "#3b82f6"][i % 5],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
