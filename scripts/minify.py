#!/usr/bin/env python3
"""
Koda Studio — CSS minifier
Usage: python3 scripts/minify.py
Output:
  dist/site.min.css          (full stylesheet)
  dist/site-deferred.min.css (below-the-fold, split at === DEFERRED-START ===)
"""

import re
import os

BASE = os.path.join(os.path.dirname(__file__), '..', 'styles')
DIST = os.path.join(os.path.dirname(__file__), '..', 'dist')
SRC  = os.path.join(BASE, 'site.css')
DEST_FULL     = os.path.join(DIST, 'site.min.css')
DEST_DEFERRED = os.path.join(DIST, 'site-deferred.min.css')

SPLIT_MARKER = '/* === DEFERRED-START === */'


def minify_css(src: str) -> str:
    src = re.sub(r'/\*[\s\S]*?\*/', '', src)
    src = re.sub(r'\s+', ' ', src)
    src = re.sub(r'\s*([{}:;,>~+])\s*', r'\1', src)
    src = re.sub(r';+}', '}', src)
    return src.strip()


def _report(label: str, raw: str, minified: str, path: str) -> None:
    orig_kb = len(raw.encode()) / 1024
    min_kb  = len(minified.encode()) / 1024
    saving  = 100 * (1 - min_kb / orig_kb)
    print(f"{label:<28} {orig_kb:>6.1f} KB → {min_kb:>6.1f} KB  ({saving:.0f}% saved)  {path}")


def main():
    with open(SRC, 'r', encoding='utf-8') as f:
        raw = f.read()

    if SPLIT_MARKER not in raw:
        print(f"WARNING: split marker not found in {SRC}")
        critical_raw = raw
        deferred_raw = ''
    else:
        idx = raw.index(SPLIT_MARKER)
        critical_raw = raw[:idx]
        deferred_raw = raw[idx + len(SPLIT_MARKER):]

    full_min     = minify_css(raw)
    deferred_min = minify_css(deferred_raw)

    with open(DEST_FULL, 'w', encoding='utf-8') as f:
        f.write(full_min)

    with open(DEST_DEFERRED, 'w', encoding='utf-8') as f:
        f.write(deferred_min)

    _report('site.min.css',          raw,          full_min,     DEST_FULL)
    _report('site-deferred.min.css', deferred_raw, deferred_min, DEST_DEFERRED)


if __name__ == '__main__':
    main()
