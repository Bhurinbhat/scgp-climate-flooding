// Temporary: inspect data.go.th (CKAN) datasets of กรมชลประทาน (removed after use)
module.exports = async (req, res) => {
  const u = req.query.u;
  try {
    const r = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json,*/*' }, signal: AbortSignal.timeout(25000) });
    const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {}
    if (j && req.query.pick === 'search') {
      const rs = (j.result && j.result.results) || [];
      return res.status(200).json({ count: j.result && j.result.count, items: rs.map((p) => ({ name: p.name, title: p.title, res: (p.resources || []).map((x) => [x.format, x.url, x.name]).slice(0, 4) })) });
    }
    if (j && req.query.pick === 'pkg') { const p = j.result || {}; return res.status(200).json({ title: p.title, notes: (p.notes || '').slice(0, 400), res: (p.resources || []).map((x) => ({ f: x.format, url: x.url, name: x.name, desc: (x.description || '').slice(0, 200) })) }); }
    res.status(200).json({ status: r.status, ctype: r.headers.get('content-type'), len: t.length, body: t.slice(+req.query.o || 0, (+req.query.o || 0) + (+req.query.n || 3000)) });
  } catch (e) { res.status(200).json({ error: e.message }); }
};
