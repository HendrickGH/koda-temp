#!/usr/bin/env python3
"""
Adds a services-by-anchor section to each /digitalizamos/[city]/index.html page.
Each city gets ~500-700 words of unique service content with 6 anchors:
#desarrollo-web, #branding, #marketing-redes, #automatizacion,
#tienda-en-linea, #rediseno-marca
"""

import re
from pathlib import Path

ROOT = Path("/Users/hendrick/Documents/Landing page")

# Per-city contextual hooks (intro phrase + local-color details)
CITIES = {
    "ciudad-de-mexico": {
        "name": "Ciudad de México",
        "short": "CDMX",
        "vibe": "la capital y centro financiero del país",
        "audience": "despachos jurídicos, consultoras estratégicas y corporativos B2B",
        "color": "Polanco, Reforma, Roma-Condesa y Santa Fe son nodos donde compiten marcas que no se pueden dar el lujo de un sitio mediocre",
    },
    "monterrey": {
        "name": "Monterrey",
        "short": "MTY",
        "vibe": "el corazón industrial del norte",
        "audience": "empresas manufactureras, proveedores de la industria automotriz y firmas de consultoría",
        "color": "San Pedro Garza García, Valle Oriente y la Zona Norte concentran a los decisores de compra que evalúan proveedores con criterio técnico",
    },
    "guadalajara": {
        "name": "Guadalajara",
        "short": "GDL",
        "vibe": "el polo tecnológico y creativo de Occidente",
        "audience": "startups SaaS, agencias creativas, despachos de arquitectura y empresas familiares en transición digital",
        "color": "Providencia, Zapopan y el corredor de tecnología hacia Chapala marcan el ritmo de adopción digital en la región",
    },
    "queretaro": {
        "name": "Querétaro",
        "short": "QRO",
        "vibe": "el hub aeroespacial e industrial del Bajío",
        "audience": "empresas aeroespaciales, manufactureras avanzadas y desarrolladoras inmobiliarias",
        "color": "El Marqués, Juriquilla y la zona industrial de Bernardo Quintana albergan a empresas que exigen procesos digitales tan rigurosos como sus líneas de producción",
    },
    "puebla": {
        "name": "Puebla",
        "short": "PUE",
        "vibe": "centro automotriz histórico con vocación industrial",
        "audience": "proveedores Tier 1 y 2 de la industria automotriz, empresas textiles y firmas educativas",
        "color": "La zona de Cholula, Angelópolis y el corredor industrial hacia Tlaxcala marcan el pulso comercial de la región",
    },
    "tijuana": {
        "name": "Tijuana",
        "short": "TJ",
        "vibe": "la frontera más activa del continente",
        "audience": "empresas maquiladoras, distribuidoras binacionales y proveedores cross-border",
        "color": "La Mesa, Zona Río y la franja fronteriza son puntos donde se cierran negocios entre México y California en doble idioma",
    },
    "merida": {
        "name": "Mérida",
        "short": "MID",
        "vibe": "la capital cultural y turística del sureste",
        "audience": "hoteles boutique, despachos legales locales, desarrolladoras turísticas y firmas creativas",
        "color": "El Centro Histórico, Altabrisa y la Ruta de los Cenotes han transformado a Mérida en uno de los mercados de mayor crecimiento del país",
    },
    "estado-de-mexico": {
        "name": "Estado de México",
        "short": "Edomex",
        "vibe": "el corredor industrial y logístico más denso de Latinoamérica",
        "audience": "empresas industriales, logísticas, distribuidoras y firmas con operación metropolitana",
        "color": "Toluca, Naucalpan, Tlalnepantla y el corredor Cuautitlán-Izcalli concentran fábricas y centros de distribución que mueven el comercio nacional",
    },
    "hidalgo": {
        "name": "Hidalgo",
        "short": "HGO",
        "vibe": "región industrial con vocación logística y minera",
        "audience": "empresas industriales medianas, transportistas, ferreteros mayoristas y constructoras regionales",
        "color": "Pachuca, Tula y Tepeji concentran operaciones que requieren presencia digital seria, no de pueblo chico",
    },
    "quintana-roo": {
        "name": "Quintana Roo",
        "short": "QR",
        "vibe": "el destino turístico premium más rentable del país",
        "audience": "hoteles, desarrolladoras inmobiliarias, agencias de turismo experiencial y operadores de wellness",
        "color": "Cancún, Tulum, Playa del Carmen y Bacalar marcan el estándar de marca premium que el mercado internacional exige",
    },
    "canada": {
        "name": "Canadá",
        "short": "CA",
        "vibe": "uno de los mercados B2B más sofisticados de Norteamérica",
        "audience": "agentes inmobiliarios, despachos profesionales, agencias creativas y empresas en sectores premium",
        "color": "Vancouver, Toronto, Montreal y la Columbia Británica exigen presencia digital de nivel global con sensibilidad cultural local",
    },
}


