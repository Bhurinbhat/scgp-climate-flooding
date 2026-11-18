// Temporary: discover which open feeds carry the remaining slots (removed after use)
module.exports = async (req, res) => {
  const u = req.query.u || 'https://app.rid.go.th/reservoir/rsvmiddle';
  try {
    const r = await fetch(u, { method: req.query.post ? 'POST' : 'GET', headers: { 'User-Agent': 'Mozilla/5.0', Accept: '*/*', 'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/x-www-form-urlencoded' }, body: req.query.post || undefined, signal: AbortSignal.timeout(25000) });
    const t = await r.text();
    const hits = []; const re = /(ajax|\.php|url\s*:|fetch\(|\$\.get|\$\.post|api\/)[^\n]{0,160}/gi; let m; while ((m = re.exec(t)) && hits.length < 25) hits.push(m[0]);
    const i = t.search(/พระปรง|สะทึง/);
    res.status(200).json({ status: r.status, len: t.length, hits, around: i >= 0 ? t.slice(Math.max(0, i - 400), i + 1200) : null, head: req.query.head ? t.slice(0, 1500) : undefined });
  } catch (e) { res.status(200).json({ error: e.message }); }
};
