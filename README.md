# SCGP Climate Change Management — Flooding

Climate-risk web page for SCG Packaging (Flooding module), linked to the **SCGP Water Management Dashboard** (`scgp-water-management`, a separate project that this repo does not change).

| Live | https://scgp-climate-flooding.vercel.app |
|---|---|
| Part | Where |
| Web page | `public/index.html` (built) — served at `/` |
| Water data | `/api/water` → server-side pass-through to `scgp-water-management.vercel.app/api/water` |
| Station trend | `/api/history?stations=<id>&range=1D\|1W\|1M` → pass-through to `/api/history` |
| Extra sources | `/api/climate` — RID/ThaiWater stations (C.2, C.13, C.29A, K.63, Kgt.10 …), Open-Meteo rain (past/next 24 h), Copernicus DEM ground level (via Open-Meteo elevation), Open-Meteo marine predicted sea level |
| Database | Supabase project `scgp-climate-flooding` — `climate_snapshots` (one row ≤ every 30 min, kept 180 days) |

## Edit
1. Change `src/addon/*` (live feed, map, trigger points, flood area) — `src/base.html` is the original page.
2. `python3 build.py` → writes `public/index.html`.
3. Commit + push `main` → Vercel deploys.

## Environment (Vercel)
`SUPABASE_URL`, `SUPABASE_ANON_KEY` (publishable), `CLIMATE_INGEST_KEY` (sensitive; its SHA-256 is in `app_secrets`). Optional `WM_BASE_URL`.

## Supabase
`supabase/migrations/001_init.sql`. RLS on, no table policies; writes only through `climate_ingest(key, payload)`, reads through `climate_latest()`.

## Data notes
- DEM is a surface model (buildings/trees) for screening only; use plant survey levels for alert thresholds.
- No open source for Pipe & pump (Engineering/Utility), RID medium reservoirs (Prapong, Prasatung), or Navy tide predictions.
