#!/usr/bin/env python3
"""
Koda Studio — SEO & font update script
- Removes Google Fonts <link> tags (Playfair now self-hosted)
- Removes preconnect to fonts.googleapis.com / fonts.gstatic.com
- Adds meta robots to pages missing it
- Adds preload for Inter font to pages missing it
- Adds / updates og:image on index pages (not subpages)
- Adds og:image:width / og:image:height where og:image is set
"""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

META_ROBOTS = '<meta name="robots" content="index, follow, max-image-preview:large" />'

OG_IMAGES = {
    "index.html": "https://kodastudio.com.mx/uploads/og_image.png",
    "servicios/index.html": "https://kodastudio.com.mx/uploads/og_image_services.png",
    "blog/index.html": "https://kodastudio.com.mx/uploads/og_image_blog.png",
    "digitalizamos/index.html": "https://kodastudio.com.mx/uploads/og_image_digitalizamos.png",
}


def preload_inter(depth: int) -> str:
    prefix = "../../" if depth == 2 else "../" if depth == 1 else ""
    return (
        f'<link rel="preload" href="{prefix}fonts/Inter-VariableFont_opsz_wght.woff2"'
        ' as="font" type="font/woff2" crossorigin />'
    )


def process(html_path: Path):
    rel = html_path.relative_to(ROOT)
    depth = len(rel.parts) - 1  # 0=root, 1=section, 2=subsection
    rel_str = str(rel)

    original = html_path.read_text(encoding="utf-8")
    text = original

    # 1. Remove Google Fonts stylesheet link for Playfair Display
    text = re.sub(
        r'\n?\s*<link[^>]+fonts\.googleapis\.com[^>]+Playfair[^>]*/?\s*>\n?',
        "\n",
        text,
    )

    # 2. Remove preconnect to fonts.googleapis.com and fonts.gstatic.com
    text = re.sub(
        r'\n?\s*<link\s+rel="preconnect"\s+href="https://fonts\.googleapis\.com"[^>]*/?\s*>\n?',
        "\n",
        text,
    )
    text = re.sub(
        r'\n?\s*<link\s+rel="preconnect"\s+href="https://fonts\.gstatic\.com"[^>]*/?\s*>\n?',
        "\n",
        text,
    )

    # 3. Add meta robots if missing
    if 'name="robots"' not in text:
        # Insert after <meta name="viewport" ...> line
        text = re.sub(
            r'(<meta\s+name="viewport"[^>]*/?>)',
            r'\1\n\t\t' + META_ROBOTS,
            text,
            count=1,
        )

    # 4. Add preload Inter if missing
    has_inter_preload = (
        'Inter-VariableFont' in text and 'rel="preload"' in text
        and 'Inter-VariableFont' in text[text.find('rel="preload"') - 5 : text.find('rel="preload"') + 300]
    )
    # More robust check
    if not re.search(r'rel="preload"[^>]*Inter-VariableFont|Inter-VariableFont[^>]*rel="preload"', text):
        inter_link = preload_inter(depth)
        # Insert before first <link rel="stylesheet" or before </head>
        m = re.search(r'(<link\s+rel="stylesheet")', text)
        if m:
            text = text[:m.start()] + inter_link + "\n\t\t" + text[m.start():]
        else:
            text = text.replace("</head>", f"\t\t{inter_link}\n\t</head>", 1)

    # 5. OG image — only for specific top-level index pages
    if rel_str in OG_IMAGES:
        og_url = OG_IMAGES[rel_str]

        # Update existing og:image if present
        if 'property="og:image"' in text:
            text = re.sub(
                r'<meta\s+property="og:image"\s+content="[^"]*"\s*/>',
                f'<meta property="og:image" content="{og_url}" />',
                text,
            )
        else:
            # Insert after og:description
            text = re.sub(
                r'(<meta\s+property="og:description"[^>]*/?>)',
                r'\1\n\t\t<meta property="og:image" content="' + og_url + '" />',
                text,
                count=1,
            )

        # Ensure og:image:width and og:image:height exist
        if 'property="og:image:width"' not in text:
            text = re.sub(
                r'(<meta\s+property="og:image"\s+content="[^"]*"\s*/>)',
                r'\1\n\t\t<meta property="og:image:width" content="1200" />'
                r'\n\t\t<meta property="og:image:height" content="630" />',
                text,
                count=1,
            )

    if text != original:
        html_path.write_text(text, encoding="utf-8")
        return True
    return False


def main():
    html_files = list(ROOT.glob("*.html")) + list(ROOT.glob("**/index.html"))
    # Deduplicate
    seen = set()
    unique = []
    for f in html_files:
        if f not in seen:
            seen.add(f)
            unique.append(f)

    changed = []
    for f in sorted(unique):
        if process(f):
            changed.append(f.relative_to(ROOT))

    print(f"Updated {len(changed)} files:")
    for p in changed:
        print(f"  {p}")


if __name__ == "__main__":
    main()
