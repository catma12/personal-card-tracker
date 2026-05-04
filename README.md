# Personal Card Tracker

A personal credit card portfolio manager for tracking cards, benefits, spending goals, and welcome bonus eligibility.

## Features

- **Dashboard** — Portfolio overview with stats, spending goals, and categorized credit tracker ("Use This Month" grouped by Travel, Dining, Transportation, etc.)
- **My Cards** — Add, edit, and manage your credit cards with annual fee tracking and keep/cancel decisions
- **Credits & Benefits** — Track all card credits and benefits with usage status
- **5/24 Tracker** — Monitor Chase 5/24 status with timeline view
- **Welcome Bonus Eligibility** — Check eligibility across issuers (Chase, Amex, Citi, Capital One, Marriott cross-issuer rules)
- **Transfer Partners** — Browse airline and hotel transfer partners by issuer
- **Calendar** — Upcoming annual fees and benefit resets
- **Settings** — App preferences

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Supabase (database + auth)

## Local Development

```sh
# Install dependencies
npm install

# Start dev server
npm run dev
```

Requires a Supabase project. Copy `.env.example` to `.env` and fill in your Supabase URL and anon key.
