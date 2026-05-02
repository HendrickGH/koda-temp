"""
Reemplaza el JSON-LD de las 11 páginas /digitalizamos/{slug}/index.html
por un grafo schema.org con ProfessionalService (HQ CDMX) + Service por
área + BreadcrumbList + WebPage. Añade hreflang es-MX y x-default.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIG = ROOT / "digitalizamos"
SITE = "https://kodastudio.com.mx"

ORG = {
    "@type": "ProfessionalService",
    "@id": f"{SITE}/#organization",
    "name": "Koda Studio",
    "alternateName": "Koda Studio Design",
    "url": f"{SITE}/",
    "logo": {
        "@type": "ImageObject",
        "url": f"{SITE}/assets/wordmark.svg",
        "width": 512,
        "height": 512,
    },
    "image": f"{SITE}/uploads/og_image.png",
    "description": "Agencia boutique de desarrollo web, branding corporativo y automatización digital para empresas B2B en México.",
    "telephone": "+52-772-169-8485",
    "email": "contacto@kodastudio.com.mx",
    "priceRange": "$5,000 - $50,000 MXN",
    "currenciesAccepted": "MXN",
    "paymentAccepted": "Transferencia bancaria, tarjeta de crédito",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "Campeche 76-42, Roma Sur",
        "addressLocality": "Cuauhtémoc",
        "addressRegion": "Ciudad de México",
        "postalCode": "06760",
        "addressCountry": "MX",
    },
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": 19.4099,
        "longitude": -99.1645,
    },
    "hasMap": "https://maps.app.goo.gl/KcLSb5L9VaPDukFGA",
    "openingHoursSpecification": [{
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00",
    }],
    "areaServed": [
        {"@type": "Country", "name": "México"},
        {"@type": "Country", "name": "Canada"},
    ],
    "founder": {
        "@type": "Person",
        "name": "Hendrick Adelaido Galarza Hernández",
        "jobTitle": "Fundador & Director de Estrategia Digital",
        "url": "https://www.linkedin.com/in/hendrick-galarza/",
    },
    "sameAs": [
        "https://www.linkedin.com/company/koda-studio-design/",
        "https://www.linkedin.com/in/hendrick-galarza/",
        "https://www.instagram.com/kodastudiodesign/",
        "https://maps.app.goo.gl/KcLSb5L9VaPDukFGA",
    ],
    "knowsLanguage": ["es", "en"],
    "slogan": "Arquitectura digital para marcas que dominan su sector",
}

OFFER_CATALOG = {
    "@type": "OfferCatalog",
    "name": "Servicios disponibles",
    "itemListElement": [
        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Desarrollo web profesional"}},
        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Branding corporativo"}},
        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Marketing digital y redes"}},
        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Automatización digital"}},
        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Tienda en línea"}},
    ],
}

# slug -> (areaType, areaName, breadcrumbName, serviceDesc)
PAGES = {
    "ciudad-de-mexico": (
        "City", "Ciudad de México", "Ciudad de México",
        "Agencia boutique de desarrollo web, branding y captación de leads para empresas B2B en Ciudad de México. Sede en Roma Sur, Cuauhtémoc."
    ),
    "estado-de-mexico": (
        "State", "Estado de México", "Estado de México",
        "Agencia boutique de desarrollo web, branding y captación de leads para empresas industriales en Estado de México."
    ),
    "guadalajara": (
        "City", "Guadalajara, Jalisco", "Guadalajara",
        "Agencia boutique de desarrollo web, branding y captación de leads para empresas B2B en Guadalajara, Jalisco."
    ),
    "hidalgo": (
        "State", "Hidalgo, México", "Hidalgo",
        "Agencia boutique de desarrollo web, branding y captación de leads para empresas industriales en Hidalgo."
    ),
    "merida": (
        "City", "Mérida, Yucatán", "Mérida",
        "Agencia boutique de desarrollo web, branding y captación de leads para hotelería y experiencias premium en Mérida, Yucatán."
    ),
    "monterrey": (
        "City", "Monterrey, Nuevo León", "Monterrey",
        "Agencia boutique de desarrollo web, branding y captación de leads para empresas B2B en Monterrey, Nuevo León."
    ),
    "puebla": (
        "State", "Puebla, México", "Puebla",
        "Agencia boutique de desarrollo web, branding y captación de leads para marcas y empresas familiares en Puebla."
    ),
    "queretaro": (
        "State", "Querétaro, México", "Querétaro",
        "Agencia boutique de desarrollo web, branding y captación de leads para empresas industriales en Querétaro."
    ),
    "quintana-roo": (
        "State", "Quintana Roo, México", "Quintana Roo",
        "Agencia boutique de desarrollo web, branding y captación de leads para hospitality y turismo premium en Quintana Roo."
    ),
    "tijuana": (
        "City", "Tijuana, Baja California", "Tijuana",
        "Agencia boutique de desarrollo web, branding y captación de leads bilingües para empresas B2B en Tijuana y Baja California."
    ),
    "canada": (
        "Country", "Canada", "Canadá",
        "Agencia boutique de desarrollo web, branding y captación de leads bilingüe para operaciones México–Canadá."
    ),
}


def build_graph(slug: str, area_type: str, area_name: str, crumb: str, desc: str) -> dict:
    page_url = f"{SITE}/digitalizamos/{slug}/"
    return {
        "@context": "https://schema.org",
        "@graph": [
            ORG,
            {
                "@type": "Service",
                "@id": f"{page_url}#service",
                "name": f"Desarrollo digital y captación de leads B2B — {area_name}",
                "description": desc,
                "url": page_url,
                "serviceType": "Captación de leads y desarrollo digital",
                "provider": {"@id": f"{SITE}/#organization"},
                "areaServed": {"@type": area_type, "name": area_name},
                "hasOfferCatalog": OFFER_CATALOG,
                "availableChannel": {
                    "@type": "ServiceChannel",
                    "serviceUrl": page_url,
                    "servicePhone": "+52-772-169-8485",
                    "availableLanguage": ["es", "en"],
                },
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Inicio", "item": f"{SITE}/"},
                    {"@type": "ListItem", "position": 2, "name": "Presencia", "item": f"{SITE}/digitalizamos/"},
                    {"@type": "ListItem", "position": 3, "name": crumb, "item": page_url},
                ],
            },
            {
                "@type": "WebPage",
                "@id": f"{page_url}#webpage",
                "url": page_url,
                "name": f"Desarrollo digital y captación de leads B2B — {area_name} · Koda Studio",
                "isPartOf": {"@id": f"{SITE}/#website"},
                "about": {"@id": f"{SITE}/#organization"},
                "mainEntity": {"@id": f"{page_url}#service"},
                "inLanguage": "es-MX",
            },
        ],
    }


JSONLD_RE = re.compile(
    r'<script type="application/ld\+json">\s*\{.*?\}\s*</script>',
    re.DOTALL,
)


def update_page(slug: str) -> None:
    fp = DIG / slug / "index.html"
    html = fp.read_text(encoding="utf-8")
    area_type, area_name, crumb, desc = PAGES[slug]
    graph = build_graph(slug, area_type, area_name, crumb, desc)
    body = json.dumps(graph, ensure_ascii=False, indent=2)
    body = "\n".join("\t\t\t" + line for line in body.splitlines())
    new_block = f'<script type="application/ld+json">\n{body}\n\t\t</script>'

    if not JSONLD_RE.search(html):
        raise RuntimeError(f"JSON-LD no encontrado en {fp}")
    html = JSONLD_RE.sub(new_block, html, count=1)

    page_url = f"{SITE}/digitalizamos/{slug}/"
    hreflang_block = (
        f'<link rel="alternate" hreflang="es-MX" href="{page_url}" />\n'
        f'\t\t<link rel="alternate" hreflang="x-default" href="{page_url}" />'
    )
    canonical_re = re.compile(
        r'(<link\s+rel="canonical"\s+href="' + re.escape(page_url) + r'"\s*/?>)',
    )
    if "hreflang=" not in html:
        if not canonical_re.search(html):
            raise RuntimeError(f"Canonical no encontrado en {fp}")
        html = canonical_re.sub(r'\1\n\t\t' + hreflang_block, html, count=1)

    fp.write_text(html, encoding="utf-8")
    print(f"  ✓ {slug}")


def main() -> None:
    print("Actualizando schema en /digitalizamos/*")
    for slug in PAGES:
        update_page(slug)
    print("Listo.")


if __name__ == "__main__":
    main()
