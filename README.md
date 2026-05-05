# Koda Studio — Sistema de marca

> Manifiesto operativo del sistema de diseño. Basado **estrictamente** en `styles/site.css`. Si este documento contradice al CSS, gana el CSS — y este documento se actualiza, no al revés.

---

## 1. Identidad

**Koda Studio** es un estudio boutique de arquitectura digital. Construye sedes online minimalistas, exclusivas, ingenierizadas para **conversión silenciosa** — experiencias premium que proyectan autoridad en lugar de persuadir.

Filosofía: **demostrar excelencia, nunca vender.** El trabajo habla por sí solo a través de restraint, precisión y oficio impecable.

### Voz y tono

- **Declarativo y autoritario.** Afirmaciones, no preguntas. _"Construimos las sedes digitales más poderosas de la red."_ Nunca _"¿Listo para hacer crecer tu negocio?"_.
- **Conciso.** Cada palabra se gana su lugar. Sin relleno, sin clichés.
- **Primera persona plural ("nosotros").** El estudio habla como inteligencia colectiva. _"Diseñamos / Construimos / Elevamos."_
- **Evitar segunda persona vendedora.** Nada de _"tu negocio"_, _"te ayudamos a"_. El cliente está implícito.
- **Presente.** _"Trabajamos con…"_ no _"Hemos trabajado con…"_.
- **Cero emoji. Cero exclamaciones.** La autoridad no grita.
- **Capitalización:** sentence case en titulares. ALL CAPS solo en eyebrows/labels con tracking extremo.
- **Itálica de Playfair** es el único énfasis decorativo en titulares (`<em>` dentro de h1/h2/h-display).

### Frases canónicas

```
"Elevamos marcas. Construimos legados."
"Diseñamos sedes digitales de alto rendimiento para empresas
 que no se conforman con lo ordinario."
"Ingeniería digital de precisión."
"Silencio que convierte."
```

### Eyebrows / labels

Patrón canónico: em-dash + número/categoría, ALL CAPS, tracking 0.22em (`--tracking-label`).

```
— 01 / Expertise
— 02 / Casos de estudio
— 03 / Metodología
— El Manifiesto
```

---

## 2. Fundamentos visuales

### Tipografía

Solo dos familias, self-hosted desde `/fonts/`:

| Uso | Familia | Tamaños | Notas |
|---|---|---|---|
| H1, H2, H-display | Playfair Display 400 | `clamp(3.5rem, 8vw, 8rem)` / `clamp(2.5rem, 5vw, 5rem)` | line 0.95–1.05 · tracking `-0.03em` |
| H3, h-sub | Playfair Display 400, **italic** | `clamp(1.75rem, 3vw, 2.5rem)` | énfasis editorial |
| **H4** | **Inter 500 uppercase** | `1rem` · tracking `0.08em` | h4 es un eyebrow estructural, **no** Playfair |
| Body / `p` / `.body` | Inter 300 | `1rem` · line 1.55 | color `--fg-tertiary` |
| `.body-sm` | Inter 300 | `14px` | denso/secundario |
| `.label`, `label`, `.eyebrow` | Inter 500 | `10px` uppercase · tracking `0.22em` | `--tracking-label` |
| `.caption` | Inter 300 | `12px` | metadatos |

**Regla:** sin negritas en cuerpo. Énfasis vía itálica o contraste de tamaño.

### Color

#### Tema claro (predeterminado)

| Token | Hex | Rol |
|---|---|---|
| `--color-bone` | `#F5F2ED` | Fondo primario |
| `--color-stone` | `#EDE9E3` | Fondo secundario / `.alt-bg` |
| `--color-stone-deep` | `#D6D0C7` | Terciario |
| `--color-ink` | `#1A1A18` | Texto principal |
| `--color-ink-mid` | `#2C2C28` | Texto secundario |
| `--color-ink-soft` | `#4A4A45` | Cuerpo |
| `--color-ink-muted` | `#7A7A72` | Placeholders, captions |
| `--color-ink-faint` | `#A8A8A0` | Texto muy sutil |
| `--color-slate` | `#5B6B7C` | Acento principal |
| `--color-slate-deep` | `#4A5A6B` | Hover/pressed |
| `--color-slate-dark` | `#3D4F5E` | Énfasis |
| `--color-border-soft` | `#DDD9D2` | Divisor interno sutil |
| `--color-border` | `#C8C3BB` | Líneas de grid 1px |
| `--color-border-hard` | `#A8A29A` | Borde fuerte |
| `--color-border-accent` | `#5B6B7C` | Hover/active |

