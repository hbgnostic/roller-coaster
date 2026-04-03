# CoasterVerse - Claude Context

## Project Overview
Interactive roller coaster fan site built as a gift for a son-in-law (Dad) and his 6-year-old son. Features educational content, games, and a family contest to win theme park tickets.

## Tech Stack
- Next.js 14.2 / React 18 / TypeScript
- Tailwind CSS
- Supabase (PostgreSQL)
- Anthropic Claude API (AI chat)
- Resend (email notifications)

## Key Features

### Dual Mode System
- **Kid Mode**: Simplified language, emojis, fun descriptions
- **Adult Mode**: Technical details, proper physics formulas
- Toggle in navbar affects all components
- Separate user tracking (different localStorage IDs, separate DB records)

### Contest System (`/src/components/Contest.tsx`)
- Both Dad and Son must complete ANY one of:
  - 7 trivia correct
  - 10 days visited
  - 8 cards unlocked
- When both win → email to Gigi via `/api/notify-win`
- Uses `contest_wins` table to prevent duplicate notifications

### Birthday Cards
- "Class of '88" unlocks in April (month index 3)
- "Born to Ride" unlocks in October (month index 9)
- Defined in `/src/lib/data.ts` with `unlockMethod: "birthday-april"` etc.

### Coaster Builder Physics
- Speed: `v = √(2gh)` - conservation of energy
- G-force: `v² / (r × g)` - centripetal acceleration
- Radius calculated from curve's second derivative
- G-force warnings at 5G and 10G thresholds

## Database Tables (Supabase)
- `visits` - daily visit tracking
- `trivia_scores` - quiz progress per user
- `saved_designs` - coaster builder saves
- `card_unlocks` - collected cards
- `contest_wins` - tracks if notification was sent

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
RESEND_API_KEY=
NOTIFICATION_EMAIL=
```

## Important Files
- `/src/lib/data.ts` - Timeline, trivia questions, card definitions, facts
- `/src/lib/supabase.ts` - DB helpers, getUserId(kidMode) for separate tracking
- `/src/lib/ModeContext.tsx` - Kid/adult mode React context
- `/src/components/Contest.tsx` - Family challenge with progress bars

## Deployment Notes
- Ready for Vercel deployment
- Environment variables must be set in Vercel dashboard
- Supabase URL is public, anon key is safe for client-side
- ANTHROPIC_API_KEY and RESEND_API_KEY are server-side only (no NEXT_PUBLIC_ prefix)

## Next Steps (as of 2026-04-03)

### Before Testing
- [ ] Run SQL in Supabase to create contest_wins table:
  ```sql
  CREATE TABLE contest_wins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    notified_at TIMESTAMPTZ DEFAULT now()
  );
  ```

### To Test Email Locally
- Resend works from localhost - no deployment needed
- Run `npm run dev` and trigger a win condition
- Or temporarily lower thresholds in Contest.tsx (GOALS object) to test quickly

### Vercel Deployment
1. Push code to GitHub
2. Connect repo to Vercel (vercel.com → New Project → Import)
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY`
   - `RESEND_API_KEY`
   - `NOTIFICATION_EMAIL`
4. Deploy (Vercel auto-detects Next.js)

### URL
- Using Vercel Pro: free auto-generated URL like `coasterverse.vercel.app` works fine
- No need to buy a custom domain
