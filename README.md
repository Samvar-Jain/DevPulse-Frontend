# BudgetBrain Frontend

A React dashboard for **BudgetBrain**, an AI-powered personal finance tracker. Upload bank statements, see spending broken down by category, get AI-generated insights, and track savings goals — all in one responsive interface.

<p>
  <img src="https://img.shields.io/badge/react-18+-61DAFB" alt="React 18+">
  <img src="https://img.shields.io/badge/build-Vite-646CFF" alt="Vite">
  <img src="https://img.shields.io/badge/styling-Tailwind%20CSS%20v4-38BDF8" alt="Tailwind CSS v4">
  <img src="https://img.shields.io/badge/license-MIT-lightgrey" alt="MIT License">
</p>

**Live app:** https://budgetbrain-frontend.vercel.app

**Part of the BudgetBrain project:**
| Service | Description |
|---|---|
| **budgetbrain-frontend** *(this repo)* | React dashboard |
| [budgetbrain-api](https://github.com/Samvar-Jain/BudgetBrain-api) | Spring Boot backend orchestrator |
| [budgetbrain-ml](https://github.com/Samvar-Jain/BudgetBrain-ml) | Python ML classifier |

---

## What it does

Drag in a CSV bank statement and the dashboard uploads it to the backend, shows classification progress, then renders:

- an interactive **doughnut chart** of spending by category
- an **AI insights panel** with plain-English spending analysis (Gemini, via the backend)
- a **transactions table** with search, filters, and pagination
- a **savings goals tracker** with progress bars and deadlines

## Quick Start

Requires **Node.js 16+ and npm**, plus the [Spring Boot API](https://github.com/Samvar-Jain/BudgetBrain-api) running on `http://localhost:8080` (which in turn needs the [Python ML service](https://github.com/Samvar-Jain/BudgetBrain-ml) on `http://localhost:8000`).

```bash
git clone https://github.com/Samvar-Jain/BudgetBrain-frontend.git
cd budgetbrain-frontend

npm install
npm run dev
```

Runs at `http://localhost:5173`. It talks to `http://localhost:8080` by default — override with a `VITE_API_BASE_URL` env variable if your backend lives elsewhere.

```bash
npm run build      # production build → dist/
npm run preview    # preview the production build locally
```

---

## Features

- **CSV upload & auto-classification** — drag-and-drop with real-time progress
- **Interactive spending chart** — Chart.js doughnut chart with a dynamic legend
- **AI spending insights** — Gemini-powered recommendations in a chat-like panel
- **Savings goals tracker** — create, update, and monitor progress with deadlines
- **Transaction dashboard** — filter, search, and paginate uploaded transactions
- **Responsive, dark-mode-optimized UI** — Tailwind CSS v4 + Lucide icons

## Tech Stack

React 18 (Vite) · Tailwind CSS v4 · Chart.js + react-chartjs-2 · Axios · Lucide Icons · deployed on Vercel

---

<details>
<summary><strong>Component overview</strong></summary>

```
App
├── Sidebar Navigation
├── KPI Cards (Income, Expenses, Net Savings, Goal Progress %)
├── Tabs (Transactions | Analytics)
│   ├── TransactionGrid   — search, filter, pagination
│   ├── CategoryChart     — interactive doughnut chart
│   └── InsightsPanel     — AI recommendations
├── UploadForm            — drag-and-drop CSV import
└── GoalsTracker          — CRUD + progress bars
```

**`App.jsx`** — root component; orchestrates layout and state, persisted via `localStorage`.

**`UploadForm.jsx`** — drag-and-drop CSV import with `.csv`-only validation, upload progress, and retry-friendly error messages.

**`CategoryChart.jsx`** — Chart.js doughnut chart with per-category totals/percentages, hover tooltips, and a Tailwind-styled custom legend.

**`InsightsPanel.jsx`** — "Get Insight" button calls the Gemini-backed `/insights` endpoint; shows a skeleton loader, renders markdown, supports copy-to-clipboard.

**`GoalsTracker.jsx`** — full CRUD for savings goals: create via modal, inline quick-edit for `currentAmount`, delete with confirmation, progress bar + deadline display.

**`TransactionGrid.jsx`** — paginated transaction list with category filter, live search, optional date-range filtering, sorting, and per-row delete.

</details>

<details>
<summary><strong>API integration</strong></summary>

### Base URL

```javascript
// src/api/client.js
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
```

Set `VITE_API_BASE_URL=https://budgetbrain-api.onrender.com` in the Vercel dashboard for production.

### Endpoints called

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/upload` | Upload CSV, get classified transactions |
| `GET` | `/insights` | Fetch AI spending summary |
| `GET` | `/goals` | List savings goals |
| `POST` | `/goals` | Create a goal |
| `PUT` | `/goals/{id}` | Update goal progress |
| `DELETE` | `/goals/{id}` | Delete a goal |

Errors surface as user-friendly messages in the UI with retry buttons where the failure is likely transient; details are also logged to the console. If the env var isn't set, calls fall back to `localhost`.

</details>

<details>
<summary><strong>Styling & design system</strong></summary>

**Tailwind CSS v4** — Plus Jakarta Sans font, dark-mode-optimized palette (slate/gray + accents), slide-in page transitions, mobile-first breakpoints.

**Lucide Icons** — used for upload, AI insights (sparkles), goals (target), category markers, and edit/delete actions.

**Category color palette:**

```javascript
const CATEGORY_COLORS = {
  Food: "#F59E0B",      // Amber
  Transport: "#3B82F6", // Blue
  Travel: "#8B5CF6",    // Purple
  Shopping: "#EC4899",  // Pink
  Bills: "#EF4444",     // Red
  Finance: "#10B981",   // Green
  Health: "#14B8A6",    // Teal
  Income: "#22C55E",    // Lime
  Other: "#6B7280",     // Gray
};
```

</details>

<details>
<summary><strong>State management (localStorage)</strong></summary>

Transactions and goals are cached client-side for instant reloads:

```javascript
// On upload success
localStorage.setItem('transactions', JSON.stringify(transactions));

// On goal changes
localStorage.setItem('goals', JSON.stringify(goals));

// On mount
const cached = localStorage.getItem('transactions');
if (cached) setTransactions(JSON.parse(cached));
```

**Trade-offs:** fast reloads with no network call, but state doesn't sync across devices and needs a manual refresh path when data changes elsewhere.

</details>

<details>
<summary><strong>Deployment (Vercel)</strong></summary>

Vercel auto-deploys on every push to `main`:

```bash
git push origin main
```

To redeploy manually: **Vercel Dashboard → BudgetBrain-frontend → Deployments → ⋯ → Redeploy**.

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist/` |
| Node version | 18.x (Vercel default) |

</details>

<details>
<summary><strong>Testing locally (all three services)</strong></summary>

```bash
# Terminal 1 — Python ML service
cd ../budgetbrain-ml
source venv/bin/activate
uvicorn main:app --reload --port 8000

# Terminal 2 — Spring Boot API
cd ../budgetbrain-api
./mvnw spring-boot:run

# Terminal 3 — React frontend
cd ../budgetbrain-frontend
npm run dev
```

Then in the browser at `http://localhost:5173`:

1. Upload `real_test_data.csv`
2. Confirm the doughnut chart renders with categories
3. Click **Get Insight** and wait 3–8s for the Gemini response
4. Create a goal, then update its `currentAmount` and confirm the progress bar updates
5. Delete the goal and confirm it disappears

</details>

<details>
<summary><strong>Project structure</strong></summary>

```
budgetbrain-frontend/
├── src/
│   ├── components/
│   │   ├── UploadForm.jsx
│   │   ├── CategoryChart.jsx
│   │   ├── InsightsPanel.jsx
│   │   ├── GoalsTracker.jsx
│   │   └── TransactionGrid.jsx
│   ├── api/
│   │   └── client.js              # Axios instance, env-based base URL
│   ├── App.jsx                    # Main dashboard component
│   ├── index.css                  # Tailwind + custom animations
│   └── main.jsx                   # React entry point
├── public/                        # Static assets
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

</details>

<details>
<summary><strong>Development workflow</strong></summary>

**Add a new component:** create it under `src/components/`, import it in `App.jsx`, render it in JSX — Vite hot-reloads immediately.

**Add a new API call:** extend `src/api/client.js` if it needs new base config, call it from the component (`apiClient.get('/endpoint')`), then handle the response/error and update state.

**Style new elements:** prefer Tailwind utility classes; add custom rules to `index.css` and custom colors to `tailwind.config.js` when needed.

</details>

<details>
<summary><strong>Known limitations</strong></summary>

| Limitation | Details |
|---|---|
| **Upload fails on live deployment** | Works locally, but returns `502` on Render due to the Python ML service's cold-start timeout (documented in the API repo). Test locally where all three services run together. |
| **Only the latest upload is kept** | A new CSV upload overwrites previous transaction data in `localStorage`. Multi-upload history is a planned enhancement. |
| **No authentication** | Data is stored locally / in a shared database with no per-user isolation. |
| **Gemini rate limits** | Frequent "Get Insight" clicks can hit free-tier limits — keep it to roughly 3 per minute. |

</details>

<details>
<summary><strong>Debugging</strong></summary>

**API calls not working?**
- Is the backend up? `curl http://localhost:8080/goals` should return `[]` or an error, not hang
- Check `VITE_API_BASE_URL` in the browser console: `console.log(import.meta.env.VITE_API_BASE_URL)`
- Look for CORS errors in the Network tab — if blocked, the backend's `@CrossOrigin` origins need updating

**Chart not displaying?**
- Confirm the dependency is installed: `npm list react-chartjs-2`
- Check the browser console for errors
- Verify `localStorage.getItem('transactions')` actually has data

**Goals not persisting?**
- Some privacy extensions (e.g. Privacy Badger) or Firefox settings block `localStorage`
- Check DevTools → Application → Local Storage for `transactions` and `goals` keys

**Slow initial load?**
- Vercel cold start (~5–10s) plus a Render backend cold start (~30–60s on the free tier) is expected, not a bug

</details>

---

## Performance

Vite code-splits components automatically, Chart.js loads on demand, icons are SVG, and Tailwind purges unused styles in production — production bundle is roughly **~150KB gzipped**, with hot reload under 100ms in local dev.

## Browser Support

Chrome/Edge 90+, Firefox 88+, Safari 14+, and modern mobile browsers (iOS Safari, Chrome Mobile). Built on standard React 18, Tailwind, and Axios — no bleeding-edge APIs.

## Roadmap

Transaction history across uploads · budget alerts · recurring transaction detection · CSV/PDF export · React Native app · light mode toggle · multi-language support · authentication & cloud sync · crypto support

## Contributing

This is a portfolio project — contributions aren't actively solicited, but the codebase is open for learning and reference.

## License

MIT

## Questions?

See the [BudgetBrain ML repo](https://github.com/Samvar-Jain/BudgetBrain-ml) for the full system architecture and integration details.
