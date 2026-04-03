# Changelog

## 2026-04-03 - Initial Development Session

### Added
- **Contest System**: Family challenge with progress bars for both Dad and Son
  - Three paths to win: 7 trivia correct, 10 days visited, or 8 cards unlocked
  - Both players must complete at least one path to win
  - Email notification to Gigi (via Resend) when both win
  - Celebration screen with prize message: "Two tickets to the theme park of your choice!"

- **Birthday Cards**: Special collectible cards that unlock during birthday months
  - "Class of '88" - unlocks in April (Dad's birthday)
  - "Born to Ride" - unlocks in October (Son's birthday)
  - Special 🎂 locked card display with "Birthday Special" label

- **Improved G-Force Physics**: Coaster builder now uses proper radius of curvature
  - Formula: G = v² / (r × g)
  - Warnings for unrealistic values: ⚠️ 5-10G "Intense!", ☠️ 10G+ "Not survivable!"
  - Kid mode shows fun indicators: "Smooth! 😎", "WILD!! 🤯", "IMPOSSIBLE! 💀"

- **Physics Explainer**: Collapsible section below coaster stats
  - Adult mode: Shows actual formulas (v = √(2gh), G = v²/rg)
  - Kid mode: Simple story-style explanations

- **Separate User Tracking**: Kid and adult modes now have completely separate progress
  - Different user IDs stored in localStorage
  - Trivia scores, card unlocks, and saved designs tracked independently

- **Preset Button Highlighting**: Visual feedback showing which coaster preset is selected

### Changed
- Footer text: "Built with love for a coaster-obsessed son-in-law"
- Save Design button restored with kid/adult mode support

### Database Tables Required
```sql
-- Run in Supabase SQL editor
CREATE TABLE contest_wins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  notified_at TIMESTAMPTZ DEFAULT now()
);
```

### Environment Variables Added
```
RESEND_API_KEY=re_xxxxx...
NOTIFICATION_EMAIL=bridget@doranconsultingllc.com
```
