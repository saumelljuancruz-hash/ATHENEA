"""Busca imágenes en Wikimedia Commons (con reintentos) y guarda resultados en JSON."""
import json
import re
import sys
import time
import urllib.parse
import urllib.request

UA = "RevistaEscolar/1.0 (saumelljuancruz@gmail.com) python-urllib"
API = "https://commons.wikimedia.org/w/api.php"


def get(url, tries=8):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = int(e.headers.get("retry-after", "15")) + 2
                time.sleep(wait)
                continue
            raise
    raise RuntimeError("demasiados reintentos: " + url)


def search(q, n=10):
    params = {
        "action": "query", "generator": "search", "gsrsearch": q + " filetype:bitmap",
        "gsrnamespace": 6, "gsrlimit": n, "prop": "imageinfo",
        "iiprop": "url|size|extmetadata", "iiurlwidth": 1400,
        "iiextmetadatafilter": "LicenseShortName|Artist|ImageDescription", "format": "json",
    }
    d = json.loads(get(API + "?" + urllib.parse.urlencode(params)))
    out = []
    for p in d.get("query", {}).get("pages", {}).values():
        ii = p["imageinfo"][0]
        m = ii.get("extmetadata", {})
        clean = lambda k: re.sub(r"<[^>]+>", "", m.get(k, {}).get("value", "")).strip()
        out.append({
            "title": p["title"], "w": ii["width"], "h": ii["height"],
            "thumb": ii.get("thumburl"), "page": ii.get("descriptionurl"),
            "license": clean("LicenseShortName"), "artist": clean("Artist")[:80],
            "desc": clean("ImageDescription")[:160],
        })
    return out


if __name__ == "__main__":
    mode = sys.argv[1]
    if mode == "search":
        res = {}
        for q in sys.argv[3:]:
            res[q] = search(q)
            time.sleep(3)
        json.dump(res, open(sys.argv[2], "w"), ensure_ascii=False, indent=1)
        for q, items in res.items():
            print("==", q)
            for it in items:
                print(f"  {it['title'][5:70]:65s} {it['w']}x{it['h']} {it['license'][:14]} | {it['desc'][:70]}")
    elif mode == "download":
        url, dest = sys.argv[2], sys.argv[3]
        open(dest, "wb").write(get(url))
        print("ok", dest)
