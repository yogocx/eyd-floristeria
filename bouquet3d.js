/* Vista 3D del ramo del taller. Usa three.js (r128, global THREE) y genera todo por código:
   cabezas de flor (instancias de pétalos y puntos), tallos, cono de papel, listón y sombra. */
window.Bouquet3D = (function () {
  'use strict';
  const D = window.EYD;
  const T3 = window.THREE;
  const GA = Math.PI * (3 - Math.sqrt(5));
  const OLIVE = '#6E7A45', GOLD = '#D9B25C';
  let el, renderer, scene, camera, root, bouquet = null, raf = 0, visible = false, dragging = false, lastX = 0, needs = true;
  let petalGeo, dotGeo, stemGeo, mat, dummy, reduced = false;
  const UP = T3 ? new T3.Vector3(0, 1, 0) : null;

  function ok() {
    if (!T3) return false;
    try { const c = document.createElement('canvas'); return !!(c.getContext('webgl') || c.getContext('experimental-webgl')); } catch (e) { return false; }
  }

  /* ---------- Utilidades ---------- */
  function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function palette(type, variant) { const p = D.PALETTES[type]; return p[variant] || p[D.FLOWERS[type].variants[0]]; }
  function stemsOf(spec) { const out = []; (spec.items || []).forEach((it) => { for (let i = 0; i < it.n; i++) out.push({ type: it.type, variant: it.variant || D.FLOWERS[it.type].variants[0] }); }); return out; }

  // Añade una instancia (pétalo o punto) en coordenadas locales de la flor.
  function inst(arr, parent, x, y, z, euler, sx, sy, sz, color) {
    dummy.position.set(x, y, z);
    if (euler) dummy.rotation.set(euler[0], euler[1], euler[2], 'YZX'); else dummy.rotation.set(0, 0, 0);
    dummy.scale.set(sx, sy, sz); dummy.updateMatrix();
    arr.push({ m: parent.clone().multiply(dummy.matrix), c: color });
  }
  // Pétalo tumbado (largo en X) a radio r, ángulo a, inclinado "tilt" hacia arriba.
  function ringFlat(arr, parent, k, r, h, tilt, sx, sy, sz, color, off) {
    for (let j = 0; j < k; j++) { const a = off + j * 2 * Math.PI / k; inst(arr, parent, r * Math.cos(a), h, r * Math.sin(a), [0, -a, tilt], sx, sy, sz, color); }
  }
  // Pétalo de pie (largo en Y) a radio r, inclinado hacia afuera.
  function ringUp(arr, parent, k, r, h, lean, sx, sy, sz, color, off) {
    for (let j = 0; j < k; j++) { const a = off + j * 2 * Math.PI / k; inst(arr, parent, r * Math.cos(a), h, r * Math.sin(a), [0, -a, -lean], sx, sy, sz, color); }
  }

  const FLOWER = {
    peonia(P, Dt, M, c, r) {
      ringFlat(P, M, 10, 0.60, 0.00, 0.95, 0.44, 0.14, 0.30, c[0], r() * 6.3);
      ringFlat(P, M, 8, 0.42, 0.14, 0.70, 0.36, 0.12, 0.26, c[1], r() * 6.3);
      ringFlat(P, M, 6, 0.24, 0.28, 0.45, 0.26, 0.10, 0.20, c[2], r() * 6.3);
      ringFlat(P, M, 4, 0.10, 0.40, 0.25, 0.16, 0.09, 0.14, c[0], r() * 6.3);
      inst(Dt, M, 0, 0.44, 0, null, 0.09, 0.09, 0.09, GOLD);
    },
    rosa(P, Dt, M, c, r) {
      ringFlat(P, M, 7, 0.42, 0.00, 1.05, 0.34, 0.12, 0.26, c[0], r() * 6.3);
      ringFlat(P, M, 6, 0.28, 0.14, 0.85, 0.26, 0.10, 0.20, c[1], r() * 6.3);
      ringFlat(P, M, 5, 0.16, 0.26, 0.65, 0.18, 0.09, 0.15, c[2], r() * 6.3);
      inst(Dt, M, 0, 0.30, 0, null, 0.13, 0.16, 0.13, c[1]);
    },
    tulipan(P, Dt, M, c, r) {
      const o = r() * 6.3;
      ringUp(P, M, 3, 0.20, 0.42, 0.22, 0.17, 0.46, 0.24, c[0], o);
      ringUp(P, M, 3, 0.14, 0.44, 0.10, 0.15, 0.44, 0.22, c[1], o + Math.PI / 3);
      inst(Dt, M, 0, 0.10, 0, null, 0.17, 0.12, 0.17, OLIVE);
    },
    lirio(P, Dt, M, c, r) {
      const o = r() * 6.3;
      ringFlat(P, M, 6, 0.46, 0.06, 0.30, 0.62, 0.05, 0.17, c[0], o);
      ringFlat(P, M, 6, 0.30, 0.10, 0.20, 0.34, 0.04, 0.10, c[1], o + Math.PI / 6);
      for (let j = 0; j < 5; j++) { const a = j * 1.2566; inst(Dt, M, 0.22 * Math.cos(a), 0.22, 0.22 * Math.sin(a), null, 0.045, 0.045, 0.045, '#8E1743'); }
      inst(Dt, M, 0, 0.16, 0, null, 0.07, 0.07, 0.07, c[2]);
    },
    hortensia(P, Dt, M, c, r) {
      for (let j = 0; j < 30; j++) {
        const u = r(), v = r(); const th = 2 * Math.PI * u, ph = Math.acos(1 - 1.35 * v);
        const d = new T3.Vector3(Math.sin(ph) * Math.cos(th), Math.cos(ph), Math.sin(ph) * Math.sin(th));
        const q = new T3.Quaternion().setFromUnitVectors(UP, d);
        dummy.position.copy(d.multiplyScalar(0.50)); dummy.position.y += 0.30; dummy.quaternion.copy(q); dummy.scale.set(0.17, 0.06, 0.17); dummy.updateMatrix();
        P.push({ m: M.clone().multiply(dummy.matrix), c: j % 3 ? c[0] : c[1] });
      }
    },
    eucalipto(P, Dt, M, c, r, S) {
      S.push({ a: new T3.Vector3(0, -0.1, 0).applyMatrix4(M), b: new T3.Vector3(0, 1.05, 0).applyMatrix4(M), rad: 0.02 });
      const o = r() * 6.3;
      [0.15, 0.36, 0.57, 0.78, 0.98].forEach((y, i) => {
        inst(P, M, -0.15, y, 0, [0, o + i * 0.5, 0], 0.17, 0.035, 0.17, i % 2 ? c[0] : c[1]);
        inst(P, M, 0.15, y + 0.08, 0, [0, o + i * 0.5, 0], 0.17, 0.035, 0.17, i % 2 ? c[1] : c[0]);
      });
      inst(P, M, 0, 1.12, 0, null, 0.14, 0.035, 0.14, c[0]);
    },
    gypsophila(P, Dt, M, c, r, S) {
      S.push({ a: new T3.Vector3(0, -0.1, 0).applyMatrix4(M), b: new T3.Vector3(0, 0.45, 0).applyMatrix4(M), rad: 0.014 });
      for (let j = 0; j < 20; j++) {
        const th = r() * 6.283, ph = Math.acos(1 - 2 * r()), d = 0.42 * Math.cbrt(r());
        inst(Dt, M, d * Math.sin(ph) * Math.cos(th), 0.5 + d * Math.cos(ph) * 0.8, d * Math.sin(ph) * Math.sin(th), null, 0.055, 0.055, 0.055, c[0]);
      }
    },
  };

  /* ---------- Escena ---------- */
  function mount(container) {
    el = container;
    reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    dummy = new T3.Object3D();
    renderer = new T3.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.outputEncoding = T3.sRGBEncoding;
    renderer.domElement.className = 'stage-canvas';
    el.appendChild(renderer.domElement);
    scene = new T3.Scene();
    camera = new T3.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 1.9, 9.6); camera.lookAt(0, -0.15, 0);
    scene.add(new T3.HemisphereLight(0xfff3f6, 0x4a2535, 1.0));
    const key = new T3.DirectionalLight(0xffffff, 0.85); key.position.set(4, 7, 6); scene.add(key);
    const fill = new T3.DirectionalLight(0xffd9e3, 0.35); fill.position.set(-5, 2, -3); scene.add(fill);
    root = new T3.Group(); root.rotation.y = -0.4; scene.add(root);

    petalGeo = new T3.SphereGeometry(1, 12, 8);
    dotGeo = new T3.SphereGeometry(1, 8, 6);
    stemGeo = new T3.CylinderGeometry(1, 1, 1, 6);
    mat = new T3.MeshStandardMaterial({ roughness: 0.72, metalness: 0 });

    // sombra suave bajo el ramo
    const cv = document.createElement('canvas'); cv.width = cv.height = 128;
    const g = cv.getContext('2d'), grd = g.createRadialGradient(64, 64, 4, 64, 64, 64);
    grd.addColorStop(0, 'rgba(60,20,40,.42)'); grd.addColorStop(1, 'rgba(60,20,40,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
    const shadow = new T3.Mesh(new T3.CircleGeometry(1.5, 32), new T3.MeshBasicMaterial({ map: new T3.CanvasTexture(cv), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = -2.45; shadow.scale.set(1.15, 0.7, 1); root.add(shadow);

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
  function frame() {
    raf = 0;
    if (!dragging && !reduced) { root.rotation.y += 0.0045; needs = true; }
    if (needs) { renderer.render(scene, camera); needs = false; }
    if (visible && !document.hidden && (!reduced || dragging)) raf = requestAnimationFrame(frame);
  }

  /* ---------- Construcción del ramo ---------- */
  function clear() {
    if (!bouquet) return;
    root.remove(bouquet);
    bouquet.traverse((o) => {
      if (o.geometry && o.geometry !== petalGeo && o.geometry !== dotGeo && o.geometry !== stemGeo) o.geometry.dispose();
      if (o.material && o.material !== mat) o.material.dispose();
    });
    bouquet = null;
  }

  function update(spec) {
    if (!renderer) return;
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
    const H = 0.5 * R, BASE = 0.42;
    const scale = Math.max(0.42, Math.min(0.92, 0.62 * R / Math.sqrt(n) * 2.5));
    const P = [], Dt = [], S = [];
    const neck = new T3.Vector3(0, -0.95, 0);
    const M = new T3.Matrix4(), q = new T3.Quaternion(), qs = new T3.Quaternion(), pos = new T3.Vector3(), nrm = new T3.Vector3();

    stems.forEach((s, i) => {
      const rr = 0.8 * R * Math.sqrt((i + 0.5) / n), th = i * GA + (r() - 0.5) * 0.35;
      const x = rr * Math.cos(th), z = rr * Math.sin(th);
      const y = BASE + H * Math.sqrt(Math.max(0, 1 - (rr / R) * (rr / R)));
      nrm.set(x / (R * R), (y - BASE + 0.35) / (H * H), z / (R * R)).normalize();
      pos.set(x, y, z);
      q.setFromUnitVectors(UP, nrm); qs.setFromAxisAngle(UP, r() * 6.283); q.multiply(qs);
      const sc = scale * (0.9 + r() * 0.2) * (s.type === 'eucalipto' || s.type === 'gypsophila' ? 1.15 : 1);
      M.compose(pos, q, new T3.Vector3(sc, sc, sc));
      FLOWER[s.type](P, Dt, M, palette(s.type, s.variant), r, S);
      const base = pos.clone().addScaledVector(nrm, -0.12 * sc);
      S.push({ a: base, b: neck.clone(), rad: 0.028 });
    });

    const addInst = (geo, list) => {
      if (!list.length) return;
      const im = new T3.InstancedMesh(geo, mat, list.length);
      const col = new T3.Color();
      list.forEach((it, i) => { im.setMatrixAt(i, it.m); im.setColorAt(i, col.set(it.c)); });
      im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
      bouquet.add(im);
    };
    addInst(petalGeo, P); addInst(dotGeo, Dt);

    // tallos
    const stemList = S.map((s) => {
      const dir = s.b.clone().sub(s.a), len = dir.length(); dir.normalize();
      dummy.position.copy(s.a).addScaledVector(dir, len / 2); dummy.quaternion.setFromUnitVectors(UP, dir); dummy.scale.set(s.rad, len, s.rad); dummy.updateMatrix();
      return { m: dummy.matrix.clone(), c: OLIVE };
    });
    addInst(stemGeo, stemList);

    // papel: cono facetado (los lados sugieren los dobleces)
    const wc = D.WRAPS[spec.wrap] || D.WRAPS.kraft;
    const pts = [[0.06, -2.32], [0.30, -2.26], [0.44, -1.6], [0.56, -1.0], [0.78, -0.55], [R * 0.6, 0.0], [R * 0.86, 0.5]].map((p) => new T3.Vector2(p[0], p[1]));
    const paper = new T3.Mesh(new T3.LatheGeometry(pts, 7), new T3.MeshStandardMaterial({ color: wc.base, roughness: 0.9, side: T3.DoubleSide }));
    paper.rotation.y = 0.3; bouquet.add(paper);
    const pts2 = [[0.55, -0.98], [0.75, -0.6], [R * 0.54, -0.08], [R * 0.78, 0.36]].map((p) => new T3.Vector2(p[0], p[1]));
    const paper2 = new T3.Mesh(new T3.LatheGeometry(pts2, 5), new T3.MeshStandardMaterial({ color: wc.light, roughness: 0.9, side: T3.DoubleSide }));
    paper2.rotation.y = 1.1; bouquet.add(paper2);

    // listón y moño
    const rc = (D.RIBBONS[spec.ribbon] || D.RIBBONS.oro).color;
    const rm = new T3.MeshStandardMaterial({ color: rc, roughness: 0.45, metalness: 0.15 });
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
