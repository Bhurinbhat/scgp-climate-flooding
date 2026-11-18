// Vercel Serverless Function: GET /api/climate
// Extra data for the Climate Change Management (Flooding) page — complements /api/water:
//  - RID / ThaiWater stations the 7-trigger drawings need that /api/water does not keep (C.2, C.13, C.29A, K.63, Kgt.10 …), with discharge
//  - Rainfall per SCGP site (45 sites, all countries): last 24 h and next 24 h, peak mm/h — Open-Meteo forecast API
//  - Ground elevation per site — Copernicus DEM (GLO-90) via Open-Meteo elevation API (surface model, screening only)
//  - Predicted sea level at the Mae Klong and Chao Phraya river mouths — Open-Meteo marine API (tide model)
const sites = require('./_lib/climate-sites.json');
const TW = 'https://api-v3.thaiwater.net/api/v1/thaiwater30/public/waterlevel_load';
const TWH = { 'User-Agent': 'Mozilla/5.0 (SCGP BCM Water Dashboard)', Referer: 'https://www.thaiwater.net/', Accept: 'application/json' };
const CODES = ['C.2', 'C.13', 'C.29A', 'C.7A', 'K.63', 'K.11A', 'K.55A', 'K.37', 'K.35A', 'Kgt.10', 'Kgt.13A', 'Kgt.3', 'Kgt.43A', 'Kgt.12A', 'E.22B', 'CPY012', 'CPY014', 'GLF001', 'MKG006'];
const MOUTHS = [['Mae Klong mouth', 13.33, 99.99], ['Chao Phraya mouth', 13.45, 100.6]];

function num(x) { return x == null || x === '' || isNaN(+x) ? null : +x; }
async function j(url, headers, ms) {
  const r = await fetch(url, { headers: headers || { Accept: 'application/json' }, signal: AbortSignal.timeout(ms || 20000) });
  if (!r.ok) throw new Error(url.split('?')[0] + ' HTTP ' + r.status);
  return r.json();
}
const ll = (a) => 'latitude=' + a.map((s) => s[1]).join(',') + '&longitude=' + a.map((s) => s[2]).join(',');

async function stations() {
  const d = await j(TW, TWH, 25000);
  const rows = (d.waterlevel_data && d.waterlevel_data.data) || [];
  const want = new Set(CODES);
  const out = rows.filter((x) => x.station && want.has(x.station.tele_station_oldcode)).map((x) => {
    const s = x.station;
    return { id: s.id, code: s.tele_station_oldcode, name: (s.tele_station_name && s.tele_station_name.th) || '', lat: num(s.tele_station_lat), lng: num(s.tele_station_long),
      t: x.waterlevel_datetime, wl: num(x.waterlevel_msl), q: num(x.discharge != null ? x.discharge : x.flow_rate), pct: num(x.storage_percent), sit: x.situation_level,
      bank: num(s.min_bank), ground: num(s.ground_level), river: x.river_name || '', agency: x.agency && x.agency.agency_shortname ? x.agency.agency_shortname.th : '' };
  });
  return { rows: out, fields: rows[0] ? Object.keys(rows[0]) : [] };
}

async function rain() {
  const d = await j('https://api.open-meteo.com/v1/forecast?' + ll(sites) + '&hourly=precipitation&past_days=1&forecast_days=2&timezone=Asia%2FBangkok');
  const arr = Array.isArray(d) ? d : [d];
  const now = Date.now();
  return arr.map((x) => {
    const h = x.hourly || {}, t = h.time || [], p = h.precipitation || [];
    let past = 0, next = 0, peak = 0, peakAt = null;
    t.forEach((s, i) => {
      const ms = Date.parse(s + ':00+07:00'), v = p[i] || 0;
      if (ms <= now && ms > now - 864e5) past += v;
      if (ms > now && ms <= now + 864e5) { next += v; if (v > peak) { peak = v; peakAt = s; } }
    });
    return [Math.round(past * 10) / 10, Math.round(next * 10) / 10, peak, peakAt];
  });
}

async function elev() {
  const d = await j('https://api.open-meteo.com/v1/elevation?' + ll(sites));
  return d.elevation || [];
}

async function tide() {
  const d = await j('https://marine-api.open-meteo.com/v1/marine?' + ll(MOUTHS) + '&hourly=sea_level_height_msl&past_days=1&forecast_days=2&timezone=Asia%2FBangkok');
  const arr = Array.isArray(d) ? d : [d];
  return arr.map((x, i) => ({ name: MOUTHS[i][0], lat: MOUTHS[i][1], lng: MOUTHS[i][2], time: (x.hourly || {}).time || [], h: (x.hourly || {}).sea_level_height_msl || [] }));
}

// Snapshot store (separate Supabase project): write with the ingest key, read the latest when every source fails
const SB = process.env.SUPABASE_URL, SBK = process.env.SUPABASE_ANON_KEY, KEY = process.env.CLIMATE_INGEST_KEY;
async function rpc(fn, args) {
  const r = await fetch(SB + '/rest/v1/rpc/' + fn, { method: 'POST', headers: { apikey: SBK, Authorization: 'Bearer ' + SBK, 'Content-Type': 'application/json' }, body: JSON.stringify(args || {}), signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error(fn + ' HTTP ' + r.status);
  return r.json();
}

module.exports = async (req, res) => {
  const names = ['stations', 'rain', 'elev', 'tide'];
  const r = await Promise.allSettled([stations(), rain(), elev(), tide()]);
  let body = { fetchedAt: new Date().toISOString(), sites: sites.map((s) => s[0]), errors: [], source: 'live' };
  r.forEach((x, i) => { if (x.status === 'fulfilled') body[names[i]] = x.value; else body.errors.push(names[i] + ': ' + x.reason.message); });
  if (SB && SBK) {
    if (body.errors.length < names.length) {
      if (KEY) { try { body.stored = await rpc('climate_ingest', { p_key: KEY, p_payload: body }); } catch (e) { body.stored = 'error: ' + e.message; } }
    } else {
      try { const last = await rpc('climate_latest'); if (last && last.payload) body = Object.assign(last.payload, { source: 'stored', storedAt: last.storedAt, errors: body.errors }); } catch (e) {}
    }
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=1800');
  res.status(200).json(body);
};
