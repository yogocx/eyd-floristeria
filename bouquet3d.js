/* Vista 3D del ramo del taller con flores reales.
   Cada tallo es un recorte fotográfico (PNG con transparencia) colocado sobre una cúpula y siempre de cara
   a la cámara; los recortes claros se tiñen según el tono elegido. Papel, listón, tallos y sombra son 3D.
   Requiere three.js r128 (global THREE). */
window.Bouquet3D = (function () {
  'use strict';
  const D = window.EYD;
  const T3 = window.THREE;
  const GA = Math.PI * (3 - Math.sqrt(5));
  const OLIVE = '#6E7A45';

  // Recortes por tipo de flor. Son fotos de flores claras para poder teñirlas.
  const CUTOUTS = { peonia: 'assets/flowers/peonia.png', rosa: 'assets/flowers/rosa.png', tulipan: 'assets/flowers/tulipan.png', lirio: 'assets/flowers/lirio.png', hortensia: 'assets/flowers/hortensia.png', eucalipto: 'assets/flowers/eucalipto.png', gypsophila: 'assets/flowers/gypsophila.png' };
  // Ancho relativo del recorte y si debe apuntar hacia afuera del ramo (tallos rectos) o puede girar libremente.
  const SHAPE = { peonia: { w: 1.85, dir: false }, rosa: { w: 1.5, dir: false }, tulipan: { w: 1.2, dir: true }, lirio: { w: 1.9, dir: false }, hortensia: { w: 2.0, dir: false }, eucalipto: { w: 2.0, dir: true }, gypsophila: { w: 1.9, dir: true } };
  // Tono que coincide con el color natural del recorte (no se tiñe).
  const NATURAL = { peonia: 'blanco', rosa: 'blanco', tulipan: 'blanco', lirio: 'crema', hortensia: 'blanco', eucalipto: 'verde', gypsophila: 'blanco' };

  let el, renderer, scene, camera, root, bouquet = null, raf = 0, visible = false, dragging = false, lastX = 0, needs = true, reduced = false;
  let stemGeo, stemMat, paperTex, pending = null, directional = [], center = null;
  const tex = {}, aspect = {};
  const UP = T3 ? new T3.Vector3(0, 1, 0) : null;

  function ok() {
    if (!T3) return false;
    try { const c = document.createElement('canvas'); return !!(c.getContext('webgl') || c.getContext('experimental-webgl')); } catch (e) { return false; }
  }
  function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function stemsOf(spec) { const out = []; (spec.items || []).forEach((it) => { for (let i = 0; i < it.n; i++) out.push({ type: it.type, variant: it.variant || D.FLOWERS[it.type].variants[0] }); }); return out; }
  function tint(type, variant) {
    if (variant === NATURAL[type]) return new T3.Color(0xffffff);
    const p = D.PALETTES[type][variant] || D.PALETTES[type][D.FLOWERS[type].variants[0]];
    const c = new T3.Color(p[0]).convertSRGBToLinear();
    const lift = variant === 'vino' ? 0.14 : variant === 'blush' ? 0.3 : 0.2;
    return c.lerp(new T3.Color(0xffffff), lift);
  }

  /* ---------- Texturas ---------- */
  function loadTextures() {
    const loader = new T3.TextureLoader();
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    return Promise.all(Object.keys(CUTOUTS).map((k) => new Promise((res) => {
      loader.load(CUTOUTS[k], (t) => { t.encoding = T3.sRGBEncoding; t.anisotropy = maxAniso; tex[k] = t; aspect[k] = t.image.height / t.image.width; res(); }, undefined, () => res());
    })));
  }
  function makePaperTexture() {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d');
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, 256, 256);
    const r = rng(11);
    for (let i = 0; i < 9000; i++) { const v = 205 + Math.floor(r() * 50); g.fillStyle = `rgba(${v},${v},${v},${0.18 + r() * 0.25})`; g.fillRect(r() * 256, r() * 256, 1 + r() * 1.5, 1 + r() * 1.5); }
    for (let i = 0; i < 160; i++) { g.strokeStyle = `rgba(${180 + Math.floor(r() * 60)},${170 + Math.floor(r() * 60)},${160 + Math.floor(r() * 60)},${0.08 + r() * 0.12})`; g.lineWidth = 0.6 + r(); g.beginPath(); const y = r() * 256; g.moveTo(0, y); g.bezierCurveTo(80, y + (r() - 0.5) * 14, 170, y + (r() - 0.5) * 14, 256, y + (r() - 0.5) * 6); g.stroke(); }
    const t = new T3.CanvasTexture(c); t.wrapS = t.wrapT = T3.RepeatWrapping; t.repeat.set(3, 1.6); t.encoding = T3.sRGBEncoding; return t;
  }

  /* ---------- Escena ---------- */
  function mount(container) {
    el = container;
    reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    renderer = new T3.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.outputEncoding = T3.sRGBEncoding;
    renderer.domElement.className = 'stage-canvas';
    el.appendChild(renderer.domElement);
    scene = new T3.Scene();
    camera = new T3.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 1.5, 9.8); camera.lookAt(0, -0.05, 0);
    scene.add(new T3.HemisphereLight(0xfff3f6, 0x4a2535, 1.05));
    const key = new T3.DirectionalLight(0xffffff, 0.8); key.position.set(4, 7, 6); scene.add(key);
    const fill = new T3.DirectionalLight(0xffd9e3, 0.3); fill.position.set(-5, 2, -3); scene.add(fill);
    root = new T3.Group(); root.rotation.y = -0.25; scene.add(root);
    center = new T3.Vector3(0, 0.3, 0);

    stemGeo = new T3.CylinderGeometry(1, 1, 1, 6);
    stemMat = new T3.MeshStandardMaterial({ color: OLIVE, roughness: 0.8 });
    paperTex = makePaperTexture();

    const cv = document.createElement('canvas'); cv.width = cv.height = 128;
    const g = cv.getContext('2d'), grd = g.createRadialGradient(64, 64, 4, 64, 64, 64);
    grd.addColorStop(0, 'rgba(60,20,40,.42)'); grd.addColorStop(1, 'rgba(60,20,40,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
    const shadow = new T3.Mesh(new T3.CircleGeometry(1.5, 32), new T3.MeshBasicMaterial({ map: new T3.CanvasTexture(cv), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = -2.45; shadow.scale.set(1.15, 0.7, 1); root.add(shadow);

    loadTextures().then(() => { if (pending) build(pending); });

    resize();
    if (window.ResizeObserver) new ResizeObserver(resize).observe(el); else addEventListener('resize', resize);
    const c = renderer.domElement;
    c.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; c.setPointerCapture(e.pointerId); c.classList.add('grabbing'); });
    c.addEventListener('pointermove', (e) => { if (!dragging) return; root.rotation.y += (e.clientX - lastX) * 0.012; lastX = e.clientX; needs = true; });
    const end = (e) => { dragging = false; c.classList.remove('grabbing'); try { c.releasePointerCapture(e.pointerId); } catch (x) { /* ya liberado */ } };
    c.addEventListener('pointerup', end); c.addEventListener('pointercancel', end);
    new IntersectionObserver((en) => { visible = en[0].isIntersecting; if (visible && !document.hidden) start(); else stop(); }, { rootMargin: '80px' }).observe(el);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else if (visible) start(); });
  }

  function resize() {
    if (!el || !renderer) return;
    const w = Math.max(1, el.clientWidth), h = Math.max(1, el.clientHeight);
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); needs = true;
  }
  function start() { if (!raf) raf = requestAnimationFrame(frame); }
  function stop() { cancelAnimationFrame(raf); raf = 0; }
  const wp = T3 ? new T3.Vector3() : null;
  function orient() {
    // Las flores de tallo recto apuntan hacia afuera del centro del ramo, en pantalla.
    for (const d of directional) { d.sp.getWorldPosition(wp); d.sp.material.rotation = -Math.atan2(wp.x - center.x, wp.y - center.y) * 0.85; }
  }
  function frame() {
    raf = 0;
    if (!dragging && !reduced) { root.rotation.y += 0.004; needs = true; }
    if (needs) { orient(); renderer.render(scene, camera); needs = false; }
    if (visible && !document.hidden && (!reduced || dragging)) raf = requestAnimationFrame(frame);
  }

  /* ---------- Construcción ---------- */
  function clear() {
    if (!bouquet) return;
    root.remove(bouquet);
    const shared = Object.keys(tex).map((k) => tex[k]);
    bouquet.traverse((o) => {
      if (o.geometry && o.geometry !== stemGeo) o.geometry.dispose();
      if (o.material && o.material !== stemMat) { if (o.material.map && o.material.map !== paperTex && shared.indexOf(o.material.map) < 0) o.material.map.dispose(); o.material.dispose(); }
    });
    bouquet = null; directional = [];
  }

  function update(spec) {
    pending = spec;
    if (!renderer) return;
    if (Object.keys(tex).length) build(spec);
  }

  function build(spec) {
    clear();
    const stems = stemsOf(spec), n = stems.length;
    bouquet = new T3.Group(); root.add(bouquet);
    if (!n) { needs = true; start(); return; }
    const r = rng(hash(JSON.stringify(spec)));
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [stems[i], stems[j]] = [stems[j], stems[i]]; }
    const W = { peonia: 0, hortensia: 0.1, lirio: 0.2, rosa: 0.4, tulipan: 0.5, gypsophila: 0.8, eucalipto: 1 };
    stems.forEach((s) => { s.w = W[s.type] + r() * 0.35; });
    stems.sort((a, b) => a.w - b.w);

    const R = Math.min(2.5, 0.7 + 0.3 * Math.sqrt(n));
    const H = 0.55 * R, BASE = 0.18;
    const sc = Math.max(0.42, Math.min(0.92, 0.62 * R / Math.sqrt(n) * 2.5));
    const neck = new T3.Vector3(0, -0.95, 0);
    const stemList = [];

    stems.forEach((s, i) => {
      const rr = 0.8 * R * Math.sqrt((i + 0.5) / n), th = i * GA + (r() - 0.5) * 0.35;
      const x = rr * Math.cos(th), z = rr * Math.sin(th);
      const y = BASE + H * Math.sqrt(Math.max(0, 1 - (rr / R) * (rr / R)));
      const t = tex[s.type]; if (!t) return;
      const shape = SHAPE[s.type], asp = aspect[s.type] || 1;
      const mat = new T3.SpriteMaterial({ map: t, color: tint(s.type, s.variant), transparent: true, alphaTest: 0.05, depthWrite: false });
      if (!shape.dir) mat.rotation = (r() - 0.5) * 1.2;
      const sp = new T3.Sprite(mat);
      const w = shape.w * sc * (0.92 + r() * 0.16);
      sp.scale.set(r() < 0.5 ? -w : w, w * asp, 1);
      // los recortes altos (tulipán, eucalipto) se levantan para que su base quede en la cúpula
      sp.position.set(x, y + (shape.dir ? w * asp * 0.3 : 0), z);
      bouquet.add(sp);
      if (shape.dir) directional.push({ sp });
      stemList.push({ a: new T3.Vector3(x, y - 0.25, z), b: neck });
    });

    stemList.forEach((s) => {
      const dir = s.b.clone().sub(s.a), len = dir.length(); dir.normalize();
      const m = new T3.Mesh(stemGeo, stemMat);
      m.position.copy(s.a).addScaledVector(dir, len / 2); m.quaternion.setFromUnitVectors(UP, dir); m.scale.set(0.028, len, 0.028);
      bouquet.add(m);
    });

    // papel: cono facetado con textura de grano
    const wc = D.WRAPS[spec.wrap] || D.WRAPS.kraft;
    const pts = [[0.06, -2.32], [0.30, -2.26], [0.44, -1.6], [0.56, -1.0], [0.78, -0.55], [R * 0.6, 0.0], [R * 0.86, 0.5]].map((p) => new T3.Vector2(p[0], p[1]));
    const paper = new T3.Mesh(new T3.LatheGeometry(pts, 7), new T3.MeshStandardMaterial({ color: wc.base, map: paperTex, bumpMap: paperTex, bumpScale: 0.015, roughness: 0.92, side: T3.DoubleSide }));
    paper.rotation.y = 0.3; bouquet.add(paper);
    const pts2 = [[0.55, -0.98], [0.75, -0.6], [R * 0.54, -0.08], [R * 0.78, 0.36]].map((p) => new T3.Vector2(p[0], p[1]));
    const paper2 = new T3.Mesh(new T3.LatheGeometry(pts2, 5), new T3.MeshStandardMaterial({ color: wc.light, map: paperTex, roughness: 0.92, side: T3.DoubleSide }));
    paper2.rotation.y = 1.1; bouquet.add(paper2);

    // listón y moño (acabado satinado)
    const rc = (D.RIBBONS[spec.ribbon] || D.RIBBONS.oro).color;
    const rm = new T3.MeshStandardMaterial({ color: rc, roughness: 0.35, metalness: 0.25 });
    const band = new T3.Mesh(new T3.TorusGeometry(0.60, 0.065, 10, 40), rm); band.rotation.x = Math.PI / 2; band.position.y = -0.96; bouquet.add(band);
    const loopL = new T3.Mesh(new T3.TorusGeometry(0.17, 0.05, 8, 24), rm); loopL.position.set(-0.19, -0.92, 0.62); loopL.rotation.z = 0.6; bouquet.add(loopL);
    const loopR = new T3.Mesh(new T3.TorusGeometry(0.17, 0.05, 8, 24), rm); loopR.position.set(0.19, -0.92, 0.62); loopR.rotation.z = -0.6; bouquet.add(loopR);
    const knot = new T3.Mesh(new T3.SphereGeometry(0.085, 10, 8), rm); knot.position.set(0, -0.94, 0.66); bouquet.add(knot);
    const tailL = new T3.Mesh(new T3.BoxGeometry(0.09, 0.62, 0.02), rm); tailL.position.set(-0.11, -1.36, 0.6); tailL.rotation.z = 0.12; bouquet.add(tailL);
    const tailR = new T3.Mesh(new T3.BoxGeometry(0.09, 0.56, 0.02), rm); tailR.position.set(0.11, -1.33, 0.6); tailR.rotation.z = -0.12; bouquet.add(tailR);

    needs = true; start();
  }

  return { ok, mount, update };
})();
