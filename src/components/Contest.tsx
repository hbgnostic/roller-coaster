"use client";

import { useState, useEffect, useCallback } from "react";
import { useMode } from "@/lib/ModeContext";
import {
  getUserId,
  getTriviaScore,
  getVisitCount,
  getDesignCount,
  getUnlockedCards,
  checkContestWon,
  markContestWon,
} from "@/lib/supabase";
import { coasterCards } from "@/lib/data";

// Confetti celebration popup
function WinCelebration({ kidMode, onClose }: { kidMode: boolean; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: "-10px",
              width: `${8 + Math.random() * 10}px`,
              height: `${8 + Math.random() * 10}px`,
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

      {/* Modal */}
      <div className="relative z-10 mx-4 max-w-md animate-scale-in">
        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border-4 border-yellow-400 rounded-3xl p-8 shadow-2xl shadow-yellow-500/30 text-center">
          {/* Bouncing emojis */}
          <div className="flex justify-center gap-3 mb-4">
            {["🎉", "🎢", "🏆", "🎢", "🎉"].map((e, i) => (
              <span
                key={i}
                className="text-4xl md:text-5xl animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {e}
              </span>
            ))}
          </div>

          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
            {kidMode ? "YOU WON!!!" : "YOU WON!"}
          </h2>

          <p className="text-xl md:text-2xl text-yellow-100 mb-6 leading-relaxed">
            {kidMode
              ? "You and Dad did it! You've won TWO TICKETS to the theme park of your choice!"
              : "You've both completed the challenge! You've won two tickets to the theme park of your choice!"}
          </p>

          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 mb-6">
            <p className="text-lg text-yellow-200 font-medium">
              {kidMode
                ? "🎁 Gigi knows — go ask her about your prize!"
                : "🎁 Gigi has been notified about your prize!"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 font-bold text-lg rounded-xl shadow-lg hover:scale-105 transition-transform"
          >
            {kidMode ? "AWESOME! 🎢" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Contest goals
const GOALS = {
  trivia: 7,
  visits: 10,
  cards: 8,
};

interface UserProgress {
  trivia: number;
  visits: number;
  cards: number;
  designs: number;
  hasWon: boolean;
}

function ProgressBar({ current, goal, label, icon, kidMode }: {
  current: number;
  goal: number;
  label: string;
  icon: string;
  kidMode: boolean;
}) {
  const percent = Math.min((current / goal) * 100, 100);
  const complete = current >= goal;

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-sm">
        <span className={kidMode ? "text-yellow-300" : "text-amber-300"}>
          {icon} {label}
        </span>
        <span className={complete ? "text-green-400 font-bold" : "text-amber-400"}>
          {current}/{goal} {complete && "✓"}
        </span>
      </div>
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            complete
              ? "bg-gradient-to-r from-green-500 to-emerald-400"
              : kidMode
              ? "bg-gradient-to-r from-orange-500 to-red-500"
              : "bg-gradient-to-r from-red-600 to-orange-500"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function PlayerCard({ title, progress, kidMode, isKidPlayer }: {
  title: string;
  progress: UserProgress;
  kidMode: boolean;
  isKidPlayer: boolean;
}) {
  const hasCompletedAny =
    progress.trivia >= GOALS.trivia ||
    progress.visits >= GOALS.visits ||
    progress.cards >= GOALS.cards;

  return (
    <div className={`p-4 rounded-xl border ${
      hasCompletedAny
        ? "bg-green-900/20 border-green-500/30"
        : "bg-gray-900/50 border-red-500/20"
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{isKidPlayer ? "👦" : "👨"}</span>
        <h4 className="font-bold text-white">{title}</h4>
        {hasCompletedAny && (
          <span className="ml-auto text-green-400 text-sm font-medium">
            {kidMode ? "DONE! 🎉" : "Complete!"}
          </span>
        )}
      </div>
      <div className="space-y-3">
        <ProgressBar
          current={progress.trivia}
          goal={GOALS.trivia}
          label={kidMode ? "Quiz Questions" : "Trivia Correct"}
          icon="🧠"
          kidMode={kidMode}
        />
        <ProgressBar
          current={progress.visits}
          goal={GOALS.visits}
          label={kidMode ? "Days Visited" : "Days Visited"}
          icon="📅"
          kidMode={kidMode}
        />
        <ProgressBar
          current={progress.cards}
          goal={GOALS.cards}
          label={kidMode ? "Cards Collected" : "Cards Unlocked"}
          icon="🃏"
          kidMode={kidMode}
        />
      </div>
    </div>
  );
}

export default function Contest() {
  const { kidMode } = useMode();
  const [adultProgress, setAdultProgress] = useState<UserProgress | null>(null);
  const [kidProgress, setKidProgress] = useState<UserProgress | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [alreadyWonBefore, setAlreadyWonBefore] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProgress = useCallback(async () => {
    // Get both user IDs
    const adultId = getUserId(false);
    const kidId = getUserId(true);

    // Load adult progress
    const [adultTrivia, adultVisits, adultDesigns, adultCards] = await Promise.all([
      getTriviaScore(adultId),
      getVisitCount(adultId),
      getDesignCount(adultId),
      getUnlockedCards(adultId),
    ]);

    // Load kid progress
    const [kidTrivia, kidVisits, kidDesigns, kidCards] = await Promise.all([
      getTriviaScore(kidId),
      getVisitCount(kidId),
      getDesignCount(kidId),
      getUnlockedCards(kidId),
    ]);

    // Get default cards count
    const defaultCards = coasterCards.filter((c) => c.unlockMethod === "default").length;

    const adultData: UserProgress = {
      trivia: adultTrivia?.total_correct ?? 0,
      visits: adultVisits,
      cards: (adultCards?.length ?? 0) + defaultCards,
      designs: adultDesigns,
      hasWon:
        (adultTrivia?.total_correct ?? 0) >= GOALS.trivia ||
        adultVisits >= GOALS.visits ||
        ((adultCards?.length ?? 0) + defaultCards) >= GOALS.cards,
    };

    const kidData: UserProgress = {
      trivia: kidTrivia?.total_correct ?? 0,
      visits: kidVisits,
      cards: (kidCards?.length ?? 0) + defaultCards,
      designs: kidDesigns,
      hasWon:
        (kidTrivia?.total_correct ?? 0) >= GOALS.trivia ||
        kidVisits >= GOALS.visits ||
        ((kidCards?.length ?? 0) + defaultCards) >= GOALS.cards,
    };

    setAdultProgress(adultData);
    setKidProgress(kidData);

    // Check if both have won
    const alreadyWon = await checkContestWon();

    if (adultData.hasWon && kidData.hasWon && !alreadyWon) {
      // Both just won! Send notification and show celebration
      try {
        await fetch("/api/notify-win", { method: "POST" });
        await markContestWon();
        setShowCelebration(true);
      } catch (err) {
        console.error("Failed to send win notification:", err);
      }
    } else if (alreadyWon) {
      // They won before - just show the "already won" state, not the popup
      setAlreadyWonBefore(true);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const closeCelebration = () => {
    setShowCelebration(false);
    setAlreadyWonBefore(true);
  };

  if (loading) return null;

  const bothWon = adultProgress?.hasWon && kidProgress?.hasWon;

  return (
    <section id="contest" className="py-20 px-4 max-w-4xl mx-auto">
      {/* Celebration Popup - only shows once when they first win */}
      {showCelebration && (
        <WinCelebration kidMode={kidMode} onClose={closeCelebration} />
      )}

      <h2 className="text-4xl md:text-5xl font-black text-center mb-4 bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
        {kidMode ? "🏆 Secret Challenge!" : "Family Challenge"}
      </h2>
      <p className="text-center text-amber-300 mb-8 max-w-xl mx-auto">
        {kidMode
          ? "Complete ANY challenge below — and get Dad to do one too — to unlock a SURPRISE!"
          : "Both players must complete at least one challenge path to unlock a special prize!"}
      </p>

      {/* Already Won Banner - shows on return visits */}
      {alreadyWonBefore && bothWon && (
        <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 text-center">
          <span className="text-2xl mr-2">🏆</span>
          <span className="text-green-300 font-bold">
            {kidMode ? "You already won! Ask Gigi about your prize!" : "Challenge complete! Prize claimed."}
          </span>
        </div>
      )}

      {/* Progress Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <PlayerCard
          title={kidMode ? "Dad's Progress" : "Adult Progress"}
          progress={adultProgress!}
          kidMode={kidMode}
          isKidPlayer={false}
        />
        <PlayerCard
          title={kidMode ? "Your Progress" : "Kid Progress"}
          progress={kidProgress!}
          kidMode={kidMode}
          isKidPlayer={true}
        />
      </div>

      {/* Status Message */}
      {!bothWon && (
        <p className="text-center text-amber-400 text-sm mt-6">
          {adultProgress?.hasWon && !kidProgress?.hasWon
            ? kidMode
              ? "Dad finished! Now it's YOUR turn!"
              : "Adult complete! Waiting for kid to finish a challenge."
            : !adultProgress?.hasWon && kidProgress?.hasWon
            ? kidMode
              ? "You did it! Now Dad needs to finish one!"
              : "Kid complete! Waiting for adult to finish a challenge."
            : kidMode
            ? "Keep going! You both need to finish a challenge!"
            : "Both players need to complete at least one challenge path."}
        </p>
      )}

      {/* How to complete */}
      <div className="mt-8 p-4 bg-gray-900/50 border border-red-500/20 rounded-xl">
        <h4 className="font-bold text-amber-300 mb-2">
          {kidMode ? "How do I complete a challenge?" : "How to complete a challenge"}
        </h4>
        <ul className="text-sm text-amber-200 space-y-1">
          <li>🧠 <strong>Trivia:</strong> {kidMode ? "Answer 7 quiz questions right!" : `Answer ${GOALS.trivia} trivia questions correctly (1 per day)`}</li>
          <li>📅 <strong>Visits:</strong> {kidMode ? "Come back 10 different days!" : `Visit the site on ${GOALS.visits} different days`}</li>
          <li>🃏 <strong>Cards:</strong> {kidMode ? "Collect 8 coaster cards!" : `Unlock ${GOALS.cards} coaster cards (via trivia, visits, or building)`}</li>
        </ul>
      </div>
    </section>
  );
}
