#!/usr/bin/env python3
"""
Koda Studio — CSS minifier
Usage: python3 scripts/minify.py
Output: styles/site.min.css
"""

import re
import os

SRC = os.path.join(os.path.dirname(__file__), '..', 'styles', 'site.css')
DEST = os.path.join(os.path.dirname(__file__), '..', 'styles', 'site.min.css')


def minify_css(src: str) -> str:
    # Remove single-line comments (/* ... */ not spanning newlines)
    src = re.sub(r'/\*[^*]*\*+(?:[^/*][^*]*\*+)*/', '', src)

    # Collapse whitespace
    src = re.sub(r'\s+', ' ', src)

    # Remove spaces around structural characters
    src = re.sub(r'\s*([{}:;,>~+])\s*', r'\1', src)

    # Remove space between selector and opening brace already handled above
    # Remove last semicolon before closing brace
    src = re.sub(r';+}', '}', src)

    # Remove leading/trailing whitespace
    src = src.strip()

    return src


def main():
    with open(SRC, 'r', encoding='utf-8') as f:
        raw = f.read()

    minified = minify_css(raw)
    original_kb = len(raw.encode()) / 1024
    minified_kb = len(minified.encode()) / 1024
    saving = 100 * (1 - minified_kb / original_kb)

    with open(DEST, 'w', encoding='utf-8') as f:
        f.write(minified)

    print(f"site.css      {original_kb:.1f} KB")
    print(f"site.min.css  {minified_kb:.1f} KB")
    print(f"Saved         {saving:.1f}%")
    print(f"Written to    {DEST}")


if __name__ == '__main__':
    main()
