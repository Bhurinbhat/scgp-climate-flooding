// Temporary: discover which open feeds carry the remaining slots (removed after use)
const BASE = 'https://api-v3.thaiwater.net/api/v1/thaiwater30/public/';
const H = { 'User-Agent': 'Mozilla/5.0 (SCGP BCM Water Dashboard)', Referer: 'https://www.thaiwater.net/', Accept: 'application/json' };
const j = async (u) => { const r = await fetch(u, { headers: H, signal: AbortSignal.timeout(25000) }); return r.ok ? r.json() : { status: r.status }; };
const st = (s) => s && { id: s.id, old: s.tele_station_oldcode, name: s.tele_station_name && s.tele_station_name.th, lat: s.tele_station_lat, lng: s.tele_station_long };
module.exports = async (req, res) => {
  const out = {};
  const wl = await j(BASE + 'waterlevel_load');
  const rows = (wl.waterlevel_data && wl.waterlevel_data.data) || [];
  out.wl = rows.filter((x) => /พระปรง|สะทึง/.test(x.river_name || '') || /บางไทร/.test(JSON.stringify(x.geocode || '')) || /ท่าม่วง/.test(JSON.stringify(x.geocode || '')))
    .map((x) => Object.assign(st(x.station), { t: x.waterlevel_datetime, wl: x.waterlevel_msl, q: x.discharge, river: x.river_name, sit: x.situation_level }));
  const tm = await j(BASE + 'thailand_main');
  const rain = (tm.rain && tm.rain.data && tm.rain.data.data) || [];
  out.rainSt = rain.filter((x) => x.station && /TC\.29|TK\.63/.test(x.station.tele_station_oldcode || '')).map((x) => Object.assign(st(x.station), { r: x.rain_24h }));
  out.graph = {};
  for (const s of out.rainSt) {
    try { const g = await j(BASE + 'waterlevel_graph?station_type=tele_waterlevel&station_id=' + s.id); const d = g.data || g; out.graph[s.old] = { keys: Object.keys(d || {}).slice(0, 12), n: (d.graph_data || []).length, last: (d.graph_data || []).slice(-1)[0] || null, bank: d.min_bank || null }; } catch (e) { out.graph[s.old] = { error: e.message }; }
  }
  res.status(200).json(out);
};
