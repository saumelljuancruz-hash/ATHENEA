import React from "react";
import { interpolateColors } from "remotion";
import { COLOR } from "../../comun/tema";

/** Medidas en coordenadas locales (origen en el centro del frente). */
export const MO = {
  ancho: 760,
  alto: 460,
  /** Desplazamiento oblicuo para la cara superior y la lateral (profundidad). */
  prof: [46, -38] as [number, number],
  puerta: { x0: -358, x1: 174, y0: -208, y1: 208 },
  ventana: { x0: -314, x1: 130, y0: -166, y1: 166 },
  panel: { x0: 190, x1: 358 },
  /** Punto de la comida, para hacer zoom. */
  comidaFrente: [-92, 72] as [number, number],
  comidaCorte: [-70, 120] as [number, number],
  magnetron: [274, -30] as [number, number],
  /** Salida de la guía de ondas a la cavidad. */
  salida: [166, -140] as [number, number],
};

export type UbicacionMO = { x: number; y: number; escala: number };

export const aLienzoMO = ([lx, ly]: [number, number], u: UbicacionMO): [number, number] => [
  u.x + lx * u.escala,
  u.y + ly * u.escala,
];

export const puntoMO = (local: [number, number], u: UbicacionMO) => {
  const [x, y] = aLienzoMO(local, u);
  return { x, y };
};

/** Color de temperatura: azul (frío) → naranja → rojo (caliente). `t` 0..1 */
export const colorTemp = (t: number) =>
  interpolateColors(Math.min(1, Math.max(0, t)), [0, 0.55, 1], [COLOR.azul, COLOR.naranjaCalor, "#ff3b2f"]);

/** Recorrido de una onda que rebota dentro de un rectángulo (reflexión especular). */
export const rebotes = (
  inicio: [number, number],
  angulo: number,
  caja: { x0: number; x1: number; y0: number; y1: number },
  largo: number,
): [number, number][] => {
  const pts: [number, number][] = [inicio];
  let [x, y] = inicio;
  let dx = Math.cos(angulo);
  let dy = Math.sin(angulo);
  let resto = largo;
  for (let k = 0; k < 12 && resto > 0; k++) {
    const tx = dx > 0 ? (caja.x1 - x) / dx : dx < 0 ? (caja.x0 - x) / dx : Infinity;
    const ty = dy > 0 ? (caja.y1 - y) / dy : dy < 0 ? (caja.y0 - y) / dy : Infinity;
    const t = Math.min(tx, ty, resto);
    x += dx * t;
    y += dy * t;
    resto -= t;
    pts.push([x, y]);
    if (t === tx) dx = -dx;
    if (t === ty) dy = -dy;
  }
  return pts;
};

/** Convierte una polilínea en una onda senoidal que viaja a lo largo de ella. */
export const ondaSobre = (pts: [number, number][], fase: number, amplitud = 12, longitud = 46) => {
  const salida: [number, number][] = [];
  let s = 0;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const l = Math.hypot(x1 - x0, y1 - y0);
    const nx = -(y1 - y0) / (l || 1);
    const ny = (x1 - x0) / (l || 1);
    for (let d = 0; d < l; d += 6) {
      const u = d / l;
      const a = amplitud * Math.sin(((s + d) / longitud) * 2 * Math.PI - fase);
      salida.push([x0 + (x1 - x0) * u + nx * a, y0 + (y1 - y0) * u + ny * a]);
    }
    s += l;
  }
  return salida;
};

const ruta = (pts: [number, number][]) => (pts.length ? `M${pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join("L")}` : "");

const AGUJEROS = "moPuntos";

