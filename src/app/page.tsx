"use client";

import { useEffect } from "react";
import { ModeProvider } from "@/lib/ModeContext";
import { getUserId, logVisit } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Timeline from "@/components/Timeline";
import CoasterBuilder from "@/components/CoasterBuilder";
import TriviaChallenge from "@/components/TriviaChallenge";
import AiChat from "@/components/AiChat";
import CoasterCards from "@/components/CoasterCards";
import FactSpinner from "@/components/FactSpinner";
import { FirstVisitConfetti, HiddenClickEasterEgg } from "@/components/BirthdayEasterEggs";

export default function Home() {
  useEffect(() => {
    const userId = getUserId();
    logVisit(userId);
  }, []);

  return (
    <ModeProvider>
      <FirstVisitConfetti />
      <Navbar />
      <main className="pt-14">
        <Hero />
        <Timeline />
        <CoasterBuilder />
        <TriviaChallenge />
        <AiChat />
        <CoasterCards />
        <FactSpinner />
      </main>
      <footer className="text-center py-8 text-purple-400 text-sm border-t border-purple-500/10">
        <p>
          Built with love for a coaster-obsessed drummer{" "}
          <HiddenClickEasterEgg />
        </p>
        <p className="text-xs text-purple-500 mt-1">CoasterVerse &copy; 2026</p>
      </footer>
    </ModeProvider>
  );
}
