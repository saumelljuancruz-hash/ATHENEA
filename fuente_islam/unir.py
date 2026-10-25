"""Reemplaza la primera y la última página del interior por la portada y la contraportada."""
import sys

from pypdf import PdfReader, PdfWriter

TITLE = sys.argv[4] if len(sys.argv) > 4 else "Revista"

interior, portadas, salida = sys.argv[1:4]
inner = PdfReader(interior)
covers = PdfReader(portadas)
w = PdfWriter()
w.add_page(covers.pages[0])
for p in inner.pages[1:-1]:
    w.add_page(p)
w.add_page(covers.pages[1])
w.add_metadata({"/Title": TITLE})
with open(salida, "wb") as f:
    w.write(f)
print(len(w.pages), "páginas")
