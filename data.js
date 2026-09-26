/* E&D Floristería — datos del sitio.
   Todo lo que el cliente debe cambiar está en CONFIG. Los textos van en pares {es, en}. */
window.EYD = (function () {
  'use strict';

  const CONFIG = {
    brand: 'E&D Floristería',
    heroImage: 'assets/img/hero.jpg',
    // Número de WhatsApp con código de país y sin espacios ni "+". REEMPLAZAR.
    whatsapp: '5215512345678',
    phoneDisplay: '+52 55 1234 5678',
    email: 'hola@edfloristeria.com',
    address: { es: 'Av. de las Flores 123, Col. Jardines', en: 'Av. de las Flores 123, Col. Jardines' },
    mapsUrl: 'https://maps.google.com/?q=Av.+de+las+Flores+123',
    instagram: 'edfloristeriaa',
    instagramUrl: 'https://www.instagram.com/edfloristeriaa',
    locale: 'es-US',         // formato de números; el idioma de la página se controla aparte
    currency: 'USD',         // moneda de todos los precios (USD, MXN, EUR…)
    baseFee: 12,             // armado y papel de un ramo personalizado
    freeDeliveryFrom: 100,   // envío gratis a partir de este subtotal
    cutoffHour: 13,          // hora límite para entrega el mismo día
    closedDays: [0],         // 0 = domingo
    hours: [
      { d: { es: 'Lunes a viernes', en: 'Monday to Friday' }, h: '9:00 – 19:00' },
      { d: { es: 'Sábado', en: 'Saturday' }, h: '9:00 – 15:00' },
      { d: { es: 'Domingo', en: 'Sunday' }, h: { es: 'Cerrado', en: 'Closed' } },
    ],
    // Promesas de servicio (no cifras históricas): un negocio nuevo puede cumplirlas desde el primer día.
    stats: [
      { n: { es: 'Mismo día', en: 'Same day' }, l: { es: 'entrega en tu ciudad si pides antes de las 13:00', en: 'delivery across the city when you order before 1 pm' } },
      { n: { es: 'Hecho a mano', en: 'Hand-tied' }, l: { es: 'cada ramo se arma el día de la entrega con flor de temporada', en: 'every bouquet is made the day it ships, with seasonal flowers' } },
      { n: { es: '< 1 hora', en: '< 1 hour' }, l: { es: 'respuesta a cotizaciones por WhatsApp en horario de atención', en: 'reply to WhatsApp quotes during opening hours' } },
    ],
  };

  const T = {
    es: {
      skip: 'Ir al contenido',
      nav_col: 'Colección', nav_taller: 'Arma tu ramo', nav_eventos: 'Bodas y eventos', nav_port: 'Portafolio', nav_contacto: 'Contacto', nav_cta: 'Cuéntanos tu fecha',
      hero_eyebrow: 'Floristería artesanal',
      hero_title: 'Flores que enamoran, detalles que perduran.',
      hero_lead: 'Ramos hechos a mano con flores frescas de temporada, diseño floral para bodas y eventos corporativos, y entrega el mismo día en tu ciudad.',
      hero_cta1: 'Cuéntanos tu fecha', hero_cta2: 'Ver colección',
      trust_today: 'Entrega hoy si pides en {h} h {m} min', trust_tomorrow: 'Los pedidos de hoy se entregan mañana', trust_closed: 'Hoy descansamos: entregamos el lunes',
      trust2: 'Flores frescas de temporada', trust3: 'Diseño hecho a tu medida',
      ev_eyebrow: 'Diseño floral para eventos', ev_title: 'Dos maneras de trabajar contigo',
      ev_boda_t: 'Bodas', ev_boda_p: 'Ramo de novia, ceremonia, centros de mesa e instalaciones florales que cuentan la historia de la pareja. Nos encargamos del diseño, la producción, el montaje y el retiro.', ev_boda_cta: 'Explorar bodas',
      ev_corp_t: 'Corporativo', ev_corp_p: 'Lanzamientos, galas, cenas ejecutivas y recepciones con florales alineados a tu marca. Producción escalable, logística resuelta y facturación mensual.', ev_corp_cta: 'Explorar corporativo',
      col_eyebrow: 'Entrega de flores', col_title: 'Ramos para cada ocasión',
      col_lead: 'Filtra por ocasión, toca un ramo para verlo de cerca y agrégalo a tu pedido. Todos se entregan el mismo día si pides antes de las 13:00.',
      col_sort: 'Ordenar', sort_rec: 'Recomendados', sort_asc: 'Precio: menor a mayor', sort_desc: 'Precio: mayor a menor',
      col_empty: 'Aún no hay ramos en esta categoría.', col_fav_empty: 'Toca el corazón de un ramo para guardarlo aquí.',
      occ_todos: 'Todos', occ_amor: 'Amor', occ_cumple: 'Cumpleaños', occ_aniv: 'Aniversario', occ_boda: 'Bodas', occ_nac: 'Nacimiento', occ_cond: 'Condolencias', occ_corp: 'Corporativo', occ_porque: 'Solo porque sí', occ_fav: 'Favoritos',
      card_add: 'Agregar', card_view: 'Ver de cerca', card_fav: 'Guardar en favoritos', card_unfav: 'Quitar de favoritos', stems: 'tallos', stem: 'tallo',
      qv_size: 'Tamaño', qv_qty: 'Cantidad', qv_add: 'Agregar al carrito', qv_edit: 'Personalizar en el taller', qv_flowers: 'Lleva',
      size_std: 'Estándar', size_grande: 'Grande', size_deluxe: 'Deluxe',
      b_eyebrow: 'Arma tu ramo', b_title: 'Tu ramo, tallo por tallo', b_lead: 'Elige flores, papel y listón. La vista previa y el precio cambian al instante.',
      b_step1: 'Elige tus flores', b_step2: 'Papel', b_step3: 'Listón', b_step4: 'Extras', b_msg: 'Mensaje para la tarjeta', b_msgph: 'Escribe algo bonito…',
      b_surprise: 'Sorpréndeme', b_clear: 'Empezar de nuevo', b_add: 'Agregar al carrito', b_hint: 'Precio final confirmado por WhatsApp según disponibilidad del día.',
      b_empty: 'Agrega al menos un tallo para ver tu ramo.', b_ref: 'Foto de referencia', b_sketch: 'Boceto de tu mezcla', b_drag: 'Arrastra para girar', b_perstem: 'por tallo', b_base: 'Armado y papel', b_tone: 'Tono',
      size_peq: 'Ramo pequeño', size_med: 'Ramo mediano', size_gra: 'Ramo grande', size_del: 'Ramo deluxe', custom_name: 'Ramo personalizado',
      included: 'Incluida', paper: 'papel', ribbon: 'listón', extras: 'extras', card: 'tarjeta',
      pf_eyebrow: 'Portafolio', pf_title: 'Algunos de nuestros trabajos', pf_note: 'Fotografías de muestra para ilustrar cada tipo de proyecto. Se sustituyen por el portafolio real al publicar.',
      pr_eyebrow: 'Cómo trabajamos', pr_title: 'Un proceso que se adapta a tu evento',
      srv_eyebrow: 'Servicios', srv_title: 'Más que un ramo', srv_cta: 'Cotizar',
      tst_eyebrow: 'Testimonios', tst_title: 'Lo que dicen quienes ya regalaron flores',
      faq_eyebrow: 'Preguntas frecuentes', faq_title: 'Antes de pedir',
      ct_eyebrow: 'Cuéntanos tu fecha', ct_title: 'Cada evento es único. Empecemos por el tuyo.', ct_lead: 'Comparte la fecha, el lugar y tu idea. Te respondemos con una propuesta y una cotización detallada.',
      ct_phone: 'WhatsApp', ct_email: 'Correo', ct_addr: 'Dirección', ct_ig: 'Instagram', ct_hours: 'Horario', copy: 'Copiar', copied: 'Copiado', open_map: 'Ver mapa',
      f_name: 'Nombre', f_phone: 'Teléfono', f_date: 'Fecha del evento', f_type: 'Tipo de evento', f_venue: 'Lugar', f_guests: 'Invitados', f_msg: 'Cuéntanos tu idea',
      f_t_boda: 'Boda', f_t_corp: 'Evento corporativo', f_t_social: 'Evento social', f_t_sus: 'Suscripción', f_t_cond: 'Condolencias', f_t_otro: 'Otro',
      f_send: 'Enviar por WhatsApp', f_copy: 'Copiar mensaje', f_err: 'Escribe tu nombre y teléfono para que podamos responderte.',
      foot_tag: 'Flores que enamoran, detalles que perduran.', foot_rights: 'Todos los derechos reservados.', foot_follow: 'Síguenos',
      cart_title: 'Tu pedido', cart_empty: 'Aún no has agregado ramos.', cart_browse: 'Ver colección', cart_delivery: 'Entrega', cart_pickup: 'Recoger en tienda',
      cart_zone: 'Zona', cart_slot: 'Horario', cart_date: 'Fecha', cart_name: 'Tu nombre', cart_phone: 'Tu teléfono', cart_addr: 'Dirección de entrega', cart_card: 'Mensaje de la tarjeta',
      cart_subtotal: 'Subtotal', cart_shipping: 'Envío', cart_free: 'Gratis', cart_total: 'Total', cart_send: 'Pedir por WhatsApp', cart_copy: 'Copiar pedido',
      cart_note: 'Confirmamos disponibilidad y pago por WhatsApp. No se cobra nada en esta página.', cart_free_hint: 'Envío gratis a partir de {n}', cart_remove: 'Quitar',
      slot_m: 'Mañana · 9 a 13 h', slot_t: 'Tarde · 13 a 18 h', slot_n: 'Noche · 18 a 21 h', pickup_store: 'Recoger en tienda', tbd: 'por confirmar',
      toast_added: 'Agregado a tu pedido', toast_copied: 'Copiado al portapapeles', toast_removed: 'Quitado del pedido', toast_loaded: 'Ramo cargado en el taller',
      wa_hello: 'Hola E&D Floristería 🌸 Quiero hacer un pedido:', wa_delivery: 'Entrega', wa_pickup: 'Recojo en tienda', wa_addr: 'Dirección', wa_name: 'Nombre', wa_phone: 'Teléfono', wa_card: 'Tarjeta',
      wa_inq: 'Hola E&D Floristería 🌸 Quiero cotizar un evento:', wa_type: 'Tipo', wa_date: 'Fecha', wa_venue: 'Lugar', wa_guests: 'Invitados', wa_idea: 'Idea',
      prev: 'Anterior', next: 'Siguiente', close: 'Cerrar', more: 'Más', less: 'Menos',
    },
    en: {
      skip: 'Skip to content',
      nav_col: 'Collection', nav_taller: 'Build a bouquet', nav_eventos: 'Weddings & events', nav_port: 'Portfolio', nav_contacto: 'Contact', nav_cta: 'Tell us your date',
      hero_eyebrow: 'Artisan floristry',
      hero_title: 'Flowers that charm, details that last.',
      hero_lead: 'Hand-tied bouquets with fresh seasonal flowers, floral design for weddings and corporate events, and same-day delivery across the city.',
      hero_cta1: 'Tell us your date', hero_cta2: 'See the collection',
      trust_today: 'Same-day delivery if you order in {h} h {m} min', trust_tomorrow: 'Orders placed now arrive tomorrow', trust_closed: 'Closed today: deliveries resume Monday',
      trust2: 'Fresh seasonal flowers', trust3: 'Designed to your taste',
      ev_eyebrow: 'Floral design for events', ev_title: 'Two ways to work with us',
      ev_boda_t: 'Weddings', ev_boda_p: 'Bridal bouquet, ceremony, centrepieces and floral installations that tell the couple’s story. We handle design, production, setup and strike.', ev_boda_cta: 'Explore weddings',
      ev_corp_t: 'Corporate', ev_corp_p: 'Launches, galas, executive dinners and receptions with florals aligned to your brand. Scalable production, logistics solved, monthly invoicing.', ev_corp_cta: 'Explore corporate',
      col_eyebrow: 'Flower delivery', col_title: 'Bouquets for every occasion',
      col_lead: 'Filter by occasion, tap a bouquet to see it up close and add it to your order. Everything ships same-day when you order before 1 pm.',
      col_sort: 'Sort', sort_rec: 'Recommended', sort_asc: 'Price: low to high', sort_desc: 'Price: high to low',
      col_empty: 'No bouquets in this category yet.', col_fav_empty: 'Tap the heart on a bouquet to save it here.',
      occ_todos: 'All', occ_amor: 'Love', occ_cumple: 'Birthday', occ_aniv: 'Anniversary', occ_boda: 'Weddings', occ_nac: 'New baby', occ_cond: 'Sympathy', occ_corp: 'Corporate', occ_porque: 'Just because', occ_fav: 'Favourites',
      card_add: 'Add', card_view: 'View up close', card_fav: 'Save to favourites', card_unfav: 'Remove from favourites', stems: 'stems', stem: 'stem',
      qv_size: 'Size', qv_qty: 'Quantity', qv_add: 'Add to cart', qv_edit: 'Customize in the studio', qv_flowers: 'Includes',
      size_std: 'Standard', size_grande: 'Large', size_deluxe: 'Deluxe',
      b_eyebrow: 'Build your bouquet', b_title: 'Your bouquet, stem by stem', b_lead: 'Pick flowers, paper and ribbon. Preview and price update as you go.',
      b_step1: 'Choose your flowers', b_step2: 'Wrapping paper', b_step3: 'Ribbon', b_step4: 'Extras', b_msg: 'Card message', b_msgph: 'Write something lovely…',
      b_surprise: 'Surprise me', b_clear: 'Start over', b_add: 'Add to cart', b_hint: 'Final price confirmed over WhatsApp based on the day’s availability.',
      b_empty: 'Add at least one stem to see your bouquet.', b_ref: 'Reference photo', b_sketch: 'Sketch of your mix', b_drag: 'Drag to rotate', b_perstem: 'per stem', b_base: 'Hand-tying and paper', b_tone: 'Tone',
      size_peq: 'Small bouquet', size_med: 'Medium bouquet', size_gra: 'Large bouquet', size_del: 'Deluxe bouquet', custom_name: 'Custom bouquet',
      included: 'Included', paper: 'paper', ribbon: 'ribbon', extras: 'extras', card: 'card',
      pf_eyebrow: 'Portfolio', pf_title: 'Some of our work', pf_note: 'Sample photographs illustrating each type of project. They are replaced with the real portfolio at launch.',
      pr_eyebrow: 'How we work', pr_title: 'A process that fits your event',
      srv_eyebrow: 'Services', srv_title: 'More than a bouquet', srv_cta: 'Get a quote',
      tst_eyebrow: 'Testimonials', tst_title: 'What our customers say',
      faq_eyebrow: 'FAQ', faq_title: 'Before you order',
      ct_eyebrow: 'Tell us your date', ct_title: 'Every event is one of a kind. Let’s start with yours.', ct_lead: 'Share the date, the venue and your idea. We reply with a concept and an itemized estimate.',
      ct_phone: 'WhatsApp', ct_email: 'Email', ct_addr: 'Address', ct_ig: 'Instagram', ct_hours: 'Hours', copy: 'Copy', copied: 'Copied', open_map: 'Open map',
      f_name: 'Name', f_phone: 'Phone', f_date: 'Event date', f_type: 'Event type', f_venue: 'Venue', f_guests: 'Guests', f_msg: 'Tell us your idea',
      f_t_boda: 'Wedding', f_t_corp: 'Corporate event', f_t_social: 'Social event', f_t_sus: 'Subscription', f_t_cond: 'Sympathy', f_t_otro: 'Other',
      f_send: 'Send via WhatsApp', f_copy: 'Copy message', f_err: 'Add your name and phone so we can get back to you.',
      foot_tag: 'Flowers that charm, details that last.', foot_rights: 'All rights reserved.', foot_follow: 'Follow us',
      cart_title: 'Your order', cart_empty: 'You haven’t added any bouquets yet.', cart_browse: 'Browse collection', cart_delivery: 'Delivery', cart_pickup: 'Pick up in store',
      cart_zone: 'Area', cart_slot: 'Time slot', cart_date: 'Date', cart_name: 'Your name', cart_phone: 'Your phone', cart_addr: 'Delivery address', cart_card: 'Card message',
      cart_subtotal: 'Subtotal', cart_shipping: 'Delivery', cart_free: 'Free', cart_total: 'Total', cart_send: 'Order via WhatsApp', cart_copy: 'Copy order',
      cart_note: 'We confirm availability and payment over WhatsApp. Nothing is charged on this page.', cart_free_hint: 'Free delivery from {n}', cart_remove: 'Remove',
      slot_m: 'Morning · 9 am to 1 pm', slot_t: 'Afternoon · 1 to 6 pm', slot_n: 'Evening · 6 to 9 pm', pickup_store: 'Store pickup', tbd: 'to be confirmed',
      toast_added: 'Added to your order', toast_copied: 'Copied to clipboard', toast_removed: 'Removed from order', toast_loaded: 'Bouquet loaded in the studio',
      wa_hello: 'Hi E&D Floristería 🌸 I’d like to place an order:', wa_delivery: 'Delivery', wa_pickup: 'Store pickup', wa_addr: 'Address', wa_name: 'Name', wa_phone: 'Phone', wa_card: 'Card',
      wa_inq: 'Hi E&D Floristería 🌸 I’d like a quote for an event:', wa_type: 'Type', wa_date: 'Date', wa_venue: 'Venue', wa_guests: 'Guests', wa_idea: 'Idea',
      prev: 'Previous', next: 'Next', close: 'Close', more: 'More', less: 'Less',
    },
  };

  // Flores disponibles en el taller. price = precio por tallo. r = radio visual para el acomodo.
  const FLOWERS = {
    peonia:     { name: { es: 'Peonía', en: 'Peony' },          plural: { es: 'peonías', en: 'peonies' },          price: 9,  r: 22, variants: ['rosa', 'blush', 'vino'] },
    rosa:       { name: { es: 'Rosa', en: 'Rose' },             plural: { es: 'rosas', en: 'roses' },              price: 4,  r: 16, variants: ['vino', 'rosa', 'blanco', 'durazno'] },
    tulipan:    { name: { es: 'Tulipán', en: 'Tulip' },         plural: { es: 'tulipanes', en: 'tulips' },         price: 3,  r: 14, variants: ['rosa', 'blanco', 'vino', 'amarillo'] },
    lirio:      { name: { es: 'Lirio', en: 'Lily' },            plural: { es: 'lirios', en: 'lilies' },            price: 6,  r: 20, variants: ['crema', 'rosa'] },
    hortensia:  { name: { es: 'Hortensia', en: 'Hydrangea' },   plural: { es: 'hortensias', en: 'hydrangeas' },    price: 9, r: 20, variants: ['rosa', 'azul', 'blanco'] },
    eucalipto:  { name: { es: 'Eucalipto', en: 'Eucalyptus' },  plural: { es: 'eucalipto', en: 'eucalyptus' },     price: 2,  r: 14, variants: ['verde'] },
    gypsophila: { name: { es: 'Gypsophila', en: 'Baby’s breath' }, plural: { es: 'gypsophila', en: 'baby’s breath' }, price: 3, r: 13, variants: ['blanco'] },
  };

  const PALETTES = {
    peonia:     { rosa: ['#F1A6BC', '#E27C9E', '#F8CCD8'], blush: ['#F6C9D5', '#EBA4B9', '#FBE3EA'], vino: ['#B12A57', '#8E1743', '#D2557E'] },
    rosa:       { vino: ['#9E1B47', '#7B1236', '#B8305E'], rosa: ['#EC90AC', '#D96F92', '#F5B9CA'], blanco: ['#FBF3EE', '#EEDCD6', '#FFFFFF'], durazno: ['#F4B69B', '#E8977A', '#FAD1BF'] },
    tulipan:    { rosa: ['#E9779B', '#D4587F'], blanco: ['#FBF4EE', '#EAD9D0'], vino: ['#A32250', '#7F1440'], amarillo: ['#F0C75E', '#D9A93C'] },
    lirio:      { crema: ['#F8E9DD', '#EBCFBF', '#C39B4E'], rosa: ['#F4C9D4', '#E8A6B8', '#C39B4E'] },
    hortensia:  { rosa: ['#F2BCCE', '#E69CB5'], azul: ['#B9C6E6', '#93A5D3'], blanco: ['#F7F1F0', '#E8DCDC'] },
    eucalipto:  { verde: ['#7F8C5A', '#6A7646'] },
    gypsophila: { blanco: ['#FFFFFF', '#F2E8EA'] },
  };

  const VARIANT_NAMES = {
    rosa: { es: 'rosa', en: 'pink' }, blush: { es: 'rosa pálido', en: 'blush' }, vino: { es: 'vino', en: 'wine' }, blanco: { es: 'blanco', en: 'white' },
    durazno: { es: 'durazno', en: 'peach' }, amarillo: { es: 'amarillo', en: 'yellow' }, crema: { es: 'crema', en: 'cream' }, azul: { es: 'azul', en: 'blue' }, verde: { es: 'verde', en: 'green' },
  };

  const WRAPS = {
    kraft:  { name: { es: 'Kraft', en: 'Kraft' },            base: '#C8A97C', light: '#DCC19B', dark: '#8F6F45' },
    blush:  { name: { es: 'Rosa pálido', en: 'Blush' },      base: '#F2C6D1', light: '#F8DDE4', dark: '#C98AA0' },
    vino:   { name: { es: 'Vino', en: 'Wine' },              base: '#7B1236', light: '#96284D', dark: '#4C0A22' },
    blanco: { name: { es: 'Blanco', en: 'White' },           base: '#F7F1EC', light: '#FFFFFF', dark: '#C9BCB4' },
    negro:  { name: { es: 'Negro', en: 'Black' },            base: '#2C242A', light: '#463A42', dark: '#0E0A0D' },
  };

  const RIBBONS = {
    oro:   { name: { es: 'Dorado', en: 'Gold' },        color: '#C39B4E' },
    vino:  { name: { es: 'Vino', en: 'Wine' },          color: '#8E1743' },
    rosa:  { name: { es: 'Rosa', en: 'Pink' },          color: '#E48BA5' },
    oliva: { name: { es: 'Verde oliva', en: 'Olive' },  color: '#6E7A45' },
  };

  const EXTRAS = [
    { id: 'tarjeta', name: { es: 'Tarjeta escrita a mano', en: 'Handwritten card' }, price: 0 },
    { id: 'choc',    name: { es: 'Chocolates artesanales', en: 'Artisan chocolates' }, price: 15 },
    { id: 'vela',    name: { es: 'Vela aromática', en: 'Scented candle' }, price: 18 },
    { id: 'jarron',  name: { es: 'Jarrón de vidrio', en: 'Glass vase' }, price: 20 },
    { id: 'globo',   name: { es: 'Globo', en: 'Balloon' }, price: 6 },
  ];

  const ZONES = [
    { id: 'centro',   name: { es: 'Centro', en: 'Downtown' },  fee: 0 },
    { id: 'norte',    name: { es: 'Norte', en: 'North' },      fee: 8 },
    { id: 'sur',      name: { es: 'Sur', en: 'South' },        fee: 8 },
    { id: 'oriente',  name: { es: 'Oriente', en: 'East' },     fee: 12 },
    { id: 'poniente', name: { es: 'Poniente', en: 'West' },    fee: 12 },
  ];

  const SLOTS = ['m', 't', 'n'];
  const OCC = ['todos', 'amor', 'cumple', 'aniv', 'boda', 'nac', 'cond', 'corp', 'porque', 'fav'];
  const SIZES = { std: 1, grande: 1.35, deluxe: 1.7 };

  const PRODUCTS = [
    { id: 'amanecer', img: 'assets/img/p-amanecer.jpg', name: { es: 'Amanecer Rosa', en: 'Rose Dawn' }, price: 85, occ: ['amor', 'cumple'],
      desc: { es: 'Peonías rosa en papel blanco con listón dorado. Nuestro ramo más pedido.', en: 'Pink peonies in white paper with a gold ribbon. Our most requested bouquet.' },
      spec: { items: [{ type: 'peonia', n: 9, variant: 'rosa' }, { type: 'eucalipto', n: 2 }], wrap: 'blanco', ribbon: 'oro' } },
    { id: 'vinooro', img: 'assets/img/p-vinooro.jpg', name: { es: 'Vino y Oro', en: 'Wine & Gold' }, price: 65, occ: ['amor', 'aniv'],
      desc: { es: 'Rosas color vino con eucalipto fresco, envueltas en kraft con listón dorado.', en: 'Wine-red roses with fresh eucalyptus, wrapped in kraft with a gold ribbon.' },
      spec: { items: [{ type: 'rosa', n: 9, variant: 'vino' }, { type: 'eucalipto', n: 5 }], wrap: 'kraft', ribbon: 'oro' } },
    { id: 'tulipanes', img: 'assets/img/p-tulipanes.jpg', name: { es: 'Jardín de Tulipanes', en: 'Tulip Garden' }, price: 48, occ: ['cumple', 'porque'],
      desc: { es: 'Quince tulipanes rosa en papel blanco. Sencillo, fresco y alegre.', en: 'Fifteen pink tulips in white paper. Simple, fresh and cheerful.' },
      spec: { items: [{ type: 'tulipan', n: 15, variant: 'rosa' }], wrap: 'blanco', ribbon: 'rosa' } },
    { id: 'lirio', img: 'assets/img/p-lirio.jpg', name: { es: 'Lirio Sereno', en: 'Quiet Lily' }, price: 70, occ: ['cond', 'porque'],
      desc: { es: 'Lirios crema con eucalipto y gypsophila. Un arreglo sobrio para acompañar.', en: 'Cream lilies with eucalyptus and baby’s breath. A gentle arrangement to accompany.' },
      spec: { items: [{ type: 'lirio', n: 5, variant: 'crema' }, { type: 'eucalipto', n: 4 }, { type: 'gypsophila', n: 4 }], wrap: 'blanco', ribbon: 'oliva' } },
    { id: 'hortensia', img: 'assets/img/p-hortensia.jpg', name: { es: 'Nube de Hortensia', en: 'Hydrangea Cloud' }, price: 78, occ: ['nac', 'aniv'],
      desc: { es: 'Hortensias rosa y blancas en papel de seda. Suave y voluminoso, ideal para recibir a alguien nuevo.', en: 'Pink and white hydrangeas in tissue paper. Soft and generous, perfect for welcoming someone new.' },
      spec: { items: [{ type: 'hortensia', n: 3, variant: 'rosa' }, { type: 'hortensia', n: 2, variant: 'blanco' }, { type: 'eucalipto', n: 3 }], wrap: 'blanco', ribbon: 'rosa' } },
    { id: 'silvestre', img: 'assets/img/p-silvestre.jpg', name: { es: 'Campo Silvestre', en: 'Wildflower Field' }, price: 42, occ: ['porque', 'cumple'],
      desc: { es: 'Tulipanes blancos envueltos en kraft. Sencillo, ligero y de campo.', en: 'White tulips wrapped in kraft. Simple, light and country-fresh.' },
      spec: { items: [{ type: 'tulipan', n: 12, variant: 'blanco' }, { type: 'eucalipto', n: 3 }], wrap: 'kraft', ribbon: 'oliva' } },
    { id: 'peoniareal', img: 'assets/img/p-peoniareal.jpg', name: { es: 'Peonía Real', en: 'Royal Peony' }, price: 120, occ: ['boda', 'aniv', 'amor'],
      desc: { es: 'Doce peonías coral en papel negro con listón dorado. Un ramo de celebración.', en: 'Twelve coral peonies in black paper with a gold ribbon. A celebration bouquet.' },
      spec: { items: [{ type: 'peonia', n: 12, variant: 'vino' }], wrap: 'negro', ribbon: 'oro' } },
    { id: 'corporativo', img: 'assets/img/p-corporativo.jpg', name: { es: 'Clásico Corporativo', en: 'Corporate Classic' }, price: 85, occ: ['corp'],
      desc: { es: 'Rosas blancas con eucalipto en papel negro. Elegante para recepciones y regalos.', en: 'White roses with eucalyptus in black paper. Elegant for receptions and gifts.' },
      spec: { items: [{ type: 'rosa', n: 12, variant: 'blanco' }, { type: 'eucalipto', n: 4 }], wrap: 'negro', ribbon: 'oro' } },
    { id: 'durazno', img: 'assets/img/p-durazno.jpg', name: { es: 'Tarde de Durazno', en: 'Peach Afternoon' }, price: 68, occ: ['cumple', 'amor'],
      desc: { es: 'Rosas durazno y crema con gypsophila. Cálido y luminoso.', en: 'Peach and cream roses with baby’s breath. Warm and bright.' },
      spec: { items: [{ type: 'rosa', n: 8, variant: 'durazno' }, { type: 'rosa', n: 4, variant: 'blanco' }, { type: 'gypsophila', n: 4 }], wrap: 'blush', ribbon: 'oro' } },
    { id: 'azul', img: 'assets/img/p-azul.jpg', name: { es: 'Cielo de Hortensia', en: 'Hydrangea Sky' }, price: 75, occ: ['nac', 'porque'],
      desc: { es: 'Hortensias azules y blancas con eucalipto. Fresco y sereno.', en: 'Blue and white hydrangeas with eucalyptus. Fresh and calm.' },
      spec: { items: [{ type: 'hortensia', n: 3, variant: 'azul' }, { type: 'hortensia', n: 2, variant: 'blanco' }, { type: 'eucalipto', n: 3 }], wrap: 'blanco', ribbon: 'oliva' } },
    { id: 'novia', img: 'assets/img/p-novia.jpg', name: { es: 'Ramo de Novia Clásico', en: 'Classic Bridal Bouquet' }, price: 220, occ: ['boda'],
      desc: { es: 'Peonías blush, rosas blancas y lirios crema, atado con listón de seda. Se diseña junto a la novia.', en: 'Blush peonies, white roses and cream lilies, tied with silk ribbon. Designed together with the bride.' },
      spec: { items: [{ type: 'peonia', n: 5, variant: 'blush' }, { type: 'rosa', n: 6, variant: 'blanco' }, { type: 'lirio', n: 3, variant: 'crema' }, { type: 'eucalipto', n: 3 }], wrap: 'blanco', ribbon: 'rosa' } },
    { id: 'condolencia', img: 'assets/img/p-condolencia.jpg', name: { es: 'Paz Blanca', en: 'White Peace' }, price: 110, occ: ['cond'],
      desc: { es: 'Rosas y lirios blancos con eucalipto. Entrega directa en funerarias y velatorios.', en: 'White roses and lilies with eucalyptus. Direct delivery to funeral homes.' },
      spec: { items: [{ type: 'rosa', n: 8, variant: 'blanco' }, { type: 'lirio', n: 5, variant: 'crema' }, { type: 'eucalipto', n: 5 }], wrap: 'blanco', ribbon: 'oliva' } },
  ];

  const PORTFOLIO = [
    { img: 'assets/img/pf-1.jpg', title: { es: 'Boda en jardín', en: 'Garden wedding' }, place: { es: 'Hacienda, 180 invitados', en: 'Hacienda, 180 guests' }, spec: { items: [{ type: 'peonia', n: 6, variant: 'blush' }, { type: 'rosa', n: 6, variant: 'blanco' }, { type: 'eucalipto', n: 6 }], wrap: 'blanco', ribbon: 'oro' } },
    { img: 'assets/img/pf-2.jpg', title: { es: 'Gala corporativa', en: 'Corporate gala' }, place: { es: 'Hotel, 400 invitados', en: 'Hotel ballroom, 400 guests' }, spec: { items: [{ type: 'rosa', n: 10, variant: 'vino' }, { type: 'lirio', n: 4, variant: 'crema' }, { type: 'eucalipto', n: 4 }], wrap: 'negro', ribbon: 'oro' } },
    { img: 'assets/img/pf-3.jpg', title: { es: 'Lanzamiento de marca', en: 'Brand launch' }, place: { es: 'Showroom, instalación floral', en: 'Showroom, floral installation' }, spec: { items: [{ type: 'hortensia', n: 5, variant: 'blanco' }, { type: 'tulipan', n: 8, variant: 'blanco' }, { type: 'gypsophila', n: 6 }], wrap: 'blanco', ribbon: 'oliva' } },
    { img: 'assets/img/pf-4.jpg', title: { es: 'Cena de aniversario', en: 'Anniversary dinner' }, place: { es: 'Restaurante, mesa larga', en: 'Restaurant, long table' }, spec: { items: [{ type: 'peonia', n: 6, variant: 'vino' }, { type: 'rosa', n: 6, variant: 'durazno' }, { type: 'eucalipto', n: 4 }], wrap: 'kraft', ribbon: 'vino' } },
    { img: 'assets/img/pf-5.jpg', title: { es: 'Bautizo', en: 'Christening' }, place: { es: 'Terraza, 60 invitados', en: 'Terrace, 60 guests' }, spec: { items: [{ type: 'hortensia', n: 4, variant: 'azul' }, { type: 'rosa', n: 6, variant: 'blanco' }, { type: 'gypsophila', n: 6 }], wrap: 'blush', ribbon: 'rosa' } },
    { img: 'assets/img/pf-6.jpg', title: { es: 'Recepción de oficina', en: 'Office reception' }, place: { es: 'Suscripción semanal', en: 'Weekly subscription' }, spec: { items: [{ type: 'lirio', n: 5, variant: 'crema' }, { type: 'eucalipto', n: 6 }, { type: 'tulipan', n: 6, variant: 'amarillo' }], wrap: 'kraft', ribbon: 'oliva' } },
    { img: 'assets/img/pf-7.jpg', title: { es: 'Ceremonia civil', en: 'Civil ceremony' }, place: { es: 'Jardín privado, 40 invitados', en: 'Private garden, 40 guests' }, spec: { items: [{ type: 'tulipan', n: 10, variant: 'rosa' }, { type: 'peonia', n: 4, variant: 'rosa' }, { type: 'gypsophila', n: 5 }], wrap: 'blush', ribbon: 'oro' } },
  ];

  const PROCESS = [
    { t: { es: 'Brief y objetivos', en: 'Brief & goals' }, p: { es: 'Compártenos fecha, lugar, número de invitados y lo que quieres lograr. Si tienes referencias, paleta o manual de marca, adjúntalos.', en: 'Share the date, venue, guest count and what you want to achieve. Attach references, palette or brand guidelines if you have them.' } },
    { t: { es: 'Concepto y cotización', en: 'Concept & estimate' }, p: { es: 'Te proponemos un concepto floral con cotización desglosada para que compares opciones y apruebes con calma.', en: 'We propose a floral concept with an itemized estimate so you can compare options and approve at your pace.' } },
    { t: { es: 'Producción y montaje', en: 'Production & setup' }, p: { es: 'Con tu aprobación nos encargamos de la compra, el armado, la entrega, el montaje y el retiro, coordinados con tu lugar y proveedores.', en: 'Once approved we handle sourcing, production, delivery, setup and strike, coordinated with your venue and vendors.' } },
  ];

  const SERVICES = [
    { id: 'boda', icon: 'rings', t: { es: 'Bodas y eventos sociales', en: 'Weddings & social events' }, p: { es: 'Ramo de novia, ceremonia, centros de mesa, arcos y ambientación completa. Agenda una cita para diseñar tu evento.', en: 'Bridal bouquet, ceremony, centrepieces, arches and full styling. Book a consultation to design your event.' } },
    { id: 'suscripcion', icon: 'repeat', t: { es: 'Suscripción semanal', en: 'Weekly subscription' }, p: { es: 'Flores frescas en tu casa, recepción u oficina cada semana o cada quince días, con jarrón y mantenimiento incluidos.', en: 'Fresh flowers at home, reception or office every week or fortnight, with vase and maintenance included.' } },
    { id: 'corporativo', icon: 'building', t: { es: 'Corporativo', en: 'Corporate' }, p: { es: 'Lanzamientos, galas, regalos para clientes y fechas especiales. Producción escalable y facturación mensual.', en: 'Launches, galas, client gifts and special dates. Scalable production and monthly invoicing.' } },
    { id: 'condolencias', icon: 'leaf', t: { es: 'Condolencias', en: 'Sympathy' }, p: { es: 'Coronas, cruces y arreglos para acompañar con respeto. Entrega directa en funerarias y velatorios.', en: 'Wreaths, crosses and arrangements to accompany with respect. Direct delivery to funeral homes.' } },
  ];

  const TESTIMONIALS = [
    { q: { es: 'El ramo llegó puntual y más bonito que en la foto. Mi mamá no dejaba de hablar de las peonías.', en: 'The bouquet arrived on time and prettier than the picture. My mom couldn’t stop talking about the peonies.' }, a: 'Mariana R.', w: { es: 'Día de las Madres', en: 'Mother’s Day' } },
    { q: { es: 'Armé el ramo desde el celular en cinco minutos y me lo entregaron el mismo día. Voy a repetir.', en: 'I built the bouquet from my phone in five minutes and it was delivered the same day. I’ll be back.' }, a: 'Diego L.', w: { es: 'Aniversario', en: 'Anniversary' } },
    { q: { es: 'Se encargaron de toda la decoración de nuestra boda. Cada mesa era distinta y todas eran perfectas.', en: 'They handled all the décor for our wedding. Every table was different and every one was perfect.' }, a: 'Ana y Rodrigo', w: { es: 'Boda en jardín', en: 'Garden wedding' } },
    { q: { es: 'Las flores de la recepción duran toda la semana y siempre van con nuestros colores. Servicio impecable.', en: 'The reception flowers last all week and always match our colours. Flawless service.' }, a: 'Grupo Ventura', w: { es: 'Suscripción corporativa', en: 'Corporate subscription' } },
    { q: { es: 'Pedí un arreglo de condolencias a distancia y lo trataron con una delicadeza que no esperaba.', en: 'I ordered a sympathy arrangement from abroad and they handled it with a delicacy I didn’t expect.' }, a: 'Lucía P.', w: { es: 'Condolencias', en: 'Sympathy' } },
  ];

  const FAQS = [
    { q: { es: '¿Hacen entregas el mismo día?', en: 'Do you deliver same-day?' }, a: { es: 'Sí. Los pedidos confirmados antes de las 13:00 se entregan el mismo día dentro de nuestras zonas. En fechas altas (14 de febrero, 10 de mayo) te recomendamos pedir con dos días de anticipación.', en: 'Yes. Orders confirmed before 1 pm are delivered the same day within our areas. On peak dates (Valentine’s, Mother’s Day) we recommend ordering two days ahead.' } },
    { q: { es: '¿Puedo cambiar las flores de un ramo de la colección?', en: 'Can I change the flowers in a collection bouquet?' }, a: { es: 'Claro. Abre el ramo, toca "Personalizar en el taller" y ajusta tallos, tonos, papel y listón. El precio se actualiza al momento.', en: 'Of course. Open the bouquet, tap "Customize in the studio" and adjust stems, tones, paper and ribbon. The price updates instantly.' } },
    { q: { es: '¿Qué pasa si una flor no está disponible?', en: 'What if a flower isn’t available?' }, a: { es: 'Trabajamos con flor de temporada, así que puede pasar. Te avisamos por WhatsApp antes de armar el ramo y te proponemos una sustitución de igual o mayor valor.', en: 'We work with seasonal flowers, so it can happen. We let you know over WhatsApp before making the bouquet and propose a substitution of equal or higher value.' } },
    { q: { es: '¿Pueden igualar los colores de nuestra marca o del evento?', en: 'Can you match our brand or event colours?' }, a: { es: 'Sí. Compártenos tu paleta o manual de marca y diseñamos flores, papel, listones y recipientes en coherencia con tu identidad.', en: 'Yes. Share your palette or brand guidelines and we design flowers, paper, ribbons and vessels to match your identity.' } },
    { q: { es: '¿Con cuánta anticipación debo reservar un evento?', en: 'How far in advance should I book an event?' }, a: { es: 'Para bodas, entre tres y seis meses. Para eventos corporativos, de dos a cuatro semanas; con más margen podemos hacer prototipos y muestras.', en: 'For weddings, three to six months. For corporate events, two to four weeks; with more lead time we can produce mockups and samples.' } },
    { q: { es: '¿Se encargan del montaje y del retiro?', en: 'Do you handle setup and strike?' }, a: { es: 'Sí. Coordinamos horarios de carga con tu lugar, montamos, damos mantenimiento durante el evento si se requiere y retiramos al terminar.', en: 'Yes. We coordinate load-in with your venue, set up, maintain during the event if needed and strike afterwards.' } },
    { q: { es: '¿Cómo cuido mi ramo para que dure más?', en: 'How do I make my bouquet last longer?' }, a: { es: 'Corta los tallos en diagonal, cambia el agua cada dos días y mantenlo lejos del sol directo y de la fruta. Así dura entre cinco y diez días según la flor.', en: 'Trim the stems diagonally, change the water every two days and keep it away from direct sun and fruit. It lasts five to ten days depending on the flower.' } },
    { q: { es: '¿Cómo pago?', en: 'How do I pay?' }, a: { es: 'Transferencia, tarjeta mediante enlace de pago o efectivo al recoger. En esta página no se cobra nada: confirmamos todo por WhatsApp.', en: 'Bank transfer, card via payment link or cash on pickup. Nothing is charged on this page: we confirm everything over WhatsApp.' } },
  ];

  // Foto de referencia del taller según la flor dominante y su tono (clave: tipo/tono).
  const PREVIEW_PHOTOS = {
    'peonia/rosa': 'assets/img/p-amanecer.jpg', 'peonia/blush': 'assets/img/p-novia.jpg', 'peonia/vino': 'assets/img/p-peoniareal.jpg',
    'rosa/vino': 'assets/img/p-vinooro.jpg', 'rosa/rosa': 'assets/img/b-rosa-rosa.jpg', 'rosa/blanco': 'assets/img/p-corporativo.jpg', 'rosa/durazno': 'assets/img/p-durazno.jpg',
    'tulipan/rosa': 'assets/img/p-tulipanes.jpg', 'tulipan/blanco': 'assets/img/p-silvestre.jpg', 'tulipan/vino': 'assets/img/b-tulipan-vino.jpg', 'tulipan/amarillo': 'assets/img/b-tulipan-amarillo.jpg',
    'lirio/crema': 'assets/img/p-lirio.jpg', 'lirio/rosa': 'assets/img/p-condolencia.jpg',
    'hortensia/rosa': 'assets/img/p-hortensia.jpg', 'hortensia/azul': 'assets/img/p-azul.jpg', 'hortensia/blanco': 'assets/img/b-hortensia-blanco.jpg',
    'eucalipto/verde': 'assets/img/b-filler.jpg', 'gypsophila/blanco': 'assets/img/b-filler.jpg',
  };

  const MARQUEE = { es: ['Bodas', 'Galas', 'Lanzamientos', 'Cumpleaños', 'Aniversarios', 'Nacimientos', 'Condolencias', 'Oficinas', 'Cenas privadas', 'Bautizos'], en: ['Weddings', 'Galas', 'Launches', 'Birthdays', 'Anniversaries', 'New babies', 'Sympathy', 'Offices', 'Private dinners', 'Christenings'] };

  return { CONFIG, T, FLOWERS, PALETTES, VARIANT_NAMES, WRAPS, RIBBONS, EXTRAS, ZONES, SLOTS, OCC, SIZES, PRODUCTS, PORTFOLIO, PROCESS, SERVICES, TESTIMONIALS, FAQS, MARQUEE, PREVIEW_PHOTOS };
})();
