#!/usr/bin/env python3
"""
Adds the "Casos" nav item to all existing pages.
Calculates the correct relative path per page depth.
"""

import re
from pathlib import Path

ROOT = Path("/Users/hendrick/Documents/Landing page")

# Pages to update with their relative path prefix to root
# Format: (file_path, prefix_to_root)
TARGETS = [
    # Root level
    # (already updated index.html)
    ("sobre-nosotros/index.html", "../"),
    ("digitalizamos/index.html", "../"),
    ("blog/index.html", "../"),
    ("servicios/index.html", "../"),
    # Second level (depth 2)
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


def process_file(rel_path: str, prefix: str) -> tuple[bool, str]:
    """Add Casos link to nav and mobile-nav of one file."""
    path = ROOT / rel_path
    if not path.exists():
        return False, f"NOT FOUND: {rel_path}"

    content = path.read_text(encoding="utf-8")
    original = content
    casos_href = f"{prefix}casos/"

    # Check if already has Casos link
    if f'href="{casos_href}"' in content:
        return False, f"SKIP (already has): {rel_path}"

    # ── DESKTOP NAV ──
    # Pattern: the submenu closes with </div>, then there's the Presencia link.
    # We insert Casos link between submenu and Presencia.
    # Some pages use href="../digitalizamos/" or href="../../digitalizamos/"
    digitalizamos_pattern = re.compile(
        r'(\s*</div>\s*</div>\s*)(\n\s*<a href="' + re.escape(prefix) + r'digitalizamos/")',
        re.MULTILINE,
    )

    casos_link_desktop = f'\n\t\t\t\t\t<a href="{casos_href}">Casos</a>'

    new_content, count_desktop = digitalizamos_pattern.subn(
        r"\1" + casos_link_desktop + r"\2",
        content,
        count=1,
    )

    if count_desktop == 0:
        # Try an alternative pattern (some files might have slight whitespace differences)
        alt_pattern = re.compile(
            r'(</div>\s*</div>)\s*(<a href="' + re.escape(prefix) + r'digitalizamos/")',
        )
        new_content, count_desktop = alt_pattern.subn(
            r'\1\n\t\t\t\t\t<a href="' + casos_href + r'">Casos</a>\n\t\t\t\t\t\2',
            content,
            count=1,
        )

    # ── MOBILE NAV ──
    # Mobile nav has subnav links and finally a Presencia link.
    # Accept both: with and without class="is-active"
    # Match variants: style="--d: 240ms" or style="--d: 240ms" class="is-active"
    mobile_pattern = re.compile(
        r'(<a href="' + re.escape(prefix) + r'digitalizamos/" style="--d: )(\d+)(ms"(?:\s+class="is-active")?)>Presencia</a>'
    )

    def mobile_replacer(match):
        # Shift Presencia's delay forward by 20ms to make room for Casos
        original_delay = int(match.group(2))
        new_presencia_delay = original_delay + 20
        casos_delay = original_delay
        # Preserve any extra attrs (like is-active)
        suffix = match.group(3)
        return (
            f'<a href="{casos_href}" style="--d: {casos_delay}ms">Casos</a>\n\t\t\t\t\t'
            f'<a href="{prefix}digitalizamos/" style="--d: {new_presencia_delay}ms"{"" if "is-active" not in suffix else " class=\"is-active\""}>Presencia</a>'
        )

    new_content, count_mobile = mobile_pattern.subn(mobile_replacer, new_content, count=1)

    if count_desktop > 0 and count_mobile > 0:
        path.write_text(new_content, encoding="utf-8")
        return True, f"UPDATED: {rel_path}"
    else:
        return (
            False,
            f"PARTIAL: {rel_path} (desktop={count_desktop}, mobile={count_mobile})",
        )


def main():
    updated = 0
    skipped = 0
    failed = 0

    for rel_path, prefix in TARGETS:
        success, msg = process_file(rel_path, prefix)
        print(msg)
        if "UPDATED" in msg:
            updated += 1
        elif "SKIP" in msg or "NOT FOUND" in msg:
            skipped += 1
        else:
            failed += 1

    print(f"\n— Done. Updated: {updated} · Skipped: {skipped} · Failed: {failed}")


if __name__ == "__main__":
    main()
