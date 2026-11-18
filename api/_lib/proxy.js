// Server-side pass-through to the SCGP Water Management Dashboard (separate project, left untouched).
const WM = process.env.WM_BASE_URL || 'https://scgp-water-management.vercel.app';
module.exports = (path, cache) => async (req, res) => {
  const q = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  try {
    const r = await fetch(WM + path + q, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(45000) });
    const body = await r.text();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', r.ok ? cache : 'no-store');
    res.status(r.status).send(body);
  } catch (e) {
    res.status(502).json({ error: 'Water Management Dashboard unreachable: ' + e.message });
  }
};
