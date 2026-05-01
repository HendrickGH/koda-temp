"""
Genera sitemap.xml con lastmod real basado en git log (último commit que
tocó el archivo). Si el archivo no está en git, cae a st_mtime.

Asigna priority/changefreq por sección. Idempotente: re-ejecutar siempre
produce el mismo sitemap salvo cambios reales en los archivos.
"""
import subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://kodastudio.com.mx"

EXCLUDED_DIRS = {"node_modules", "dist", ".unlighthouse", "scratch",
                 "graphify-out", "scripts", "fonts", "uploads", "assets",
                 "styles", ".git"}


def find_pages() -> list[Path]:
    pages = []
    for p in ROOT.rglob("index.html"):
        if any(part in EXCLUDED_DIRS for part in p.relative_to(ROOT).parts):
            continue
        pages.append(p)
    return sorted(pages)


def url_for(p: Path) -> str:
    rel = p.relative_to(ROOT).parent
    if str(rel) == ".":
        return f"{SITE}/"
    return f"{SITE}/{rel.as_posix()}/"


def lastmod_for(p: Path) -> str:
    rel = p.relative_to(ROOT).as_posix()
    try:
        out = subprocess.check_output(
            ["git", "log", "-1", "--format=%cI", "--", rel],
            cwd=ROOT, stderr=subprocess.DEVNULL, text=True,
        ).strip()
        if out:
            return out.split("T")[0]
    except subprocess.CalledProcessError:
        pass
    ts = datetime.fromtimestamp(p.stat().st_mtime, tz=timezone.utc)
    return ts.strftime("%Y-%m-%d")


def priority_changefreq(path: str) -> tuple[str, str]:
    """path is the URL path after the domain, e.g. '/blog/foo/' or '/'."""
    if path == "/":
        return "1.0", "monthly"
    if path == "/servicios/":
        return "0.9", "monthly"
    if path.startswith("/servicios/"):
        return "0.8", "monthly"
    if path == "/digitalizamos/":
        return "0.8", "monthly"
    if path.startswith("/digitalizamos/"):
        return "0.7", "monthly"
    if path == "/blog/":
        return "0.8", "weekly"
    if path.startswith("/blog/"):
        return "0.7", "monthly"
    if path == "/sobre-nosotros/":
        return "0.6", "yearly"
    if path in ("/aviso-de-privacidad/", "/terminos-y-condiciones/"):
        return "0.3", "yearly"
    return "0.5", "monthly"


def url_sort_key(p: Path) -> tuple:
    path = url_for(p).removeprefix(SITE)
    order = [
        ("/", 0),
        ("/servicios/", 1),
        ("/digitalizamos/", 2),
        ("/blog/", 3),
        ("/sobre-nosotros/", 4),
        ("/aviso-de-privacidad/", 5),
        ("/terminos-y-condiciones/", 6),
    ]
    section_idx = 99
    for prefix, idx in order:
        if path == prefix or (prefix != "/" and path.startswith(prefix)):
            section_idx = idx
            break
    is_index = 0 if path.count("/") <= 2 else 1
    return (section_idx, is_index, path)


def build_sitemap(pages: list[Path]) -> str:
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for p in sorted(pages, key=url_sort_key):
        url = url_for(p)
        path = url.removeprefix(SITE)
        priority, changefreq = priority_changefreq(path)
        lastmod = lastmod_for(p)
        lines += [
            "  <url>",
            f"    <loc>{url}</loc>",
            f"    <lastmod>{lastmod}</lastmod>",
            f"    <changefreq>{changefreq}</changefreq>",
            f"    <priority>{priority}</priority>",
            "  </url>",
        ]
    lines.append("</urlset>")
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    pages = find_pages()
    xml = build_sitemap(pages)
    out = ROOT / "sitemap.xml"
    out.write_text(xml, encoding="utf-8")
    print(f"Escritas {len(pages)} URLs → {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
