"""Genera revista.html (Revista «El Islam») a partir de contenido.json.

Uso: python3 make_html.py contenido.json [paginas.json]
"""
import html
import json
import re
import sys

import pyphen

HYPH = pyphen.Pyphen(lang="es", left=2, right=3)
SHY = "­"

BLOCKS = json.load(open(sys.argv[1], encoding="utf-8"))
PAGES = json.load(open(sys.argv[2])) if len(sys.argv) > 2 else {}
CREDITS = json.load(open("creditos.json", encoding="utf-8"))

# Índice tal como figura en el documento original
INDEX = [
    (1, "Editorial", "La importancia de la religión en la actualidad"),
    (2, "Artículo histórico", "Origen y evolución del Islam"),
    (3, "Entrevista", "Creencias y vida cotidiana"),
    (4, "Artículo de divulgación", "Religión y sociedad hoy"),
    (5, "Artículo de opinión", "Religión y cultura"),
    (6, "Roles religiosos", "Líderes, prácticas y celebraciones"),
    (7, "Infografía central", "Signos y símbolos del Islam"),
    (8, "Conclusión general", ""),
    (9, "Bibliografía y fuentes de consulta", ""),
]

# Figuras: clave -> (epígrafe, tipo). Tipo: "col" (en columna) o "wide" (ancho completo)
FIGS = {
    "oracion_mezquita": ("Fieles rezan juntos en una mezquita. Para Durkheim, los rituales compartidos "
                         "fortalecen los vínculos y el sentimiento de pertenencia.", "col"),
    "mapa_arabia": ("Arabia Saudita: La Meca, donde surgió el Islam; Medina, destino de la Hégira en 622; "
                    "y Riad, la capital actual.", "col"),
    "medina_nabawi": ("La Mezquita del Profeta (al-Masjid an-Nabawi), en Medina, la ciudad a la que "
                      "emigraron Mahoma y sus seguidores en el año 622.", "col"),
    "biblioteca_medieval": ("Recreación de una biblioteca medieval: ciudades como Bagdad, Córdoba y El Cairo "
                            "fueron centros destacados de conocimiento.", "col"),
    "sabios_manuscritos": ("Ilustración de sabios que estudian manuscritos junto a un astrolabio, símbolo "
                           "de los aportes a la astronomía.", "col"),
    "ninos_coran": ("Pintura de niños que leen y estudian el Corán bajo un arco: la lectura del Corán "
                    "es una de las prácticas más habituales.", "col"),
    "iftar_amigos": ("Un iftar entre amigos: la comida compartida con la que se rompe el ayuno al "
                     "ponerse el sol durante el Ramadán.", "col"),
    "estudiantes_jordania": ("Estudiantes indonesias de intercambio en la Universidad de Yarmouk, en Jordania.",
                             "col"),
    "cordoba_arcos": ("Arcos de la Mezquita de Córdoba (España), levantada a partir del siglo VIII: "
                      "un ejemplo de la arquitectura islámica.", "col"),
    "alhambra_teselado": ("Teselado geométrico de la Alhambra de Granada (España). El arte islámico "
                          "desarrolló complejos diseños geométricos.", "col"),
    "minbar_tashkent": ("Minbar de la mezquita Hazrati Imam, en Taskent (Uzbekistán): desde este púlpito "
                        "se pronuncia el sermón.", "col"),
    "eid_indonesia": ("Oración del Eid al-Fitr en la mezquita Al-Hikmah, en Indonesia, el país con mayor "
                      "población musulmana del mundo.", "col"),
    "kaaba_hajj": ("Miles de peregrinos rodean la Kaaba, en la Gran Mezquita de La Meca, durante el Hajj, "
                   "que reúne a musulmanes de diferentes países.", "wide"),
    "ilustracion_lugares_santos": ("Ilustración que reúne, de forma imaginaria, la Kaaba (a la izquierda) "
                                   "y mezquitas con cúpulas y minaretes.", "col"),
}

