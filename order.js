/* E&D Floristería — carrito, WhatsApp, contacto, portafolio, proceso, servicios, testimonios, FAQ, pétalos e inicio. */
(function () {
  'use strict';
  const A = window.App, D = window.EYD, B = window.Bouquet;
  const { $, $$, state, t, L, esc, money, toast } = A;
  const C = D.CONFIG;

  /* ---------- Utilidades ---------- */
  function copyText(text) {
    const done = () => toast(t('toast_copied'));
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(done).catch(() => fallback());
    return fallback();
    function fallback() {
      const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (e) { /* sin acceso */ } document.body.removeChild(ta);
    }
  }
  const waUrl = (msg) => 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(msg);
  function fmtDate(iso) {
    if (!iso) return t('tbd');
    const [y, m, d] = iso.split('-').map(Number);
    try { return new Date(y, m - 1, d).toLocaleDateString(state.lang === 'en' ? 'en-US' : C.locale, { weekday: 'long', day: 'numeric', month: 'long' }); } catch (e) { return iso; }
  }
  const todayISO = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };

  /* ---------- Carrito ---------- */
  const drawer = () => $('#drawer');
  let lastFocus = null;
  function openDrawer() { lastFocus = document.activeElement; drawer().classList.add('open'); drawer().setAttribute('aria-hidden', 'false'); document.body.classList.add('locked'); setTimeout(() => $('#drawerClose').focus(), 50); }
  function closeDrawer() { drawer().classList.remove('open'); drawer().setAttribute('aria-hidden', 'true'); document.body.classList.remove('locked'); if (lastFocus && lastFocus.focus) lastFocus.focus(); }

  function cartTotals() {
    const subtotal = state.cart.reduce((a, i) => a + i.unit * i.qty, 0);
    const zone = D.ZONES.find((z) => z.id === state.delivery.zone) || D.ZONES[0];
    const shipping = state.delivery.pickup || !state.cart.length ? 0 : (subtotal >= C.freeDeliveryFrom ? 0 : zone.fee);
    return { subtotal, shipping, total: subtotal + shipping, zone };
  }
  function renderCartOptions() {
    $('#zone').innerHTML = D.ZONES.map((z) => `<option value="${z.id}" ${state.delivery.zone === z.id ? 'selected' : ''}>${esc(L(z.name))}${z.fee ? ' · ' + money(z.fee) : ' · ' + esc(t('cart_free'))}</option>`).join('');
    $('#slot').innerHTML = D.SLOTS.map((s) => `<option value="${s}" ${state.delivery.slot === s ? 'selected' : ''}>${esc(t('slot_' + s))}</option>`).join('');
    $('#date').min = todayISO(); $('#qDate').min = todayISO();
  }
  function renderCart() {
    const items = $('#cartItems');
    if (!state.cart.length) {
      items.innerHTML = `<div class="cart-empty"><p>${esc(t('cart_empty'))}</p><a class="btn btn-outline btn-sm" href="#coleccion" id="cartBrowse">${esc(t('cart_browse'))}</a></div>`;
      $('#cartBrowse').addEventListener('click', closeDrawer);
    } else {
      items.innerHTML = state.cart.map((i) => `<div class="citem" data-uid="${i.uid}">
        <div class="th">${B.svg(i.spec, '')}</div>
        <div class="ci-body">
          <div class="ci-name">${esc(A.itemName(i))}</div>
          <div class="ci-detail">${esc(A.itemDetail(i))}</div>
          <div class="ci-row">
            <div class="stepper"><button type="button" data-d="-1" aria-label="${esc(t('less'))}">−</button><output>${i.qty}</output><button type="button" data-d="1" aria-label="${esc(t('more'))}">+</button></div>
            <span class="price">${money(i.unit * i.qty)}</span>
          </div>
        </div>
        <button type="button" class="ci-remove" data-remove aria-label="${esc(t('cart_remove'))}">×</button>
      </div>`).join('');
    }
    $('#cartForms').hidden = !state.cart.length;
    $('#deliveryFields').hidden = state.delivery.pickup; $('#addrField').hidden = state.delivery.pickup;
    const T = cartTotals();
    const freeHint = !state.delivery.pickup && T.subtotal < C.freeDeliveryFrom && state.cart.length ? `<div class="tot-hint">${esc(t('cart_free_hint', { n: money(C.freeDeliveryFrom) }))}</div>` : '';
    $('#totals').innerHTML = state.cart.length ? `<div class="tot"><span>${esc(t('cart_subtotal'))}</span><span>${money(T.subtotal)}</span></div>
      <div class="tot"><span>${esc(t('cart_shipping'))}${state.delivery.pickup ? ' · ' + esc(t('pickup_store')) : ''}</span><span>${T.shipping ? money(T.shipping) : esc(t('cart_free'))}</span></div>${freeHint}
      <div class="tot grand"><span>${esc(t('cart_total'))}</span><span>${money(T.total)}</span></div>` : '';
    const send = $('#waSend'); send.href = waUrl(orderMessage()); send.classList.toggle('disabled', !state.cart.length); send.setAttribute('aria-disabled', String(!state.cart.length));
    $('#copyOrder').disabled = !state.cart.length;
  }
  function orderMessage() {
    const T = cartTotals(), c = state.customer, d = state.delivery;
    const lines = [t('wa_hello'), ''];
    state.cart.forEach((i) => lines.push('• ' + i.qty + ' × ' + A.itemName(i) + ' (' + A.itemDetail(i) + ') — ' + money(i.unit * i.qty)));
    lines.push('', t('cart_subtotal') + ': ' + money(T.subtotal));
    if (!d.pickup) lines.push(t('cart_shipping') + ' (' + L(T.zone.name) + '): ' + (T.shipping ? money(T.shipping) : t('cart_free')));
    lines.push(t('cart_total') + ': ' + money(T.total), '');
    lines.push((d.pickup ? t('wa_pickup') : t('wa_delivery')) + ': ' + fmtDate(d.date) + (d.pickup ? '' : ', ' + t('slot_' + d.slot)));
    if (!d.pickup && c.addr) lines.push(t('wa_addr') + ': ' + c.addr);
    if (c.name) lines.push(t('wa_name') + ': ' + c.name);
    if (c.phone) lines.push(t('wa_phone') + ': ' + c.phone);
    if (c.card) lines.push(t('wa_card') + ': “' + c.card + '”');
    return lines.join('\n');
  }
  function wireCart() {
    $('#cartBtn').addEventListener('click', openDrawer);
    $('#drawerClose').addEventListener('click', closeDrawer);
    $('#drawerScrim').addEventListener('click', closeDrawer);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && drawer().classList.contains('open')) closeDrawer(); });
    $('#cartItems').addEventListener('click', (e) => {
      const row = e.target.closest('.citem'); if (!row) return;
      const item = state.cart.find((i) => i.uid === row.dataset.uid);
      if (e.target.closest('[data-remove]')) { state.cart = state.cart.filter((i) => i !== item); A.saveCart(); toast(t('toast_removed')); return; }
      const st = e.target.closest('[data-d]'); if (st) { item.qty = Math.max(1, Math.min(20, item.qty + Number(st.dataset.d))); A.saveCart(); }
    });
    $('#pickup').addEventListener('change', (e) => { state.delivery.pickup = e.target.checked; renderCart(); });
    $('#zone').addEventListener('change', (e) => { state.delivery.zone = e.target.value; renderCart(); });
    $('#slot').addEventListener('change', (e) => { state.delivery.slot = e.target.value; renderCart(); });
    $('#date').addEventListener('change', (e) => { state.delivery.date = e.target.value; renderCart(); });
    [['cName', 'name'], ['cPhone', 'phone'], ['cAddr', 'addr'], ['cCard', 'card']].forEach(([id, k]) => $('#' + id).addEventListener('input', (e) => { state.customer[k] = e.target.value.trim(); $('#waSend').href = waUrl(orderMessage()); }));
    $('#copyOrder').addEventListener('click', () => copyText(orderMessage()));
    $('#waSend').addEventListener('click', (e) => { if (!state.cart.length) e.preventDefault(); });
  }

  /* ---------- Contacto ---------- */
  function renderContact() {
    const rows = [
      { k: 'ct_phone', v: C.phoneDisplay, copy: C.phoneDisplay, href: 'https://wa.me/' + C.whatsapp },
      { k: 'ct_email', v: C.email, copy: C.email },
      { k: 'ct_addr', v: L(C.address), copy: L(C.address), href: C.mapsUrl, link: t('open_map') },
      { k: 'ct_ig', v: '@' + C.instagram, href: C.instagramUrl, link: 'Instagram' },
    ];
    $('#infoList').innerHTML = rows.map((r) => `<div class="info-row"><dt class="caps">${esc(t(r.k))}</dt><dd>${r.href && !r.copy ? `<a href="${esc(r.href)}" target="_blank" rel="noopener">${esc(r.v)}</a>` : `<span>${esc(r.v)}</span>`}
      ${r.copy ? `<button type="button" class="mini" data-copy="${esc(r.copy)}">${esc(t('copy'))}</button>` : ''}${r.href && r.copy ? `<a class="mini" href="${esc(r.href)}" target="_blank" rel="noopener">${esc(r.link || 'WhatsApp')}</a>` : ''}</dd></div>`).join('');
    $('#hours').innerHTML = `<h3 class="caps">${esc(t('ct_hours'))}</h3><table class="hours-t">${C.hours.map((h) => `<tr><td>${esc(L(h.d))}</td><td>${esc(L(h.h))}</td></tr>`).join('')}</table>`;
    $('#footSocial').innerHTML = `<span class="caps">${esc(t('foot_follow'))}</span><a href="${esc(C.instagramUrl)}" target="_blank" rel="noopener" aria-label="Instagram @${esc(C.instagram)}"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>@${esc(C.instagram)}</a>`;
    $('#year').textContent = new Date().getFullYear();
  }
  function inquiryMessage() {
    const v = (id) => $('#' + id).value.trim();
    const typeLabel = $('#qType').selectedOptions[0] ? $('#qType').selectedOptions[0].textContent : '';
    const lines = [t('wa_inq'), '', t('wa_type') + ': ' + typeLabel, t('wa_date') + ': ' + fmtDate(v('qDate'))];
    if (v('qVenue')) lines.push(t('wa_venue') + ': ' + v('qVenue'));
    if (v('qGuests')) lines.push(t('wa_guests') + ': ' + v('qGuests'));
    if (v('qMsg')) lines.push(t('wa_idea') + ': ' + v('qMsg'));
    lines.push('', t('wa_name') + ': ' + v('qName'), t('wa_phone') + ': ' + v('qPhone'));
    return lines.join('\n');
  }
  function inquiryValid() { const ok = $('#qName').value.trim() && $('#qPhone').value.trim(); $('#inqErr').hidden = !!ok; return !!ok; }
  function wireContact() {
    $('#infoList').addEventListener('click', (e) => { const b = e.target.closest('[data-copy]'); if (b) copyText(b.dataset.copy); });
    $('#inquiry').addEventListener('submit', (e) => e.preventDefault());
    $('#inquiry').addEventListener('input', () => { $('#inqSend').href = waUrl(inquiryMessage()); });
    $('#inqSend').addEventListener('click', (e) => { if (!inquiryValid()) { e.preventDefault(); $('#qName').focus(); } else { $('#inqSend').href = waUrl(inquiryMessage()); } });
    $('#inqCopy').addEventListener('click', () => { if (inquiryValid()) copyText(inquiryMessage()); });
    document.addEventListener('click', (e) => { const a = e.target.closest('[data-evt]'); if (a) $('#qType').value = a.dataset.evt; });
    $('#services').addEventListener('click', (e) => { const b = e.target.closest('[data-svc]'); if (b) { const map = { boda: 'boda', suscripcion: 'suscripcion', corporativo: 'corporativo', condolencias: 'condolencias' }; $('#qType').value = map[b.dataset.svc] || 'otro'; } });
  }

  /* ---------- Portafolio, proceso, servicios ---------- */
  function renderPortfolio() {
    $('#pfTrack').innerHTML = D.PORTFOLIO.map((p) => `<figure class="pf-card"><div class="pf-art">${B.svg(p.spec, L(p.title))}</div><figcaption><span class="pf-title display">${esc(L(p.title))}</span><span class="pf-place">${esc(L(p.place))}</span></figcaption></figure>`).join('');
  }
  function renderProcess() {
    $('#process').innerHTML = D.PROCESS.map((s, i) => `<li class="pstep"><span class="pnum script">${i + 1}</span><h3 class="display">${esc(L(s.t))}</h3><p>${esc(L(s.p))}</p></li>`).join('');
  }
  const ICONS = {
    rings: '<circle cx="9" cy="13" r="5.5"/><circle cx="15" cy="13" r="5.5"/><path d="M12 4l1.5 2.5L12 8l-1.5-1.5Z"/>',
    repeat: '<path d="M4 12a8 8 0 0 1 13.6-5.7L20 8"/><path d="M20 4v4h-4"/><path d="M20 12a8 8 0 0 1-13.6 5.7L4 16"/><path d="M4 20v-4h4"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3"/>',
    leaf: '<path d="M5 19c0-8 5-13 14-13-1 9-6 14-14 13Z"/><path d="M5 19c3-4 6-7 10-9"/>',
  };
  function renderServices() {
    $('#services').innerHTML = D.SERVICES.map((s) => `<article class="svc"><svg class="svc-ic" viewBox="0 0 24 24" aria-hidden="true">${ICONS[s.icon]}</svg><h3 class="display">${esc(L(s.t))}</h3><p>${esc(L(s.p))}</p><a class="link-caps" href="#contacto" data-svc="${s.id}">${esc(t('srv_cta'))}</a></article>`).join('');
  }
  function wirePortfolio() {
    const track = $('#pfTrack');
    const step = () => { const c = track.querySelector('.pf-card'); return c ? c.getBoundingClientRect().width + 20 : 300; };
    $('#pfPrev').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    $('#pfNext').addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  }

  /* ---------- Testimonios ---------- */
  let tstTimer = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function renderTestimonials() {
    $('#tstTrack').innerHTML = D.TESTIMONIALS.map((x) => `<blockquote class="tslide"><p class="display">“${esc(L(x.q))}”</p><footer><span class="tauth">${esc(x.a)}</span><span class="twhat">${esc(L(x.w))}</span></footer></blockquote>`).join('');
    $('#tstDots').innerHTML = D.TESTIMONIALS.map((_, i) => `<button type="button" data-i="${i}" aria-label="${i + 1}" aria-current="${i === state.tst}"></button>`).join('');
    goTst(state.tst, false);
  }
  function goTst(i, user) {
    const n = D.TESTIMONIALS.length; state.tst = (i + n) % n;
    $('#tstTrack').style.transform = 'translateX(-' + state.tst * 100 + '%)';
    $$('#tstDots button').forEach((b, k) => b.setAttribute('aria-current', String(k === state.tst)));
    if (user) restartTst();
  }
  function restartTst() { clearInterval(tstTimer); if (!reduced) tstTimer = setInterval(() => goTst(state.tst + 1, false), 6500); }
  function wireTestimonials() {
    $('#tstPrev').addEventListener('click', () => goTst(state.tst - 1, true));
    $('#tstNext').addEventListener('click', () => goTst(state.tst + 1, true));
    $('#tstDots').addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) goTst(Number(b.dataset.i), true); });
    const box = $('#tst'); box.addEventListener('mouseenter', () => clearInterval(tstTimer)); box.addEventListener('mouseleave', restartTst); box.addEventListener('focusin', () => clearInterval(tstTimer)); box.addEventListener('focusout', restartTst);
    restartTst();
  }

  /* ---------- FAQ ---------- */
  function renderFAQ() {
    $('#faq').innerHTML = D.FAQS.map((f, i) => `<details class="faq-item" ${i === 0 ? 'open' : ''}><summary>${esc(L(f.q))}<span class="plus" aria-hidden="true"></span></summary><p>${esc(L(f.a))}</p></details>`).join('');
  }

  /* ---------- Aviso de entrega ---------- */
  function deliveryHint() {
    const now = new Date();
    if (C.closedDays.includes(now.getDay())) return t('trust_closed');
    const cut = new Date(now); cut.setHours(C.cutoffHour, 0, 0, 0);
    if (now < cut) { const m = Math.floor((cut - now) / 60000); return t('trust_today', { h: Math.floor(m / 60), m: String(m % 60).padStart(2, '0') }); }
    return t('trust_tomorrow');
  }
  function tickHint() { $('#deliveryHint').textContent = deliveryHint(); }

  /* ---------- Pétalos ---------- */
  function petals() {
    const c = $('#petals'); if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const dpr = Math.min(2, devicePixelRatio || 1);
    let w = 0, h = 0, P = [], raf = 0, visible = true;
    const cols = ['#E48BA5', '#F3C3D0', '#C9386A', '#E2C889', '#F7E6D8'];
    function size() { const r = c.getBoundingClientRect(); w = c.width = Math.floor(r.width * dpr); h = c.height = Math.floor(r.height * dpr); }
    function mk(init) { return { x: Math.random() * w, y: init ? Math.random() * h : -20 * dpr, r: (5 + Math.random() * 8) * dpr, a: Math.random() * 6.28, va: (Math.random() - 0.5) * 0.02, vy: (0.25 + Math.random() * 0.4) * dpr, vx: (Math.random() - 0.5) * 0.3 * dpr, ph: Math.random() * 6.28, col: cols[Math.floor(Math.random() * cols.length)], al: 0.3 + Math.random() * 0.35 }; }
    function draw() { ctx.clearRect(0, 0, w, h); for (const p of P) { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.globalAlpha = p.al; ctx.fillStyle = p.col; ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, 6.283); ctx.fill(); ctx.restore(); } }
    function step() { for (const p of P) { p.y += p.vy; p.ph += 0.01; p.x += p.vx + Math.sin(p.ph) * 0.4 * dpr; p.a += p.va; if (p.y > h + 30) Object.assign(p, mk(false)); } draw(); raf = visible ? requestAnimationFrame(step) : 0; }
    size(); P = Array.from({ length: 18 }, () => mk(true));
    addEventListener('resize', size);
    if (reduced) { draw(); return; }
    const start = () => { if (!raf) raf = requestAnimationFrame(step); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    new IntersectionObserver((en) => { visible = en[0].isIntersecting; if (visible && !document.hidden) start(); else stop(); }).observe(c);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else if (visible) start(); });
  }

  /* ---------- Inicio ---------- */
  function renderAll() { renderCartOptions(); renderCart(); renderContact(); renderPortfolio(); renderProcess(); renderServices(); renderTestimonials(); renderFAQ(); tickHint(); }
  window.Order = { renderAll, renderCart, openDrawer, closeDrawer };

  function init() {
    A.wire(); wireCart(); wireContact(); wirePortfolio(); wireTestimonials();
    A.applyI18n();
    petals();
    setInterval(tickHint, 30000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
