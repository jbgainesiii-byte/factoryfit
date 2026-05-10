# Factory Fit MVP

A clean Next.js/Tailwind MVP for Detroit AI Works. Factory Fit helps first-time apparel founders understand which production path and supplier type fits their clothing brand before they spend money on samples or production.

## Stack

- Next.js app router
- React client-side MVP flow
- Tailwind CSS
- Supabase REST for remote tester storage when env vars are present
- Browser `localStorage` fallback for local/demo use
- Editable research-graded supplier candidate data in `data/suppliers.js`
- Rule-based diagnosis logic in `lib/factoryFit.js`

## Core Features

- Premium editorial landing page
- Multi-step founder intake
- Rule-based production path diagnosis
- Readiness score out of 100
- Personalized report output
- Outreach script generator
- Supplier questions and red flag checklist
- 30-day action plan
- Initial supplier candidate shortlist based on diagnosis
- Hidden PIN-gated admin supplier workspace
- Manual reviewed supplier attachment to a report
- Feedback form

## Run Locally

```bash
npm install
npm run build
python3 -m http.server 3000 --directory out
```

Then open:

```text
http://localhost:3000
```

Hidden admin URL:

```text
/#admin
```

Admin PIN:

```text
factoryfit
```

If port `3000` is busy, use another port:

```bash
python3 -m http.server 3010 --directory out
```

## Data

The MVP reads and writes to Supabase when these variables are available at build time:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Without those variables, it stores submissions, supplier edits, attachments, and feedback in browser `localStorage` under:

```text
factory-fit:next-mvp:v1
```

The Supabase schema lives in:

```text
supabase/schema.sql
```

For this private MVP test, Supabase policies are intentionally open enough for a static site to save intake and feedback data. Tighten RLS and add real admin auth before a public launch.

## Deployment

The app is configured for static export so it can be sent to a tester without a backend.

```bash
npm run build
```

The static app is generated in:

```text
out/
```

You can host `out/` on Netlify, Vercel, Cloudflare Pages, or any static file host.

For Netlify, add these environment variables before building:

```text
NEXT_PUBLIC_SUPABASE_URL=https://haptqwnajdutyyeevivk.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key from Supabase>
```

## Tester Handoff

Send the tester:

```text
Please open the Factory Fit test link and complete the intake as if you were preparing your first clothing drop.

Test flow:
1. Start Factory Fit Check.
2. Answer the intake honestly.
3. Generate the report.
4. Read the recommendation, readiness score, likely mistake, cost reality, outreach script, red flags, and 30-day plan.
5. Leave feedback at the bottom.

Questions to answer after testing:
- Did the report clarify what kind of supplier you need?
- Did it change your next step?
- Did anything feel inaccurate?
- What was missing?
- Would you pay for this? If yes, what price feels fair?
```

Internal admin:

```text
Admin PIN: factoryfit
Use Admin to view submissions, edit supplier candidates, attach a reviewed shortlist to a report, and review feedback.
```

## Notes

This is not a marketplace and does not guarantee supplier performance, pricing, availability, quality, timelines, or business outcomes. It is a decision-support tool for choosing a realistic sourcing path, then creating a small reviewed supplier-candidate shortlist.
