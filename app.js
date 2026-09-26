/* E&D Floristería — estado, idioma, colección, vista rápida y taller. */
window.App = (function () {
  'use strict';
  const D = window.EYD, B = window.Bouquet;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* almacenamiento no disponible */ } },
  };

  const DEFAULT_BUILDER = { counts: { peonia: 3, rosa: 4, gypsophila: 3 }, variants: {}, wrap: 'blush', ribbon: 'oro', extras: ['tarjeta'], msg: '' };

  const state = {
    lang: store.get('eyd.lang', 'es') === 'en' ? 'en' : 'es',
    filter: 'todos', sort: 'rec',
    cart: store.get('eyd.cart', []),
    fav: new Set(store.get('eyd.fav', [])),
    builder: Object.assign({}, DEFAULT_BUILDER, store.get('eyd.builder', {})),
    delivery: { zone: 'centro', slot: 'm', date: '', pickup: false },
    customer: { name: '', phone: '', addr: '', card: '' },
    qv: { id: null, size: 'std', qty: 1 },
    tst: 0,
  };
  Object.keys(D.FLOWERS).forEach((k) => { if (!state.builder.variants[k]) state.builder.variants[k] = D.FLOWERS[k].variants[0]; if (!state.builder.counts[k]) state.builder.counts[k] = 0; });

  const t = (k, vars) => { let s = (D.T[state.lang] || {})[k]; if (s == null) s = D.T.es[k]; if (s == null) s = k; if (vars) Object.keys(vars).forEach((v) => { s = s.replace('{' + v + '}', vars[v]); }); return s; };
  const L = (o) => (o && typeof o === 'object' && !Array.isArray(o)) ? (o[state.lang] != null ? o[state.lang] : o.es) : o;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function money(n) {
    try { return new Intl.NumberFormat(state.lang === 'en' ? 'en-US' : D.CONFIG.locale, { style: 'currency', currency: D.CONFIG.currency, currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0 }).format(n); }
    catch (e) { return '$' + Math.round(n).toLocaleString(); }
  }
  function flowerLabel(type, n, variant) {
    const f = D.FLOWERS[type];
    let s = n + ' ' + (n === 1 ? L(f.name).toLowerCase() : L(f.plural));
    if (f.variants.length > 1 && variant) s += ' (' + L(D.VARIANT_NAMES[variant]) + ')';
    return s;
  }
  function specSummary(spec) {
    return spec.items.filter((i) => i.n > 0).map((i) => flowerLabel(i.type, i.n, i.variant)).join(', ');
  }

  let toastTimer = 0;
  function toast(msg) {
    const el = $('#toast'); el.textContent = msg; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
  }

  /* ---------- Cifras y cinta ---------- */
  function renderStats() {
    $('#stats').innerHTML = D.CONFIG.stats.map((s) => `<div class="stat"><div class="stat-n display">${esc(L(s.n))}</div><div class="stat-l">${esc(L(s.l))}</div></div>`).join('');
  }
  function renderMarquee() {
    const words = D.MARQUEE[state.lang] || D.MARQUEE.es;
    const seq = words.map((w) => `<span>${esc(w)}</span><i aria-hidden="true">♡</i>`).join('');
    $('#marquee').innerHTML = seq + seq;
  }

  /* ---------- Colección ---------- */
  function renderChips() {
    $('#chips').innerHTML = D.OCC.map((o) => `<button type="button" class="chip" role="tab" data-occ="${o}" aria-selected="${state.filter === o}">${o === 'fav' ? '♥ ' : ''}${esc(t('occ_' + o))}</button>`).join('');
  }
  function visibleProducts() {
    let list = D.PRODUCTS.filter((p) => state.filter === 'todos' ? true : state.filter === 'fav' ? state.fav.has(p.id) : p.occ.includes(state.filter));
    if (state.sort === 'asc') list = list.slice().sort((a, b) => a.price - b.price);
    if (state.sort === 'desc') list = list.slice().sort((a, b) => b.price - a.price);
    return list;
  }
  function cardHTML(p) {
    const fav = state.fav.has(p.id);
    const names = Array.from(new Set(p.spec.items.map((i) => L(D.FLOWERS[i.type].name)))).join(' · ');
    return `<article class="card" data-id="${p.id}">
      <button type="button" class="fav" data-act="fav" aria-pressed="${fav}" aria-label="${esc(t(fav ? 'card_unfav' : 'card_fav'))}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21c-4-3-8-6.5-8-11a4 4 0 0 1 7-2.6A4 4 0 0 1 20 10c0 4.5-4 8-8 11Z"/></svg></button>
      <div class="art${p.img ? ' has-img' : ''}" data-act="view" role="button" tabindex="0" aria-label="${esc(t('card_view'))}: ${esc(L(p.name))}">${p.img ? `<img src="${p.img}" alt="${esc(L(p.name))}" loading="lazy" width="900" height="1125">` : B.svg(p.spec, L(p.name))}</div>
      <div class="body">
        <h3 class="name display">${esc(L(p.name))}</h3>
        <p class="meta">${esc(names)} · ${B.count(p.spec)} ${esc(t('stems'))}</p>
        <div class="row">
          <span class="price">${money(p.price)}</span>
          <div class="acts">
            <button type="button" class="btn btn-outline btn-sm" data-act="view">${esc(t('card_view'))}</button>
            <button type="button" class="btn btn-primary btn-sm" data-act="add">${esc(t('card_add'))}</button>
          </div>
        </div>
      </div>
    </article>`;
  }
  function renderCatalog() {
    const list = visibleProducts();
    $('#grid').innerHTML = list.map(cardHTML).join('');
    const empty = $('#gridEmpty');
    empty.hidden = list.length > 0;
    empty.textContent = t(state.filter === 'fav' ? 'col_fav_empty' : 'col_empty');
  }
  function toggleFav(id) {
    if (state.fav.has(id)) state.fav.delete(id); else state.fav.add(id);
    store.set('eyd.fav', Array.from(state.fav));
    renderCatalog();
  }

  /* ---------- Carrito (datos) ---------- */
  function saveCart() { store.set('eyd.cart', state.cart); updateBadge(); if (window.Order) window.Order.renderCart(); }
  function updateBadge() {
    const n = state.cart.reduce((a, i) => a + i.qty, 0);
    const b = $('#cartCount'); b.textContent = n; b.hidden = n === 0;
    $('#drawerCount').textContent = n ? '(' + n + ')' : '';
  }
  function addToCart(item) {
    const same = item.pid ? state.cart.find((i) => i.pid === item.pid && i.size === item.size) : null;
    if (same) same.qty += item.qty; else state.cart.push(Object.assign({ uid: Date.now().toString(36) + Math.random().toString(36).slice(2, 6) }, item));
    saveCart(); toast(t('toast_added'));
    if (window.Order) window.Order.openDrawer();
  }
  function itemName(item) { return item.pid ? L(D.PRODUCTS.find((p) => p.id === item.pid).name) : t('custom_name'); }
  function itemThumb(item) { const p = item.pid ? D.PRODUCTS.find((x) => x.id === item.pid) : null; const src = item.photo || (p && p.img); return src ? `<img src="${src}" alt="">` : B.svg(item.spec, ''); }
  function itemDetail(item) {
    if (item.pid) return t('size_' + item.size) + ' · ' + B.count(item.spec) + ' ' + t('stems');
    const c = item.custom;
    const parts = [B.count(item.spec) + ' ' + t('stems') + ': ' + specSummary(item.spec), t('paper') + ' ' + L(D.WRAPS[c.wrap].name).toLowerCase(), t('ribbon') + ' ' + L(D.RIBBONS[c.ribbon].name).toLowerCase()];
    const ex = c.extras.filter((e) => e !== 'tarjeta').map((e) => L(D.EXTRAS.find((x) => x.id === e).name).toLowerCase());
    if (ex.length) parts.push(t('extras') + ': ' + ex.join(', '));
    if (c.msg) parts.push(t('card') + ': “' + c.msg + '”');
    return parts.join(' · ');
  }

  /* ---------- Vista rápida ---------- */
  const qv = () => $('#qv');
  function openQV(id) { state.qv = { id, size: 'std', qty: 1 }; renderQV(); if (!qv().open) qv().showModal(); }
  function closeQV() { if (qv().open) qv().close(); }
  function qvProduct() { return D.PRODUCTS.find((p) => p.id === state.qv.id); }
  function qvUnit() { return Math.round(qvProduct().price * D.SIZES[state.qv.size]); }
  function renderQV() {
    const p = qvProduct(); if (!p) return;
    $('#qvArt').innerHTML = p.img ? `<img src="${p.img}" alt="${esc(L(p.name))}">` : B.svg(p.spec, L(p.name));
    $('#qvOcc').textContent = p.occ.map((o) => t('occ_' + o)).join(' · ');
    $('#qvName').textContent = L(p.name);
    $('#qvDesc').textContent = L(p.desc);
    $('#qvFlowers').textContent = t('qv_flowers') + ' ' + specSummary(p.spec) + '.';
    $('#qvSizes').innerHTML = Object.keys(D.SIZES).map((s) => `<button type="button" role="radio" data-size="${s}" aria-checked="${state.qv.size === s}">${esc(t('size_' + s))}<small>${money(Math.round(p.price * D.SIZES[s]))}</small></button>`).join('');
    $('#qvQty').textContent = state.qv.qty;
    $('#qvPrice').textContent = money(qvUnit() * state.qv.qty);
  }

  /* ---------- Taller ---------- */
  const b = () => state.builder;
  function builderSpec() {
    return { items: Object.keys(D.FLOWERS).filter((k) => b().counts[k] > 0).map((k) => ({ type: k, n: b().counts[k], variant: b().variants[k] })), wrap: b().wrap, ribbon: b().ribbon };
  }
  function builderTotals() {
    let stems = 0, sum = 0;
    Object.keys(D.FLOWERS).forEach((k) => { const n = b().counts[k] || 0; stems += n; sum += n * D.FLOWERS[k].price; });
    const extras = b().extras.reduce((a, id) => { const e = D.EXTRAS.find((x) => x.id === id); return a + (e ? e.price : 0); }, 0);
    return { stems, sum, extras, total: stems ? D.CONFIG.baseFee + sum + extras : 0 };
  }
  const sizeKey = (n) => n <= 8 ? 'peq' : n <= 14 ? 'med' : n <= 22 ? 'gra' : 'del';
  const FOCAL = { peonia: 0, hortensia: 1, lirio: 2, rosa: 3, tulipan: 4, gypsophila: 5, eucalipto: 6 };
  function dominantType() { const c = b().counts; return Object.keys(D.FLOWERS).filter((k) => c[k] > 0).sort((x, y) => (c[y] - c[x]) || (FOCAL[x] - FOCAL[y]))[0] || null; }
  function previewPhoto() { const k = dominantType(); if (!k) return null; return D.PREVIEW_PHOTOS[k + '/' + b().variants[k]] || D.PREVIEW_PHOTOS[k + '/' + D.FLOWERS[k].variants[0]] || null; }
  function dominantLabel() { const k = dominantType(); if (!k) return ''; const f = D.FLOWERS[k]; return L(f.name) + (f.variants.length > 1 ? ' ' + L(D.VARIANT_NAMES[b().variants[k]]) : ''); }
  function saveBuilder() { store.set('eyd.builder', b()); }

  function renderBuilder() {
    $('#flowerList').innerHTML = Object.keys(D.FLOWERS).map((k) => {
      const f = D.FLOWERS[k];
      const tones = f.variants.length > 1 ? `<div class="tones" role="group" aria-label="${esc(t('b_tone'))}">${f.variants.map((v) => `<button type="button" class="tone" data-v="${v}" style="--c:${D.PALETTES[k][v][0]};--c2:${D.PALETTES[k][v][1]}" aria-pressed="${b().variants[k] === v}" aria-label="${esc(L(D.VARIANT_NAMES[v]))}" title="${esc(L(D.VARIANT_NAMES[v]))}"></button>`).join('')}</div>` : '';
      return `<div class="frow" data-type="${k}">
        <div class="sw">${B.flowerSVG(k, b().variants[k])}</div>
        <div class="fi"><div class="nm">${esc(L(f.name))}</div><div class="pp">${money(f.price)} ${esc(t('b_perstem'))}</div>${tones}</div>
        <div class="stepper"><button type="button" data-d="-1" aria-label="${esc(t('less'))}">−</button><output>${b().counts[k]}</output><button type="button" data-d="1" aria-label="${esc(t('more'))}">+</button></div>
      </div>`;
    }).join('');
    $('#wrapList').innerHTML = Object.keys(D.WRAPS).map((k) => `<button type="button" class="swatch" data-wrap="${k}" aria-pressed="${b().wrap === k}"><i style="background:${D.WRAPS[k].base}"></i>${esc(L(D.WRAPS[k].name))}</button>`).join('');
    $('#ribbonList').innerHTML = Object.keys(D.RIBBONS).map((k) => `<button type="button" class="swatch" data-ribbon="${k}" aria-pressed="${b().ribbon === k}"><i style="background:${D.RIBBONS[k].color}"></i>${esc(L(D.RIBBONS[k].name))}</button>`).join('');
    $('#extraList').innerHTML = D.EXTRAS.map((e) => `<label class="extra"><input type="checkbox" data-extra="${e.id}" ${b().extras.includes(e.id) ? 'checked' : ''}><span>${esc(L(e.name))}</span><span class="pr">${e.price ? money(e.price) : esc(t('included'))}</span></label>`).join('');
    $('#cardMsg').value = b().msg || '';
    updateBuilder();
  }
  function updateBuilder() {
    const tot = builderTotals();
    $$('.frow').forEach((row) => {
      const k = row.dataset.type, n = b().counts[k] || 0;
      row.classList.toggle('on', n > 0);
      $('output', row).textContent = n;
      const tones = $('.tones', row); if (tones) { tones.hidden = n === 0; $$('.tone', tones).forEach((tb) => tb.setAttribute('aria-pressed', tb.dataset.v === b().variants[k])); }
    });
    renderStage(tot);
    $('#pvSize').textContent = tot.stems ? t('size_' + sizeKey(tot.stems)) + ' · ' + tot.stems + ' ' + t(tot.stems === 1 ? 'stem' : 'stems') : t('custom_name');
    $('#pvDetail').textContent = tot.stems ? specSummary(builderSpec()) + ' · ' + t('b_base') + ' ' + money(D.CONFIG.baseFee) : '';
    $('#pvPrice').textContent = money(tot.total);
    $('#addCustomPrice').textContent = money(tot.total);
    $('#addCustomBtn').disabled = !tot.stems;
    $('#msgCount').textContent = (b().msg || '').length;
    saveBuilder();
  }
  let stageMode = null; // '3d' cuando hay WebGL, 'photo' como respaldo
  function ensureStage() {
    const stage = $('#stage');
    if (stageMode) return stage;
    stageMode = (window.Bouquet3D && window.Bouquet3D.ok()) ? '3d' : 'photo';
    stage.innerHTML = (stageMode === '3d' ? '<div class="stage-3d" id="stage3d"></div>' : '<img class="stage-photo" id="stagePhoto" alt="">')
      + '<div class="stage-inset" id="stageInset"></div><span class="stage-tag" id="stageTag"></span>'
      + (stageMode === '3d' ? '<span class="stage-hint" id="stageHint"></span>' : '')
      + '<p class="stage-empty" id="stageEmpty" hidden></p>';
    if (stageMode === '3d') window.Bouquet3D.mount($('#stage3d'));
    return stage;
  }
  function renderStage(tot) {
    const stage = ensureStage(), empty = $('#stageEmpty');
    if (!tot.stems) { stage.classList.add('is-empty'); empty.hidden = false; empty.textContent = t('b_empty'); if (stageMode === '3d') window.Bouquet3D.update({ items: [] }); return; }
    stage.classList.remove('is-empty'); empty.hidden = true;
    const photo = previewPhoto(), label = dominantLabel(), inset = $('#stageInset');
    if (stageMode === '3d') {
      window.Bouquet3D.update(builderSpec());
      if (inset.dataset.src !== (photo || '')) { inset.innerHTML = photo ? `<img src="${photo}" alt="">` : ''; inset.dataset.src = photo || ''; }
      $('#stageHint').textContent = t('b_drag');
    } else {
      const img = $('#stagePhoto'); if (img.getAttribute('src') !== photo) img.src = photo; img.alt = t('b_ref') + ': ' + label;
      inset.innerHTML = B.svg(builderSpec(), t('b_sketch'));
    }
    $('#stageTag').textContent = t('b_ref') + ' · ' + label;
  }
  function setCount(k, n) { b().counts[k] = Math.max(0, Math.min(12, n)); const total = Object.values(b().counts).reduce((a, v) => a + v, 0); if (total > 40) b().counts[k] -= total - 40; updateBuilder(); }
  function loadSpec(spec) {
    Object.keys(D.FLOWERS).forEach((k) => { b().counts[k] = 0; });
    spec.items.forEach((i) => { b().counts[i.type] = (b().counts[i.type] || 0) + i.n; if (i.variant) b().variants[i.type] = i.variant; });
    b().wrap = spec.wrap; b().ribbon = spec.ribbon;
    renderBuilder();
  }
  function surprise() {
    const r = Math.random;
    const focal = ['peonia', 'rosa', 'tulipan', 'lirio', 'hortensia'].sort(() => r() - 0.5).slice(0, 1 + Math.floor(r() * 2));
    const fill = ['eucalipto', 'gypsophila'].filter(() => r() > 0.35);
    Object.keys(D.FLOWERS).forEach((k) => { b().counts[k] = 0; });
    focal.forEach((k) => { b().counts[k] = 3 + Math.floor(r() * 5); b().variants[k] = D.FLOWERS[k].variants[Math.floor(r() * D.FLOWERS[k].variants.length)]; });
    fill.forEach((k) => { b().counts[k] = 2 + Math.floor(r() * 4); });
    const wk = Object.keys(D.WRAPS), rk = Object.keys(D.RIBBONS);
    b().wrap = wk[Math.floor(r() * wk.length)]; b().ribbon = rk[Math.floor(r() * rk.length)];
    renderBuilder();
  }
  function clearBuilder() { Object.keys(D.FLOWERS).forEach((k) => { b().counts[k] = 0; }); b().extras = ['tarjeta']; b().msg = ''; renderBuilder(); }
  function addCustom() {
    const tot = builderTotals(); if (!tot.stems) return;
    addToCart({ pid: null, qty: 1, unit: tot.total, size: null, spec: builderSpec(), photo: previewPhoto(), custom: { counts: Object.assign({}, b().counts), variants: Object.assign({}, b().variants), wrap: b().wrap, ribbon: b().ribbon, extras: b().extras.slice(), msg: b().msg } });
  }

  /* ---------- Idioma ---------- */
  function applyI18n() {
    document.documentElement.lang = state.lang;
    $$('[data-t]').forEach((el) => { el.textContent = t(el.dataset.t); });
    $$('[data-t-ph]').forEach((el) => { el.placeholder = t(el.dataset.tPh); });
    $$('[data-lang]').forEach((btn) => btn.setAttribute('aria-pressed', String(btn.dataset.lang === state.lang)));
    $('#cartBtn').setAttribute('aria-label', t('cart_title'));
    $$('#pfPrev,#tstPrev').forEach((el) => el.setAttribute('aria-label', t('prev')));
    $$('#pfNext,#tstNext').forEach((el) => el.setAttribute('aria-label', t('next')));
    $$('#drawerClose,#qvClose').forEach((el) => el.setAttribute('aria-label', t('close')));
    renderAll();
  }
  function setLang(l) { state.lang = l; store.set('eyd.lang', l); applyI18n(); }
  function renderAll() {
    renderStats(); renderMarquee(); renderChips(); renderCatalog(); renderBuilder(); updateBadge();
    if (state.qv.id && qv().open) renderQV();
    if (window.Order) window.Order.renderAll();
  }

  /* ---------- Eventos ---------- */
  function wire() {
    $$('[data-lang]').forEach((btn) => btn.addEventListener('click', () => setLang(btn.dataset.lang)));
    const menuBtn = $('#menuBtn'), nav = $('#nav');
    menuBtn.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', String(open)); });
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); } });
    addEventListener('scroll', () => $('#top').classList.toggle('scrolled', scrollY > 12), { passive: true });

    $('#chips').addEventListener('click', (e) => { const c = e.target.closest('[data-occ]'); if (!c) return; state.filter = c.dataset.occ; renderChips(); renderCatalog(); });
    $('#sortSel').addEventListener('change', (e) => { state.sort = e.target.value; renderCatalog(); });
    $('#grid').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-act]'); if (!btn) return;
      const id = btn.closest('.card').dataset.id, p = D.PRODUCTS.find((x) => x.id === id);
      if (btn.dataset.act === 'fav') toggleFav(id);
      else if (btn.dataset.act === 'view') openQV(id);
      else if (btn.dataset.act === 'add') addToCart({ pid: id, qty: 1, unit: p.price, size: 'std', spec: p.spec });
    });
    $('#grid').addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.art')) { e.preventDefault(); openQV(e.target.closest('.card').dataset.id); } });

    $('#qvClose').addEventListener('click', closeQV);
    qv().addEventListener('click', (e) => { if (e.target === qv()) closeQV(); });
    $('#qvSizes').addEventListener('click', (e) => { const s = e.target.closest('[data-size]'); if (s) { state.qv.size = s.dataset.size; renderQV(); } });
    $('#qvMinus').addEventListener('click', () => { state.qv.qty = Math.max(1, state.qv.qty - 1); renderQV(); });
    $('#qvPlus').addEventListener('click', () => { state.qv.qty = Math.min(20, state.qv.qty + 1); renderQV(); });
    $('#qvAdd').addEventListener('click', () => { const p = qvProduct(); addToCart({ pid: p.id, qty: state.qv.qty, unit: qvUnit(), size: state.qv.size, spec: p.spec }); closeQV(); });
    $('#qvEdit').addEventListener('click', () => { loadSpec(qvProduct().spec); closeQV(); document.getElementById('taller').scrollIntoView({ behavior: 'smooth', block: 'start' }); toast(t('toast_loaded')); });

    $('#flowerList').addEventListener('click', (e) => {
      const row = e.target.closest('.frow'); if (!row) return;
      const k = row.dataset.type;
      const step = e.target.closest('[data-d]'); if (step) { setCount(k, (b().counts[k] || 0) + Number(step.dataset.d)); return; }
      const tone = e.target.closest('[data-v]'); if (tone) { b().variants[k] = tone.dataset.v; $('.sw', row).innerHTML = B.flowerSVG(k, tone.dataset.v); updateBuilder(); }
    });
    $('#wrapList').addEventListener('click', (e) => { const s = e.target.closest('[data-wrap]'); if (!s) return; b().wrap = s.dataset.wrap; $$('#wrapList .swatch').forEach((x) => x.setAttribute('aria-pressed', String(x === s))); updateBuilder(); });
    $('#ribbonList').addEventListener('click', (e) => { const s = e.target.closest('[data-ribbon]'); if (!s) return; b().ribbon = s.dataset.ribbon; $$('#ribbonList .swatch').forEach((x) => x.setAttribute('aria-pressed', String(x === s))); updateBuilder(); });
    $('#extraList').addEventListener('change', (e) => { const id = e.target.dataset.extra; if (!id) return; b().extras = e.target.checked ? b().extras.concat(id) : b().extras.filter((x) => x !== id); updateBuilder(); });
    $('#cardMsg').addEventListener('input', (e) => { b().msg = e.target.value; $('#msgCount').textContent = e.target.value.length; saveBuilder(); });
    $('#surpriseBtn').addEventListener('click', surprise);
    $('#clearBtn').addEventListener('click', clearBuilder);
    $('#addCustomBtn').addEventListener('click', addCustom);
  }

  return { $, $$, state, store, t, L, esc, money, toast, applyI18n, wire, renderAll, saveCart, itemName, itemThumb, itemDetail, specSummary, loadSpec };
})();
