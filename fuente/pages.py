"""Busca los marcadores @@Snn@@ en el PDF y guarda el número de página de cada sección."""
import json
import re
import sys

from pypdf import PdfReader

reader = PdfReader(sys.argv[1])
pages = {}
for i, p in enumerate(reader.pages, start=1):
    for m in re.findall(r"@@S(\d\d)@@", (p.extract_text() or "").replace(" ", "")):
        pages.setdefault(m, i)
json.dump(pages, open(sys.argv[2], "w"))
print(len(reader.pages), "páginas;", pages)
