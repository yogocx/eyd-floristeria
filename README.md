# E&D Floristería — sitio web

Sitio interactivo de una página para **E&D Floristería** ("Flores que enamoran, detalles que perduran").

- `index.html` — el sitio completo (HTML, CSS y JS en un solo archivo, sin build).
- `assets/logo.webp` — logotipo oficial.
- `netlify.toml` — configuración de despliegue (publica la raíz del repo, sin comando de build).

## Desplegar en Netlify

1. En Netlify: **Add new site → Import an existing project → GitHub** y elige este repositorio.
2. Deja el build command vacío y el publish directory en `.` (ya viene en `netlify.toml`).
3. Deploy. Cada push a `main` vuelve a publicar el sitio.

## Datos que hay que reemplazar antes de publicar

En `index.html`, dentro del bloque `CONFIG` al inicio del script: número de WhatsApp, correo, dirección, horario, usuario de Instagram, moneda y zonas de entrega.
