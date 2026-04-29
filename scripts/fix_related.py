#!/usr/bin/env python3
"""
Replaces the `<section class="related">…</section>` block in every blog post
with a fully-correct, thematically curated block of 3 related-article cards.
"""
import re
from pathlib import Path

BLOG_DIR = Path(__file__).parent.parent / "blog"

# ── Catalog ─────────────────────────────────────────────────────────────────
# slug → (category-label, reading-time-label, short card title)
POSTS = {
    "agencia-digital-empresas-industriales": (
        "Sector", "12 min",
        "Cómo elegir agencia digital para empresas industriales.",
    ),
    "agencias-offshore-vs-koda": (
        "Análisis", "12 min",
        "Por qué las agencias offshore fallan con marcas mexicanas premium.",
    ),
    "automatizacion-agendas-redes-sociales": (
        "Estrategia", "14 min",
        "Automatización de agendas y captación en redes sociales.",
    ),
    "branding-autoridad-empresas-b2b": (
        "Estrategia", "11 min",
        "Branding de autoridad para empresas B2B.",
    ),
    "costo-real-pagina-web-barata": (
        "Perspectiva", "9 min",
        "El costo real de una página web barata.",
    ),
    "diseno-minimalista-firmas-legales": (
        "Caso de estudio", "12 min",
        "El impacto del diseño minimalista en la conversión de firmas legales.",
    ),
    "diseno-web-despachos-juridicos": (
        "Sector", "11 min",
        "Diseño web para despachos jurídicos: confianza, autoridad y conversión.",
    ),
    "error-narrativa-sitios-corporativos": (
        "Perspectiva", "9 min",
        "El error más común en sitios corporativos: hablar de uno mismo.",
    ),
    "funnel-linkedin-cierre-b2b": (
        "Estrategia", "13 min",
        "De LinkedIn al cierre: funnel B2B de alto rendimiento.",
    ),
    "identidad-visual-constructoras": (
        "Sector", "11 min",
        "Identidad visual para constructoras e inmobiliarias.",
    ),
    "plantillas-devaluan-marca-b2b": (
        "Perspectiva", "8 min",
        "Por qué las plantillas devalúan tu negocio B2B.",
    ),
    "roi-desarrollo-medida-vs-wordpress": (
        "Análisis", "14 min",
        "ROI real: desarrollo a medida vs. WordPress.",
    ),
    "sede-digital-vs-sitio-web": (
        "Manifiesto", "10 min",
        "Sede digital vs. sitio web: la diferencia que cambia todo.",
    ),
    "seo-b2b-mexico-vs-extranjeras": (
        "Análisis", "13 min",
        "SEO B2B en México vs. agencias extranjeras.",
    ),
    "top-agencias-diseno-web-b2b-mexico": (
        "Ranking", "16 min",
        "Top 10 agencias de diseño web B2B en México (2026).",
    ),
}

