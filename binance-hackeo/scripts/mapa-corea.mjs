// Genera src/korea.json: la península de Corea proyectada a píxeles.
// Uso: node scripts/mapa-corea.mjs <carpeta con ne_50m_admin_0_countries.geojson>
// (Natural Earth, dominio público)
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { geoMercator, geoPath } from "d3-geo";

const countries = JSON.parse(readFileSync(path.join(process.argv[2], "ne_50m_admin_0_countries.geojson"), "utf8")).features;
const pick = (names) => ({ type: "FeatureCollection", features: countries.filter((f) => names.includes(f.properties.ADMIN)) });
const box = { type: "Feature", geometry: { type: "Polygon", coordinates: [[[123, 44], [132, 44], [132, 33], [123, 33], [123, 44]]] } };
const proj = geoMercator().fitExtent([[80, 60], [1000, 1180]], box);
const p = geoPath(proj);
const round = (d) => d.replace(/(\d+\.\d)\d+/g, "$1");
const out = {
  north: round(p(pick(["North Korea"]))),
  south: round(p(pick(["South Korea"]))),
  around: round(p(pick(["China", "Russia", "Japan"]))),
  pyongyang: proj([125.75, 39.03]).map(Math.round),
};
writeFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), "..", "src", "korea.json"), JSON.stringify(out) + "\n");
console.log("norte", out.north.length, "sur", out.south.length, "alrededor", out.around.length, "pyongyang", out.pyongyang);