#### Tema oscuro (full-bleed)

Se aplica vía `.section.dark`, `.method.dark`, `.hero`, `.cta-final`, `.modal-overlay`, `.site-footer` y `.site-header.on-dark`. **Nunca** es un toggle global; siempre seccional.

| Token | Valor | Rol |
|---|---|---|
| `--color-obsidian` | `#111110` | Fondo de hero, modales, secciones oscuras |
| `--color-dark` | `#1A1A18` | Submenu, fondos alternos sobre oscuro |
| `.site-footer` | `#0A0A09` (literal) | Footer canónico |
| `--color-slate-pale` | `#8A9BAC` | Acento sobre oscuro (eyebrows en method, KPIs, listas) |
| `--fg-on-dark` | `#F5F2ED` (bone) | Texto principal sobre oscuro |
| `--fg-on-dark-strong` | `rgba(255,255,255,.88)` | Énfasis fuerte |
| `--fg-on-dark-mid` | `rgba(255,255,255,.70)` | Cuerpo |
| `--fg-on-dark-soft` | `rgba(255,255,255,.55)` | Subtítulos italic, labels secundarios |
| `--fg-on-dark-faint` | `rgba(255,255,255,.40)` | Eyebrows, indices, captions |
| `--fg-on-dark-dim` | `rgba(255,255,255,.25)` | Texto casi invisible |
| `--border-on-dark` | `rgba(255,255,255,.12)` | Divisores principales |
| `--border-on-dark-soft` | `rgba(255,255,255,.08)` | Sub-divisores |
| `--border-on-dark-faint` | `rgba(255,255,255,.04)` | Casi imperceptibles |
| `--surface-on-dark-low / mid / high` | `.02 / .04 / .08` | Tints sutiles para hover/elevación implícita |

**Reglas estrictas:**
- Cero gradientes en superficies. (Excepción documentada: `.hero-smoke / .hero-veil / .hero-grain` son **texturas atmosféricas**, no gradientes UI.)
- Cero saturación. Nada vibrante.
- Nunca blanco puro (`#FFFFFF`) ni negro puro (`#000000`).

### Espaciado

Escala completa en CSS: `--space-1` a `--space-48` (4px → 192px). Padding vertical de sección: `clamp(80px, 12vw, 160px)` o `--space-32` mínimo. El espacio en blanco es señal de lujo.

- Layout: `--max-width: 1400px` · `--gutter: clamp(1.5rem, 5vw, 5rem)`
- Medida de columna textual: `--measure-narrow 32ch` · `--measure-normal 52ch` · `--measure-wide 72ch`

### Bordes y líneas

- **Border-radius: `0px`. En todo. Sin excepción.** El reset global aplica `border-radius: 0 !important` a `*, *::before, *::after`.
- Las cards se definen por bordes 1px o por espacio negativo, **nunca** por sombra.
- `box-shadow` no se usa. Elevación = espacio + borde.

### Movimiento

| Token | Valor | Uso |
|---|---|---|
| `--transition-fast` | `200ms ease` | feedback inmediato (foco, toggle) |
| `--transition-base` | `300ms ease` | hover, color shifts |
| `--transition-slow` | `400ms ease` | nav glassmorphism, CTA grandes |

- **Sin animaciones bouncy/springy.** El lujo es lento y deliberado.
- Hover válido: cambio de color, opacidad, border-color.
- `transform: translateX(4–8px)` permitido en flechas (`.arr`, `.iarr`, `.hero-cta-arrow`).
- Hero usa `smokeDrift` (40s ease-in-out infinite) y `scrollPulse` (2.4s) — animaciones lentas, atmosféricas.
- `[data-reveal]` y `.fade-up` son animaciones de scroll-in: 900ms cubic-bezier(0.2, 0.8, 0.2, 1).
- Respetar `prefers-reduced-motion: reduce`.

### Z-index

`--z-base 0` · `--z-raised 2` · `--z-sticky 80` (header) · `--z-overlay 200` (submenus, header inner) · `--z-modal 2000` · `--z-toast 9999`.

---

## 3. Componentes

Todos los componentes viven en `styles/site.css`. Ver `/brand-kit/ui-kits/` para previews funcionales.

### Header — `.site-header`

Sticky en `--z-sticky`. Glassmorphism vía `::before` (no en el elemento) para no romper `position: fixed` del `.mobile-nav`.

