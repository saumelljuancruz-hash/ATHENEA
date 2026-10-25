#!/bin/sh
# Genera ../Revista_El_Islam.pdf (dos pasadas: la segunda completa los números de página del índice).
set -e
cd "$(dirname "$0")"
OUT=${1:-../Revista_El_Islam.pdf}
python3 make_html.py contenido.json
node render.js revista.html pasada1.pdf
python3 pages.py pasada1.pdf paginas.json
python3 make_html.py contenido.json paginas.json
node render.js revista.html interior.pdf
node render.js portadas.html portadas.pdf
python3 unir.py interior.pdf portadas.pdf "$OUT" "El Islam · Revista interdisciplinaria"
rm -f pasada1.pdf interior.pdf portadas.pdf