/** Comida en el plato (vista de frente, dentro de la cavidad), girando con `rot`. */
const PlatoConComida: React.FC<{ cx: number; cy: number; rot: number; temp: number; escala?: number }> = ({
  cx,
  cy,
  rot,
  temp,
  escala = 1,
}) => {
  const trozos = Array.from({ length: 26 }, (_, i) => {
    const a = i * 2.39996 + rot;
    const r = 0.25 + 0.7 * ((i * 0.618) % 1);
    return { x: Math.cos(a) * r * 96, y: Math.sin(a) * r * 18, frente: Math.sin(a) > -0.2, c: i % 3 };
  });
  const base = interpolateColors(temp, [0, 1], ["#a8653c", "#d9772f"]);
  return (
    <g transform={`translate(${cx} ${cy}) scale(${escala})`}>
      <ellipse cx={0} cy={36} rx={172} ry={30} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" />
      <ellipse cx={0} cy={30} rx={150} ry={26} fill="#d7dade" />
      <ellipse cx={0} cy={26} rx={128} ry={20} fill="#c3c7cd" />
      <path d="M-112 4 Q-110 32 0 34 Q110 32 112 4 Z" fill="#9aa0a8" />
      <ellipse cx={0} cy={2} rx={112} ry={22} fill={base} />
      {trozos.map((t, i) => (
        <ellipse
          key={i}
          cx={t.x}
          cy={t.y - 2}
          rx={9}
          ry={4.5}
          fill={["#6f8f3a", "#e3b25b", "#8a3d24"][t.c]}
          opacity={t.frente ? 0.95 : 0.55}
        />
      ))}
      {temp > 0.4
        ? [0, 1, 2].map((k) => (
            <path
              key={k}
              d={`M${-40 + k * 40} -20 q 10 -20 0 -40 q -10 -20 0 -40`}
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth={4}
              strokeLinecap="round"
              opacity={(temp - 0.4) * 1.6}
              transform={`translate(0 ${-Math.sin(rot * 2 + k) * 6})`}
            />
          ))
        : null}
    </g>
  );
};