# Dónde va cada figura: (sección, comienzo del párrafo después del cual se inserta)
PLACES = [
    (1, "Desde la Sociología", "oracion_mezquita"),
    (2, "En el año 622", "mapa_arabia"),
    (2, "Después de la muerte", "medina_nabawi"),
    (2, "Durante la Edad Media", "biblioteca_medieval"),
    (2, "Hoy el Islam", "sabios_manuscritos"),
    (3, "Nota editorial", "ninos_coran"),
    (3, "Respuesta: Es un mes sagrado", "iftar_amigos"),
    (4, "La situación de las mujeres", "estudiantes_jordania"),
    (5, "Uno de los aspectos", "cordoba_arcos"),
    (5, "El arte islámico", "alhambra_teselado"),
    (6, "En las mezquitas", "minbar_tashkent"),
    (6, "Es la celebración que marca", "eid_indonesia"),
    (6, "Es la peregrinación a La Meca", "ilustracion_lugares_santos"),
]

QUOTES = {
    3: "Conocer otras religiones permite comprender mejor a las personas y respetar la diversidad cultural.",
    4: "El Islam no es una cultura única: es una religión compartida por comunidades muy diversas.",
    5: "Respetar una cultura no significa estar de acuerdo con todas sus prácticas.",
    6: "La religión puede unir a personas de diferentes culturas a través de creencias y tradiciones compartidas.",
}

ARABIC_PILLARS = {"Shahada": "الشهادة", "Salat": "الصلاة", "Zakat": "الزكاة", "Sawm": "الصوم", "Hajj": "الحج"}


def hyph(text):
    def rep(m):
        w = m.group(0)
        return HYPH.inserted(w, hyphen=SHY) if len(w) > 6 else w
    return re.sub(r"[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+", rep, text)


def inline(text, do_hyph=True):
    parts = re.split(r"(\*\*[^*]+\*\*|https?://\S+)", text)
    out = []
    for p in parts:
        if p.startswith("**") and p.endswith("**"):
            out.append("<strong>" + html.escape(p[2:-2]) + "</strong>")
        elif p.startswith("http"):
            out.append(f'<span class="url">{html.escape(p)}</span>')
        else:
            out.append(html.escape(hyph(p) if do_hyph else p))
    return "".join(out)


def label(text, *labels):
    """Pone en negrita un rótulo inicial («Respuesta:», «Nuestra opinión:»)."""
    for lb in labels:
        if text.startswith(lb):
            return f"<strong class=\"lbl\">{lb}</strong>{inline(text[len(lb):])}"
    return inline(text)


def figure(key, kind=None):
    cap, k = FIGS[key]
    kind = kind or k
    return (f'<figure class="{kind}"><div class="frame"><img src="img/{key}.jpg" alt=""></div>'
            f"<figcaption>{html.escape(cap)}</figcaption></figure>")


# ---------- dividir los bloques por sección ----------
sections = {}
cur = None
for b in BLOCKS:
    if b["t"] == "h2":
        cur = int(b["x"].split(".")[0])
        sections[cur] = []
        continue
    sections[cur].append(b)


def head(num, extra=""):
    n, kind, title = INDEX[num - 1]
    area = next((b["x"] for b in sections[num] if b["t"] == "area"), "")
    area_html = f'<span class="area">Área: {area}</span>' if area else ""
    t = title or kind
    k = kind if title else ""
    return f"""
  <span class="marker">@@S{num:02d}@@</span>
  <header class="sec-head">
    <span class="num">{num:02d}</span>
    <div class="htext">
      <p class="kicker">{html.escape(k)}{area_html}</p>
      <h2>{html.escape(t)}</h2>
      <span class="rule"></span>
      {extra}
    </div>
  </header>"""


