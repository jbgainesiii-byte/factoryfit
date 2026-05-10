# Factory Fit Tester Guide

Use this when sending Factory Fit to a first tester.

## What To Send

```text
Can you test this Factory Fit prototype?

Please complete the intake as if you were preparing your first clothing drop. At the end, read the report and tell me whether it clarifies what kind of supplier you actually need.

Please pay attention to:
- whether the recommended production path feels accurate
- whether the readiness score feels fair
- whether the cost reality and likely mistake are helpful
- whether the outreach script sounds usable
- what is missing or confusing
- what you would pay for this, if anything
```

## Tester Flow

1. Open the Factory Fit link.
2. Click `Start Factory Fit Check`.
3. Complete all intake steps.
4. Generate the report.
5. Read:
   - Recommended Production Path
   - Readiness Score
   - Executive Read
   - Cost Reality
   - Your Likely Mistake
   - Outreach Script
   - Red Flags
   - 30-Day Action Plan
6. Submit feedback at the bottom.

## Internal Admin

Admin PIN:

```text
factoryfit
```

Use Admin to:

- view submitted intakes
- review report summaries
- edit seed supplier records
- attach supplier candidates to reports
- read tester feedback

## Important Note

The current MVP can save tester data to Supabase when deployed with the project environment variables. If those variables are not present, it falls back to browser `localStorage`, which means intake, report, admin review, and feedback stay on the same browser/device.

For the first private tester link, use the Supabase-backed deployment so submissions and feedback can be reviewed from the admin view.
