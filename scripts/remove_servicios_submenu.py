#!/usr/bin/env python3
"""
Removes the Servicios dropdown submenu from all pages.
Phase 1: Replace <div class="nav-item has-submenu">…</div> with a plain <a>.
Phase 2: Remove all mobile-subnav <a> blocks linking into servicios/* sub-pages.
Idempotent: each phase runs only when its marker is still present.
"""

import re
from pathlib import Path

ROOT = Path("/Users/hendrick/Documents/Landing page")

TARGETS = [
    # Root level
    ("index.html", ""),
    ("sobre-nosotros/index.html", "../"),
    ("digitalizamos/index.html", "../"),
    ("blog/index.html", "../"),
    ("servicios/index.html", "../"),
    ("casos/index.html", "../"),
    ("recursos/index.html", "../"),
    ("aviso-de-privacidad/index.html", "../"),
    ("terminos-y-condiciones/index.html", "../"),
    # Depth 2
    ("servicios/desarrollo-web/index.html", "../../"),
    ("servicios/branding/index.html", "../../"),
    ("servicios/marketing-redes/index.html", "../../"),
    ("servicios/automatizacion/index.html", "../../"),
    ("servicios/tienda-en-linea/index.html", "../../"),
    ("servicios/rediseno-marca/index.html", "../../"),
    ("digitalizamos/canada/index.html", "../../"),
    ("digitalizamos/ciudad-de-mexico/index.html", "../../"),
    ("digitalizamos/estado-de-mexico/index.html", "../../"),
    ("digitalizamos/guadalajara/index.html", "../../"),
    ("digitalizamos/hidalgo/index.html", "../../"),
    ("digitalizamos/merida/index.html", "../../"),
    ("digitalizamos/monterrey/index.html", "../../"),
    ("digitalizamos/puebla/index.html", "../../"),
    ("digitalizamos/queretaro/index.html", "../../"),
    ("digitalizamos/quintana-roo/index.html", "../../"),
    ("digitalizamos/tijuana/index.html", "../../"),
    ("casos/baja-electric/index.html", "../../"),
    ("casos/novus/index.html", "../../"),
    ("casos/voga/index.html", "../../"),
    ("recursos/benchmark-performance-b2b-mexico/index.html", "../../"),
    ("recursos/checklist-branding-b2b/index.html", "../../"),
    ("recursos/guia-costos-web-mexico-2026/index.html", "../../"),
    ("blog/agencia-digital-empresas-industriales/index.html", "../../"),
    ("blog/agencias-offshore-vs-koda/index.html", "../../"),
    ("blog/automatizacion-agendas-redes-sociales/index.html", "../../"),
    ("blog/branding-autoridad-empresas-b2b/index.html", "../../"),
    ("blog/costo-real-pagina-web-barata/index.html", "../../"),
    ("blog/diseno-minimalista-firmas-legales/index.html", "../../"),
    ("blog/diseno-web-despachos-juridicos/index.html", "../../"),
    ("blog/error-narrativa-sitios-corporativos/index.html", "../../"),
    ("blog/funnel-linkedin-cierre-b2b/index.html", "../../"),
    ("blog/identidad-visual-constructoras/index.html", "../../"),
    ("blog/plantillas-devaluan-marca-b2b/index.html", "../../"),
    ("blog/roi-desarrollo-medida-vs-wordpress/index.html", "../../"),
    ("blog/sede-digital-vs-sitio-web/index.html", "../../"),
    ("blog/seo-b2b-mexico-vs-extranjeras/index.html", "../../"),
    ("blog/top-agencias-diseno-web-b2b-mexico/index.html", "../../"),
]


def phase1_desktop(content: str, prefix: str) -> tuple[str, int]:
    """Replace the entire has-submenu div block with a plain <a> link."""
    servicios_href = f"{prefix}servicios/"

    # Detect whether the active state is on this page
    is_active = bool(re.search(
        r'<div class="nav-item has-submenu">.*?<a href="'
        + re.escape(servicios_href)
        + r'" class="is-active">',
        content, re.DOTALL,
    ))
    active_attr = ' class="is-active"' if is_active else ""
    replacement = f'<a href="{servicios_href}"{active_attr}>Servicios</a>'

    pattern = re.compile(
        r'<div class="nav-item has-submenu">\s*'
        r'<a href="' + re.escape(servicios_href) + r'"(?:\s+class="is-active")?>\s*Servicios\s*</a>\s*'
        r'<div class="nav-submenu">.*?</div>\s*</div>',
        re.DOTALL,
    )
    new_content, count = pattern.subn(replacement, content, count=1)
    return new_content, count


