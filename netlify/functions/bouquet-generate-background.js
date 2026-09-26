// POST /api/bouquet-generate { spec } -> 202 de inmediato; genera la imagen con OpenAI en segundo plano
// y la guarda en Netlify Blobs bajo la clave de la selección. Límite diario configurable con MAX_GENERATIONS_PER_DAY.
const { canonical, keyFor, prompt, store, apiKey } = require('../lib/shared');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST' || !apiKey()) return { statusCode: 400 };
  let body; try { body = JSON.parse(event.body || '{}'); } catch (e) { return { statusCode: 400 }; }
  const canon = canonical(body.spec); if (!canon) return { statusCode: 400 };
  const key = keyFor(canon), st = store(event);
  const existing = await st.get('meta/' + key, { type: 'json' });
  if (existing && (existing.status === 'ready' || (existing.status === 'pending' && Date.now() - existing.started < 120000))) return { statusCode: 202 };

  // límite diario
  const day = new Date().toISOString().slice(0, 10);
  const count = Number(await st.get('count/' + day, { type: 'text' })) || 0;
  const max = Number(process.env.MAX_GENERATIONS_PER_DAY) || 300;
  if (count >= max) { await st.setJSON('meta/' + key, { status: 'error', error: 'daily-limit', started: Date.now() }); return { statusCode: 202 }; }
  await st.set('count/' + day, String(count + 1));
  await st.setJSON('meta/' + key, { status: 'pending', started: Date.now() });

  try {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { authorization: 'Bearer ' + apiKey(), 'content-type': 'application/json' },
      body: JSON.stringify({ model: process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1', prompt: prompt(canon), n: 1, size: '1024x1536', quality: process.env.OPENAI_IMAGE_QUALITY || 'medium', output_format: 'jpeg', output_compression: 82 }),
    });
    const data = await res.json();
    if (!res.ok || !data.data || !data.data[0] || !data.data[0].b64_json) {
      const msg = (data.error && data.error.message) || ('HTTP ' + res.status);
      await st.setJSON('meta/' + key, { status: 'error', error: msg.slice(0, 200), started: Date.now() });
      return { statusCode: 202 };
    }
    const bytes = Buffer.from(data.data[0].b64_json, 'base64');
    await st.set('img/' + key, bytes, { metadata: { prompt: prompt(canon).slice(0, 500) } });
    await st.setJSON('meta/' + key, { status: 'ready', started: Date.now(), bytes: bytes.length });
  } catch (e) {
    await st.setJSON('meta/' + key, { status: 'error', error: String(e.message || e).slice(0, 200), started: Date.now() });
  }
  return { statusCode: 202 };
};
