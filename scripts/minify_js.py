#!/usr/bin/env python3
"""
Koda Studio — JS minifier
Usage: python3 scripts/minify_js.py
Output: scripts/site.min.js
"""

import re
import os

SRC  = os.path.join(os.path.dirname(__file__), 'site.js')
DEST = os.path.join(os.path.dirname(__file__), '..', 'dist', 'site.min.js')


def minify_js(src: str) -> str:
    out = []
    i, n = 0, len(src)

    while i < n:
        # Block comment
        if src[i:i+2] == '/*':
            end = src.find('*/', i + 2)
            i = n if end == -1 else end + 2
            continue

        # Line comment
        if src[i:i+2] == '//':
            end = src.find('\n', i + 2)
            if end == -1:
                i = n
            else:
                out.append('\n')
                i = end + 1
            continue

        # String literals (single, double, template)
        if src[i] in ('"', "'", '`'):
            quote = src[i]
            out.append(quote)
            i += 1
            while i < n:
                ch = src[i]
                if ch == '\\' and i + 1 < n:
                    out.append(ch)
                    out.append(src[i + 1])
                    i += 2
                elif ch == quote:
                    out.append(ch)
                    i += 1
                    break
                else:
                    out.append(ch)
                    i += 1
            continue

        out.append(src[i])
        i += 1

    result = ''.join(out)

    # Collapse horizontal whitespace
    result = re.sub(r'[ \t]+', ' ', result)
    # Remove spaces around structural tokens
    result = re.sub(r' *([\n;{}()\[\],]) *', r'\1', result)
    # Remove spaces around operators (safe subset)
    result = re.sub(r' *([=!<>]=?|[+\-*/%&|^]=|&&|\|\||\?\?|=>) *', r'\1', result)
    # Collapse blank lines
    result = re.sub(r'\n{2,}', '\n', result)

    return result.strip()


def main():
    with open(SRC, 'r', encoding='utf-8') as f:
        raw = f.read()

    minified = minify_js(raw)
    orig_kb = len(raw.encode()) / 1024
    min_kb  = len(minified.encode()) / 1024
    saving  = 100 * (1 - min_kb / orig_kb)

    with open(DEST, 'w', encoding='utf-8') as f:
        f.write(minified)

    print(f"{'site.js':<28} {orig_kb:>6.1f} KB → {min_kb:>6.1f} KB  ({saving:.0f}% saved)  {DEST}")


if __name__ == '__main__':
    main()
