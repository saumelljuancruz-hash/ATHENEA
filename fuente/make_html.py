"""Genera revista.html a partir del texto del documento (doc.md)."""
import html
import json
import re
import sys

import pyphen

HYPH = pyphen.Pyphen(lang="es", left=2, right=3)
SHY = "­"

SRC = sys.argv[1]
PAGES = json.load(open(sys.argv[2])) if len(sys.argv) > 2 else {}

KICKERS = {
    1: "Introducción", 2: "Ideas previas", 3: "Panorama", 4: "Historia",
    5: "Textos sagrados", 6: "Creencias", 7: "Dioses", 8: "Trimurti",
    9: "Avatares", 10: "Corrientes", 11: "Templos y arte", 12: "Lugares sagrados",
    13: "Rituales", 14: "Festividades", 15: "Vestimenta", 16: "Alimentación",
    17: "Mujer y sociedad", 18: "Castas", 19: "Valores", 20: "Actualidad",
    21: "Convivencia", 22: "Opinión · Sociología", 24: "Vida cotidiana",
    25: "Arte y cultura", 26: "Debate", 27: "Símbolos", 28: "Infografía",
    29: "Conclusión",
}

# Secciones que abren página nueva (bloques temáticos de la revista)
NEW_PAGE = {1, 4, 6, 9, 17, 20, 22, 25, 27, 28, 29}

# Figuras: (archivo, epígrafe, tipo). "wide" = ancho completo, "col" = dentro de la columna
FIGS = {
    1: [("templo_piedra.jpg", "Templo hindú de piedra tallada al amanecer. Sus muros, cubiertos de esculturas, "
         "son a la vez espacio de culto y obra de arte.", "wide-photo")],
    4: [("mohenjo.jpg", "Ruinas de Mohenjo-Daro (actual Pakistán), una de las grandes ciudades de la "
         "civilización del valle del Indo, que floreció hacia el 2500 a. C.", "wide-photo"),
        ("mapa.jpg", "Mapa de las rutas de las migraciones indoarias hacia el subcontinente indio "
         "(c. 1750 a. C.), vinculadas al origen de la tradición védica.", "col")],
    6: [("panca.jpg", "Panca Sradha: las cinco creencias fundamentales del hinduismo. Brahman, Atman, "
         "Karma Phala (el fruto de las acciones), Samsara y Moksha.", "col")],
    7: [("diosas.jpg", "Lakshmi, diosa de la prosperidad (arriba), junto a Ganesha y Saraswati, "
         "en una representación devocional tradicional.", "col")],
    9: [("dashavatara.jpg", "Dashavatara: los diez avatares de Vishnu, desde Matsya, el pez, "
         "hasta Kalki, el avatar que todavía no habría aparecido.", "wide")],
    11: [("gopuram.jpg", "Gopuram (torre de entrada) de un templo del sur de la India, cubierto de "
          "esculturas policromadas de divinidades y escenas sagradas.", "col")],
    13: [("puja.jpg", "Ofrenda de flores e incienso durante una puja, una de las formas "
          "de adoración más extendidas, en el templo o en el hogar.", "wide-photo")],
    14: [("holi_diwali.jpg", "A la izquierda, Holi, el festival de los colores; a la derecha, las diyas "
          "encendidas de Diwali, el festival de las luces.", "wide-photo")],
    18: [("castas.jpg", "Esquema tradicional del sistema de castas: las cuatro varnas y, en la base, "
          "los dalits, históricamente excluidos de ellas.", "col")],
    21: [("lugares_culto.jpg", "Lugares de culto de algunas de las religiones presentes en la India: "
          "templo hindú, mezquita, gurdwara sikh, iglesia, pagoda budista y templo jainista.", "col")],
    25: [("danza.jpg", "Bailarina de bharatanatyam, danza clásica del sur de la India que, mediante "
          "gestos y movimientos, narra relatos de las divinidades.", "col")],
}

# Citas destacadas (frases textuales del documento)
QUOTES = {
    2: "Para conocer una religión es necesario informarse y evitar los prejuicios.",
    12: "Sus aguas son consideradas sagradas.",
    17: "Es importante no considerar que todas las mujeres hindúes viven de la misma manera.",
    21: "La convivencia no significa que todas las personas deban pensar igual.",
    27: "Es importante analizarla siempre dentro de su contexto histórico y cultural.",
    25: "Conocer una religión no significa tener que compartir sus creencias, sino aprender a respetarlas.",
}


SYMBOL_ICONS = {
    "Om (ॐ)": "om", "Flor de loto": "loto", "Tilak": "tilak", "Trishula o tridente": "trishula",
    "Diya": "diya", "Vaca": "vaca", "Esvástica hindú tradicional": "esvastica",
}


