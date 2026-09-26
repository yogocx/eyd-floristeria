// Utilidades compartidas por las funciones del taller.
const crypto = require('crypto');
const { getStore, connectLambda } = require('@netlify/blobs');

const FLOWERS = { peonia: 'peonies', rosa: 'roses', tulipan: 'tulips', lirio: 'lilies', hortensia: 'hydrangea blooms', eucalipto: 'stems of silver-dollar eucalyptus', gypsophila: 'sprigs of baby\'s breath' };
const TONES = { rosa: 'pink', blush: 'blush pink', vino: 'deep wine red', blanco: 'white', durazno: 'peach', amarillo: 'yellow', crema: 'cream white', azul: 'blue', verde: 'green' };
const WRAPS = { kraft: 'natural kraft paper', blush: 'blush pink paper', vino: 'deep wine-colored paper', blanco: 'white paper', negro: 'matte black paper' };
const RIBBONS = { oro: 'gold satin ribbon', vino: 'wine-red satin ribbon', rosa: 'pink satin ribbon', oliva: 'olive green satin ribbon' };

// Normaliza la selección: solo campos relevantes, ordenados, para que el mismo ramo dé la misma clave.
function canonical(spec) {
  if (!spec || !Array.isArray(spec.items)) return null;
  const items = spec.items
    .filter((i) => i && FLOWERS[i.type] && Number.isInteger(i.n) && i.n > 0)
    .map((i) => ({ type: i.type, n: Math.min(i.n, 12), variant: TONES[i.variant] ? i.variant : null }))
    .sort((a, b) => a.type.localeCompare(b.type) || String(a.variant).localeCompare(String(b.variant)));
  const total = items.reduce((a, i) => a + i.n, 0);
  if (!items.length || total > 40) return null;
  return { items, wrap: WRAPS[spec.wrap] ? spec.wrap : 'kraft', ribbon: RIBBONS[spec.ribbon] ? spec.ribbon : 'oro' };
}
function keyFor(canon) { return crypto.createHash('sha256').update(JSON.stringify(canon)).digest('hex').slice(0, 32); }
function prompt(canon) {
  const parts = canon.items.map((i) => `${i.n} ${i.variant ? TONES[i.variant] + ' ' : ''}${FLOWERS[i.type]}`);
  const list = parts.length > 1 ? parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1] : parts[0];
  return `Professional product photograph of a hand-tied flower bouquet containing exactly ${list}. ` +
    `The bouquet is wrapped in ${WRAPS[canon.wrap]} and tied with a ${RIBBONS[canon.ribbon]} in a neat bow. ` +
    'It stands upright on a pale marble table in front of a soft, warm cream wall. Natural window light, shallow depth of field, ' +
    'true-to-life colors, high detail, florist editorial style. No text, no people, no hands, no watermark.';
}
// En funciones en modo Lambda hay que conectar Blobs con el evento antes de usar el almacén.
function store(event) { if (event) { try { connectLambda(event); } catch (e) { /* ya conectado */ } } return getStore({ name: 'bouquets' }); }
const json = (status, body, extra) => ({ statusCode: status, headers: Object.assign({ 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }, extra || {}), body: JSON.stringify(body) });

// Clave de OpenAI saneada: sin espacios, saltos de línea ni comillas pegadas al copiar.
function apiKey() { return String(process.env.OPENAI_API_KEY || '').trim().replace(/^["']+|["']+$/g, ''); }
module.exports = { canonical, keyFor, prompt, store, json, apiKey };
