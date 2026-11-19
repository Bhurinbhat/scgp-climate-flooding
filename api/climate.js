// Vercel Serverless Function: GET /api/climate
// Extra data for the Climate Change Management (Flooding) page — complements /api/water:
//  - RID / ThaiWater stations the 7-trigger drawings need that /api/water does not keep (C.2, C.13, C.29A, K.63, Kgt.10 …), with discharge
//  - Rainfall per SCGP site (45 sites, all countries): last 24 h and next 24 h, peak mm/h — Open-Meteo forecast API
//  - Ground elevation per site — Copernicus DEM (GLO-90) via Open-Meteo elevation API (surface model, screening only)
//  - Predicted sea level at the Mae Klong and Chao Phraya river mouths — Open-Meteo marine API (tide model)
const sites = require('./_lib/climate-sites.json');
const TW = 'https://api-v3.thaiwater.net/api/v1/thaiwater30/public/waterlevel_load';
const TWH = { 'User-Agent': 'Mozilla/5.0 (SCGP BCM Water Dashboard)', Referer: 'https://www.thaiwater.net/', Accept: 'application/json' };
const CODES = ['K.79', 'C.2', 'C.13', 'C.29A', 'C.7A', 'K.63', 'K.11A', 'K.55A', 'K.37', 'K.35A', 'Kgt.10', 'Kgt.13A', 'Kgt.3', 'Kgt.43A', 'Kgt.12A', 'E.22B', 'CPY012', 'CPY014', 'GLF001', 'MKG006'];
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


// กรมชลประทาน: medium reservoirs (Prapong, Prasatung) — same JSON the RID reservoir page loads
async function reservoirs() {
  // today's report appears later in the day; fall back to the previous day's report until then
  const day = (k) => new Date(Date.now() + 7 * 3600e3 - k * 864e5).toISOString().slice(0, 10);
  for (const d of ['', day(1), day(2)]) { const out = await rsvDay(d); if (out.some((x) => x.vol != null)) return out; }
  return rsvDay('');
}
async function rsvDay(date) {
  const r = await fetch('https://app.rid.go.th/reservoir/api/rsvmiddles', { method: 'POST', headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'date=' + date + '&region=&percent=&percent_from=&percent_to=&status=1', signal: AbortSignal.timeout(20000) });
  if (!r.ok) throw new Error('rsvmiddles HTTP ' + r.status);
  const d = await r.json(), out = [];
  (function walk(o) { if (!o || typeof o !== 'object') return; if (Array.isArray(o)) return o.forEach(walk); if (o.nresv && /พระปรง|สะทึง/.test(o.nresv)) out.push({ name: o.nresv, date: o.date, lat: num(o.cresv_lat), lng: num(o.cresv_lng), cap: num(o.cap_resv), vol: num(o.qdisc_curr), pct: num(o.percent_resv_curr), inflow: num(o.q_info), outflow: num(o.q_outfo), province: o.tprov }); else Object.values(o).forEach(walk); })(d);
  return out;
}


// กรมชลประทาน: large reservoirs (data.go.th "อ่างเก็บน้ำขนาดใหญ่" → app.rid.go.th/reservoir/api/dam/public)
async function bigdams() {
  const r = await fetch('https://app.rid.go.th/reservoir/api/dam/public', { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' }, signal: AbortSignal.timeout(25000) });
  if (!r.ok) throw new Error('rid dam HTTP ' + r.status);
  const d = await r.json(), out = [];
  (d.data || []).forEach((g) => (g.dam || []).forEach((x) => out.push({ id: x.id, name: x.name, region: g.region, owner: x.owner, cap: num(x.capacity), vol: num(x.volume), active: num(x.active_storage), pct: num(x.percent_storage), inflow: num(x.inflow), outflow: num(x.outflow) })));
  return { date: d.date, dams: out };
}


// WaterWest (ติดตามลุ่มน้ำแม่กลอง, ข้อมูลกรมชลประทาน): stations missing from ThaiWater (K.63) and K.11A discharge
const WW = ['K.63', 'K.11A'];
const TM = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
function thaiTime(x) { // "19 พ.ย. 09:00 น." → "2026-11-19 09:00:00" (Asia/Bangkok)
  const m = x.match(/(\d{1,2})\s*(\S+?\.\S*?\.)\s*(\d{1,2}):(\d{2})/); if (!m) return x.trim();
  const mo = TM.indexOf(m[2]); if (mo < 0) return x.trim();
  const now = new Date(Date.now() + 7 * 3600e3); let y = now.getUTCFullYear(); if (mo > now.getUTCMonth() + 1) y--;
  const p = (n) => String(n).padStart(2, '0');
  return y + '-' + p(mo + 1) + '-' + p(+m[1]) + ' ' + p(+m[3]) + ':' + m[4] + ':00';
}
async function waterwest() {
  const out = [];
  await Promise.all(WW.map(async (code) => {
    const url = 'https://waterwest.info/stations/' + code;
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (SCGP BCM Climate Dashboard)', Accept: 'text/html' }, signal: AbortSignal.timeout(15000) });
    if (!r.ok) return;
    const t = (await r.text()).replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
    const m = t.match(/ระดับน้ำ\s*(-?[\d.]+)\s*ม\.รทก\.\s*·\s*ตลิ่ง\s*(-?[\d.]+)/);
    if (!m) return;
    const q = t.match(/ปริมาณน้ำ\s*([\d,.]+)\s*ลบ\.ม\./), when = t.match(/วัดเมื่อ\s*([^·]+?)\s*·/), name = t.match(new RegExp('(\\S[^·]{1,40}?)\\s*' + code.replace('.', '\\.') + '\\s*·\\s*กรมชลประทาน'));
    const wl = num(m[1]), bank = num(m[2]);
    out.push({ code, name: name ? name[1].trim().split(' ').slice(-2).join(' ') : code, wl, bank, q: q ? num(q[1].replace(/,/g, '')) : null, t: when ? thaiTime(when[1]) : null, river: 'แม่น้ำแม่กลอง', agency: 'ชป. (WaterWest)', src: url });
  }));
  return out;
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
  const names = ['stations', 'rain', 'elev', 'tide', 'reservoirs', 'bigdams'];
  const r = await Promise.allSettled([stations(), rain(), elev(), tide(), reservoirs(), bigdams()]);
  let body = { fetchedAt: new Date().toISOString(), sites: sites.map((s) => s[0]), errors: [], source: 'live' };
  r.forEach((x, i) => { if (x.status === 'fulfilled') body[names[i]] = x.value; else body.errors.push(names[i] + ': ' + x.reason.message); });
  try {
    const ww = await waterwest();
    if (body.stations) ww.forEach((w) => {
      const row = body.stations.rows.find((x) => x.code === w.code);
      if (row) { if (row.q == null && w.q != null) { row.q = w.q; row.qsrc = w.src; } }
      else body.stations.rows.push({ id: null, code: w.code, name: w.name, t: w.t, wl: w.wl, q: w.q, pct: null, sit: w.bank && w.wl != null ? (w.wl >= w.bank ? 5 : (w.bank - w.wl) < 1 ? 4 : 3) : null, bank: w.bank, river: w.river, agency: w.agency, src: w.src });
    });
    body.waterwest = ww;
  } catch (e) { body.errors.push('waterwest: ' + e.message); }
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