def body_blocks(num, blocks, first=True):
    """Bloques genéricos dentro de las columnas, con figuras y citas intercaladas."""
    out = []
    in_ol = False
    places = [(start, key) for s, start, key in PLACES if s == num]
    for b in blocks:
        t, x = b["t"], b["x"]
        if t == "area":
            continue
        if t != "ol" and in_ol:
            out.append("</div>")
            in_ol = False
        if t == "h3":
            out.append(f'<h3 class="sub">{inline(x, False)}</h3>')
        elif t == "p":
            if x.startswith("Nuestra opinión:"):
                out.append(f'<div class="opinion"><p>{label(x, "Nuestra opinión:")}</p></div>')
            elif x.startswith("Nota editorial:"):
                out.append(f'<div class="note"><p>{label(x, "Nota editorial:")}</p></div>')
            else:
                cls = ' class="lead"' if first and len(x) > 160 else ""
                out.append(f"<p{cls}>{label(x, 'Respuesta:')}</p>")
            first = False
        elif t == "ol":
            if not in_ol:
                out.append('<div class="pillars"><p class="pillars-title">Los cinco pilares del Islam</p>')
                in_ol = True
            name, rest = x.split(":", 1)
            out.append(f'<div class="pillar"><span class="pn">{b["n"]}</span><div>'
                       f'<p class="pname"><strong>{name}</strong>'
                       f'<span class="ar" lang="ar">{ARABIC_PILLARS.get(name, "")}</span></p>'
                       f"<p>{inline(rest.strip())}</p></div></div>")
        elif t == "quote":
            out.append(f'<blockquote class="pull">{inline(x, False)}</blockquote>')
        for start, key in places:
            if t == "p" and x.startswith(start):
                out.append(figure(key))
    if in_ol:
        out.append("</div>")
    if num in QUOTES:
        # Antes de un subtítulo o de un párrafo que no siga a un subtítulo, cerca de la mitad
        mid = len(out) // 2
        while mid < len(out) and not (out[mid].startswith("<h3") or
                                      (out[mid].startswith("<p") and not out[mid - 1].startswith("<h3"))):
            mid += 1
        out.insert(mid, f'<blockquote class="pull">{html.escape(QUOTES[num])}</blockquote>')
    return "\n".join(out)


def timeline():
    items = [
        ("c. 570", "Nace Mahoma en La Meca."),
        ("610", "Según la tradición, comienza a recibir las revelaciones que forman el Corán."),
        ("622", "Hégira: emigración de La Meca a Medina. Comienza el calendario islámico."),
        ("632", "Muere Mahoma. El Islam continúa expandiéndose por Asia, África y Europa."),
    ]
    li = "".join(f'<li><span class="yr">{y}</span><span class="tx">{html.escape(t)}</span></li>' for y, t in items)
    return f'<div class="timeline"><p class="tl-title">Línea de tiempo</p><ol>{li}</ol></div>'


def map_figure():
    # Mapa vectorial elaborado con datos de Natural Earth (ver mapa.mjs)
    svg = open("img/mapa_arabia.svg", encoding="utf-8").read()
    cap = FIGS["mapa_arabia"][0]
    return (f'<figure class="col map"><div class="frame">{svg}</div>'
            f'<figcaption>{html.escape(cap)}</figcaption></figure>')


def section(num):
    blocks = sections[num]
    brk = " newpage" if num in NEW_PAGE else ""
    deck = ""
    if blocks and blocks[0]["t"] == "area":
        blocks = blocks[1:]
    if blocks and blocks[0]["t"] == "h3" and num in (3, 4, 5):
        deck = f'<p class="deck">{html.escape(blocks[0]["x"])}</p>'
        blocks = blocks[1:]
    body = body_blocks(num, blocks)
    if num == 2:
        body = body.replace(figure("mapa_arabia"), map_figure())
        body = body.replace('<h3 class="sub">La expansión del Islam</h3>',
                            timeline() + '\n<h3 class="sub">La expansión del Islam</h3>')
    return f"""
<section class="sec{brk}" id="s{num}">{head(num, deck)}
  <div class="cols">
{body}
  </div>
</section>"""


def roles_section(num=6):
    blocks = [b for b in sections[num] if b["t"] != "area"]
    # Tarjetas: imán, ulema, muftí, califa
    roles, rest, i = [], [], 0
    intro = blocks[0]["x"]
    i = 1
    while i < len(blocks) and blocks[i]["x"] in ("El imán", "El ulema", "El muftí", "El califa"):
        roles.append((blocks[i]["x"], blocks[i + 1]["x"]))
        i += 2
    rest = blocks[i:]
    cards = "".join(f'<div class="role"><h4>{html.escape(t)}</h4><p>{inline(d)}</p></div>' for t, d in roles)
    body = body_blocks(num, rest, first=False)
    body = body.replace('<h3 class="sub">Celebraciones principales</h3>',
                        '<h3 class="sub big">Celebraciones principales</h3>')
    return f"""
<section class="sec" id="s{num}">{head(num)}
  <h3 class="roles-title">{html.escape(intro)}</h3>
  <div class="roles">{cards}</div>
  <div class="cols">
{body}
  </div>
  {figure("kaaba_hajj")}
</section>"""