- **`.on-light`**: fondo `rgba(245,242,237,.92)` + `backdrop-filter: blur(14px)`.
- **`.on-dark.scrolled`**: fondo `rgba(17,17,16,.85)` + blur 14px. Sin scroll, transparente.
- **Submenu** (`.nav-submenu`): aparece en hover/focus-within, fondo `--color-bone` (claro) o `--color-dark` (oscuro).
- **Mobile drawer** (`.mobile-nav`): full-screen, `transform: translateY(-100%)` → 0, links Playfair grandes con stagger.

### Wordmark — `.wordmark`

Tipográfico, **no SVG** (los SVG en `/assets/` son fallback estático).

```html
<a href="/" class="wordmark" aria-label="Koda — Inicio">
  <span class="wm-mark">koda</span>
</a>
```

- `.wm-mark`: Playfair Display 500 · `--text-xl` (24px) · `letter-spacing: -0.03em`, lowercase.
- `.wm-sub` (opcional, ej. "Studio"): Inter 500 · 10px uppercase · tracking `0.25em` · opacity 0.6.
- Variante oscura: agregar clase `.light` → `.wm-mark` usa `--fg-on-dark`, `.wm-sub` usa `--fg-on-dark-soft`.

Archivos estáticos: `assets/wordmark.svg` (tinta sobre claro) y `assets/wordmark-dark.svg` (bone sobre oscuro). Útiles para favicons, OG images y emails — no para el sitio en sí.

### Botones — `.btn`

Base unificada: rectángulo 1px, label uppercase, gap interno para flecha.

| Clase | Uso |
|---|---|
| `.btn` | Ghost base, hereda color (currentColor) |
| `.btn-sm` / `.btn-lg` | Variantes de tamaño (11/22 · 18/32) |
| `.btn-solid` | Tinta sólida sobre claro · hover → outline |
| `.btn-solid-light` | Bone sólido sobre oscuro · hover → outline |
| `.btn-ghost` | Outline currentColor · hover invierte; en `.section.dark` invierte a bone |
| `.header-cta` | Solo dentro de `.site-header`. 12/22 · 1px currentColor |
| `.hero-cta` | Patrón canónico hero. Bone sólido 18/32 + flecha que se desplaza 4px en hover |
| `.cta-btn-lg` | CTA final. 22/36 · gap 24 |
| `.cf-submit` | Submit de formulario. Tinta sólida; soporta `disabled` (opacity 0.5) |

### Formularios — `.cf-form`

Patrón único usado por el modal de contacto.

- `.cf-field` envuelve label + input. Label es uppercase 10px tracking-label.
- `.req` marca obligatoriedad con punto pizarra.
- Inputs/selects/textarea: 1px border, padding 13/15, foco → `--color-slate`.
- Estado inválido: `.invalid` → border `#b33` + `.cf-err.show` con mensaje.
- Pantallas de reemplazo: `.cf-success` (icono ✓ con borde pizarra) y `.cf-error` (icono ! rojo).

### Cards de servicio — `.grid-services` / `.service-card`

Grid 3 columnas (1 en mobile <880px), separadas por bordes 1px. Hover → fondo `--color-stone` y service-icon → acento.

Estructura:
```
.service-card
  .service-num    ← "— 01" en acento
  .service-icon   ← SVG 44×44, stroke 1.5
  .h-sub          ← título
  .body           ← descripción (max 36ch)
  .service-tags ul.li × N
  .service-link   ← "Ver servicio →"
```

### Cards de sector — `.sector-grid` / `.sector-card`

Grid 4 columnas (2 a 1000px, 1 a 600px). Cada card tiene `data-texture="marble|concrete|linen|wood"` que activa una textura full-bleed en hover, invirtiendo el color del texto.

### Casos — `.work-grid` / `.case` / `.laptop`

Grid 3 columnas. Cada caso usa el mock de laptop (`.laptop / .laptop-bezel / .laptop-screen / .parallax-img / .laptop-base`) que renderiza una captura con efecto parallax.

### Insights — `.insight-list` / `.insight-row`

Lista oscura. Cada fila es grid `70px 160px 1fr 80px 40px` (índice / tipo / título / duración / flecha). Hover → fondo `--surface-on-dark-low` + padding-left aumentado.

### FAQ — `.faq-list` / `.faq-item`

`<details>`/`<summary>` nativo. Toggle visual con dos líneas 1px (`.fq-toggle .h / .v`) — la vertical desaparece y rota 90° al abrir. Sin marker nativo (`::-webkit-details-marker { display:none }`).

### Testimoniales — `.testimonial-carousel`

Grid `40px 1fr 40px` con `.carousel-nav` (botones cuadrados 40×40, 1px border) y `.carousel-dots` (líneas 1px de 32×1). Itálica Playfair para la cita.

