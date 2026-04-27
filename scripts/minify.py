#!/usr/bin/env python3
"""
Koda Studio — CSS minifier
Usage: python3 scripts/minify.py
Minifies every stylesheet under styles/ to dist/<name>.min.css.
For site.css, also produces dist/site-deferred.min.css from the
'/* === DEFERRED-START === */' marker onwards.
"""

import re
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STYLES = ROOT / 'styles'
DIST = ROOT / 'dist'
SPLIT_MARKER = '/* === DEFERRED-START === */'


def minify_css(src: str) -> str:
    src = re.sub(r'/\*[\s\S]*?\*/', '', src)
    src = re.sub(r'\s+', ' ', src)
    src = re.sub(r'\s*([{}:;,>~+])\s*', r'\1', src)
    src = re.sub(r';+}', '}', src)
    return src.strip()


def report(label: str, raw: str, mini: str, path: Path) -> None:
    orig_kb = len(raw.encode()) / 1024
    min_kb = len(mini.encode()) / 1024
    saving = 100 * (1 - min_kb / orig_kb) if orig_kb else 0
    print(f"{label:<32} {orig_kb:>6.1f} KB → {min_kb:>6.1f} KB  ({saving:.0f}% saved)  {path.name}")


def main():
    DIST.mkdir(exist_ok=True)
    for css in sorted(STYLES.glob('*.css')):
        raw = css.read_text(encoding='utf-8')
        mini = minify_css(raw)
        out = DIST / f"{css.stem}.min.css"
        out.write_text(mini, encoding='utf-8')
        report(css.name, raw, mini, out)

        if css.name == 'site.css' and SPLIT_MARKER in raw:
            idx = raw.index(SPLIT_MARKER)
            deferred_raw = raw[idx + len(SPLIT_MARKER):]
            deferred_min = minify_css(deferred_raw)
            out_def = DIST / 'site-deferred.min.css'
            out_def.write_text(deferred_min, encoding='utf-8')
            report('site.css → deferred', deferred_raw, deferred_min, out_def)


if __name__ == '__main__':
    main()
