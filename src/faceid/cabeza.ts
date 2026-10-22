/**
 * Busto 3D minimalista (sin rasgos de una persona real) dibujado en canvas:
 * superficie paramétrica + iluminación Lambert + orden de profundidad.
 * También genera la nube de puntos infrarrojos y la malla de Face ID.
 *
 * Unidades: la cabeza mide 2 de alto (y ∈ [-1, 1]); x a la derecha, y arriba,
 * z hacia la cámara.
 */
import { random } from "remotion";

export type Vec3 = [number, number, number];

export type Camara = {
  /** Giro horizontal (rad). */
  yaw: number;
  /** Inclinación (rad). */
  pitch: number;
  /** Píxeles por unidad. */
  escala: number;
  centro: [number, number];
  distancia?: number;
};

export type Proyectado = { x: number; y: number; z: number; s: number };

const RX = 0.74;
const RY = 1;
const RZ = 0.86;
const g = (v: number) => Math.exp(-v * v);
const suave = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Relieve frontal (desplazamiento en z) en función de la posición en la cara. */
export const relieve = (x: number, y: number) => {
  let dz = 0;
  // Nariz: puente fino que crece hasta la punta y cae hacia la base.
  if (y < 0.34 && y > -0.42) {
    const t = Math.min(1, Math.max(0, (0.3 - y) / 0.55));
    const h = y >= -0.25 ? 0.035 + 0.2 * Math.pow(t, 1.4) : 0.235 * Math.pow(Math.max(0, 1 - (-0.25 - y) / 0.12), 0.7);
    const w = 0.055 + 0.06 * t;
    dz += h * g(x / w);
  }
  dz += 0.05 * (g((x - 0.085) / 0.045) + g((x + 0.085) / 0.045)) * g((y + 0.29) / 0.05);
  // Cejas, cuencas, párpados y pómulos.
  dz += 0.05 * g((Math.abs(x) - 0.25) / 0.17) * g((y - 0.25) / 0.055);
  for (const s of [-1, 1]) {
    dz -= 0.1 * g((x - s * 0.26) / 0.13) * g((y - 0.12) / 0.085);
    dz += 0.045 * g((x - s * 0.26) / 0.085) * g((y - 0.11) / 0.05);
    dz += 0.065 * g((x - s * 0.4) / 0.12) * g((y + 0.03) / 0.12);
  }
  // Labios y mentón.
  dz += 0.05 * g(x / 0.16) * g((y + 0.46) / 0.035);
  dz += 0.045 * g(x / 0.14) * g((y + 0.555) / 0.04);
  dz -= 0.02 * g(x / 0.15) * g((y + 0.505) / 0.015);
  dz += 0.06 * g(x / 0.17) * g((y + 0.8) / 0.1);
  return dz;
};

/** Punto de la cabeza para los ángulos θ (alrededor) y φ (altura). */
export const superficie = (th: number, ph: number): Vec3 => {
  let x = RX * Math.cos(ph) * Math.sin(th);
  const y = RY * Math.sin(ph);
  let z = RZ * Math.cos(ph) * Math.cos(th);
  // Mandíbula y mentón más angostos.
  const mandibula = suave(-0.25, -1, y);
  x *= 1 - 0.24 * mandibula;
  z *= 1 - 0.1 * mandibula;
  if (z < 0) z *= 1.12; // nuca más redonda
  const frente = suave(0.15, 0.6, Math.cos(th));
  z += relieve(x, y) * frente;
  return [x, y, z];
};

/** `capa`: se dibuja hombros → cuello → cabeza, y dentro de cada capa por profundidad. */
type Cara = { v: Vec3[]; tono: number; capa: number };

const cuadricula = (
  nu: number,
  nv: number,
  f: (u: number, v: number) => Vec3,
  tono = 1,
  cerrarU = false,
  capa = 2,
): Cara[] => {
  const p: Vec3[][] = [];
  for (let i = 0; i <= nu; i++) {
    p.push([]);
    for (let j = 0; j <= nv; j++) p[i].push(f(i / nu, j / nv));
  }
  const caras: Cara[] = [];
  for (let i = 0; i < nu; i++) {
    for (let j = 0; j < nv; j++) {
      const i2 = cerrarU && i === nu - 1 ? 0 : i + 1;
      caras.push({ v: [p[i][j], p[i2][j], p[i2][j + 1], p[i][j + 1]], tono, capa });
    }
  }
  return caras;
};

