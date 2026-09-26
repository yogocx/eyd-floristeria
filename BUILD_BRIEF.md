# Build brief — E&D Floristería (single-page interactive site)

Deliverable: `index.html` at repo root, self-contained (inline CSS/JS), logo at `assets/logo.webp`. No build step; Netlify publishes the root.

## Brand (from the logo)
- Pink "E" #E48BA5, wine "D" #9E1B47, gold "&" and ring #C39B4E, olive leaves #6E7A45, cream lily #F7E6D8, plum ink #3A2230, blush ground #FBF4F1.
- Tagline (Spanish, keep verbatim): "Flores que enamoran, detalles que perduran."
- Motifs to reuse: gold heart-between-rules divider, scattered gold dots, gold ring.
- Type: Cormorant Garamond (display + spaced caps), Great Vibes (script accents), Jost (body). Google Fonts.

## Reference sites (structure/tone only, not copy): theflowersvalley.com and its corporate page
Take from them: full-bleed editorial hero with centered serif headline + single strong CTA; proof strip with 3 stats; two-way split (Bodas / Corporativo); "confían en nosotros" logo strip; portfolio carousel with venue names; reviews carousel; flower delivery block; process in 3 steps (Brief → Concepto y cotización → Producción); long FAQ; closing "Cuéntanos tu fecha" CTA; dark/cream alternating sections. Adapt the dark luxury feel to E&D's palette (deep plum/wine darks, blush creams, gold accents) rather than black.

## Interactive features (all client-side)
1. ES/EN language toggle (Spanish default), persisted in localStorage.
2. Colección: filter chips by occasion (Todos, Amor, Cumpleaños, Aniversario, Bodas, Nacimiento, Condolencias, Corporativo, Solo porque sí, Favoritos), sort by price; product cards with procedurally drawn SVG bouquets (no photos available yet); favourite hearts; quick-view dialog with size (Estándar / Grande +35% / Deluxe +70%) and quantity.
3. Arma tu ramo: pick flowers (peonía, rosa, tulipán, lirio, hortensia, eucalipto, gypsophila) with steppers and colour variants, wrapping paper, ribbon, extras; live SVG preview + live price (base fee + per-stem prices + extras); "Sorpréndeme" randomizer; add to cart; catalog items can be opened in the builder.
4. Cart drawer: items with thumbnails, qty, delivery zone/date/slot or pickup, customer fields, totals with free delivery threshold; "Pedir por WhatsApp" builds a wa.me link with the full order; "Copiar pedido" fallback.
5. Same-day delivery countdown in the hero trust strip (cutoff 13:00, closed Sunday).
6. Servicios (Bodas y eventos, Suscripción, Corporativo, Condolencias) with "Cotizar" prefilling the event form; testimonials carousel; FAQ accordion; contact with copy buttons.
7. Falling petals canvas in the hero, paused off-screen and under prefers-reduced-motion.
8. Light and dark themes via CSS tokens; phone-width layout; no horizontal scroll.

## Placeholders (single CONFIG object at top of script)
WhatsApp number, phone display, email, address, Instagram, hours, currency (default MXN, es-MX), delivery zones and fees, free-delivery threshold. All sample testimonials and prices are examples to be replaced by the client.
