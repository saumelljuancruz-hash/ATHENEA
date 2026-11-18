#!/bin/sh
# Genera ../Infografia_Movimientos_Sociales.pdf (A3 vertical, una página).
set -e
cd "$(dirname "$0")"
python3 build.py
node render.js infografia_out.html ../Infografia_Movimientos_Sociales.pdf
