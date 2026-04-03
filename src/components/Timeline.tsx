"use client";

import { useState, useRef, useEffect } from "react";
import { useMode } from "@/lib/ModeContext";
import { timelineEntries } from "@/lib/data";

export default function Timeline() {
  const { kidMode } = useMode();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="timeline" className="py-20 px-4 max-w-4xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-black text-center mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        {kidMode ? "🕰️ Roller Coaster Time Machine!" : "Roller Coaster Timeline"}
      </h2>
      <p className="text-center text-purple-300 mb-12">
        {kidMode ? "Travel through time and see how coasters got AWESOME!" : "Over 200 years of engineering evolution"}
      </p>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500" />

        {timelineEntries.map((entry, i) => (
          <TimelineItem
            key={entry.year}
            entry={entry}
            index={i}
            kidMode={kidMode}
            isExpanded={expanded === i}
            onToggle={() => setExpanded(expanded === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
}

function TimelineItem({
  entry,
  index,
  kidMode,
  isExpanded,
  onToggle,
}: {
  entry: (typeof timelineEntries)[0];
  index: number;
  kidMode: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative flex items-start mb-8 md:mb-12 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Timeline dot */}
      <div className="absolute left-6 md:left-1/2 w-4 h-4 -ml-2 rounded-full bg-pink-500 border-2 border-purple-300 z-10 shadow-lg shadow-pink-500/50" />

      {/* Card */}
      <div
        className={`ml-14 md:ml-0 md:w-[45%] ${
          isLeft ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
        }`}
      >
        <button
          onClick={onToggle}
          className="w-full text-left bg-gray-900/80 border border-purple-500/20 rounded-xl p-5 hover:border-pink-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-mono font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded">
              {entry.year}
            </span>
            <h3 className="text-lg font-bold text-white">{entry.title}</h3>
          </div>
          {isExpanded && (
            <p className="text-purple-200 text-sm leading-relaxed mt-3 animate-in">
              {kidMode ? entry.kidDetail : entry.detail}
            </p>
          )}
          <span className="text-xs text-purple-400 mt-2 inline-block">
            {isExpanded ? "tap to collapse" : "tap to learn more"}
          </span>
        </button>
      </div>
    </div>
  );
}
