# NxtWave Growth Intern Challenge

A prototype for the NxtWave Growth Intern challenge: plan a campaign to get 500 final-year engineering students to register for a free AI workshop in 7 days with a ₹2,000 budget.

**Live demo:** [Open the NxtWave Workshop Growth Tracker](https://rajesh569-babu.github.io/nxtwave-project-demo/)

## What is included
- Dashboard with registration entry, campaign metrics, channel comparison, referral-code tracking, and recent registrations.
- Target progress indicator and rule-based suggestions that update from the data.
- Browser-local saving for entries added during the demo.
- Responsive layout for desktop and mobile.

## Files
- `index.html`: dashboard UI
- `styles.css`: styling
- `script.js`: tracking logic and rule-based suggestions
- `growth-plan.md`: 5-slide growth plan
- `ai-learning-notes.md`: AI usage notes
- `reflection.md`: what changed, next steps, rejected AI suggestions
- `video-script.md`: 3-minute walkthrough script

## Run locally
Open `index.html` in a browser, or run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Notes
This is a simulation, not a live registration service. The 12 starting records are illustrative demo data. New entries are saved in the current browser only. The referral table shows registrations per code and their share of recorded registrations, not a conversion rate, because visits and clicks are not tracked. Suggestions are rule-based, not AI-generated. Targets are planning assumptions, not evidence of results.