export const Microondas: React.FC<{
  ubicacion: UbicacionMO;
  modo?: "frente" | "corte";
  /** Giro del plato (rad). */
  rot?: number;
  /** 0..1 luz interior. */
  luz?: number;
  /** 0..1 intensidad de las ondas (vista en corte). */
  ondas?: number;
  /** Fase de las ondas (crece con el tiempo). */
  fase?: number;
  /** 0..1 brillo del magnetrón. */
  magnetron?: number;
  tempComida?: number;
  /** Texto del display. */
  display?: string;
  children?: React.ReactNode;
}> = ({ ubicacion: u, modo = "frente", rot = 0, luz = 1, ondas = 0, fase = 0, magnetron = 0, tempComida = 0, display = "0:30", children }) => {
  const { ancho: W, alto: H, prof: [px, py], puerta: P, ventana: V, panel } = MO;
  const caraSuperior = `M${-W / 2 + 20},${-H / 2} L${W / 2 - 20},${-H / 2} L${W / 2 - 20 + px},${-H / 2 + py} L${-W / 2 + 20 + px},${-H / 2 + py} Z`;
  const caraLateral = `M${W / 2},${-H / 2 + 20} L${W / 2 + px},${-H / 2 + 20 + py} L${W / 2 + px},${H / 2 - 20 + py} L${W / 2},${H / 2 - 20} Z`;
  const corte = modo === "corte";
  // Cavidad en perspectiva oblicua: pared del fondo desplazada.
  const fondo = { dx: 58, dy: -48 };
  const caja = { x0: P.x0 + 12, x1: P.x1 - 8, y0: P.y0 + 12, y1: P.y1 - 12 };

  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs>
        <linearGradient id="moFrente" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4e57" />
          <stop offset="100%" stopColor="#2b2e34" />
        </linearGradient>
        <radialGradient id="moLuz" cx="45%" cy="25%" r="80%">
          <stop offset="0%" stopColor="#ffcf8a" stopOpacity={0.55 * luz} />
          <stop offset="60%" stopColor="#b8742f" stopOpacity={0.25 * luz} />
          <stop offset="100%" stopColor="#1a1410" stopOpacity={0.9} />
        </radialGradient>
        <linearGradient id="moMetal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6b707a" />
          <stop offset="100%" stopColor="#3c4048" />
        </linearGradient>
        <pattern id={AGUJEROS} width={9} height={9} patternUnits="userSpaceOnUse">
          <circle cx={4.5} cy={4.5} r={2.3} fill="#0a0b0d" />
        </pattern>
        <linearGradient id="moReflejo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.14} />
          <stop offset="45%" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <filter id="moSombra" x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="20" dy="40" stdDeviation="26" floodColor="#000" floodOpacity="0.55" />
        </filter>
        <clipPath id="moVentana">
          <rect x={V.x0} y={V.y0} width={V.x1 - V.x0} height={V.y1 - V.y0} rx={14} />
        </clipPath>
      </defs>

      <g transform={`translate(${u.x} ${u.y}) scale(${u.escala})`}>
        {/* Cuerpo con volumen */}
        <rect x={-W / 2} y={-H / 2} width={W} height={H} rx={28} fill="#000" filter="url(#moSombra)" opacity={0.6} />
        <path d={caraSuperior} fill="#555a64" />
        <path d={caraLateral} fill="#23262b" />
        <rect x={-W / 2} y={-H / 2} width={W} height={H} rx={28} fill="url(#moFrente)" stroke="rgba(255,255,255,0.12)" strokeWidth={2} />

        {!corte ? (
          <>
            {/* Puerta con ventana transparente */}
            <rect x={P.x0} y={P.y0} width={P.x1 - P.x0} height={P.y1 - P.y0} rx={18} fill="#25282e" stroke="rgba(255,255,255,0.08)" />
            <g clipPath="url(#moVentana)">
              <rect x={V.x0} y={V.y0} width={V.x1 - V.x0} height={V.y1 - V.y0} fill="#2a2018" />
              <rect x={V.x0} y={V.y0} width={V.x1 - V.x0} height={V.y1 - V.y0} fill="url(#moLuz)" />
              <rect x={V.x0} y={V.y1 - 70} width={V.x1 - V.x0} height={70} fill="rgba(0,0,0,0.25)" />
              <PlatoConComida cx={MO.comidaFrente[0]} cy={MO.comidaFrente[1]} rot={rot} temp={tempComida} />
              <rect x={V.x0} y={V.y0} width={V.x1 - V.x0} height={V.y1 - V.y0} fill={`url(#${AGUJEROS})`} opacity={0.32} />
              <rect x={V.x0} y={V.y0} width={V.x1 - V.x0} height={V.y1 - V.y0} fill="url(#moReflejo)" />
            </g>
            <rect x={V.x0} y={V.y0} width={V.x1 - V.x0} height={V.y1 - V.y0} rx={14} fill="none" stroke="#111215" strokeWidth={4} />
            <rect x={148} y={-120} width={14} height={240} rx={7} fill="#5d626c" />
          </>
        ) : (
          <>
            {/* Corte: sin puerta, se ve la cavidad metálica */}
            <rect x={P.x0} y={P.y0} width={P.x1 - P.x0} height={P.y1 - P.y0} rx={10} fill="#16171a" />
            <rect x={P.x0 + fondo.dx} y={P.y0 + fondo.dy + 40} width={P.x1 - P.x0 - fondo.dx} height={P.y1 - P.y0 - 40} fill="url(#moMetal)" opacity={0.5} />
            <path
              d={`M${P.x0},${P.y0} L${P.x0 + fondo.dx},${P.y0 + fondo.dy + 40} L${P.x0 + fondo.dx},${P.y1 + fondo.dy} L${P.x0},${P.y1} Z`}
              fill="#4a4e57"
            />
            <path
              d={`M${P.x0},${P.y1} L${P.x0 + fondo.dx},${P.y1 + fondo.dy} L${P.x1},${P.y1 + fondo.dy} L${P.x1},${P.y1} Z`}
              fill="#3a3d44"
            />
            <rect x={P.x0} y={P.y0} width={P.x1 - P.x0} height={P.y1 - P.y0} fill="url(#moLuz)" opacity={0.7} />
            <PlatoConComida cx={MO.comidaCorte[0]} cy={MO.comidaCorte[1]} rot={rot} temp={tempComida} />

            {/* Ondas que rebotan en las paredes */}
            {ondas > 0
              ? [-2.6, 2.8].map((a, i) => {
                  const pts = rebotes(MO.salida, a, caja, 2600);
                  const largoVisible = 120 + ondas * 1000;
                  const recorte: [number, number][] = [];
                  let acum = 0;
                  for (let k = 1; k < pts.length; k++) {
                    const l = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]);
                    if (k === 1) recorte.push(pts[0]);
                    if (acum + l > largoVisible) {
                      const t = (largoVisible - acum) / l;
                      recorte.push([pts[k - 1][0] + (pts[k][0] - pts[k - 1][0]) * t, pts[k - 1][1] + (pts[k][1] - pts[k - 1][1]) * t]);
                      break;
                    }
                    recorte.push(pts[k]);
                    acum += l;
                  }
                  const d = ruta(ondaSobre(recorte, fase + i * 2, 9, 70));
                  return (
                    <g key={i} opacity={Math.min(1, ondas * 2) * (i === 1 ? 0.75 : 1)}>
                      <path d={d} fill="none" stroke={COLOR.verde} strokeWidth={10} strokeOpacity={0.15} strokeLinecap="round" />
                      <path d={d} fill="none" stroke={COLOR.verde} strokeWidth={3.5} strokeLinecap="round" />
                    </g>
                  );
                })
              : null}
            <rect x={P.x0} y={P.y0} width={P.x1 - P.x0} height={P.y1 - P.y0} rx={10} fill="none" stroke="#5d626c" strokeWidth={6} />
          </>
        )}

        {/* Panel de control o compartimento del magnetrón */}
        {!corte ? (
          <g>
            <rect x={panel.x0} y={-188} width={panel.x1 - panel.x0} height={56} rx={8} fill="#0c0d0f" />
            <text x={(panel.x0 + panel.x1) / 2} y={-148} textAnchor="middle" fill={COLOR.verde} fontFamily="'JetBrains Mono', monospace" fontWeight={700} fontSize={34}>
              {display}
            </text>
            {Array.from({ length: 9 }, (_, i) => (
              <rect key={i} x={panel.x0 + 14 + (i % 3) * 50} y={-100 + Math.floor(i / 3) * 40} width={40} height={28} rx={6} fill="#33363d" />
            ))}
            <circle cx={(panel.x0 + panel.x1) / 2} cy={128} r={46} fill="#2a2d33" stroke="#5d626c" strokeWidth={3} />
            <line
              x1={(panel.x0 + panel.x1) / 2}
              y1={128}
              x2={(panel.x0 + panel.x1) / 2 + Math.cos(rot * 0.2 - 1.2) * 34}
              y2={128 + Math.sin(rot * 0.2 - 1.2) * 34}
              stroke="#9aa0a8"
              strokeWidth={5}
              strokeLinecap="round"
            />
          </g>
        ) : (
          <g>
            <rect x={panel.x0 - 6} y={-H / 2 + 22} width={panel.x1 - panel.x0 + 12} height={H - 44} rx={10} fill="#121316" stroke="#5d626c" strokeWidth={3} />
            {/* Guía de ondas hacia la cavidad */}
            <path d={`M${MO.magnetron[0] - 30},${MO.magnetron[1] - 70} V-170 H${MO.salida[0]} V-110 H${MO.magnetron[0] - 60} V${MO.magnetron[1] - 70}`} fill="#2a2d33" stroke={COLOR.verde} strokeOpacity={0.25 + 0.6 * magnetron} strokeWidth={2} />
            {/* Magnetrón: cuerpo con aletas */}
            <g transform={`translate(${MO.magnetron[0]} ${MO.magnetron[1]})`}>
              {Array.from({ length: 7 }, (_, i) => (
                <rect key={i} x={-62} y={-48 + i * 15} width={124} height={7} rx={3} fill="#7a7f89" />
              ))}
              <rect x={-40} y={-62} width={80} height={124} rx={12} fill="#565b65" stroke="rgba(255,255,255,0.15)" />
              <circle cx={0} cy={0} r={22} fill="#1d1f24" stroke={COLOR.verde} strokeWidth={3} strokeOpacity={0.3 + 0.7 * magnetron} />
              <circle cx={0} cy={0} r={30 + 10 * magnetron} fill={COLOR.verde} opacity={0.18 * magnetron} />
              <rect x={-6} y={-92} width={12} height={32} rx={4} fill="#a9aeb6" />
            </g>
          </g>
        )}
        {children}
      </g>
    </svg>
  );
};