/** Malla del busto: cabeza, cuello y hombros. */
export const BUSTO: Cara[] = [
  // Frente de la cabeza en alta resolución (rasgos) y nuca en baja.
  ...cuadricula(110, 96, (u, v) => superficie(-1.45 + u * 2.9, -Math.PI / 2 + v * Math.PI)),
  ...cuadricula(30, 40, (u, v) => superficie(1.45 + u * (2 * Math.PI - 2.9), -Math.PI / 2 + v * Math.PI)),
  // Cuello que se abre hacia los hombros.
  ...cuadricula(
    36,
    10,
    (u, v) => {
      const a = -Math.PI + u * 2 * Math.PI;
      const r = 0.31 + 0.22 * v * v * v;
      return [r * 1.05 * Math.sin(a), -0.6 - v * 0.82, -0.12 + r * Math.cos(a)];
    },
    0.92,
    true,
    1,
  ),
  // Hombros (mitad superior de un elipsoide achatado, con caída de trapecios).
  ...cuadricula(
    64,
    14,
    (u, v) => {
      const a = -Math.PI + u * 2 * Math.PI;
      const b = (v * Math.PI) / 2;
      const alto = 0.55 * Math.pow(Math.sin(b), 0.8);
      return [1.42 * Math.cos(b) * Math.sin(a), -1.95 + alto, -0.14 + 0.58 * Math.cos(b) * Math.cos(a)];
    },
    0.85,
    true,
    0,
  ),
];

/* ------------------------------- Cámara ----------------------------------- */

export const rotar = ([x, y, z]: Vec3, cam: Camara): Vec3 => {
  const cy = Math.cos(cam.yaw);
  const sy = Math.sin(cam.yaw);
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const cp = Math.cos(cam.pitch);
  const sp = Math.sin(cam.pitch);
  return [x1, y * cp - z1 * sp, y * sp + z1 * cp];
};

export const proyectar = (p: Vec3, cam: Camara): Proyectado => {
  const [x, y, z] = rotar(p, cam);
  const d = cam.distancia ?? 7;
  const s = (cam.escala * d) / (d - z);
  return { x: cam.centro[0] + x * s, y: cam.centro[1] - y * s, z, s };
};

const normal = (a: Vec3, b: Vec3, c: Vec3): Vec3 => {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const n: Vec3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  const l = Math.hypot(...n) || 1;
  return [n[0] / l, n[1] / l, n[2] / l];
};

const LUZ: Vec3 = (() => {
  const v: Vec3 = [-0.55, 0.6, 0.62];
  const l = Math.hypot(...v);
  return [v[0] / l, v[1] / l, v[2] / l];
})();

