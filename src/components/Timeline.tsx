"use client";

import { useState, useRef, useEffect } from "react";
import { useMode } from "@/lib/ModeContext";
import { timelineEntries } from "@/lib/data";

export default function Timeline() {
  const { kidMode } = useMode();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(5); // Start with 5 entries for dad

  // Filter to highlighted entries for kid mode
  const kidEntries = timelineEntries.filter(e => e.kidHighlight);

  // For dad mode: only show visibleCount entries
  const visibleEntries = timelineEntries.slice(0, visibleCount);
  const hasMore = visibleCount < timelineEntries.length;

  if (kidMode) {
    return (
      <section id="timeline" className="py-20 px-4 max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-4 bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
          🕰️ Roller Coaster Time Machine!
        </h2>
        <p className="text-center text-amber-300 mb-8">
          Travel through time and see how coasters got AWESOME!
        </p>

        <div className="space-y-4">
          {kidEntries.map((entry, i) => (
            <KidTimelineCard key={entry.year} entry={entry} index={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="timeline" className="py-20 px-4 max-w-4xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-black text-center mb-4 bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
        Roller Coaster Timeline
      </h2>
      <p className="text-center text-amber-300 mb-12">
        Over 200 years of engineering evolution
      </p>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 via-orange-500 to-red-500" />

        {visibleEntries.map((entry, i) => (
          <TimelineItem
            key={entry.year}
            entry={entry}
            index={i}
            isExpanded={expanded === i}
            onToggle={() => setExpanded(expanded === i ? null : i)}
          />
        ))}
      </div>

      {/* Show More button */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setVisibleCount((c) => Math.min(c + 5, timelineEntries.length))}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-lg hover:scale-105 transition-transform"
          >
            Show More History ⬇️
            <span className="block text-xs font-normal opacity-80">
              {timelineEntries.length - visibleCount} more entries
            </span>
          </button>
        </div>
      )}
    </section>
  );
}

// Simple stacked card for kid mode - no flipping needed, easy to read
function KidTimelineCard({
  entry,
  index,
}: {
  entry: (typeof timelineEntries)[0];
  index: number;
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

  // Fun background colors that cycle
  const bgColors = [
    "from-red-600 to-orange-500",
    "from-orange-500 to-yellow-500",
    "from-amber-500 to-red-500",
    "from-yellow-500 to-orange-500",
  ];
  const bgColor = bgColors[index % bgColors.length];

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className={`rounded-2xl p-4 bg-gradient-to-br ${bgColor} shadow-lg`}>
        {/* Header with emoji, title, and year */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{entry.kidEmoji}</span>
          <div>
            <h3 className="text-lg font-black text-white drop-shadow-lg leading-tight">
              {entry.kidTitle}
            </h3>
            <span className="text-sm font-bold text-white/80 bg-black/20 px-2 py-0.5 rounded-full inline-block mt-1">
              {entry.year}
            </span>
          </div>
        </div>
        {/* Description - easy to read without scrolling */}
        <p className="text-base text-white leading-relaxed font-medium">
          {entry.kidDetail}
        </p>
      </div>
    </div>
  );
}

// Adult timeline item
function TimelineItem({
  entry,
  index,
  isExpanded,
  onToggle,
}: {
  entry: (typeof timelineEntries)[0];
  index: number;
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
      <div className="absolute left-6 md:left-1/2 w-4 h-4 -ml-2 rounded-full bg-orange-500 border-2 border-amber-300 z-10 shadow-lg shadow-orange-500/50" />

      {/* Card */}
      <div
        className={`ml-14 md:ml-0 md:w-[45%] ${
          isLeft ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
        }`}
      >
        <button
          onClick={onToggle}
          className="w-full text-left bg-gray-900/80 border border-red-500/20 rounded-xl p-5 hover:border-orange-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-mono font-bold text-yellow-400 bg-orange-500/10 px-2 py-0.5 rounded">
              {entry.year}
            </span>
            <h3 className="text-lg font-bold text-white">{entry.title}</h3>
          </div>
          {isExpanded && (
            <p className="text-amber-200 text-sm leading-relaxed mt-3 animate-in">
              {entry.detail}
            </p>
          )}
          <span className="text-xs text-amber-400 mt-2 inline-block">
            {isExpanded ? "tap to collapse" : "tap to learn more"}
          </span>
        </button>
      </div>
    </div>
  );
}
