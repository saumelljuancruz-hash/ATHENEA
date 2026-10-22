import {
  geoClipAntimeridian,
  geoClipCircle,
  geoDistance,
  geoGraticule,
  geoInterpolate,
  geoPath,
  GeoPermissibleObjects,
  GeoProjection,
  geoProjection,
  GeoStream,
} from "d3-geo";
import type { Feature, MultiPolygon, Polygon, Position } from "geojson";
import { feature, merge } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import paises from "world-atlas/countries-110m.json";

const topo = paises as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>;
const geometrias = topo.objects.countries.geometries;

/* ---------------------------------- Datos --------------------------------- */

const ID_ANTARTIDA = "010";
const ID_GROENLANDIA = "304";
const ID_EEUU = "840";
// ISO 3166-1 numérico de los países africanos presentes en world-atlas 110m.
const IDS_AFRICA = new Set([
  "012", "024", "204", "072", "854", "108", "120", "140", "148", "178", "180", "384",
  "262", "818", "226", "232", "231", "266", "270", "288", "324", "624", "404", "426",
  "430", "434", "450", "454", "466", "478", "504", "508", "516", "562", "566", "646",
  "686", "694", "706", "710", "728", "729", "748", "834", "768", "788", "800", "732",
  "894", "716",
]);

export const TIERRA: MultiPolygon = merge(
  topo,
  geometrias.filter((g) => g.id !== ID_ANTARTIDA) as never,
);

export const AFRICA: MultiPolygon = merge(
  topo,
  geometrias.filter(
    (g) => IDS_AFRICA.has(String(g.id)) || (g.properties as { name?: string })?.name === "Somaliland",
  ) as never,
);

const featureDe = (id: string) =>
  feature(topo, geometrias.find((g) => g.id === id) as never) as unknown as Feature<
    Polygon | MultiPolygon
  >;

export const GROENLANDIA = featureDe(ID_GROENLANDIA);

const eeuu = featureDe(ID_EEUU).geometry as MultiPolygon;
export const ALASKA: MultiPolygon = {
  type: "MultiPolygon",
  coordinates: eeuu.coordinates.filter((poly) => poly[0][0][0] < -130 && poly[0][0][1] > 50),
};

export const GRATICULA = geoGraticule().step([20, 20])();

/** Aeropuertos JFK y Haneda. */
export const NUEVA_YORK: [number, number] = [-73.78, 40.64];
export const TOKIO: [number, number] = [139.78, 35.55];
export const ALASKA_PUNTO: [number, number] = [-152, 64.5];

const RADIO_TIERRA_KM = 6371;

/** Gran círculo NY → Tokio (puntos lon/lat). */
export const rutaGranCirculo = (n = 120): [number, number][] => {
  const i = geoInterpolate(NUEVA_YORK, TOKIO);
  return Array.from({ length: n + 1 }, (_, k) => i(k / n));
};

const mercY = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
const mercLat = (y: number) => ((2 * Math.atan(Math.exp(y)) - Math.PI / 2) * 180) / Math.PI;

/** Loxodrómica: la línea "recta" del mapa de Mercator, yendo hacia el oeste por el Pacífico. */
export const rutaRecta = (n = 120): [number, number][] => {
  let dl = TOKIO[0] - NUEVA_YORK[0];
  if (dl > 180) dl -= 360;
  const y0 = mercY(NUEVA_YORK[1]);
  const y1 = mercY(TOKIO[1]);
  return Array.from({ length: n + 1 }, (_, k) => {
    const s = k / n;
    return [NUEVA_YORK[0] + dl * s, mercLat(y0 + (y1 - y0) * s)];
  });
};

const kmDeRuta = (pts: [number, number][]) => {
  let d = 0;
  for (let i = 1; i < pts.length; i++) d += geoDistance(pts[i - 1], pts[i]);
  return d * RADIO_TIERRA_KM;
};

export const KM_GRAN_CIRCULO = kmDeRuta(rutaGranCirculo(400));
export const KM_RECTA = kmDeRuta(rutaRecta(400));
export const LATITUD_MAX = Math.max(...rutaGranCirculo(400).map((p) => p[1]));

/* ------------------------------ Proyecciones ------------------------------ */

