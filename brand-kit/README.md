---
name: brand-kit
description: Sistema de marca Koda Studio — tokens y componentes UI visualizados. Vinculado a styles/site.css.
type: brand-system
---

# /brand-kit/

Galería completa del sistema. **Todos los archivos cargan `../styles/site.css`** (o la ruta relativa equivalente) — la única fuente de verdad. Si cambia `site.css`, los previews se actualizan solos.

## Estructura

```
brand-kit/
  index.html                  ← Portal maestro (punto de entrada)
  brand-kit.css               ← Chrome compartido (topbar, portal cards, rows)
  preview/
    index.html                ← Portal de tokens
    colors/index.html         Paleta claro/oscuro, acento, bordes, surface tints
    typography/index.html     Escala display + body, eyebrows, itálica
    spacing-borders/index.html Spacing 4px–192px, bordes, 0px radius, z-index
    motion/index.html         Transiciones, fade-up, data-reveal, smokeDrift
    brand/index.html          Wordmark, SVG, favicons, iconografía, fuentes
  ui-kits/
    index.html                ← Portal de componentes
    hero/index.html           Hero full-bleed (3 modos, corners, scroll-cue)
    sections/index.html       Sec-head, manifiesto, método, testimoniales, presencia, CTA final
    buttons/index.html        Todas las variantes de botón + accesibilidad
    forms/index.html          cf-form, estados, modal de contacto
    cards/index.html          Service cards, sector cards, laptop mock, insight rows, FAQ, WA float
    nav-footer/index.html     Header on-light/on-dark, submenus, mobile drawer, footer
```

## Cómo abrir

```bash
# Desde la raíz del repo:
python3 -m http.server 8000
# Abrir: http://localhost:8000/brand-kit/index.html
```

Las fuentes se sirven desde `/fonts/` con rutas relativas al CSS — deben correr desde el mismo servidor.

## Cobertura completa

| Token / componente | Archivo |
|---|---|
| Colores claro + oscuro | `preview/colors/` |
| Tipografía Playfair + Inter | `preview/typography/` |
| Spacing, bordes, z-index | `preview/spacing-borders/` |
| Transiciones, animaciones | `preview/motion/` |
| Wordmark, SVG, favicons | `preview/brand/` |
| Hero (3 modos) | `ui-kits/hero/` |
| Secciones layout patterns | `ui-kits/sections/` |
| Todos los botones | `ui-kits/buttons/` |
| Formularios + modal | `ui-kits/forms/` |
| Cards, grids, FAQ | `ui-kits/cards/` |
| Header, footer, drawer | `ui-kits/nav-footer/` |
