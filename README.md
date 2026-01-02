# Unity Bible Church Reader 1.1 (2026)

A simple daily Bible reading web app for Unity Bible Church's **2026 Spiritual Growth Guide**, built for fast navigation, progress tracking, and an embedded Legacy Standard Bible reader.  
It loads the reading plan from JSON files so the schedule can be updated without editing React code.

## Features

- Daily readings split into: Old Testament, Wisdom, New Testament.
- Chapter-by-chapter progress tracking (saved locally in your browser).
- Calendar view to jump to any day quickly.
- Dark mode.
- Embedded LSB reader with an "Open in new tab" fallback (helpful if a browser blocks third‑party embedding).
- "Sunday" entries supported via an `isSunday` flag for custom/rest-day messaging.

## Tech Stack

- React + Vite + TypeScript
- Tailwind CSS
- Lucide icons

## Project Structure

- `src/App.tsx` — main UI + reading logic
- `src/data/` — reading plan JSON files (one per month)
  - `january.json`
  - `february.json`
  - `march.json`
  - (Add more months as needed)

### Data format (per day)

Each month file contains an array of entries like:

```json
{
  "id": "2026-01-01",
  "month": "January",
  "day": 1,
  "dateDisplay": "Thursday, Jan 1",
  "fullDate": "Thursday, January 1",
  "ot": { "book": "Genesis", "chapters": "1-2" },
  "wisdom": { "book": "Psalm", "chapters": "1" },
  "nt": { "book": "Matthew", "chapters": "1" }
}
Notes:

chapters is stored as a string like "1", "1-2", or "1-3,5" (the app expands this to individual chapter buttons).

Optional: isSunday: true to trigger the special Sunday display.

Local Development
bash
npm install
npm run dev
Build for production:

bash
npm run build
npm run preview
Updating the Reading Plan
Add/update JSON files in src/data/ (example: april.json).

Import that file in src/App.tsx and append it into the combined READING_PLAN array.

Commit + push.

Deployment (GitHub Pages)
Vite needs a correct base path when deploying under a repository subpath (typical for GitHub Pages).
For this repo, the vite.config.ts is configured with:

typescript
base: '/Unity-Bible-Church-Reader_1.1/'
The app uses GitHub Actions to automatically build and deploy on every push to main.
Once deployed, it will be live at:

https://unitybiblechurch.github.io/Unity-Bible-Church-Reader_1.1/

Bible Reader
This app links to the Legacy Standard Bible web reader hosted at read.lsbible.org.
Single-chapter links are used for maximum reliability across different browsers.

Licensing / Attribution
This repository’s source code may be licensed under MIT (see LICENSE).
The Legacy Standard Bible text is not included in this repository; it is accessed via the external reader website. [web:7]
If adding any LSB verse text directly into the app, review the LSB “Permission to Quote” terms first. [web:19]
