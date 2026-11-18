// Temporary: discover which open feeds carry the remaining slots (removed after use)
module.exports = async (req, res) => {
  const out = {};
  for (const u of ['https://app.rid.go.th/reservoir/rsvmiddle', 'https://app.rid.go.th/reservoir/rsvmiddle?region=6']) {
    try {
      const r = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'text/html,application/json' }, signal: AbortSignal.timeout(25000) });
      const t = await r.text();
      const i = t.search(/พระปรง/), k = t.search(/สะทึง/);
      out[u] = { status: r.status, len: t.length, ctype: r.headers.get('content-type'), a: i >= 0 ? t.slice(Math.max(0, i - 600), i + 900) : null, b: k >= 0 ? t.slice(Math.max(0, k - 300), k + 900) : null, scripts: (t.match(/(?:src|url)\s*[:=]\s*["'][^"']*(?:api|json|data)[^"']*["']/gi) || []).slice(0, 15) };
    } catch (e) { out[u] = { error: e.message }; }
  }
  res.status(200).json(out);
};