def hyph(text):
    out = []
    for tok in re.split(r"(\s+)", text):
        if tok.strip() and len(tok) > 6 and tok.isalpha():
            tok = HYPH.inserted(tok, hyphen=SHY)
        elif tok.strip() and len(tok) > 7:
            m = re.match(r"^([^\wÁÉÍÓÚáéíóúñÑüÜ]*)([\wÁÉÍÓÚáéíóúñÑüÜ]+)(.*)$", tok)
            if m and len(m.group(2)) > 6 and m.group(2).isalpha():
                tok = m.group(1) + HYPH.inserted(m.group(2), hyphen=SHY) + m.group(3)
        out.append(tok)
    return "".join(out)


def inline(text, do_hyph=True):
    """Escapa HTML y convierte **negrita**."""
    parts = re.split(r"(\*\*[^*]+\*\*)", text)
    res = []
    for p in parts:
        if p.startswith("**") and p.endswith("**"):
            res.append("<strong>" + html.escape(hyph(p[2:-2]) if do_hyph else p[2:-2]) + "</strong>")
        else:
            res.append(html.escape(hyph(p) if do_hyph else p))
    return "".join(res)


# ---------- lectura del documento ----------
raw = open(SRC, encoding="utf-8").read()
blocks = [re.sub(r"\s*\n\s*", " ", b.strip()) for b in re.split(r"\n\s*\n", raw) if b.strip()]

index_items = []
sections = []  # (num, title, [blocks])
cur = None
for b in blocks:
    if b == "**ÍNDICE**":
        continue
    m = re.match(r"^(\d+)\.\s+(.*)$", b)
    if cur is None and m and not b.startswith("**"):
        index_items.append((int(m.group(1)), m.group(2).rstrip(".")))
        continue
    m = re.match(r"^\*\*(\d+)\.\s+(.+)\*\*$", b)
    if m:
        cur = (int(m.group(1)), m.group(2), [])
        sections.append(cur)
        continue
    cur[2].append(b)


def render_body(num, items):
    out = []
    i = 0
    first_para = True
    in_ol = in_ul = False

    def close_lists():
        nonlocal in_ol, in_ul
        if in_ol:
            out.append("</ol>")
            in_ol = False
        if in_ul:
            out.append("</ul>")
            in_ul = False

    for b in items:
        ol = re.match(r"^(\d+)\.\s+(.*)$", b)
        ul = re.match(r"^-\s+(.*)$", b)
        if ol:
            if not in_ol:
                close_lists()
                out.append('<ol class="avatars">')
                in_ol = True
            out.append(f"<li><span class=\"n\">{ol.group(1)}</span><span>{inline(ol.group(2))}</span></li>")
            continue
        if ul:
            if not in_ul:
                close_lists()
                out.append('<ul class="dots">')
                in_ul = True
            out.append(f"<li>{inline(ul.group(1))}</li>")
            continue
        close_lists()
        if re.match(r"^\*\*[^*]+\*\*$", b) and b[2:-2] in SYMBOL_ICONS and num == 27:
            out.append(f'<h3 class="term sym"><img src="img/ic_{SYMBOL_ICONS[b[2:-2]]}.png" alt="">'
                       f'<span>{html.escape(b[2:-2])}</span></h3>')
            continue
        if re.match(r"^\*\*[^*]+\*\*$", b):
            out.append(f'<h3 class="term">{inline(b[2:-2], do_hyph=False)}</h3>')
            continue
        cls = ' class="lead"' if first_para and len(b) > 140 else ""
        first_para = False
        out.append(f"<p{cls}>{inline(b)}</p>")
    close_lists()
    return "\n".join(out)


def figure(fn, cap, kind):
    return (f'<figure class="{kind}"><div class="frame"><img src="img/{fn}" alt=""></div>'
            f"<figcaption>{html.escape(cap)}</figcaption></figure>")


def closing(num):
    if num != 29:
        return ""
    icons = "".join(f'<img src="img/ic_{n}.png" alt="">' for n in ("om", "loto", "trishula", "diya"))
    return (f'<div class="closing"><blockquote class="pull wide">La convivencia requiere información, '
            f'diálogo, igualdad y respeto por la diversidad.</blockquote><div class="icons">{icons}</div></div>')