# ── Curated related-post map (each post → 3 related slugs, never self) ──────
RELATED = {
    "agencia-digital-empresas-industriales": [
        "identidad-visual-constructoras",
        "diseno-web-despachos-juridicos",
        "top-agencias-diseno-web-b2b-mexico",
    ],
    "agencias-offshore-vs-koda": [
        "top-agencias-diseno-web-b2b-mexico",
        "seo-b2b-mexico-vs-extranjeras",
        "roi-desarrollo-medida-vs-wordpress",
    ],
    "automatizacion-agendas-redes-sociales": [
        "funnel-linkedin-cierre-b2b",
        "sede-digital-vs-sitio-web",
        "seo-b2b-mexico-vs-extranjeras",
    ],
    "branding-autoridad-empresas-b2b": [
        "plantillas-devaluan-marca-b2b",
        "identidad-visual-constructoras",
        "error-narrativa-sitios-corporativos",
    ],
    "costo-real-pagina-web-barata": [
        "roi-desarrollo-medida-vs-wordpress",
        "plantillas-devaluan-marca-b2b",
        "top-agencias-diseno-web-b2b-mexico",
    ],
    "diseno-minimalista-firmas-legales": [
        "diseno-web-despachos-juridicos",
        "branding-autoridad-empresas-b2b",
        "error-narrativa-sitios-corporativos",
    ],
    "diseno-web-despachos-juridicos": [
        "diseno-minimalista-firmas-legales",
        "branding-autoridad-empresas-b2b",
        "identidad-visual-constructoras",
    ],
    "error-narrativa-sitios-corporativos": [
        "sede-digital-vs-sitio-web",
        "branding-autoridad-empresas-b2b",
        "plantillas-devaluan-marca-b2b",
    ],
    "funnel-linkedin-cierre-b2b": [
        "automatizacion-agendas-redes-sociales",
        "seo-b2b-mexico-vs-extranjeras",
        "branding-autoridad-empresas-b2b",
    ],
    "identidad-visual-constructoras": [
        "agencia-digital-empresas-industriales",
        "branding-autoridad-empresas-b2b",
        "diseno-web-despachos-juridicos",
    ],
    "plantillas-devaluan-marca-b2b": [
        "costo-real-pagina-web-barata",
        "branding-autoridad-empresas-b2b",
        "roi-desarrollo-medida-vs-wordpress",
    ],
    "roi-desarrollo-medida-vs-wordpress": [
        "costo-real-pagina-web-barata",
        "sede-digital-vs-sitio-web",
        "agencias-offshore-vs-koda",
    ],
    "sede-digital-vs-sitio-web": [
        "roi-desarrollo-medida-vs-wordpress",
        "error-narrativa-sitios-corporativos",
        "top-agencias-diseno-web-b2b-mexico",
    ],
    "seo-b2b-mexico-vs-extranjeras": [
        "agencias-offshore-vs-koda",
        "top-agencias-diseno-web-b2b-mexico",
        "funnel-linkedin-cierre-b2b",
    ],
    "top-agencias-diseno-web-b2b-mexico": [
        "agencias-offshore-vs-koda",
        "roi-desarrollo-medida-vs-wordpress",
        "sede-digital-vs-sitio-web",
    ],
}


def make_card(slug: str) -> str:
    cat, mins, title = POSTS[slug]
    return (
        f'\t\t\t\t\t\t<a href="../{slug}/" class="related-card">\n'
        f'\t\t\t\t\t\t\t<span class="rk">— {cat}</span>\n'
        f'\t\t\t\t\t\t\t<h3>{title}</h3>\n'
        f'\t\t\t\t\t\t\t<div class="rfoot">\n'
        f'\t\t\t\t\t\t\t\t<span>{mins}</span><span class="rarr">→</span>\n'
        f'\t\t\t\t\t\t\t</div>\n'
        f'\t\t\t\t\t\t</a>'
    )


def make_section(slug: str) -> str:
    cards = "\n".join(make_card(r) for r in RELATED[slug])
    return (
        '\t\t\t<section class="related">\n'
        '\t\t\t\t<div class="container">\n'
        '\t\t\t\t\t<header class="sec-head">\n'
        '\t\t\t\t\t\t<span class="eyebrow">— También en Insights</span>\n'
        '\t\t\t\t\t\t<h2>Continúa <em>leyendo.</em></h2>\n'
        '\t\t\t\t\t</header>\n'
        '\t\t\t\t\t<div class="related-grid">\n'
        f'{cards}\n'
        '\t\t\t\t\t</div>\n'
        '\t\t\t\t</div>\n'
        '\t\t\t</section>'
    )


# Regex that matches everything from <section class="related"> to its </section>
RELATED_PATTERN = re.compile(
    r'<section class="related">.*?</section>',
    re.DOTALL,
)


def fix_post(slug: str) -> None:
    path = BLOG_DIR / slug / "index.html"
    if not path.exists():
        print(f"  SKIP (not found): {slug}")
        return

    html = path.read_text(encoding="utf-8")
    new_section = make_section(slug)

    new_html, count = RELATED_PATTERN.subn(new_section, html)
    if count == 0:
        print(f"  WARN (no match): {slug}")
    elif count > 1:
        print(f"  WARN ({count} matches replaced): {slug}")
    else:
        print(f"  OK: {slug}")

    path.write_text(new_html, encoding="utf-8")


if __name__ == "__main__":
    print("Fixing related sections…")
    for slug in POSTS:
        fix_post(slug)
    print("Done.")