def build_services_section(city_data: dict, prefix: str = "../../") -> str:
    """Build the services-anchor HTML block, contextualized per city."""
    name = city_data["name"]
    short = city_data["short"]
    audience = city_data["audience"]
    color = city_data["color"]
    vibe = city_data["vibe"]

    return f'''
			<!-- ══════════════ SERVICIOS POR ANCLA — {name.upper()} ══════════════ -->
			<section class="local-services" id="servicios-locales">
				<div class="container">
					<header class="sec-head">
						<span class="eyebrow">— Servicios disponibles en {name}</span>
						<h2>Qué construimos para empresas <em>en {short}.</em></h2>
						<p class="sec-desc">
							{color}. Estos son los servicios que aplicamos para
							{audience} en {name}.
						</p>
					</header>

					<div class="local-services-grid">

						<article class="local-service" id="desarrollo-web">
							<div class="ls-num">01</div>
							<h3>Desarrollo web en {name}.</h3>
							<p>
								Construimos sedes digitales corporativas a medida para empresas
								B2B en {short} — sin plantillas, sin constructores visuales y
								con SEO técnico integrado desde la primera línea de código. La
								mayoría de las empresas en {vibe} pierden negocio por sitios que
								cargan en cinco segundos o que se ven idénticos a los de su
								competencia.
							</p>
							<ul>
								<li>Código a medida (sin WordPress + Elementor)</li>
								<li>LCP &lt; 2s y Lighthouse 95+ garantizado</li>
								<li>Panel de administración propio</li>
							</ul>
							<a href="{prefix}servicios/desarrollo-web/" class="ls-link">Ver servicio completo →</a>
						</article>

						<article class="local-service" id="branding">
							<div class="ls-num">02</div>
							<h3>Branding corporativo en {name}.</h3>
							<p>
								Identidad de marca para {audience} que necesitan dejar de
								parecer "uno más" en {short}. Sistema visual completo —
								logotipo, paleta, tipografía, manual de marca y aplicaciones —
								pensado como infraestructura, no como decoración. Ideal para
								empresas que evalúan rediseño cada 24 meses sin entender por
								qué nunca quedan satisfechas.
							</p>
							<ul>
								<li>Identidad estratégica + manual editorial</li>
								<li>Sistema visual aplicable a web, impreso y digital</li>
								<li>Cesión total de archivos editables</li>
							</ul>
							<a href="{prefix}servicios/branding/" class="ls-link">Ver servicio completo →</a>
						</article>

						<article class="local-service" id="marketing-redes">
							<div class="ls-num">03</div>
							<h3>Marketing &amp; redes en {name}.</h3>
							<p>
								Gestión integral de presencia digital para empresas en
								{short} con foco en captación B2B: contenido estratégico,
								publicidad pagada y automatización de seguimiento. No
								"posteamos por postear" — diseñamos calendarios editoriales
								orientados a generar reuniones cualificadas, no likes.
							</p>
							<ul>
								<li>Calendario editorial estratégico mensual</li>
								<li>Pauta digital LinkedIn Ads / Google Ads</li>
								<li>Reportes de conversión, no de impresiones</li>
							</ul>
							<a href="{prefix}servicios/marketing-redes/" class="ls-link">Ver servicio completo →</a>
						</article>

						<article class="local-service" id="automatizacion">
							<div class="ls-num">04</div>
							<h3>Automatización digital en {name}.</h3>
							<p>
								Implementamos automatizaciones de procesos comerciales y
								atención al cliente para empresas en {name}: bots de WhatsApp,
								integración con CRM, flujos de captura de leads y notificaciones
								multicanal. El objetivo es liberar las horas que tu equipo
								invierte en tareas repetitivas para que se enfoquen en cerrar
								negocio.
							</p>
							<ul>
								<li>WhatsApp Business API con flujos lógicos</li>
								<li>Integración con HubSpot, Pipedrive o CRM a medida</li>
								<li>Notificaciones automáticas a equipo comercial</li>
							</ul>
							<a href="{prefix}servicios/automatizacion/" class="ls-link">Ver servicio completo →</a>
						</article>

						<article class="local-service" id="tienda-en-linea">
							<div class="ls-num">05</div>
							<h3>Tienda en línea en {name}.</h3>
							<p>
								Desarrollo de e-commerce a medida para empresas en {short}
								que venden producto o servicio configurable: catálogo
								navegable, carrito de cotización inteligente, pasarela de
								pagos y panel administrable. No usamos Shopify-por-defecto:
								elegimos la plataforma según las integraciones reales que
								necesita tu operación.
							</p>
							<ul>
								<li>Pasarela de pagos local (Stripe, Conekta, MercadoPago)</li>
								<li>Catálogo con filtros por especificación técnica</li>
								<li>Integración con facturación electrónica</li>
							</ul>
							<a href="{prefix}servicios/tienda-en-linea/" class="ls-link">Ver servicio completo →</a>
						</article>

						<article class="local-service" id="rediseno-marca">
							<div class="ls-num">06</div>
							<h3>Rediseño de marca en {name}.</h3>
							<p>
								Actualización estratégica de identidad para empresas
								consolidadas en {name} que necesitan modernizar sin perder
								equity de marca. Auditamos la identidad actual, identificamos
								qué conservar y qué evolucionar, y entregamos un sistema
								renovado que se siente continuidad y no ruptura abrupta.
							</p>
							<ul>
								<li>Auditoría de identidad actual + análisis competitivo</li>
								<li>Evolución visual progresiva o reseteo completo</li>
								<li>Plan de migración por puntos de contacto</li>
							</ul>
							<a href="{prefix}servicios/rediseno-marca/" class="ls-link">Ver servicio completo →</a>
						</article>

					</div>
				</div>
			</section>
'''


