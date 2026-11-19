// Vercel Serverless Function: GET /api/drought-air
// Data for the Drought and Air quality & Heat pages, for the same 45 SCGP sites as the Flooding page.
//  - Open-Meteo: CAMS air quality (PM2.5, US AQI, 5-day forecast), weather (apparent temperature, rain, ET0, soil moisture)
//  - Copernicus ERA5 via Open-Meteo archive: daily rain since 2010 → monthly normals, 30/90-day anomalies, dry spell
//  - Air4Thai (Pollution Control Department): latest PM2.5 / AQI at the station nearest to each Thai site
//  - Royal Irrigation Department: large reservoirs (dam/public) and medium reservoirs (rsvmiddles)
// The response keeps the compact text format the page parses (one line per site, '|' separated).
const sites = require('./_lib/climate-sites.json');
const tls = require('tls'), https = require('https');
const TZ = 'Asia/Bangkok';
const DAMS = ['ศรีนครินทร์', 'วชิราลงกรณ', 'ภูมิพล', 'สิริกิติ์', 'แควน้อยบำรุงแดน', 'ป่าสักชลสิทธิ์', 'อุบลรัตน์', 'ลำปาว', 'ขุนด่านปราการชล', 'หนองปลาไหล', 'ประแสร์', 'คลองสียัด', 'บางพระ'];
const UA = { 'User-Agent': 'Mozilla/5.0 (SCGP BCM Climate Dashboard)', Accept: 'application/json' };

const R = Math.round, r1 = (x) => Math.round(x * 10) / 10, sum = (a) => a.reduce((p, q) => p + (q || 0), 0);
const num = (x) => (x == null || x === '' || isNaN(+x) ? null : +x);
const ll = 'latitude=' + sites.map((s) => s[1]).join(',') + '&longitude=' + sites.map((s) => s[2]).join(',');
const bkk = (k) => new Date(Date.now() + 7 * 3600e3 - (k || 0) * 864e5).toISOString().slice(0, 10);
async function j(url, opt, ms) {
  const r = await fetch(url, Object.assign({ headers: UA, signal: AbortSignal.timeout(ms || 25000) }, opt || {}));
  if (!r.ok) throw new Error(url.split('?')[0] + ' HTTP ' + r.status);
  return r.json();
}
const arr = (x) => (Array.isArray(x) ? x : [x]);