SYMBOL_ART = {
    1: '<div class="sym-icon"><svg viewBox="0 0 100 100" aria-hidden="true">'
       '<path d="M58 14a38 38 0 1 0 0 72a31 31 0 1 1 0-72z" fill="currentColor"/>'
       '<path d="M74 34l4.3 9.8 10.6 1-8 7 2.4 10.4L74 56.8l-9.3 5.4 2.4-10.4-8-7 10.6-1z" fill="currentColor"/>'
       '</svg></div>',
    2: "kaaba_hajj",
    3: "coran_azul",
    4: "caligrafia_bursa",
    5: "mezquita_silueta",
    6: "mihrab_cordoba",
}
SYMBOL_CAPS = {
    2: "La Kaaba durante el Hajj, en la Gran Mezquita de La Meca.",
    3: "Folio del «Corán Azul», escrito con letras doradas sobre pergamino teñido (siglos IX-X).",
    4: "Caligrafía árabe en la Gran Mezquita (Ulu Camii) de Bursa, Turquía.",
    5: "Silueta de una mezquita con su cúpula y sus minaretes al atardecer.",
    6: "El mihrab de la Mezquita de Córdoba, decorado con mosaicos dorados.",
}


def infographic(num=7):
    blocks = [b for b in sections[num] if b["t"] != "area"]
    intro_t, intro_p = blocks[0]["x"], blocks[1]["x"]
    syms, i = [], 2
    while i < len(blocks) and re.match(r"^\d\.", blocks[i]["x"]):
        syms.append((blocks[i]["x"], blocks[i + 1]["x"]))
        i += 2
    rest = blocks[i:]
    quote = " ".join(b["x"] for b in rest if b["t"] == "quote")
    analysis = [b for b in rest if b["t"] == "p"]

    def card(k, title, text):
        n, name = title.split(".", 1)
        art = SYMBOL_ART[k]
        if art.startswith("<div"):
            media = art
            cap = ""
        else:
            media = f'<div class="sym-photo"><img src="img/{art}.jpg" alt=""></div>'
            cap = f'<p class="sym-cap">{html.escape(SYMBOL_CAPS[k])}</p>'
        return (f'<article class="sym"><span class="sym-n">{n}</span>{media}{cap}'
                f'<h4>{html.escape(name.strip())}</h4><p class="desc">{inline(text)}</p></article>')

    left = "".join(card(k + 1, t, d) for k, (t, d) in enumerate(syms[:3]))
    right = "".join(card(k + 4, t, d) for k, (t, d) in enumerate(syms[3:]))
    q = quote.replace("IDEA PRINCIPAL:", "").strip()
    analysis_html = "".join(f"<p>{inline(b['x'])}</p>" for b in analysis)
    return f"""
<section class="spread spread-l newpage" id="s{num}">
  <span class="marker">@@S{num:02d}@@</span>
  <header class="info-head">
    <p class="kicker">Infografía central <span class="area">Área: Cultura</span></p>
    <h2>Signos y símbolos del Islam</h2>
    <p class="info-intro"><strong>{html.escape(intro_t)}</strong> {inline(intro_p)}</p>
  </header>
  <div class="syms">{left}</div>
</section>
<section class="spread spread-r newpage">
  <div class="syms">{right}</div>
  <div class="analysis"><h3>Análisis cultural</h3>{analysis_html}</div>
  <div class="idea"><span>Idea principal</span><p>{html.escape(q)}</p></div>
</section>"""


