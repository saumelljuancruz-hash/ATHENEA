// Dibuja un mapa de la península arábiga (Natural Earth, dominio público) como SVG.
import fs from "node:fs";
import { feature } from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";

const topo = JSON.parse(fs.readFileSync("node_modules/world-atlas/countries-50m.json", "utf8"));
const countries = feature(topo, topo.objects.countries).features;

const W = 600, H = 560;
const frame = { type: "Feature", geometry: { type: "Polygon", coordinates: [[[33, 12], [33, 33.5], [60, 33.5], [60, 12], [33, 12]]] } };
const proj = geoMercator().fitExtent([[0, 0], [W, H]], frame).clipExtent([[-5, -5], [W + 5, H + 5]]);
const path = geoPath(proj);
const SAUDI = "682";

const land = countries.map(f => {
  const sa = f.id === SAUDI;
  return `<path d="${path(f)}" fill="${sa ? "#d7e8e0" : "#f1e6cc"}" stroke="${sa ? "#0f4a44" : "#b9a77f"}" stroke-width="${sa ? 1.8 : 0.7}" stroke-linejoin="round"/>`;
}).join("");

const P = (lon, lat) => proj([lon, lat]).map(v => v.toFixed(1));
const label = (lon, lat, text, cls) => { const [x, y] = P(lon, lat); return `<text x="${x}" y="${y}" class="${cls}">${text}</text>`; };

const mecca = P(39.8262, 21.4225), medina = P(39.6111, 24.4672), riyadh = P(46.6753, 24.7136);
const city = ([x, y], name, dx, anchor, cap) => `
  <g>${cap
    ? `<path d="M${x} ${+y - 7}l2.1 4.4 4.9.6-3.6 3.3 1 4.8-4.4-2.4-4.4 2.4 1-4.8-3.6-3.3 4.9-.6z" fill="#b4542f" stroke="#fff" stroke-width="1.2"/>`
    : `<circle cx="${x}" cy="${y}" r="6.5" fill="#b4542f" stroke="#fff" stroke-width="2.4"/>`}
  <text x="${+x + dx}" y="${+y + 6.5}" text-anchor="${anchor}" class="city">${name}</text></g>`;

// Flecha de la Hégira (La Meca -> Medina), curva hacia el este
const [mx, my] = mecca, [dx, dy] = medina;
const ctrl = [(+mx + +dx) / 2 + 38, (+my + +dy) / 2];
const hijra = `<path d="M${mx} ${+my - 8} Q${ctrl[0]} ${ctrl[1]} ${+dx + 6} ${+dy + 8}" fill="none" stroke="#c39132" stroke-width="2.6" stroke-dasharray="6 4" marker-end="url(#arr)"/>
  <text x="${ctrl[0] - 18}" y="${ctrl[1] + 6}" class="hijra">Hégira, 622</text>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" class="mapa-svg">
<defs>
  <marker id="arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
    <path d="M0 0L10 5L0 10z" fill="#c39132"/></marker>
  <style>
    .sea{font:italic 600 19px Lora,serif;fill:#3d6f86;letter-spacing:1px}.end{text-anchor:end}
    .ctry{font:600 14px Montserrat,sans-serif;fill:#8a7853;letter-spacing:1.5px;text-transform:uppercase}
    .sa{font:700 21px Montserrat,sans-serif;fill:#0f4a44;letter-spacing:3px}
    .city{font:700 20px Montserrat,sans-serif;fill:#231f1b;paint-order:stroke;stroke:#fff;stroke-width:4px}
    .hijra{font:italic 700 18px Lora,serif;fill:#8a5f12;paint-order:stroke;stroke:#fbf7ee;stroke-width:4px}
  </style>
</defs>
<rect width="${W}" height="${H}" fill="#cfe2e6"/>
${land}
${label(37.7, 19.4, "Mar Rojo", "sea")}
${label(50.2, 27.9, "Golfo", "sea")}${label(50.0, 27.1, "Pérsico", "sea")}
${label(59.3, 15.2, "Mar Arábigo", "sea end")}
${label(40.6, 27.4, "ARABIA SAUDITA", "sa")}
${label(33.4, 27.6, "Egipto", "ctry")}${label(43.6, 31.8, "Irak", "ctry")}${label(36.6, 31.2, "Jordania", "ctry")}
${label(52.4, 31.4, "Irán", "ctry")}${label(44.0, 15.2, "Yemen", "ctry")}${label(55.0, 19.8, "Omán", "ctry")}
${label(34.2, 17.8, "Sudán", "ctry")}
${hijra}
${city(mecca, "La Meca", -10, "end")}
${city(medina, "Medina", -10, "end")}
${city(riyadh, "Riad (capital)", 11, "start", true)}
</svg>`;
fs.writeFileSync(process.argv[2], svg);
console.log("ok", svg.length);
