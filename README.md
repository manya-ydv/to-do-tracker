# Productivity & Daily Planner

Matches the layout of the reference app ([Replit example](https://asset-manager--manya-13.replit.app)): top title + **Planner** / **Insights** routes, calendar table, **Routines** with a short loading state, and **`# Friday`** style day header.

Dark-mode planner with:
- Binary checklist tasks and quantifiable progress tasks
- Date-specific task boards with mini-calendar
- Auto-cloned recurring daily routines
- End-of-day cleanup modal + browser notification
- Monthly insights (pie, bar, streak)

## Tech Stack
- React (Vite)
- Tailwind CSS
- Recharts
- Local storage persistence

## Run locally
1. Install Node.js (includes `npm`).
2. In this folder:
   - `npm install`
   - `npm run dev`

## Run on Replit
1. Create a new Repl and upload this folder (or import from GitHub).
2. Replit runs `npm install && npm run dev` (see `.replit`).
3. Open the **Webview** tab for your public `*.replit.app` URL.

## Put on GitHub and get a website URL

I cannot log into your GitHub account or create the repo for you. Your **live URL** will only exist **after** you host the built app (for example **GitHub Pages**).

### 1) Install Git (Windows)
Download and install from [https://git-scm.com/download/win](https://git-scm.com/download/win), then reopen your terminal so `git` works.

### 2) Create an empty repo on GitHub
On [GitHub](https://github.com): **New repository** → name it (e.g. `productivity-planner`) → leave “Add README” **unchecked** → **Create repository**.

### 3) Push this folder from your PC
In PowerShell (replace `YOUR_USER` and `YOUR_REPO`):

```powershell
cd "C:\Users\DELL\OneDrive\Documents\productivity-planner"
git init
git checkout -b main
git add .
git commit -m "Initial commit: productivity planner"
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

If GitHub asks for a password, use a **Personal Access Token** (not your account password): [GitHub tokens](https://github.com/settings/tokens).

### 4) Turn on GitHub Pages (Actions)
1. Repo **Settings** → **Pages** → **Build and deployment** → Source: **GitHub Actions**.
2. Push `main` again (or open **Actions** and re-run **Deploy to GitHub Pages**).

Your site URL will be:

`https://YOUR_USER.github.io/YOUR_REPO/`

(That exact string is shown in the workflow run under **deploy** → **page_url** after the first successful deploy.)

The workflow file `.github/workflows/github-pages.yml` builds with `VITE_BASE_PATH` set to your repo name so routing works under a project URL.

## Architecture

### UI Layout
- **Nav:** `SiteNav` — `/` Planner, `/insights` Monthly Insights
- **Planner page:** Left — `CalendarPanel` + `RoutinePanel`; main — `DayHeader` (`# weekday`), `TaskComposer`, `TaskList`
- **Insights page:** `InsightsPanel` (charts + streak)
- Overlay: `EndOfDayModal`

### Data Model (Local Database Schema)
The app uses a local-storage document with two main collections:

```json
{
  "tasksByDate": {
    "2026-04-03": [
      {
        "id": "uuid",
        "title": "Study for Exams",
        "type": "quantifiable",
        "completed": false,
        "target": 5,
        "actual": 2,
        "unit": "hours",
        "originRoutineId": null
      },
      {
        "id": "uuid",
        "title": "Call parents",
        "type": "checklist",
        "completed": false,
        "target": null,
        "actual": null,
        "unit": null,
        "originRoutineId": null
      }
    ]
  },
  "routines": [
    {
      "id": "routine-uuid",
      "title": "Exercise",
      "type": "quantifiable",
      "completed": false,
      "target": 1,
      "actual": 0,
      "unit": "hour",
      "originRoutineId": null
    }
  ]
}
```

### Task Logic
- Checklist task:
  - completion = `completed ? 100 : 0`
- Quantifiable task:
  - completion = `min(100, round(actual / target * 100))`
  - displayed using progress bar

### Routine Auto-Clone Logic
Implemented in `withRoutineInjection()` in `src/App.jsx`:
1. Read the active day list from `tasksByDate[dateKey]`.
2. Detect routine instances already present (`originRoutineId` exists).
3. For each master routine not present on that date, create a fresh task instance and append.
4. Save result into `tasksByDate[dateKey]`.

This means routines are injected lazily per viewed day and persisted once created.

### End-of-Day Trigger
- A timer checks every 30 seconds.
- At 21:00 local time:
  - it calculates incomplete tasks for today,
  - opens a modal with action buttons:
    - mark complete
    - delete
    - migrate to tomorrow
  - optionally fires browser notification (if permission granted).

### Monthly Insights
`buildMonthlyInsights()` scans the past 30 days and computes:
- Pie buckets: Fully Completed / Partially Completed / Ignored
- Bar metric: average completion % of quantifiable tasks
- Streak: longest consecutive sequence where all expected routines reached 100%

## File Structure
```
productivity-planner/
  .gitignore
  .replit
  src/
    components/
      CalendarPanel.jsx
      DayHeader.jsx
      EndOfDayModal.jsx
      InsightsPanel.jsx
      RoutinePanel.jsx
      SiteNav.jsx
      TaskComposer.jsx
      TaskList.jsx
    context/
      PlannerContext.jsx
    pages/
      HomePage.jsx
      InsightsPage.jsx
    utils/
      analytics.js
      date.js
      planner.js
      storage.js
    App.jsx
    index.css
    main.jsx
  index.html
  package.json
  postcss.config.js
  tailwind.config.js
  vite.config.js
```