def closing_and_biblio():
    concl = [b for b in sections[8] if b["t"] == "p"]
    concl_html = "\n".join(
        f"<p{' class=\"lead\"' if i == 0 else ''}>{inline(b['x'])}</p>" for i, b in enumerate(concl))
    bib = [b for b in sections[9] if b["t"] == "li"]
    note = next((b["x"] for b in sections[9] if b["t"] == "p"), "")
    bib_html = "".join(f"<li>{inline(b['x'], False)}</li>" for b in bib)
    cred = []
    order = ["medina_nabawi", "estudiantes_jordania", "iftar_amigos",
             "cordoba_arcos", "alhambra_teselado", "minbar_tashkent", "eid_indonesia", "kaaba_hajj",
             "coran_azul", "caligrafia_bursa", "mihrab_cordoba"]
    for k in order:
        c = CREDITS[k]
        author = c["author"] or "Wikimedia Commons"
        cred.append(f"<li><em>{html.escape(c['title'])}</em> — {html.escape(author)}. "
                    f"{html.escape(c['license'])}. Wikimedia Commons.</li>")
    return f"""
<section class="sec" id="s8">{head(8)}
  <div class="cols">
{concl_html}
  </div>
  <div class="closing">
    <blockquote class="pull wide">Aprender sobre el Islam es una oportunidad para valorar la diversidad
    religiosa y cultural.</blockquote>
    <div class="pattern-band"></div>
  </div>
</section>
<section class="sec newpage" id="s9">{head(9)}
  <ul class="biblio">{bib_html}</ul>
  <p class="biblio-note">{inline(note)}</p>
  <div class="credits">
    <h4>Créditos de las imágenes</h4>
    <p>Las fotografías de las secciones 2, 3, 4, 5, 6 y 7 provienen de Wikimedia Commons y se
    reproducen según sus licencias libres:</p>
    <ul>{''.join(cred)}</ul>
    <p>Mapa de la sección 2 elaborado para esta edición con datos de Natural Earth (dominio público).
    El resto de las imágenes fueron aportadas para esta edición.</p>
  </div>
</section>"""


def toc():
    rows = []
    for n, kind, title in INDEX:
        pg = PAGES.get(f"{n:02d}", "")
        t = f"<em>{html.escape(kind)}</em>" + (f" · {html.escape(title)}" if title else "")
        rows.append(f'<li><span class="tn">{n:02d}</span><span class="tt">{t}</span>'
                    f'<span class="lead-dots"></span><span class="tp">{pg}</span></li>')
    return "".join(rows)


NEW_PAGE = {1}

presentation = f"""
<section class="presentacion">
  <p class="toc-kicker">Presentación</p>
  <h1 class="pres-title">El Islam: una religión que atraviesa culturas</h1>
  <span class="rule"></span>
  <p class="pres-lead">Conocé sus orígenes, sus principales creencias, sus prácticas religiosas y su
  influencia en la vida cotidiana de millones de personas.</p>
  <div class="pres-grid">
    <div class="pres-box">
      <h3>En esta edición</h3>
      <ul class="dots">
        <li>El origen y la evolución del Islam.</li>
        <li>La religión desde una mirada sociológica.</li>
        <li>Las creencias y la vida cotidiana.</li>
        <li>La cultura, las tradiciones y los medios de comunicación.</li>
        <li>Los líderes religiosos, los rituales y las celebraciones.</li>
        <li>Infografía central: signos y símbolos del Islam.</li>
      </ul>
    </div>
    <blockquote class="pres-quote">Conocer una religión también es una forma de comprender a la sociedad.</blockquote>
  </div>
  <h2 class="toc-title">Índice</h2>
  <ol class="toc">{toc()}</ol>
  <div class="edition-band">
    <span class="ar" lang="ar">الإسلام</span>
    <div><b>Edición especial</b><i>El Islam y su influencia en la sociedad</i></div>
  </div>
</section>"""

body = (presentation + "".join(section(n) for n in (1, 2, 3, 4, 5)) + roles_section() + infographic()
        + closing_and_biblio())

page = f"""<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<title>El Islam · Revista interdisciplinaria</title>
<link rel="stylesheet" href="fonts/fonts.css">
<link rel="stylesheet" href="revista.css">
</head><body>
<div class="cover"></div>
{body}
<div class="cover back"></div>
</body></html>"""
open("revista.html", "w", encoding="utf-8").write(page)
print("ok")