function km(a, b, c, d) {
  const t = Math.PI / 180, x = (c - a) * t, y = (d - b) * t;
  const h = Math.sin(x / 2) ** 2 + Math.cos(a * t) * Math.cos(c * t) * Math.sin(y / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}


// air4thai.pcd.go.th serves its certificate without the intermediate CA, which Node does not fetch by itself.
// Do what browsers do (AIA chasing): read the "CA Issuers" URL from the server certificate, download that
// intermediate, and verify the connection normally against Node's root store plus that intermediate.
let A4CA = null;
function peerCert(host) {
  return new Promise((ok, no) => {
    const s = tls.connect(443, host, { servername: host, rejectUnauthorized: false }, () => { const c = s.getPeerCertificate(false); s.end(); ok(c); });
    s.on('error', no); s.setTimeout(10000, () => s.destroy(new Error('tls timeout')));
  });
}
async function issuerPem(host) {
  if (A4CA) return A4CA;
  const c = await peerCert(host), uri = c && c.infoAccess && c.infoAccess['CA Issuers - URI'];
  if (!uri || !uri[0]) throw new Error('no AIA');
  const r = await fetch(uri[0], { signal: AbortSignal.timeout(10000) });
  const b = Buffer.from(await r.arrayBuffer()), t = b.toString('latin1');
  A4CA = t.indexOf('-----BEGIN') >= 0 ? t : '-----BEGIN CERTIFICATE-----\n' + b.toString('base64').match(/.{1,64}/g).join('\n') + '\n-----END CERTIFICATE-----\n';
  return A4CA;
}
async function getJsonTls(url) {
  const host = new URL(url).hostname, ca = tls.rootCertificates.concat([await issuerPem(host)]);
  return new Promise((ok, no) => {
    const q = https.get(url, { ca, headers: Object.assign({ Referer: 'https://air4thai.pcd.go.th/' }, UA), timeout: 15000 }, (r) => {
      let d = ''; r.setEncoding('utf8'); r.on('data', (x) => { d += x; }); r.on('end', () => { try { ok(JSON.parse(d)); } catch (e) { no(new Error('air4thai: bad JSON (HTTP ' + r.statusCode + ')')); } });
    });
    q.on('error', no); q.on('timeout', () => q.destroy(new Error('air4thai timeout')));
  });
}

async function air4thai() {
  let d = null, err = null;
  try { d = await getJsonTls('https://air4thai.pcd.go.th/services/getNewAQI_JSON.php'); } catch (e) { err = e; d = null; }
  if (!d) throw new Error((err && (err.cause && err.cause.code || err.message)) || 'no data');
  const st = (d.stations || []).filter((s) => s.AQILast && s.AQILast.PM25 && +s.AQILast.PM25.value >= 0);
  // Thai sites are the first 28 rows of climate-sites.json
  return sites.slice(0, 28).map((p) => {
    let b = null, bd = 1e9;
    st.forEach((s) => { const k = km(p[1], p[2], +s.lat, +s.long); if (k < bd) { bd = k; b = s; } });
    if (!b) return '';
    const prov = String(b.areaTH || '').split(',').pop().trim();
    return [b.stationID, String(b.nameTH || '').replace(/\|/g, ' ').trim(), prov, R(bd), b.AQILast.PM25.value, b.AQILast.AQI.aqi, b.AQILast.time].join('|');
  }).join('\n');
}

async function damsBig() {
  for (const k of [1, 0, 2]) {
    const d = await j('https://app.rid.go.th/reservoir/api/dam/public/' + bkk(k), null, 20000).catch(() => null);
    if (!d) continue;
    const out = {}; let ok = 0;
    (function walk(o) { if (!o || typeof o !== 'object') return; if (Array.isArray(o)) return o.forEach(walk); if (o.name && /^เขื่อน/.test(o.name) && o.percent_storage !== undefined) { const n = o.name.replace(/^เขื่อน/, ''); if (DAMS.includes(n)) { out[n] = [num(o.volume), num(o.percent_storage), num(o.inflow), num(o.outflow)]; if (num(o.percent_storage) != null) ok++; } } else Object.values(o).forEach(walk); })(d);
    if (ok >= 8) return { date: bkk(k), dams: out };
  }
  throw new Error('rid dam/public: no complete day');
}
async function damsMid() {
  for (const k of [0, 1, 2]) {
    const r = await fetch('https://app.rid.go.th/reservoir/api/rsvmiddles', { method: 'POST', headers: Object.assign({ 'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/x-www-form-urlencoded' }, UA), body: 'date=' + (k ? bkk(k) : '') + '&region=&percent=&percent_from=&percent_to=&status=1', signal: AbortSignal.timeout(20000) }).catch(() => null);
    if (!r || !r.ok) continue;
    const d = await r.json(), out = {};
    (function walk(o) { if (!o || typeof o !== 'object') return; if (Array.isArray(o)) return o.forEach(walk); if (o.nresv && /พระปรง|สะทึง/.test(o.nresv)) out[/พระปรง/.test(o.nresv) ? 'อ่างฯ พระปรง' : 'อ่างฯ คลองพระสะทึง'] = [num(o.qdisc_curr), num(o.percent_resv_curr), num(o.q_info), num(o.q_outfo)]; else Object.values(o).forEach(walk); })(d);
    if (Object.values(out).some((v) => v[1] != null)) return out;
  }
  return {};
}

async function build() {
  const today = bkk(0), curY = +today.slice(0, 4), eraEnd = bkk(6);
  const [aq, wx, era] = await Promise.all([
    j('https://air-quality-api.open-meteo.com/v1/air-quality?' + ll + '&current=pm2_5,pm10,us_aqi&hourly=pm2_5&past_days=7&forecast_days=5&timezone=' + TZ, null, 30000).then(arr),
    j('https://api.open-meteo.com/v1/forecast?' + ll + '&current=temperature_2m,relative_humidity_2m,apparent_temperature&daily=temperature_2m_max,apparent_temperature_max,precipitation_sum,et0_fao_evapotranspiration&hourly=soil_moisture_9_to_27cm&past_days=92&forecast_days=7&timezone=' + TZ, null, 30000).then(arr),
    j('https://archive-api.open-meteo.com/v1/archive?' + ll + '&start_date=2010-01-01&end_date=' + eraEnd + '&daily=precipitation_sum&timezone=' + TZ, null, 50000).then(arr)
  ]);
  // shared calendar
  const pmDays = Object.keys(aq[0].hourly.time.reduce((o, t) => { o[t.slice(0, 10)] = 1; return o; }, {}));
  const wd = wx[0].daily.time, ti = wd.indexOf(today);
  const hiDays = wd.slice(ti - 14, ti + 7);
  const eT = era[0].daily.time; let last = eT.length - 1;
  while (last > 0 && era.every((e) => e.daily.precipitation_sum[last] == null)) last--;
  const E = eT[last], eM = +E.slice(5, 7), eD = +E.slice(8, 10), eY = +E.slice(0, 4);
  const months = []; for (let k = 11; k >= 0; k--) { const dt = new Date(Date.UTC(eY, eM - 1 - k, 1)); months.push(dt.toISOString().slice(0, 7)); }
  const normYears = []; for (let y = 2011; y < eY; y++) normYears.push(y);

  const raw = sites.map((s, i) => {
    const a = aq[i], w = wx[i], e = era[i], dd = w.daily;
    const dm = {}; a.hourly.time.forEach((t, k) => { const v = a.hourly.pm2_5[k]; if (v != null) (dm[t.slice(0, 10)] = dm[t.slice(0, 10)] || []).push(v); });
    const pmd = pmDays.map((d) => (dm[d] ? R(sum(dm[d]) / dm[d].length) : 0));
    const hi = dd.apparent_temperature_max.slice(ti - 14, ti + 7).map((v) => R(v));
    const rain30 = sum(dd.precipitation_sum.slice(ti - 30, ti)), et30 = sum(dd.et0_fao_evapotranspiration.slice(ti - 30, ti)), rain7 = sum(dd.precipitation_sum.slice(ti, ti + 7));
    const sm = w.hourly.soil_moisture_9_to_27cm[ti * 24 + 12];
    // ERA5
    const P = e.daily.precipitation_sum, byDay = {};
    eT.forEach((d, k) => { if (k <= last) byDay[d] = P[k] || 0; });
    const mon = {}; Object.keys(byDay).forEach((d) => { const m = d.slice(0, 7); mon[m] = (mon[m] || 0) + byDay[d]; });
    const m12 = months.map((m, k) => {
      const mm = m.slice(5), part = k === 11;
      const vals = normYears.map((y) => { if (!part) return mon[y + '-' + mm]; let t = 0; for (let d = 1; d <= eD; d++) t += byDay[y + '-' + mm + '-' + String(d).padStart(2, '0')] || 0; return t; }).filter((v) => v != null);
      return R(mon[m] || 0) + '/' + R(sum(vals) / vals.length);
    }).join(' ');
    const win = (days) => {
      const vals = []; let cur = 0;
      normYears.concat([eY]).forEach((y) => {
        const end = Date.UTC(y, eM - 1, eD), st = end - (days - 1) * 864e5; let t = 0;
        for (let x = st; x <= end; x += 864e5) t += byDay[new Date(x).toISOString().slice(0, 10)] || 0;
        if (y === eY) cur = t; else vals.push(t);
      });
      const m = sum(vals) / vals.length, sd = Math.sqrt(vals.reduce((p, v) => p + (v - m) ** 2, 0) / (vals.length - 1));
      return [r1(cur), r1(m), Math.round((cur - m) / sd * 100) / 100, R(vals.filter((v) => v < cur).length / vals.length * 100)];
    };
    const w30 = win(30), w90 = win(90);
    let dry = 0; for (let k = last; k >= 0 && (P[k] || 0) < 1; k--) dry++;
    return [R(a.current.pm2_5), a.current.us_aqi, pmd.join(' '), R(w.current.apparent_temperature), hi.join(' '), R(rain30), R(et30), R(rain7), R((sm || 0) * 100), m12, w30.slice(0, 3).map(R).join(' '), w90.join(' '), dry].join('|');
  }).join('\n');

  const errors = [];
  const [a4, big, mid] = await Promise.all([air4thai().catch((x) => { errors.push('air4thai: ' + x.message); return ''; }), damsBig().catch((x) => { errors.push('rid: ' + x.message); return null; }), damsMid().catch((x) => { errors.push('rid mid: ' + x.message); return {}; })]);
  return { asOf: new Date().toISOString(), today, pmDays, hiDays, months, eraEnd: E, raw, a4t: a4, dams: Object.assign({}, big ? big.dams : {}, mid), damsDate: big ? big.date : null, errors };
}

let mem = null;
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    if (!mem || Date.now() - mem.t > 30 * 60e3) mem = { t: Date.now(), body: await build() };
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600');
    res.status(200).json(mem.body);
  } catch (e) {
    if (mem) { res.setHeader('Cache-Control', 'public, s-maxage=300'); return res.status(200).json(Object.assign({ stale: true }, mem.body)); }
    res.status(502).json({ error: e.message });
  }
};
