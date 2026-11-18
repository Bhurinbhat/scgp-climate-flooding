// GET /api/history?stations=<id>&range=1D|1W|1M — station trend from the SCGP Water Management Dashboard
module.exports = require('./_lib/proxy')('/api/history', 's-maxage=900, stale-while-revalidate=1800');
