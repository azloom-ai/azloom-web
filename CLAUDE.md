# AZLOOM — www.azloom.tech

Sitio corporativo de **AZLOOM**, empresa de tecnología con base en San José, Costa Rica.
Esta carpeta es la **fuente de verdad** de la web y ya está terminada.

> ⚠️ **Esta web NO debe regenerarse desde cero.** No es una plantilla.
> Cualquier cambio estructural, de contenido aprobado, de identidad visual o de
> arquitectura requiere autorización explícita del responsable del proyecto.
> Los cambios permitidos sin consulta son correcciones técnicas puntuales
> (bugs, accesibilidad, SEO técnico) que no alteren diseño ni copy aprobado.

## Arquitectura

- **Sitio estático multipágina.** HTML + CSS + JS vanilla. **Sin framework, sin build,
  sin `package.json`, sin dependencias npm.** No migrar a React/Next/SPA.
- Deploy: Vercel desde GitHub. Config en `vercel.json` (redirects + headers).
- No hay proceso de build: lo que está en disco es lo que se sirve.

## Rutas válidas

| Español (raíz) | Inglés (`/en/`) |
|---|---|
| `/` (`index.html`) | `/en/` |
| `/sistemas/` | `/en/sistemas/` |
| `/proyectos/` | `/en/proyectos/` |
| `/nosotros/` | `/en/nosotros/` |
| `/faq/` | `/en/faq/` |
| `/contacto/` | `/en/contacto/` |

Cada página tiene su HTML propio (el chrome —nav, footer, modales— está duplicado
en cada archivo; mantener sincronizado si se edita).
Técnicas: `/robots.txt`, `/sitemap.xml`, `/favicon.svg`.
`/portafolio` → redirect 301 a `/proyectos/` (solo en `vercel.json`, sin archivo).

## Assets activos

- `styles/` — 5 hojas: `azloom-foundation.css` (tokens/reset/base),
  `azloom-components.css`, `azloom-layout.css` (nav/footer/modales),
  `azloom-pages.css`, `azloom-home.css`.
- `scripts/azloom-chrome.js` — diccionario i18n compartido ES/EN (nav, footer,
  modales legales, formulario).
- `scripts/azloom.js` — nav móvil, header scroll, i18n, reveal on scroll,
  smooth scroll, modales legales (patrón APG), envío del formulario (FormSubmit).
- `assets/projects/` — 4 fotos de proyectos (optimizadas).
- `assets/og-image.jpg` — 1200×630, paleta de marca.
- `assets/hero/` — `hero-motion.{mp4,webm}` + poster. **Sin usar todavía.**
  Reservados para una fase posterior de Motion & Interaction. No borrar.
- `public/brand/` — SVG del logo oficial. **No reconstruir, recolorear ni deformar.**
- Kit Adobe Fonts (Acumin Pro): `<link rel="stylesheet" href="https://use.typekit.net/gxb7wcy.css">`
  en el `<head>` de cada página.

## Identidad — no cambiar sin autorización

- Paleta fija: INK `#111113` · WHITE `#FFFFFF` · IVORY `#FAF9F6` · STONE `#E5E3DE`
  · SILVER `#BFC2C7` · GRAPHITE `#2B2B2E`. IVORY = canvas principal.
- Tipografía: **Acumin Pro** (Adobe Fonts, kit `gxb7wcy` — pegado en `<head>` de las
  12 páginas). **Cascadia Code** solo para metadatos/etiquetas técnicas.
- Prohibido: purple, neon, glow, gato, cerebro digital, cyberpunk, robots,
  gradientes decorativos, estética genérica de AI/SaaS.
- Posicionamiento: *"Diseñamos y construimos sistemas para empresas."* La IA, la
  automatización, el software y los datos son herramientas del sistema, no el producto.
  AZLOOM **no** es agencia de IA, de automatización ni de sitios web.
- Español: siempre **"usted"** (nunca tú/vos/contigo). Inglés: adaptación natural.
- No inventar: clientes, métricas, resultados, funcionalidades, datos legales.

## Contexto y decisiones

Registro completo de decisiones: `../REBUILD_NOTES.md` (fuera de esta carpeta).
Fuente operativa de marca: `../brand/AZLOOM_AI_Brand_Context_v1.0.md`.
Auditoría técnica de referencia: `../AZLOOM_WEB_AUDITORIA_2026-09-08/`.

## Verificación local

No hay servidor propio del proyecto. Servir la carpeta con cualquier estático:
`npx serve` o `python -m http.server`. El servidor local **no** aplica `vercel.json`
(redirects/headers) — eso solo se valida en un preview de Vercel.
