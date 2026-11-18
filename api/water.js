// GET /api/water — latest water data from the SCGP Water Management Dashboard
module.exports = require('./_lib/proxy')('/api/water', 's-maxage=300, stale-while-revalidate=600');
