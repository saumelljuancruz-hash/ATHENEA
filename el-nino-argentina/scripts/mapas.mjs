// Genera src/maps.json con los mapas del reel, ya proyectados a píxeles.
//
// Uso: node scripts/mapas.mjs <carpeta con los GeoJSON de Natural Earth>
//   ne_110m_land.geojson, ne_50m_admin_0_countries.geojson,
//   ne_50m_rivers_lake_centerlines.geojson
// (https://github.com/nvkelso/natural-earth-vector/tree/master/geojson, dominio público)

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { geoEquirectangular, geoMercator, geoPath } from "d3-geo";

const dir = process.argv[2];
const read = (name) => JSON.parse(readFileSync(path.join(dir, `${name}.geojson`), "utf8"));
const round = (d) => d.replace(/(\d+\.\d)\d+/g, "$1");

// Pacífico ecuatorial: de 100°E a 40°W y de 35°S a 35°N, más ancho que el
// cuadro para que la cámara lo recorra.
const PX_PER_DEG = 11.08;
const pacific = { width: Math.round(220 * PX_PER_DEG), height: 776, centerLon: 210, pxPerDeg: PX_PER_DEG };
const eq = geoEquirectangular()
  .rotate([150, 0])
  .scale((PX_PER_DEG * 180) / Math.PI)
  .translate([pacific.width / 2, pacific.height / 2])
  .clipExtent([[0, 0], [pacific.width, pacific.height]]);
pacific.land = round(geoPath(eq)(read("ne_110m_land")));

// Sudamérica en Mercator, con Argentina (Malvinas incluidas) aparte.
const countries = read("ne_50m_admin_0_countries").features;
const southAmerica = countries.filter((f) => f.properties.CONTINENT === "South America");
const argentina = southAmerica.filter((f) => ["Argentina", "Falkland Islands"].includes(f.properties.ADMIN));
const merc = geoMercator().fitExtent(
  [[40, 120], [1040, 1650]],
  { type: "Feature", geometry: { type: "Polygon", coordinates: [[[-82, 2], [-34, 2], [-34, -56], [-82, -56], [-82, 2]]] } },
);
const mercPath = geoPath(merc);
const rivers = read("ne_50m_rivers_lake_centerlines").features;
const river = (name) => round(mercPath({ type: "FeatureCollection", features: rivers.filter((f) => f.properties.name === name) }));
const point = (lon, lat) => merc([lon, lat]).map((v) => Math.round(v));

const sudamerica = {
  neighbors: round(mercPath({ type: "FeatureCollection", features: southAmerica.filter((f) => !argentina.includes(f)) })),
  argentina: round(mercPath({ type: "FeatureCollection", features: argentina })),
  parana: river("Paraná"),
  uruguay: river("Uruguay"),
  places: {
    buenosAires: point(-58.38, -34.6),
    rosario: point(-60.64, -32.95),
    santaFe: point(-60.7, -31.63),
    corrientes: point(-58.83, -27.47),
    posadas: point(-55.9, -27.37),
    concordia: point(-58.02, -31.39),
    cordoba: point(-64.18, -31.42),
    amazonia: point(-62, -8),
    chaco: point(-61, -24),
    litoral: point(-59, -29.5),
    pampa: point(-61.5, -35),
  },
};

writeFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), "..", "src", "maps.json"), JSON.stringify({ pacific, sudamerica }) + "\n");
console.log("pacífico", (pacific.land.length / 1024).toFixed(0), "KB · argentina", (sudamerica.argentina.length / 1024).toFixed(0), "KB · vecinos", (sudamerica.neighbors.length / 1024).toFixed(0), "KB");
console.log(sudamerica.places);
