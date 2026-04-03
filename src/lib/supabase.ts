import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ---------- Helper Types ----------
export interface TriviaScore {
  id?: string;
  user_id: string;
  streak: number;
  last_played: string; // ISO date
  total_correct: number;
}

export interface SavedDesign {
  id?: string;
  user_id: string;
  name: string;
  points: { x: number; y: number }[];
  created_at?: string;
}

export interface CardUnlock {
  user_id: string;
  card_id: string;
  unlocked_at?: string;
}

export interface VisitLog {
  user_id: string;
  visited_at: string;
}

// ---------- Persistence helpers ----------
const USER_ID_KEY_ADULT = "coasterverse_user_id_adult";
const USER_ID_KEY_KID = "coasterverse_user_id_kid";

export function getUserId(kidMode: boolean = false): string {
  if (typeof window === "undefined") return "server";
  const key = kidMode ? USER_ID_KEY_KID : USER_ID_KEY_ADULT;
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export async function logVisit(userId: string) {
  const today = new Date().toISOString().slice(0, 10);
  await supabase
    .from("visits")
    .upsert({ user_id: userId, visited_at: today }, { onConflict: "user_id,visited_at" });
}

export async function getVisitCount(userId: string): Promise<number> {
  const { count } = await supabase
    .from("visits")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);
  return count ?? 0;
}

export async function getTriviaScore(userId: string): Promise<TriviaScore | null> {
  const { data } = await supabase
    .from("trivia_scores")
    .select("*")
    .eq("user_id", userId)
    .single();
  return data;
}

export async function upsertTriviaScore(score: TriviaScore) {
  await supabase
    .from("trivia_scores")
    .upsert(score, { onConflict: "user_id" });
}

export async function saveDesign(design: SavedDesign) {
  await supabase.from("saved_designs").insert(design);
}

export async function getDesigns(userId: string): Promise<SavedDesign[]> {
  const { data } = await supabase
    .from("saved_designs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getUnlockedCards(userId: string): Promise<string[]> {
  const { data } = await supabase
    .from("card_unlocks")
    .select("card_id")
    .eq("user_id", userId);
  return data?.map((d) => d.card_id) ?? [];
}

export async function unlockCard(userId: string, cardId: string) {
  await supabase
    .from("card_unlocks")
    .upsert({ user_id: userId, card_id: cardId }, { onConflict: "user_id,card_id" });
}

export async function getDesignCount(userId: string): Promise<number> {
  const { count } = await supabase
    .from("saved_designs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);
  return count ?? 0;
}

// ---------- Contest helpers ----------
export async function checkContestWon(): Promise<boolean> {
  const { count } = await supabase
    .from("contest_wins")
    .select("*", { count: "exact", head: true });
  return (count ?? 0) > 0;
}

export async function markContestWon() {
  await supabase.from("contest_wins").insert({});
}
