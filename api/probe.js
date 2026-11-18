// Temporary: discover which open feeds carry the remaining slots (removed after use)
const BASE = 'https://api-v3.thaiwater.net/api/v1/thaiwater30/public/';
const H = { 'User-Agent': 'Mozilla/5.0 (SCGP BCM Water Dashboard)', Referer: 'https://www.thaiwater.net/', Accept: 'application/json' };
const WANT = /พระปรง|สะทึง|ประสาท|บางไทร|ท่าม่วง|C\.29|K\.63/;
function scan(o, path, out, depth) {
  if (out.length > 40 || depth > 6 || o == null) return;
  if (typeof o === 'string') { if (WANT.test(o)) out.push(path + ' = ' + o.slice(0, 80)); return; }
  if (Array.isArray(o)) { o.forEach((x, i) => scan(x, path + '[' + i + ']', out, depth + 1)); return; }
  if (typeof o === 'object') Object.keys(o).forEach((k) => scan(o[k], path + '.' + k, out, depth + 1));
}
module.exports = async (req, res) => {
  const names = (req.query.n || 'thailand_main,dam_load,dam_medium,medium_dam,dam_medium_load,waterlevel_load').split(',');
  const out = {};
  await Promise.all(names.map(async (n) => {
    try {
      const r = await fetch((n.startsWith('http') ? '' : BASE) + n, { headers: H, signal: AbortSignal.timeout(25000) });
      const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {}
      const hits = []; if (j) scan(j, '', hits, 0);
      out[n] = { status: r.status, keys: j && typeof j === 'object' ? Object.keys(j).slice(0, 20) : t.slice(0, 120), hits };
    } catch (e) { out[n] = { error: e.message }; }
  }));
  res.status(200).json(out);
};