def process_city(city_slug: str, city_data: dict) -> tuple[bool, str]:
    """Insert services section into a city page."""
    path = ROOT / "digitalizamos" / city_slug / "index.html"
    if not path.exists():
        return False, f"NOT FOUND: {city_slug}"

    content = path.read_text(encoding="utf-8")

    # Skip if already inserted
    if 'id="servicios-locales"' in content:
        return False, f"SKIP (already has): {city_slug}"

    # Step 1: Add CSS link for local-services if not present
    css_link = '<link rel="stylesheet" href="../../styles/local-services.css" />'
    if css_link not in content:
        # Insert after blog.min.css link
        content = re.sub(
            r'(<link rel="stylesheet" href="\.\./\.\./dist/blog\.min\.css" />)',
            r"\1\n\t\t" + css_link,
            content,
            count=1,
        )

    # Step 2: Insert services section between </article> and article-cta
    pattern = re.compile(
        r'(</article>)\s*(\n\s*<section class="article-cta dark">)',
        re.MULTILINE,
    )

    new_section = build_services_section(city_data, prefix="../../")
    replacement = r"\1\n" + new_section + r"\2"

    new_content, count = pattern.subn(replacement, content, count=1)

    if count > 0:
        path.write_text(new_content, encoding="utf-8")
        return True, f"UPDATED: {city_slug}"
    else:
        return False, f"FAILED (pattern not found): {city_slug}"


def main():
    updated = 0
    skipped = 0
    failed = 0

    for city_slug, data in CITIES.items():
        success, msg = process_city(city_slug, data)
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
