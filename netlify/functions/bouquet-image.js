// GET /api/bouquet-image?key=... -> la imagen JPEG generada (se cachea en el navegador y en el CDN).
const { store } = require('../lib/shared');

exports.handler = async (event) => {
  const key = (event.queryStringParameters || {}).key || '';
  if (!/^[a-f0-9]{32}$/.test(key)) return { statusCode: 400, body: 'bad key' };
  try {
    const buf = await store(event).get('img/' + key, { type: 'arrayBuffer' });
    if (!buf) return { statusCode: 404, body: 'not ready' };
    return { statusCode: 200, headers: { 'content-type': 'image/jpeg', 'cache-control': 'public, max-age=31536000, immutable' }, body: Buffer.from(buf).toString('base64'), isBase64Encoded: true };
  } catch (e) {
    return { statusCode: 500, body: 'store error' };
  }
};
