"use client";

import { useState, useEffect } from "react";
import { useMode } from "@/lib/ModeContext";
import { coasterCards, type CoasterCard, type Rarity } from "@/lib/data";
import { getUserId, getUnlockedCards } from "@/lib/supabase";

const rarityColors: Record<Rarity, { border: string; bg: string; text: string; glow: string }> = {
  Common: { border: "border-gray-500", bg: "from-gray-700 to-gray-800", text: "text-gray-300", glow: "" },
  Rare: { border: "border-blue-400", bg: "from-blue-900 to-indigo-900", text: "text-blue-300", glow: "shadow-blue-500/20" },
  Legendary: { border: "border-yellow-400", bg: "from-yellow-900/50 to-amber-900", text: "text-yellow-300", glow: "shadow-yellow-500/30" },
};

export default function CoasterCards() {
  const { kidMode } = useMode();
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      const userId = getUserId(kidMode);
      const cards = await getUnlockedCards(userId);
      // Default unlocked cards
      const defaults = coasterCards.filter((c) => c.unlockMethod === "default").map((c) => c.id);

      // Birthday cards - unlock during their birthday month
      const currentMonth = new Date().getMonth(); // 0-indexed
      const birthdayCards: string[] = [];
      if (currentMonth === 3) { // April - Dad's birthday
        const aprilCard = coasterCards.find((c) => c.unlockMethod === "birthday-april");
        if (aprilCard) birthdayCards.push(aprilCard.id);
      }
      if (currentMonth === 9) { // October - Son's birthday
        const octoberCard = coasterCards.find((c) => c.unlockMethod === "birthday-october");
        if (octoberCard) birthdayCards.push(octoberCard.id);
      }

      setUnlocked(new Set([...cards, ...defaults, ...birthdayCards]));
    })();
  }, [kidMode]);

  const toggleFlip = (id: string) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section id="cards" className="py-20 px-4 max-w-6xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-black text-center mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        {kidMode ? "🃏 Coaster Trading Cards!" : "Collectible Coaster Cards"}
      </h2>
      <p className="text-center text-purple-300 mb-4">
        {kidMode ? "Collect them ALL! Tap a card to flip it!" : "Click to flip. Unlock cards through trivia, building, and daily visits."}
      </p>
      <p className="text-center text-sm text-purple-400 mb-8">
        {unlocked.size} / {coasterCards.length} unlocked
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {coasterCards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            isFlipped={flipped.has(card.id)}
            isUnlocked={unlocked.has(card.id)}
            kidMode={kidMode}
            onFlip={() => toggleFlip(card.id)}
          />
        ))}
      </div>
    </section>
  );
}

function CardItem({
  card,
  isFlipped,
  isUnlocked,
  kidMode,
  onFlip,
}: {
  card: CoasterCard;
  isFlipped: boolean;
  isUnlocked: boolean;
  kidMode: boolean;
  onFlip: () => void;
}) {
  const r = rarityColors[card.rarity];

  if (!isUnlocked) {
    // Special display for birthday cards
    const isBirthdayCard = card.unlockMethod.startsWith("birthday-");
    const birthdayMonth = card.unlockMethod === "birthday-april" ? "April" : card.unlockMethod === "birthday-october" ? "October" : null;

    return (
      <div className={`aspect-[3/4] rounded-xl border-2 flex flex-col items-center justify-center p-4 text-center ${
        isBirthdayCard
          ? "bg-gradient-to-b from-pink-900/30 to-purple-900/30 border-pink-500/30"
          : "bg-gray-900 border-gray-700"
      }`}>
        <span className="text-4xl mb-3">{isBirthdayCard ? "🎂" : "🔒"}</span>
        <p className={`text-xs ${isBirthdayCard ? "text-pink-300" : "text-gray-500"}`}>
          {isBirthdayCard
            ? `Unlocks in ${birthdayMonth}!`
            : card.unlockMethod}
        </p>
        {isBirthdayCard && (
          <p className="text-[10px] text-pink-400 mt-1">Birthday Special</p>
        )}
      </div>
    );
  }

  return (
    <div
      className="aspect-[3/4] cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={onFlip}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 rounded-xl border-2 ${r.border} bg-gradient-to-b ${r.bg} p-4 flex flex-col justify-between shadow-lg ${r.glow}`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${r.text}`}>
              {card.rarity}
            </span>
            <h3 className="text-lg font-black text-white mt-1 leading-tight">{card.name}</h3>
            <p className="text-xs text-purple-300 mt-1">{card.park}</p>
          </div>
          <div className="text-center">
            <span className="text-5xl">🎢</span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-xs text-purple-400">{card.year}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-pink-500/20 text-pink-300">
              {card.type}
            </span>
          </div>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 rounded-xl border-2 ${r.border} bg-gradient-to-b from-gray-900 to-gray-950 p-4 flex flex-col justify-between shadow-lg ${r.glow}`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div>
            <h3 className="text-sm font-black text-white leading-tight">{card.name}</h3>
            <p className="text-[10px] text-purple-400">{card.park} • {card.year}</p>
          </div>
          <div className="space-y-1.5 text-xs">
            <StatRow label="Speed" value={`${card.speed} mph`} />
            <StatRow label="Height" value={`${card.height} ft`} />
            <StatRow label="Length" value={`${card.length.toLocaleString()} ft`} />
            <StatRow label="Inversions" value={`${card.inversions}`} />
            <StatRow label="Thrill" value={"⭐".repeat(Math.min(card.thrillRating, 5)) + (card.thrillRating > 5 ? `+${card.thrillRating - 5}` : "")} />
          </div>
          {kidMode && (
            <p className="text-[10px] text-pink-300 italic mt-2">{card.kidComparison}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-purple-400">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}
