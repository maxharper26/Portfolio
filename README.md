# Max Harper — Portfolio

Personal portfolio site built with Next.js, deployed on Vercel.

**Live URL:** https://personalportfolio-sand-seven.vercel.app/#projects

---

## Stack

- Next.js 13 (pages router)
- Recharts for interactive charts
- Vercel Blob for TWR data cache
- CSS via `styles/globals.css` (no CSS modules, no Tailwind)

---

## Repo Structure

```
portfolio/
├── pages/
│   ├── _app.js               # Imports globals.css
│   ├── index.jsx             # Main page (hero, projects, experience, education)
│   └── api/
│       └── twr.js            # API route — fetches portfolio-twr-cache.json from Vercel Blob
├── public/
│   ├── data/
│   │   └── twr_by_model.json # ML model cumulative returns (export from vix notebook)
│   ├── imgs/                 # Photos
│   └── pdfs/                 # CV, Thesis
├── styles/
│   └── globals.css           # All styles live here
├── next.config.js
└── .env.local                # BLOB_READ_WRITE_TOKEN (never commit)
```

---

## Data Sources

### Portfolio TWR (`/api/twr`)

- Reads `portfolio-twr-cache.json` from Vercel Blob
- Blob shape: `{ twr: [{date, twr}], vgs: [{date, twr}] }` — both series indexed to 100
- Written by the unified-app (`/api/stocks.js`) on each load, with 24h in-memory throttle
- Manual seed: `scripts/upload_twr_from_file.mjs` in the unified-app repo

### ML Model Returns (`/data/twr_by_model.json`)

- Static file in `public/data/` — generated from the VIX notebook
- Shape: `{ "Model Name": { "YYYY-MM-DD": value, ... }, ... }`
- To regenerate, run in `vix-mini/analysis/ml_sims_vis.ipynb`:

```python
import json
from pathlib import Path
twr_export = {name: tdf['cumulative_fixed_trade_size_return'].to_dict() for name, tdf in trades_dfs.items()}
with open(Path('../portfolio/public/data/twr_by_model.json'), 'w') as f:
    json.dump({str(k): v for k, v in twr_export.items()}, f)
```

- Model name keys must match exactly: `Linear Regression`, `Ridge Regression`, `Lasso Regression`, `Random Forest`, `Gradient Boosting`, `Neural Network`, `Nearest Neighbors`, `LSTM`

---

## Vercel Deployment

1. Import repo in Vercel, set **root directory** to `portfolio`
2. Add env var: `BLOB_READ_WRITE_TOKEN` (same token as unified-app)
3. No runtime config needed — Next.js auto-detected, API routes run as serverless functions

Shared blob token: see `.env.local` (also used by `unified-app`).

---

## Things to Remember

- **All CSS in `globals.css`** — inline `<style>` tags in JSX cause Next.js hydration errors
- **Blob shape is `{ twr, vgs }`** — `index.jsx` reads `data.twr` and `data.vgs` separately; don't flatten to an array
- **TWR values are indexed to 100** — display as numbers, not percentages; Y axis domain `[95, 'auto']`
- **ML returns are raw cumulative** (0 → ~13) — Y axis domain `[0, 13]`
- **`edit_file` preferred over `str_replace`** for MCP filesystem edits; use `write_file` for heavily-edited files
- **Node scripts don't load `.env.local`** — pass blob token explicitly when running scripts
- **`index.html`** in repo root is the old static version — ignore it

---

## Related Repos / Paths

- Unified-app (stocks dashboard): `/Users/maxharper/Desktop/random/todo`
- VIX notebook: `/Users/maxharper/Desktop/random/vix-mini/analysis/`
- Unified-app deployed: `https://unified-app-sepia.vercel.app`
