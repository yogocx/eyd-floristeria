# E&D Floristería — sitio web

Sitio interactivo de una página para **E&D Floristería** ("Flores que enamoran, detalles que perduran").

- **Producción:** https://eyd-floristeria.netlify.app (proyecto Netlify `eyd-floristeria`, equipo YOGO CX)
- **Repositorio:** https://github.com/yogocx/eyd-floristeria

## Archivos

| Archivo | Qué contiene |
| --- | --- |
| `public/index.html` | Estructura de la página (español por defecto, con textos traducibles). |
| `public/styles.css` | Estilos, tema claro y oscuro, paleta tomada del logotipo. |
| `public/data.js` | **CONFIG** (datos del negocio), traducciones ES/EN, catálogo, flores, precios, fotos de ramos de referencia, servicios, testimonios y FAQ. |
| `public/app.js` | Idioma, colección con filtros, vista rápida y taller "Arma tu ramo" (incluida la foto generada con IA). |
| `public/order.js` | Carrito, pedido por WhatsApp, contacto, portafolio, testimonios, FAQ y pétalos. |
| `public/bouquet.js` | Dibujo SVG de respaldo para miniaturas del carrito sin foto. |
| `public/assets/` | Logotipo y fotografías de muestra (ver `CREDITS.md`). |
| `netlify/functions/` | Funciones Netlify del taller: `bouquet-status`, `bouquet-generate-background`, `bouquet-image`. |
| `netlify/lib/shared.js` | Normalización de la selección, prompt para OpenAI y acceso a Netlify Blobs. |
| `netlify.toml` | Publica `public/`, registra las funciones y las rutas `/api/*`. |

El sitio estático no necesita build. Las funciones usan `@netlify/blobs` (se instala con `npm install`).

## Foto realista del ramo (OpenAI)

El botón **"Generar foto de mi ramo"** del taller pide a OpenAI (`gpt-image-1`) una fotografía del ramo exacto: cantidades, tonos, papel y listón. Cada resultado se guarda en Netlify Blobs con la clave de esa selección, así que repetir la misma combinación es instantáneo y no vuelve a cobrar.

1. En Netlify: **Site configuration → Environment variables** → `OPENAI_API_KEY` con una **clave secreta** de https://platform.openai.com/api-keys (empieza por `sk-`). La organización de OpenAI debe estar verificada para usar `gpt-image-1`.
2. Comprueba la clave sin revelarla: `https://eyd-floristeria.netlify.app/api/bouquet-status?diag=1` debe responder `"message":"ok"`. Si responde 401, la clave no es válida.
3. Opcionales: `MAX_GENERATIONS_PER_DAY` (por defecto 300), `OPENAI_IMAGE_QUALITY` (`low`, `medium`, `high`; por defecto `medium`), `OPENAI_IMAGE_MODEL`.

Costo aproximado por imagen nueva: unos 4 ¢ en calidad `low`, 6 a 8 ¢ en `medium` y hasta 25 ¢ en `high` (tamaño 1024×1536). Si la clave no está configurada, el botón no aparece y el taller muestra solo el ramo de referencia.

## Antes de publicar al cliente

Edita el bloque `CONFIG` al inicio de `data.js`:

- `whatsapp` (número con código de país, sin `+`), `phoneDisplay`, `email`, `address`, `mapsUrl`
- `instagram` / `instagramUrl` (ya apunta a @edfloristeriaa)
- `currency` y `locale` (por defecto USD / es-US; cambia a MXN, EUR, etc. y ajusta los precios)
- `baseFee`, `freeDeliveryFrom`, `cutoffHour`, `closedDays`, `hours`, `stats`
- Zonas y tarifas de entrega en `ZONES`; precios por tallo en `FLOWERS`; catálogo en `PRODUCTS`

Los testimonios, cifras y precios incluidos son ejemplos. Las fotografías son de muestra (Pexels, ver `CREDITS.md`); cada ramo del catálogo toma su imagen del campo `img` en `PRODUCTS`, y el portafolio del campo `img` en `PORTFOLIO`. La vista previa del taller "Arma tu ramo" muestra la fotografía real de ramo que mejor coincide con la flor dominante, su tono y el papel (lista `BOUQUET_PHOTOS` en `data.js`); cuantas más fotos propias se agreguen ahí, más exacta será.

## Desplegar

Con la CLI de Netlify (la carpeta ya está enlazada al proyecto):

```bash
npx netlify-cli deploy --prod
```

Para probar en local con funciones y la clave del sitio:

```bash
npx netlify-cli dev
```

Para que cada push a `main` se publique solo: en Netlify, **Site configuration → Build & deploy → Link repository** y elige `yogocx/eyd-floristeria`.

Para ver solo la parte estática en local:

```bash
python3 -m http.server 8765 --directory public
```