def section_html(num, title, items):
    brk = " newpage" if num in NEW_PAGE else ""
    deck = ""
    # Subtítulo en negrita inmediatamente después del título (secciones de opinión)
    if items and re.match(r"^\*\*[^*]+\*\*$", items[0]) and num in (22, 24, 25, 26, 27):
        deck = f'<p class="deck">{html.escape(items[0][2:-2])}</p>'
        items = items[1:]
    figs = FIGS.get(num, [])
    wide = "".join(figure(*f) for f in figs if f[2] != "col")
    cols = [f for f in figs if f[2] == "col"]
    body = render_body(num, items)
    # Insertar figura de columna después del 2.º párrafo / término
    if cols:
        pieces = body.split("\n")
        pos = {7: 3, 18: 3, 11: 0}.get(num, 2)
        pieces.insert(pos, "".join(figure(*f) for f in cols))
        body = "\n".join(pieces)
    if num in QUOTES:
        pieces = body.split("\n")
        pos = max(1, len(pieces) // 2)
        pieces.insert(pos, f'<blockquote class="pull">{html.escape(QUOTES[num])}</blockquote>')
        body = "\n".join(pieces)
    return f"""
<section class="sec{brk}" id="s{num}">
  <span class="marker">@@S{num:02d}@@</span>
  <header class="sec-head">
    <span class="num">{num:02d}</span>
    <div class="htext">
      <p class="kicker">{KICKERS.get(num, '')}</p>
      <h2>{html.escape(title)}</h2>
      <span class="rule"></span>
      {deck}
    </div>
  </header>
  {wide}
  <div class="cols">
{body}
  </div>
  {closing(num)}
</section>"""


def symbols_section(num, title, items):
    deck = f'<p class="deck">{html.escape(items[0][2:-2])}</p>'
    groups = []
    for b in items[1:]:
        if re.match(r"^\*\*[^*]+\*\*$", b):
            groups.append((b[2:-2], []))
        else:
            groups[-1][1].append(b)
    rows = "".join(
        f'<div class="symrow"><img src="img/ic_{SYMBOL_ICONS[t]}.png" alt="">'
        f'<div><h3 class="term">{html.escape(t)}</h3>'
        + "".join(f"<p>{inline(x)}</p>" for x in ps) + "</div></div>"
        for t, ps in groups)
    return f"""
<section class="sec newpage" id="s{num}">
  <span class="marker">@@S{num:02d}@@</span>
  <header class="sec-head">
    <span class="num">{num:02d}</span>
    <div class="htext">
      <p class="kicker">{KICKERS[num]}</p>
      <h2>{html.escape(title)}</h2>
      <span class="rule"></span>
      {deck}
    </div>
  </header>
  <div class="symlist">{rows}</div>
  <blockquote class="pull wide">{html.escape(QUOTES[num])}</blockquote>
</section>"""


def infographic(num, title, items):
    # 28: Infografía central
    cards = []
    i = 0
    rest = []
    while i < len(items):
        b = items[i]
        if b in ("**Infografía central: símbolos del hinduismo**", "**UNIVERSO DE SÍMBOLOS**"):
            i += 1
            continue
        if b == "**¿POR QUÉ SON IMPORTANTES?**":
            rest = items[i + 1:]
            break
        if re.match(r"^\*\*[^*]+\*\*$", b):
            cards.append((b[2:-2], items[i + 1]))
            i += 2
            continue
        i += 1
    cards_html = "".join(
        f'<div class="card"><h4>{html.escape(t.capitalize() if t != "OM" else "Om")}</h4>'
        f"<p>{html.escape(d)}</p></div>" for t, d in cards)
    why = "".join(f"<p>{inline(p)}</p>" for p in rest)
    return f"""
<section class="sec newpage info" id="s{num}">
  <span class="marker">@@S{num:02d}@@</span>
  <header class="sec-head">
    <span class="num">{num:02d}</span>
    <div class="htext">
      <p class="kicker">Infografía central · símbolos del hinduismo</p>
      <h2>{html.escape(title)}</h2>
      <span class="rule"></span>
    </div>
  </header>
  <div class="info-panel">
    <h3 class="info-title">Universo de símbolos</h3>
    <div class="info-grid">
      <figure class="info-fig"><div class="frame"><img src="img/simbolos.jpg" alt=""></div>
        <figcaption>Algunos símbolos y elementos asociados al hinduismo: Om, flor de loto, tridente,
        Ganesha, vaca, diya, caracola, tambor, yoga, sitar, pluma de pavo real, lingam y esvástica
        tradicional, entre otros.</figcaption></figure>
      <div class="cards">{cards_html}</div>
    </div>
    <div class="why"><h4>¿Por qué son importantes?</h4>{why}</div>
  </div>
</section>"""


existing = {n for n, _, _ in sections}
toc_rows = []
for n, t in index_items:
    if n not in existing:
        continue
    pg = PAGES.get(f"{n:02d}", "")
    toc_rows.append(f'<li><span class="tn">{n:02d}</span><span class="tt">{html.escape(t)}</span>'
                    f'<span class="lead-dots"></span><span class="tp">{pg}</span></li>')

body_sections = "".join(
    infographic(n, t, it) if n == 28 else symbols_section(n, t, it) if n == 27
    else section_html(n, t, it) for n, t, it in sections)

page = f"""<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<title>Revista Hinduismo · N.º 1</title>
<link rel="stylesheet" href="fonts/fonts.css">
<link rel="stylesheet" href="revista.css">
</head><body>

<div class="cover"><img src="img/portada.jpg" alt=""></div>

<section class="toc">
  <p class="toc-kicker">Revista Hinduismo · N.º 1</p>
  <h1>Índice</h1>
  <p class="toc-sub">Tradición · Cultura · Sociedad</p>
  <span class="rule"></span>
  <ol>{''.join(toc_rows)}</ol>
</section>

{body_sections}

<div class="cover back"><img src="img/contra.jpg" alt=""></div>
</body></html>"""

open("revista.html", "w", encoding="utf-8").write(page)
print("secciones:", sorted(existing))
print("índice sin contenido:", [n for n, _ in index_items if n not in existing])