export type EstadoMapa = {
  /** 0 = globo (ortográfica) · 1 = plano */
  aplanado: number;
  /** 0 = equirectangular · 1 = Mercator (se "estira" hacia los polos) */
  mercator: number;
  /** Radio del globo relativo a la escala del plano. */
  radioGlobo: number;
  escala: number;
  centro: [number, number];
  rotacion: [number, number, number?];
  recorte?: [[number, number], [number, number]] | null;
};

const LAT_MAX_MERC = (84 * Math.PI) / 180;

/**
 * Proyección interpolada globo → plano → Mercator.
 * El recorte circular sigue el "pliegue" de la interpolación, así el globo se
 * abre como una cáscara sin superponer el hemisferio trasero.
 */
export const crearProyeccion = (e: EstadoMapa): GeoProjection => {
  const t = Math.min(1, Math.max(0, e.aplanado));
  const m = e.mercator;
  const k0 = e.radioGlobo;
  const raw = (lambda: number, phi: number): [number, number] => {
    const phiC = Math.max(-LAT_MAX_MERC, Math.min(LAT_MAX_MERC, phi));
    const fx = lambda;
    const fy = (1 - m) * phi + m * Math.log(Math.tan(Math.PI / 4 + phiC / 2));
    const ox = k0 * Math.cos(phi) * Math.sin(lambda);
    const oy = k0 * Math.sin(phi);
    return [(1 - t) * ox + t * fx, (1 - t) * oy + t * fy];
  };
  const p = geoProjection(raw)
    .scale(e.escala)
    .translate(e.centro)
    .rotate(e.rotacion as [number, number, number])
    .precision(0.4);

  const coseno = t >= 1 ? -1 : Math.max(-1, -t / ((1 - t) * k0));
  const angulo = Math.acos(coseno);
  if (angulo < Math.PI - 0.004) {
    const circulo = geoClipCircle(angulo);
    p.preclip((s: GeoStream) => circulo(geoClipAntimeridian(s)));
  } else {
    p.preclip(geoClipAntimeridian);
  }
  if (e.recorte) p.clipExtent(e.recorte);
  return p;
};

/** Ángulo (radianes) visible desde el centro de la proyección. */
export const anguloVisible = (e: EstadoMapa) => {
  const t = Math.min(1, Math.max(0, e.aplanado));
  return t >= 1 ? Math.PI : Math.acos(Math.max(-1, -t / ((1 - t) * e.radioGlobo)));
};

export const esVisible = (e: EstadoMapa, punto: [number, number]) => {
  const centro: [number, number] = [-e.rotacion[0], -e.rotacion[1]];
  return geoDistance(punto, centro) < anguloVisible(e) - 0.02;
};

export const trazar = (p: GeoProjection, objeto: GeoPermissibleObjects) =>
  geoPath(p)(objeto) ?? "";

/** Proyecta los vértices sin recortar (sirve para interpolar formas punto a punto). */
export const proyectarAnillos = (
  p: (pt: [number, number]) => [number, number] | null,
  anillos: Position[][],
) => anillos.map((anillo) => anillo.map((pt) => p(pt as [number, number]) ?? [0, 0]));

export const anillosAPath = (anillos: [number, number][][]) =>
  anillos
    .map((a) => `M${a.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join("L")}Z`)
    .join("");

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Posición y ángulo a lo largo de una polilínea en pantalla (0..1). */
export const puntoEnPolilinea = (pts: [number, number][], s: number) => {
  const largos = [0];
  for (let i = 1; i < pts.length; i++) {
    largos.push(largos[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }
  const total = largos[largos.length - 1] || 1;
  const objetivo = Math.min(1, Math.max(0, s)) * total;
  let i = 1;
  while (i < largos.length - 1 && largos[i] < objetivo) i++;
  const seg = largos[i] - largos[i - 1] || 1;
  const u = (objetivo - largos[i - 1]) / seg;
  const [x0, y0] = pts[i - 1];
  const [x1, y1] = pts[i];
  return {
    x: lerp(x0, x1, u),
    y: lerp(y0, y1, u),
    angulo: (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI,
    largo: total,
  };
};

export const polilineaAPath = (pts: [number, number][]) =>
  pts.length ? `M${pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join("L")}` : "";

/** Proyecta un punto lon/lat a pantalla con un estado de mapa (útil fuera del <svg>). */
export const proyectarPunto = (e: EstadoMapa, pt: [number, number]) => {
  const r = crearProyeccion(e)(pt) ?? [0, 0];
  return { x: r[0], y: r[1] };
};