### Metodología sticky — `.method.dark` / `.method-sticky`

Two-column: `.method-steps` izquierda (lista numerada) + `.method-media` derecha (sticky). Steps inactivos a opacity 0.4; el activo (`.active`) sube a 1. En mobile, `.method-media` queda sticky arriba con aspect-ratio 16/10.

### Mapa de presencia — `.presence-grid` / `.cities` / `.presence-map`

Lista de ciudades (`<ul>` 2 columnas con bullets numerados en acento) + frame con SVG de mapa (`.mx-map`). Frame 1px border, `aspect-ratio: 6/5.2`.

### Modal — `.modal-overlay` / `.modal-panel`

Overlay obsidian `rgba(17,17,16,.82)` + `backdrop-filter: blur(6px)`. Panel bone, max 740px, max-height 92vh. Animación: `transform: translateY(28px)` → 0 con `--transition-slow`. `.modal-x` es botón cuadrado 40×40, 1px border.

### Footer — `.site-footer`

Fondo `#0A0A09` (más oscuro que `--color-obsidian` para distinguirlo del hero). Grid `0.7fr 2fr` con wordmark a la izquierda y `.footer-cols` (3 columnas con `.flabel` en `--color-slate-pale`). `.footer-bottom` con copyright y `.foot-links`.

### Skip link — `.skip-link`

Accesibilidad. Fuera de pantalla por defecto; en `:focus` aparece arriba-izquierda en obsidian con borde acento.

### Tweaks panel — `.tweaks-panel`

Panel de debug, 280px, fixed bottom-right. Solo visible en desarrollo.

### WhatsApp rail — `.wa-rail` / `.wa-float`

Botón flotante 48×48 fixed bottom-right. Hereda color del rail (`.on-dark` → bone, `.on-light` → ink). Se oculta cuando `body.nav-locked`.

---

## 4. Imagería

- Fotografía desaturada / casi B&N. Concreto, acero, vidrio, mármol.
- Renders 3D abstractos con geometría dura.
- **Nunca** stock de personas en oficinas.
- Color permitido solo si está profundamente apagado.
- Texturas decorativas (`.frame-photo`, `.sec-texture`) se construyen con gradientes radiales y `repeating-linear-gradient` — son escenografía, no fondos.

---

## 5. Iconografía

- **No hay sistema de íconos propietario.** El brand brief original mencionaba Lucide pero el repo no lo carga.
- Íconos en uso son SVG inline con `stroke="currentColor"`, stroke-width 1.5, sin fill (ej. `.service-icon` 44×44).
- Caracteres tipográficos como ícono: `→ ↗ ←` y em-dashes `—` para eyebrows.
- **Sin iconfonts. Sin emoji.**

---

## 6. Inventario de archivos

```
README.md                       ← Este archivo
auditoria_seo_geo_koda.md       ← Auditoría SEO/GEO
llms.txt · llms-full.txt        ← Resúmenes para LLM crawlers
sitemap.xml · robots.txt

styles/
  site.css                      ← Tokens + base + componentes (fuente única de verdad)
  servicios.css                 ← Reglas específicas de /servicios/*
  digitalizamos.css             ← Reglas específicas de /digitalizamos/*
  blog.css                      ← Reglas específicas de /blog/*
  sobre-nosotros.css

fonts/
  Inter-VariableFont_opsz_wght.woff2
  PlayfairDisplay-{normal,italic}-{latin,latin-ext}.woff2

assets/
  wordmark.svg                  ← Fallback estático tinta-sobre-claro
  wordmark-dark.svg             ← Fallback estático bone-sobre-oscuro
  favicon-180.png · favicon-32.svg · favicon.ico

brand-kit/                      ← Galería del sistema (este documento visualizado)
  README.md
  preview/
    colors.html                 Paleta clara y oscura
    typography.html             Escala display + body
    spacing-borders.html        Tokens de spacing y bordes
  ui-kits/
    buttons.html
    forms.html
    cards-and-grids.html
    nav-and-footer.html

dist/                           ← Bundles minificados
scripts/                        ← Generación/SEO
```

---

## 7. Reglas de cierre

1. **Cero radius. Cero sombra. Cero gradientes UI. Cero emoji. Cero exclamación.**
2. La fuente única de verdad de tokens es `styles/site.css`. Nada se duplica en este README ni en `/brand-kit/`.
3. El tema oscuro **siempre** es full-bleed seccional, nunca un toggle global.
4. La itálica Playfair es el único énfasis decorativo en titulares.
5. Si una decisión de diseño no encaja con estas reglas, la decisión está mal — no las reglas.
