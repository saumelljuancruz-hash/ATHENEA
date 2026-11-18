import json, html
c = json.load(open("creditos.json"))
names = {"obrero": "Movimiento obrero", "madres": "Madres de Plaza de Mayo", "mst": "MST", "niunamenos": "Ni Una Menos", "ecologistas": "Ecologistas"}
li = "".join(f"<li>{names[k]}: <i>{html.escape(c[k]['title'])}</i>, {html.escape(c[k]['author'])}. {html.escape(c[k]['license'])}.</li>"
             for k in names if k in c and c[k].get("ok"))
s = open("infografia.html", encoding="utf-8").read().replace("@@CREDITOS@@", li)
open("infografia_out.html", "w", encoding="utf-8").write(s)
