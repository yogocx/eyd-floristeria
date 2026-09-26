// GET  /api/bouquet-status            -> { enabled }
// POST /api/bouquet-status { spec }    -> { key, status: 'ready' | 'pending' | 'error' | 'none', error? }
const { canonical, keyFor, store, json, apiKey } = require('../lib/shared');

exports.handler = async (event) => {
  const enabled = !!apiKey();
  if (event.httpMethod === 'GET') {
    // ?diag=1 comprueba la clave contra OpenAI sin revelarla (útil al configurar el sitio).
    if ((event.queryStringParameters || {}).diag === '1' && enabled) {
      try {
        const r = await fetch('https://api.openai.com/v1/models/gpt-image-1', { headers: { authorization: 'Bearer ' + apiKey() } });
        const d = await r.json().catch(() => ({}));
        return json(200, { enabled, openai: r.status, message: r.ok ? 'ok' : ((d.error && d.error.message) || 'error') });
      } catch (e) { return json(200, { enabled, openai: 0, message: String(e.message || e) }); }
    }
    return json(200, { enabled });
  }
  if (event.httpMethod !== 'POST') return json(405, { error: 'method' });
  if (!enabled) return json(503, { error: 'not-configured' });
  let body; try { body = JSON.parse(event.body || '{}'); } catch (e) { return json(400, { error: 'bad-json' }); }
  const canon = canonical(body.spec); if (!canon) return json(400, { error: 'bad-spec' });
  const key = keyFor(canon);
  try {
    const st = store(event);
    const meta = await st.get('meta/' + key, { type: 'json' });
    if (!meta) return json(200, { key, status: 'none' });
    if (meta.status === 'pending' && Date.now() - meta.started > 120000) return json(200, { key, status: 'none' });
    return json(200, { key, status: meta.status, error: meta.error || undefined });
  } catch (e) {
    return json(500, { error: 'store', detail: String(e.message || e) });
  }
};
