#!/bin/sh
# Genera ../Revista_Hinduismo.pdf (dos pasadas: la segunda completa los números de página del índice).
# Requiere: python3 + pyphen + pypdf, node + playwright-core (npm install) y Chromium.
set -e
cd "$(dirname "$0")"
python3 make_html.py texto.md
node render.js revista.html pasada1.pdf
python3 pages.py pasada1.pdf paginas.json
python3 make_html.py texto.md paginas.json
node render.js revista.html interior.pdf
node render.js portadas.html portadas.pdf
python3 unir.py interior.pdf portadas.pdf ../Revista_Hinduismo.pdf
rm -f pasada1.pdf interior.pdf portadas.pdf