def phase2_mobile(content: str, prefix: str) -> tuple[str, int]:
    """Remove mobile-subnav <a> tags that link to servicios/* sub-pages.

    The <a> tag can span multiple lines in two formats:
      Format A (single-line opening):
        <a href="PREFIX servicios/foo/" class="mobile-subnav" style="...">Text</a>

      Format B (multi-line, closing > and </a> on separate lines):
        <a
          href="PREFIX servicios/foo/"
          class="mobile-subnav"
          style="..."
          >Text</a
        >

    We match any <a …> block that contains BOTH:
      - class="mobile-subnav"
      - href="PREFIX servicios/<something>/"  (not just servicios/ root)
    """
    servicios_sub_re = re.escape(prefix) + r"servicios/[^/\"]+/"

    # This pattern matches an <a opening tag (possibly multi-line) followed by
    # content and a closing </a>, optionally followed by a lone >:
    #
    #   \s*          — leading whitespace / newline
    #   <a\b         — tag start
    #   [^>]*        — attributes on first line (may be empty for multi-line)
    #   (?:          — optionally more attribute lines
    #     \n[^>]*
    #   )*
    #   >            — end of opening tag
    #   .*?          — tag body (non-greedy, DOTALL)
    #   </a          — start of closing tag
    #   (?:\s*>)?    — optional multi-line closing: </a\n   >
    #   \s*>?        — handle </a> on same line or lone > on next
    #
    # We use lookahead to pre-screen: only attempt the expensive match on
    # blocks that contain "mobile-subnav".

    removed = 0
    output = []
    pos = 0
    tag_start = re.compile(r'\s*<a\b')

    while pos < len(content):
        m = tag_start.search(content, pos)
        if m is None:
            output.append(content[pos:])
            break

        # Append everything before this potential tag
        output.append(content[pos:m.start()])

        # Try to match a full <a ...>...</a> block starting here
        block_match = re.match(
            r'(\s*<a\b[^>]*(?:\n[^>]*)*>.*?</a(?:\n\s*)?>)',
            content[m.start():],
            re.DOTALL,
        )
        if block_match is None:
            # Not a valid full block; emit one char and move on
            output.append(content[m.start()])
            pos = m.start() + 1
            continue

        block = block_match.group(1)
        block_end = m.start() + len(block)

        is_subnav = 'class="mobile-subnav"' in block
        targets_sub = bool(re.search(servicios_sub_re, block))

        if is_subnav and targets_sub:
            removed += 1
            pos = block_end
        else:
            output.append(block)
            pos = block_end

    return "".join(output), removed


def process_file(rel_path: str, prefix: str) -> tuple[bool, str]:
    path = ROOT / rel_path
    if not path.exists():
        return False, f"NOT FOUND: {rel_path}"

    content = path.read_text(encoding="utf-8")
    notes = []

    if "has-submenu" in content:
        content, count = phase1_desktop(content, prefix)
        if count:
            notes.append("desktop")

    if 'class="mobile-subnav"' in content:
        content, removed = phase2_mobile(content, prefix)
        if removed:
            notes.append(f"mobile×{removed}")

    if notes:
        path.write_text(content, encoding="utf-8")
        return True, f"UPDATED ({', '.join(notes)}): {rel_path}"
    return False, f"SKIP (already clean): {rel_path}"


def main():
    updated = skipped = 0
    for rel_path, prefix in TARGETS:
        success, msg = process_file(rel_path, prefix)
        print(msg)
        if success:
            updated += 1
        else:
            skipped += 1
    print(f"\n— Done. Updated: {updated} · Skipped: {skipped}")


if __name__ == "__main__":
    main()