/** Dibuja el busto sombreado. `luz` 0..1 atenúa la iluminación (para "luces apagadas"). */
export const dibujarBusto = (
  ctx: CanvasRenderingContext2D,
  cam: Camara,
  { luz = 1, opacidad = 1 }: { luz?: number; opacidad?: number } = {},
) => {
  if (opacidad <= 0) return;
  const lista: { pts: Proyectado[]; z: number; c: number; capa: number }[] = [];
  for (const cara of BUSTO) {
    const r = cara.v.map((p) => rotar(p, cam));
    const n = normal(r[0], r[1], r[2]);
    const centro: Vec3 = [(r[0][0] + r[2][0]) / 2, (r[0][1] + r[2][1]) / 2, (r[0][2] + r[2][2]) / 2];
    // Normal orientada hacia la cámara (las caras traseras quedan tapadas por el orden de profundidad).
    const d = cam.distancia ?? 7;
    const haciaCamara = -n[0] * centro[0] - n[1] * centro[1] + n[2] * (d - centro[2]) > 0;
    const no: Vec3 = haciaCamara ? n : [-n[0], -n[1], -n[2]];
    const dif = Math.max(0, no[0] * LUZ[0] + no[1] * LUZ[1] + no[2] * LUZ[2]);
    const relleno = Math.max(0, no[0] * 0.5 + no[1] * 0.1 + no[2] * 0.6) * 0.22;
    const borde = Math.pow(1 - Math.max(0, no[2]), 3) * 0.28;
    const c = (0.1 + 0.82 * dif + relleno) * cara.tono * luz + borde * luz;
    lista.push({ pts: cara.v.map((p) => proyectar(p, cam)), z: centro[2], c, capa: cara.capa });
  }
  lista.sort((a, b) => a.capa - b.capa || a.z - b.z);
  ctx.save();
  ctx.globalAlpha = opacidad;
  for (const q of lista) {
    const v = Math.round(Math.min(1.1, q.c) * 168);
    ctx.fillStyle = `rgb(${v},${v + 3},${v + 9})`;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(q.pts[0].x, q.pts[0].y);
    for (let k = 1; k < 4; k++) ctx.lineTo(q.pts[k].x, q.pts[k].y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
};

/* --------------------------- Puntos infrarrojos --------------------------- */

export type Punto = {
  sup: Vec3;
  n: Vec3;
  retraso: number;
};

const normalSuperficie = (th: number, ph: number): Vec3 => {
  const e = 0.004;
  const a = superficie(th, ph);
  const b = superficie(th + e, ph);
  const c = superficie(th, ph + e);
  const n = normal(a, b, c);
  return n[2] < 0 ? [-n[0], -n[1], -n[2]] : n;
};

/** ~3.000 puntos repartidos sobre el frente de la cara (representan los 30.000 reales). */
export const PUNTOS: Punto[] = (() => {
  const salida: Punto[] = [];
  const paso = 0.027;
  let k = 0;
  for (let x = -RX; x <= RX; x += paso) {
    for (let y = -0.98; y <= 0.98; y += paso) {
      k++;
      const jx = x + (random(`px${k}`) - 0.5) * paso * 0.8;
      const jy = y + (random(`py${k}`) - 0.5) * paso * 0.8;
      if ((jx / RX) ** 2 + (jy / RY) ** 2 > 0.96) continue;
      const ph = Math.asin(jy / RY);
      const th = Math.asin(Math.max(-1, Math.min(1, jx / (RX * Math.cos(ph)))));
      if (Math.abs(th) > 1.25) continue;
      salida.push({ sup: superficie(th, ph), n: normalSuperficie(th, ph), retraso: random(`pr${k}`) });
    }
  }
  return salida;
})();

export type OpcionesPuntos = {
  /** 0..1: cuántos puntos se encendieron. */
  aparicion: number;
  /** 0..1: de la "pantalla plana" (z = plano) a la superficie de la cara. */
  aterrizaje: number;
  /** Profundidad del plano de partida (o de la foto). */
  plano?: number;
  /** true: los puntos se quedan en el plano (foto sin profundidad). */
  sobrePlano?: boolean;
  color?: string;
  /** Rayos desde el proyector (coordenadas de pantalla). */
  origen?: [number, number];
  rayos?: number;
  tamano?: number;
  opacidad?: number;
};

export const posicionPunto = (p: Punto, o: OpcionesPuntos): Vec3 => {
  const plano = o.plano ?? 1.15;
  if (o.sobrePlano) return [p.sup[0], p.sup[1], plano];
  const t = Math.min(1, Math.max(0, o.aterrizaje * 1.6 - p.retraso * 0.6));
  const e = t * t * (3 - 2 * t);
  return [p.sup[0], p.sup[1], plano + (p.sup[2] - plano) * e];
};

export const dibujarPuntos = (ctx: CanvasRenderingContext2D, cam: Camara, o: OpcionesPuntos) => {
  const color = o.color ?? "#ff4f7a";
  const opacidad = o.opacidad ?? 1;
  if (opacidad <= 0 || o.aparicion <= 0) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const tam = o.tamano ?? 1.5;
  const visibles: Proyectado[] = [];
  PUNTOS.forEach((p, i) => {
    if (p.retraso > o.aparicion) return;
    const pos = posicionPunto(p, o);
    const n = o.sobrePlano ? ([0, 0, 1] as Vec3) : p.n;
    const nr = rotar(n, cam);
    if (nr[2] < 0.05 && o.aterrizaje > 0.5) return;
    const q = proyectar(pos, cam);
    visibles.push(q);
    if (o.rayos && o.origen && i % 9 === 0) {
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.07 * o.rayos * opacidad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(o.origen[0], o.origen[1]);
      ctx.lineTo(q.x, q.y);
      ctx.stroke();
    }
  });
  ctx.fillStyle = color;
  for (const q of visibles) {
    const r = (tam * q.s) / cam.escala;
    ctx.globalAlpha = 0.1 * opacidad;
    ctx.beginPath();
    ctx.arc(q.x, q.y, r * 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.95 * opacidad;
    ctx.fillRect(q.x - r / 2, q.y - r / 2, r, r);
  }
  ctx.restore();
};

/* --------------------------------- Malla ---------------------------------- */

const LINEAS_MALLA: Vec3[][] = (() => {
  const lineas: Vec3[][] = [];
  const ths = Array.from({ length: 27 }, (_, i) => -1.3 + i * 0.1);
  const phs = Array.from({ length: 26 }, (_, i) => -1.2 + i * 0.098);
  for (const th of ths) lineas.push(Array.from({ length: 60 }, (_, j) => superficie(th, -1.2 + (j / 59) * 2.45)));
  for (const ph of phs) lineas.push(Array.from({ length: 60 }, (_, j) => superficie(-1.3 + (j / 59) * 2.6, ph)));
  return lineas;
})();

/** Malla 3D (alambre). `progreso` 0..1 dibuja las líneas de a poco. */
export const dibujarMalla = (
  ctx: CanvasRenderingContext2D,
  cam: Camara,
  { progreso = 1, color = "#3ee0c0", opacidad = 1, grosor = 1.4 }: { progreso?: number; color?: string; opacidad?: number; grosor?: number },
) => {
  if (opacidad <= 0 || progreso <= 0) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = grosor;
  ctx.lineCap = "round";
  LINEAS_MALLA.forEach((linea, i) => {
    const largo = Math.max(0, Math.min(1, progreso * 1.5 - (i / LINEAS_MALLA.length) * 0.5));
    const n = Math.floor(largo * (linea.length - 1));
    for (let j = 0; j < n; j++) {
      const a = rotar(linea[j], cam);
      const b = rotar(linea[j + 1], cam);
      // Atenúa los tramos que miran hacia atrás.
      const frente = Math.min(1, Math.max(0, (a[2] + b[2]) / 2 + 0.15));
      if (frente <= 0) continue;
      const pa = proyectar(linea[j], cam);
      const pb = proyectar(linea[j + 1], cam);
      ctx.globalAlpha = opacidad * (0.25 + 0.75 * frente);
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.stroke();
    }
  });
  ctx.restore();
};

/** Puntos de referencia de la cara (para anclar etiquetas). */
export const ZONAS: Record<"nariz" | "pomuloIzq" | "pomuloDer" | "frente" | "menton", Vec3> = {
  nariz: superficie(0, Math.asin(-0.25)),
  pomuloIzq: superficie(Math.asin(-0.4 / RX), Math.asin(-0.03)),
  pomuloDer: superficie(Math.asin(0.4 / RX), Math.asin(-0.03)),
  frente: superficie(0, Math.asin(0.55)),
  menton: superficie(0, Math.asin(-0.8)),
};

/** Coordenadas reales (en "mm") de algunos puntos, para la columna de números. */
export const NUMEROS: string[] = PUNTOS.filter((_, i) => i % 97 === 0).map((p) => {
  const f = (v: number) => (v >= 0 ? " " : "−") + Math.abs(v * 100).toFixed(1).padStart(4, "0");
  return `${f(p.sup[0])} ${f(p.sup[1])} ${f(p.sup[2])}`;
});
