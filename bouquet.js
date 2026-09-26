/* Dibujo procedural de ramos en SVG. Un mismo "spec" produce siempre el mismo ramo.
   spec = { items: [{ type, n, variant }], wrap: 'kraft', ribbon: 'oro' } */
window.Bouquet = (function () {
  'use strict';
  const D = window.EYD;
  const OLIVE = '#6E7A45';

  function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const f1 = (n) => (Math.round(n * 10) / 10).toString();

  function ring(k, rx, ry, off, col, rot0, stroke) {
    let s = '';
    for (let i = 0; i < k; i++) s += `<ellipse cx="${off}" cy="0" rx="${rx}" ry="${ry}" fill="${col}" stroke="${stroke}" stroke-width=".6" transform="rotate(${rot0 + i * 360 / k})"/>`;
    return s;
  }

  const DRAW = {
    peonia(c) {
      const st = 'rgba(90,20,50,.16)';
      return ring(9, 12, 6.5, 9.5, c[0], 0, st) + ring(7, 9, 5.2, 6.5, c[1], 20, st) + ring(5, 6, 3.6, 3.8, c[2], 45, st) + `<circle r="2.6" fill="#D9B25C"/>`;
    },
    rosa(c) {
      let s = ring(6, 10, 6.2, 7, c[0], 15, 'rgba(60,10,30,.2)');
      for (let i = 0; i < 7; i++) { const k = 7 - i; s += `<ellipse rx="${f1(2.2 + k * 0.9)}" ry="${f1(1.4 + k * 0.62)}" fill="${i % 2 ? c[1] : c[2]}" stroke="rgba(60,10,30,.22)" stroke-width=".6" transform="rotate(${i * 52})"/>`; }
      return s;
    },
    tulipan(c) {
      return `<g transform="translate(0 4)"><path d="M-10 6C-12-5-7-14 0-17C7-14 12-5 10 6Z" fill="${c[0]}" stroke="rgba(90,20,50,.18)" stroke-width=".6"/><path d="M-10 6C-9-3-5-9 0-12C5-9 9-3 10 6Z" fill="${c[1]}" opacity=".85"/><path d="M-3 6C-4-2-2-9 0-13C2-9 4-2 3 6Z" fill="${c[0]}"/></g>`;
    },
    lirio(c) {
      let s = '';
      for (let i = 0; i < 6; i++) s += `<path d="M0 0Q7-8 21 0Q7 8 0 0Z" fill="${c[0]}" stroke="rgba(120,60,40,.2)" stroke-width=".6" transform="rotate(${i * 60})"/>`;
      for (let i = 0; i < 6; i++) s += `<path d="M3 0Q9-2 17 0Q9 2 3 0Z" fill="${c[1]}" opacity=".7" transform="rotate(${i * 60})"/>`;
      for (let i = 0; i < 5; i++) s += `<g transform="rotate(${i * 72 - 72})"><line x1="0" y1="0" x2="9" y2="0" stroke="${c[2]}" stroke-width="1"/><ellipse cx="10" cy="0" rx="2.4" ry="1.2" fill="#8E1743"/></g>`;
      return s + `<circle r="2" fill="${c[2]}"/>`;
    },
    hortensia(c, r) {
      let s = '';
      for (let i = 0; i < 13; i++) {
        const a = r() * 6.283, d = Math.sqrt(r()) * 13, col = i % 3 ? c[0] : c[1];
        s += `<g transform="translate(${f1(Math.cos(a) * d)} ${f1(Math.sin(a) * d)}) rotate(${(r() * 90) | 0})">`;
        for (let k = 0; k < 4; k++) s += `<circle cx="2.6" r="2.7" fill="${col}" stroke="rgba(90,20,50,.12)" stroke-width=".5" transform="rotate(${k * 90})"/>`;
        s += `<circle r="1" fill="#D9B25C"/></g>`;
      }
      return s;
    },
    eucalipto(c) {
      let s = `<line x1="0" y1="16" x2="0" y2="-18" stroke="${c[1]}" stroke-width="1.6"/>`;
      [-14, -7, 0, 7, 13].forEach((y, i) => { s += `<circle cx="-6" cy="${y}" r="4.3" fill="${i % 2 ? c[0] : c[1]}"/><circle cx="6" cy="${y + 3}" r="4.3" fill="${i % 2 ? c[1] : c[0]}"/>`; });
      return s + `<circle cx="0" cy="-20" r="3.6" fill="${c[0]}"/>`;
    },
    gypsophila(c, r) {
      let s = `<g stroke="#8E9A6A" stroke-width="1"><line x1="0" y1="14" x2="-8" y2="-4"/><line x1="0" y1="14" x2="1" y2="-9"/><line x1="0" y1="14" x2="8" y2="-2"/><line x1="-4" y1="4" x2="-11" y2="-9"/><line x1="4" y1="6" x2="11" y2="-8"/></g>`;
      for (let i = 0; i < 16; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * 12; s += `<circle cx="${f1(Math.cos(a) * d)}" cy="${f1(Math.sin(a) * d - 3)}" r="${f1(1.3 + r() * 0.9)}" fill="${c[0]}" stroke="rgba(120,80,90,.35)" stroke-width=".6"/>`; }
      return s;
    },
  };

  function palette(type, variant) {
    const p = D.PALETTES[type];
    return p[variant] || p[D.FLOWERS[type].variants[0]];
  }

  // Miniatura de una sola flor (para el taller).
  function flowerSVG(type, variant) {
    const r = rng(7);
    return `<svg viewBox="-26 -26 52 52" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${DRAW[type](palette(type, variant), r)}</svg>`;
  }

  function stemsOf(spec) {
    const out = [];
    (spec.items || []).forEach((it) => { for (let i = 0; i < it.n; i++) out.push({ type: it.type, variant: it.variant || D.FLOWERS[it.type].variants[0] }); });
    return out;
  }

  function svg(spec, label) {
    const stems = stemsOf(spec);
    const n = stems.length;
    const wc = D.WRAPS[spec.wrap] || D.WRAPS.kraft;
    const rc = (D.RIBBONS[spec.ribbon] || D.RIBBONS.oro).color;
    let out = `<svg viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label || ''}">`;
    if (!n) return out + '</svg>';
    const r = rng(hash(JSON.stringify(spec)));
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [stems[i], stems[j]] = [stems[j], stems[i]]; }
    const W = { peonia: 0, hortensia: 0.1, lirio: 0.2, rosa: 0.4, tulipan: 0.5, gypsophila: 0.8, eucalipto: 1 };
    stems.forEach((s) => { s.w = W[s.type] + r() * 0.35; });
    stems.sort((a, b) => a.w - b.w);
    const R = Math.min(112, 34 + 15 * Math.sqrt(n));
    const scale = Math.max(0.72, Math.min(1.18, 1.32 - 0.022 * n));
    const GA = Math.PI * (3 - Math.sqrt(5));
    const placed = stems.map((s, i) => {
      const rr = R * Math.sqrt((i + 0.5) / n), th = i * GA + r() * 0.3;
      return { ...s, x: 150 + rr * Math.cos(th) * 1.04, y: 152 + rr * Math.sin(th) * 0.86, rot: r() * 40 - 20, s: scale * (0.9 + r() * 0.2) };
    });
    const filler = (t) => t === 'eucalipto' || t === 'gypsophila';
    const order = [...placed].sort((a, b) => (filler(b.type) - filler(a.type)) || (a.y - b.y));
    out += `<g stroke="${OLIVE}" stroke-width="2.4" stroke-linecap="round" opacity=".95">` + placed.map((p) => `<line x1="${f1(p.x)}" y1="${f1(p.y + 6)}" x2="150" y2="262"/>`).join('') + '</g>';
    out += `<polygon points="72,200 150,172 228,200 196,336 104,336" fill="${wc.light}"/>`;
    out += order.map((p) => `<g transform="translate(${f1(p.x)} ${f1(p.y)}) rotate(${p.rot | 0}) scale(${p.s.toFixed(2)})">${DRAW[p.type](palette(p.type, p.variant), r)}</g>`).join('');
    out += `<polygon points="56,218 150,256 244,218 202,348 98,348" fill="${wc.base}"/>`;
    out += `<polygon points="56,218 150,256 128,348 98,348" fill="${wc.dark}" opacity=".22"/>`;
    out += `<polygon points="244,218 150,256 172,348 202,348" fill="${wc.dark}" opacity=".1"/>`;
    out += `<polygon points="88,276 212,276 209,292 91,292" fill="${rc}"/>`;
    out += `<g fill="${rc}"><ellipse cx="134" cy="284" rx="15" ry="8" transform="rotate(-18 134 284)"/><ellipse cx="166" cy="284" rx="15" ry="8" transform="rotate(18 166 284)"/><polygon points="146,290 138,322 146,318"/><polygon points="154,290 162,322 154,318"/><circle cx="150" cy="284" r="5.5"/></g>`;
    out += `<g stroke="${OLIVE}" stroke-width="2.2" stroke-linecap="round"><line x1="140" y1="348" x2="136" y2="364"/><line x1="150" y1="348" x2="150" y2="366"/><line x1="160" y1="348" x2="164" y2="364"/></g>`;
    return out + '</svg>';
  }

  function count(spec) { return stemsOf(spec).length; }

  return { svg, flowerSVG, count, hash };
})();
