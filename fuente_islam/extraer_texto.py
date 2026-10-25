"""Extrae el texto del PDF original en bloques estructurados (JSON).

Tipos de bloque: h2 (título de sección), area, h3 (subtítulo), p (párrafo, con **negrita**),
li (viñeta), ol (lista numerada), quote (cita centrada).
"""
import json
import re
import sys

import pdfplumber


def line_text(line):
    """Texto de la línea marcando con ** los tramos en negrita."""
    out, bold = [], False
    for ch in line["chars"]:
        b = "Bold" in ch["fontname"]
        if b != bold:
            out.append("**")
            bold = b
        out.append(ch["text"])
    if bold:
        out.append("**")
    s = "".join(out)
    # pdfplumber no siempre incluye los espacios como chars: usamos el texto de la línea como guía
    return s


def bold_ratio(line):
    chars = [c for c in line["chars"] if c["text"].strip()]
    return sum("Bold" in c["fontname"] for c in chars) / max(1, len(chars))


def with_spaces(line):
    """Reconstruye la línea con espacios (de extract_text_lines) y negritas (de chars)."""
    text = line["text"]
    chars = [c for c in line["chars"] if c["text"].strip()]
    res, ci, bold = [], 0, False
    for t in text:
        if t.isspace():
            res.append(t)
            continue
        b = ci < len(chars) and "Bold" in chars[ci]["fontname"]
        if b != bold:
            res.append("**")
            bold = b
        res.append(t)
        ci += 1
    if bold:
        res.append("**")
    s = "".join(res)
    return re.sub(r"\*\*(\s+)\*\*", r"\1", s)


pdf = pdfplumber.open(sys.argv[1])
blocks = []
cur = None  # bloque abierto que admite continuación
prev_bottom = None
stop = False
for pn, page in enumerate(pdf.pages, start=1):
    if pn < 3 or stop:
        continue
    prev_bottom = None
    for line in page.extract_text_lines():
        size = round(line["chars"][0]["size"], 1)
        txt = line["text"].strip()
        if size <= 8.0 and "Página" in txt:
            continue
        if txt.startswith("GUÍA PARA ORGANIZAR"):
            stop = True
            break
        gap = None if prev_bottom is None else line["top"] - prev_bottom
        prev_bottom = line["bottom"]
        if size >= 17:
            if cur and cur["t"] == "h2" and gap is not None and gap < 12:
                cur["x"] += " " + txt
            else:
                cur = {"t": "h2", "x": txt}
                blocks.append(cur)
            continue
        if txt.startswith("Área:"):
            cur = {"t": "area", "x": txt.split(":", 1)[1].strip()}
            blocks.append(cur)
            continue
        if size >= 12 and bold_ratio(line) > 0.8:
            kind = "quote" if txt.startswith(("“", "IDEA")) or (cur and cur["t"] == "quote" and (gap is None or gap < 12)) else "h3"
            if cur and cur["t"] == kind and (gap is None and kind == "quote" or gap is not None and gap < 5):
                cur["x"] += " " + txt
            else:
                cur = {"t": kind, "x": txt}
                blocks.append(cur)
            continue
        if size >= 9 and bold_ratio(line) > 0.8 and txt.startswith(("IDEA", "puede variar")):
            pass
        body = with_spaces(line).strip()
        m_ol = re.match(r"^(\d)\.\s+(.*)$", txt)
        new_para = gap is None or gap > 7
        if txt.startswith("Nota:") and cur and cur["t"] == "li":
            cur = {"t": "p", "x": body}
            blocks.append(cur)
        elif txt.startswith("•"):
            cur = {"t": "li", "x": body.lstrip("• ").strip()}
            blocks.append(cur)
        elif m_ol and new_para:
            cur = {"t": "ol", "n": int(m_ol.group(1)), "x": body.split(".", 1)[1].strip()}
            blocks.append(cur)
        elif cur and cur["t"] in ("p", "li", "ol", "quote") and not new_para:
            cur["x"] += " " + body
        elif cur and cur["t"] == "quote" and gap is not None and gap < 40 and pn and size >= 9 and bold_ratio(line) > 0.8:
            cur["x"] += " " + body
        else:
            cur = {"t": "p", "x": body}
            blocks.append(cur)

for b in blocks:
    b["x"] = re.sub(r"\s+", " ", b["x"]).replace("** **", " ").strip()
json.dump(blocks, open(sys.argv[2], "w"), ensure_ascii=False, indent=1)
for b in blocks:
    print(b["t"].ljust(5), b.get("n", ""), b["x"][:110])
