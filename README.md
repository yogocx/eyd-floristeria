# E&D Floristería — sitio web

Sitio interactivo de una página para **E&D Floristería** ("Flores que enamoran, detalles que perduran").

- **Producción:** https://eyd-floristeria.netlify.app (proyecto Netlify `eyd-floristeria`, equipo YOGO CX)
- **Repositorio:** https://github.com/yogocx/eyd-floristeria

## Archivos

| Archivo | Qué contiene |
| --- | --- |
| `index.html` | Estructura de la página (español por defecto, con textos traducibles). |
| `styles.css` | Estilos, tema claro y oscuro, paleta tomada del logotipo. |
| `data.js` | **CONFIG** (datos del negocio), traducciones ES/EN, catálogo, flores, precios, servicios, testimonios y preguntas frecuentes. |
| `bouquet.js` | Dibuja los ramos en SVG a partir de una lista de flores, papel y listón. |
| `app.js` | Idioma, colección con filtros, vista rápida y taller "Arma tu ramo". |
| `order.js` | Carrito, pedido por WhatsApp, contacto, portafolio, testimonios, FAQ y pétalos. |
| `assets/logo.webp` | Logotipo oficial. |
| `assets/img/` | Fotografías de muestra (ver `CREDITS.md`). Sustituir por fotos propias. |
| `netlify.toml` | Publica la raíz del repo sin comando de build. |

No hay paso de build: cualquier servidor estático sirve la carpeta tal cual.

## Antes de publicar al cliente

Edita el bloque `CONFIG` al inicio de `data.js`:

- `whatsapp` (número con código de país, sin `+`), `phoneDisplay`, `email`, `address`, `mapsUrl`
- `instagram` / `instagramUrl` (ya apunta a @edfloristeriaa)
- `currency` y `locale` (por defecto USD / es-US; cambia a MXN, EUR, etc. y ajusta los precios)
- `baseFee`, `freeDeliveryFrom`, `cutoffHour`, `closedDays`, `hours`, `stats`
- Zonas y tarifas de entrega en `ZONES`; precios por tallo en `FLOWERS`; catálogo en `PRODUCTS`

Los testimonios, cifras y precios incluidos son ejemplos. Las fotografías son de muestra (Pexels, ver `CREDITS.md`); cada ramo del catálogo toma su imagen del campo `img` en `PRODUCTS`, y el portafolio del campo `img` en `PORTFOLIO`. La vista previa del taller "Arma tu ramo" se dibuja en vivo según lo que elige el cliente.

## Desplegar

Con la CLI de Netlify (la carpeta ya está enlazada al proyecto):

```bash
npx netlify-cli deploy --prod --dir .
```

Para que cada push a `main` se publique solo: en Netlify, **Site configuration → Build & deploy → Link repository** y elige `yogocx/eyd-floristeria`.

Para ver el sitio en local:

```bash
python3 -m http.server 8765
```
