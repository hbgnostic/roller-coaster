"use client";

import { useState, useEffect } from "react";
import { useMode } from "@/lib/ModeContext";
import { triviaQuestions } from "@/lib/data";
import { getUserId, getTriviaScore, upsertTriviaScore } from "@/lib/supabase";

export default function TriviaChallenge() {
  const { kidMode } = useMode();
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Pick question by day of year
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const qIndex = dayOfYear % triviaQuestions.length;
  const q = triviaQuestions[qIndex];
  const question = kidMode && q.kidQuestion ? q.kidQuestion : q.question;
  const options = kidMode && q.kidOptions ? q.kidOptions : q.options;
  const funFact = kidMode && q.kidFunFact ? q.kidFunFact : q.funFact;

  useEffect(() => {
    (async () => {
      // Reset state when switching modes
      setSelected(null);
      setRevealed(false);
      setLoaded(false);

      const userId = getUserId(kidMode);
      const score = await getTriviaScore(userId);
      if (score) {
        const today = new Date().toISOString().slice(0, 10);
        if (score.last_played === today) {
          setRevealed(true);
        }
        setStreak(score.streak);
        setTotalCorrect(score.total_correct);
      } else {
        setStreak(0);
        setTotalCorrect(0);
      }
      setLoaded(true);
    })();
  }, [kidMode]);

  const handleAnswer = async (idx: number) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);

    const correct = idx === q.answer;
    const userId = getUserId(kidMode);
    const today = new Date().toISOString().slice(0, 10);
    const newStreak = correct ? streak + 1 : 0;
    const newTotal = correct ? totalCorrect + 1 : totalCorrect;

    setStreak(newStreak);
    setTotalCorrect(newTotal);

    await upsertTriviaScore({
      user_id: userId,
      streak: newStreak,
      last_played: today,
      total_correct: newTotal,
    });
  };

  if (!loaded) return null;

  return (
    <section id="trivia" className="py-20 px-4 max-w-2xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-black text-center mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        {kidMode ? "🧠 Daily Coaster Quiz!" : "Daily Coaster Challenge"}
      </h2>

      {/* Streak */}
      <div className="flex justify-center gap-6 mb-8">
        <div className="text-center">
          <div className="text-3xl font-black text-yellow-400">{streak}</div>
          <div className="text-xs text-purple-300 uppercase tracking-wider">
            {kidMode ? "🔥 Streak" : "Day Streak"}
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-black text-green-400">{totalCorrect}</div>
          <div className="text-xs text-purple-300 uppercase tracking-wider">
            {kidMode ? "⭐ Total" : "Total Correct"}
          </div>
        </div>
      </div>

      {/* Question card */}
      <div className="bg-gray-900/80 border border-purple-500/20 rounded-2xl p-6 md:p-8">
        <p className="text-lg md:text-xl font-semibold text-white mb-6">{question}</p>

        <div className="space-y-3">
          {options.map((opt, i) => {
            let style = "bg-gray-800/50 border-purple-500/20 text-purple-100 hover:border-pink-500/40";
            if (revealed) {
              if (i === q.answer) style = "bg-green-900/40 border-green-500/50 text-green-200";
              else if (i === selected) style = "bg-red-900/40 border-red-500/50 text-red-200";
              else style = "bg-gray-800/30 border-gray-700/30 text-gray-500";
            }
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={revealed}
                className={`w-full text-left px-5 py-3 rounded-xl border transition-all duration-300 ${style}`}
              >
                <span className="font-mono text-sm mr-3 opacity-60">{String.fromCharCode(65 + i)}</span>
                {opt}
                {revealed && i === q.answer && <span className="ml-2">✓</span>}
              </button>
            );
          })}
        </div>

        {/* Fun fact reveal */}
        {revealed && (
          <div className="mt-6 p-4 bg-purple-900/20 border border-purple-500/20 rounded-xl">
            <p className="text-sm text-purple-200">
              <span className="font-bold text-pink-400">
                {kidMode ? "Cool fact! " : "Fun fact: "}
              </span>
              {funFact}
            </p>
          </div>
        )}

        {revealed && (
          <p className="text-center text-purple-400 text-sm mt-4">
            Come back tomorrow for a new question!
          </p>
        )}
      </div>
    </section>
  );
}
