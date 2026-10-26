import React from "react";
import { random } from "remotion";
import { MapaMaqueta } from "../../avion/componentes/MapaMaqueta";
import { EstadoMapa, esVisible, proyectarPunto } from "../../avion/geo";
import { COLOR } from "../../comun/tema";

/** Satélite estilizado (cuerpo + paneles solares). Se dibuja dentro de un <svg>. */
export const Satelite: React.FC<{ x: number; y: number; tamano?: number; angulo?: number; opacidad?: number; brillo?: number }> = ({
  x,
  y,
  tamano = 40,
  angulo = 0,
  opacidad = 1,
  brillo = 0,
}) => {
  const s = tamano / 40;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angulo}) scale(${s})`} opacity={opacidad}>
      {brillo > 0 ? <circle cx={0} cy={0} r={34} fill={COLOR.verde} opacity={0.22 * brillo} /> : null}
      {[-1, 1].map((l) => (
        <g key={l}>
          <line x1={l * 9} y1={0} x2={l * 16} y2={0} stroke="#9aa0a8" strokeWidth={2} />
          <rect x={l > 0 ? 16 : -40} y={-9} width={24} height={18} rx={2} fill="#2d4a7a" stroke="#6f8fc4" strokeWidth={1.2} />
          <line x1={l > 0 ? 24 : -32} y1={-9} x2={l > 0 ? 24 : -32} y2={9} stroke="#6f8fc4" strokeWidth={0.8} />
          <line x1={l > 0 ? 32 : -24} y1={-9} x2={l > 0 ? 32 : -24} y2={9} stroke="#6f8fc4" strokeWidth={0.8} />
        </g>
      ))}
      <rect x={-9} y={-11} width={18} height={22} rx={3} fill="#c9cdd4" />
      <rect x={-9} y={-11} width={9} height={22} rx={3} fill="#e8ebef" />
      <line x1={0} y1={11} x2={0} y2={18} stroke="#c9cdd4" strokeWidth={2} />
      <circle cx={0} cy={19} r={3} fill={COLOR.verde} />
    </g>
  );
};

/** Pin de ubicación (el celular). */
export const Pin: React.FC<{ x: number; y: number; tamano?: number; color?: string; pulso?: number; opacidad?: number }> = ({
  x,
  y,
  tamano = 36,
  color = COLOR.verde,
  pulso = 0,
  opacidad = 1,
}) => (
  <g transform={`translate(${x} ${y})`} opacity={opacidad}>
    <ellipse cx={0} cy={2} rx={tamano * 0.35} ry={tamano * 0.12} fill="#000" opacity={0.35} />
    {pulso > 0 ? <circle cx={0} cy={0} r={tamano * (0.4 + pulso)} fill="none" stroke={color} strokeWidth={2} opacity={1 - pulso} /> : null}
    <path
      d={`M0 0 C ${-tamano * 0.15} ${-tamano * 0.35} ${-tamano * 0.42} ${-tamano * 0.55} ${-tamano * 0.42} ${-tamano * 0.82} A ${tamano * 0.42} ${tamano * 0.42} 0 1 1 ${tamano * 0.42} ${-tamano * 0.82} C ${tamano * 0.42} ${-tamano * 0.55} ${tamano * 0.15} ${-tamano * 0.35} 0 0 Z`}
      fill={color}
      stroke="rgba(0,0,0,0.35)"
      strokeWidth={1.5}
    />
    <circle cx={0} cy={-tamano * 0.82} r={tamano * 0.17} fill="#101114" />
  </g>
);

/** Posición en pantalla de un punto del globo (para anclar etiquetas fuera del <svg>). */
export const puntoEnGlobo = (centro: [number, number], R: number, lonCentro: number, latCentro: number, pt: [number, number]) =>
  proyectarPunto({ aplanado: 0, mercator: 1, radioGlobo: 1, escala: R, centro, rotacion: [-lonCentro, -latCentro, 0] }, pt);

export type Orbita = { rx: number; ry: number; giro: number; vel: number; fase: number };

/** Órbitas fijas alrededor del globo (relativas a su radio). */
export const ORBITAS: Orbita[] = [
  { rx: 1.5, ry: 0.42, giro: -22, vel: 0.006, fase: 0.3 },
  { rx: 1.62, ry: 0.5, giro: 28, vel: -0.005, fase: 2.1 },
  { rx: 1.42, ry: 0.55, giro: 72, vel: 0.0055, fase: 4.0 },
  { rx: 1.7, ry: 0.36, giro: -60, vel: -0.0045, fase: 1.2 },
  { rx: 1.55, ry: 0.6, giro: 5, vel: 0.004, fase: 5.1 },
  { rx: 1.66, ry: 0.46, giro: 48, vel: 0.005, fase: 3.3 },
];

/** 31 satélites repartidos en las 6 órbitas. */
export const SATELITES = Array.from({ length: 31 }, (_, i) => ({
  orbita: i % ORBITAS.length,
  fase: (i / 31) * Math.PI * 2 * 5 + random(`sat${i}`) * 0.6,
  aparece: random(`sap${i}`),
}));

export const posicionOrbita = (o: Orbita, ang: number, centro: [number, number], R: number) => {
  const a = (o.giro * Math.PI) / 180;
  const x = o.rx * R * Math.cos(ang);
  const y = o.ry * R * Math.sin(ang);
  return {
    x: centro[0] + x * Math.cos(a) - y * Math.sin(a),
    y: centro[1] + x * Math.sin(a) + y * Math.cos(a),
    /** true si está del lado de atrás del globo. */
    atras: Math.sin(ang) < 0,
  };
};

const elipse = (o: Orbita, centro: [number, number], R: number, mitad: "atras" | "frente") => {
  const pts: string[] = [];
  for (let k = 0; k <= 40; k++) {
    const ang = mitad === "atras" ? Math.PI + (k / 40) * Math.PI : (k / 40) * Math.PI;
    const p = posicionOrbita(o, ang, centro, R);
    pts.push(`${k ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`);
  }
  return pts.join("");
};

/**
 * Globo con órbitas y satélites. Los satélites del lado de atrás se dibujan antes que el globo.
 * `visibles` 0..1 controla cuántos de los 31 satélites aparecen.
 */
export const Espacio: React.FC<{
  frame: number;
  centro: [number, number];
  R: number;
  lonCentro: number;
  latCentro: number;
  visibles?: number;
  /** Índices de satélites que transmiten (anillos) y mandan señal al pin. */
  transmiten?: number[];
  senales?: number;
  ubicacion: [number, number];
  verPin?: number;
  verOrbitas?: number;
  children?: (pin: { x: number; y: number }) => React.ReactNode;
}> = ({ frame, centro, R, lonCentro, latCentro, visibles = 1, transmiten = [], senales = 0, ubicacion, verPin = 1, verOrbitas = 1, children }) => {
  const estado: EstadoMapa = {
    aplanado: 0,
    mercator: 1,
    radioGlobo: 1,
    escala: R,
    centro,
    rotacion: [-lonCentro, -latCentro, 0],
  };
  const pin = proyectarPunto(estado, ubicacion);
  const sats = SATELITES.map((s, i) => {
    const o = ORBITAS[s.orbita];
    const p = posicionOrbita(o, s.fase + frame * o.vel, centro, R);
    const dentroDisco = Math.hypot(p.x - centro[0], p.y - centro[1]) < R;
    return { ...p, i, oculto: p.atras && dentroDisco, visible: s.aparece <= visibles };
  });

  const capaSatelites = (atras: boolean) =>
    sats
      .filter((s) => s.visible && s.atras === atras && !s.oculto)
      .map((s) => {
        const t = transmiten.includes(s.i);
        const anillo = ((frame + s.i * 13) % 50) / 50;
        return (
          <g key={s.i}>
            {t ? <circle cx={s.x} cy={s.y} r={14 + anillo * 70} fill="none" stroke={COLOR.verde} strokeWidth={2} opacity={(1 - anillo) * 0.8} /> : null}
            <Satelite x={s.x} y={s.y} tamano={atras ? 26 : 34} angulo={-15} opacidad={atras ? 0.55 : 1} brillo={t ? 1 : 0} />
          </g>
        );
      });

  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g opacity={verOrbitas * 0.5}>
          {ORBITAS.map((o, k) => (
            <path key={k} d={elipse(o, centro, R, "atras")} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1.2} strokeDasharray="4 6" />
          ))}
        </g>
        {capaSatelites(true)}
      </svg>
      <MapaMaqueta estado={estado} mostrarGrilla />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g opacity={verOrbitas * 0.7}>
          {ORBITAS.map((o, k) => (
            <path key={k} d={elipse(o, centro, R, "frente")} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1.4} strokeDasharray="4 6" />
          ))}
        </g>
        {/* Señales: pulsos que viajan del satélite al celular (el celular no transmite) */}
        {senales > 0
          ? sats
              .filter((s) => s.visible && !s.oculto && transmiten.includes(s.i))
              .map((s) => {
                const u = ((frame * 1.6 + s.i * 17) % 60) / 60;
                return (
                  <g key={s.i} opacity={senales}>
                    <line x1={s.x} y1={s.y} x2={pin.x} y2={pin.y - 30} stroke={COLOR.verde} strokeWidth={1.5} strokeDasharray="3 7" opacity={0.6} />
                    <circle cx={s.x + (pin.x - s.x) * u} cy={s.y + (pin.y - 30 - s.y) * u} r={6} fill={COLOR.verde} />
                    <circle cx={s.x + (pin.x - s.x) * u} cy={s.y + (pin.y - 30 - s.y) * u} r={14} fill={COLOR.verde} opacity={0.2} />
                  </g>
                );
              })
          : null}
        {capaSatelites(false)}
        {esVisible(estado, ubicacion) ? <Pin x={pin.x} y={pin.y} pulso={(frame % 45) / 45} opacidad={verPin} /> : null}
        {children?.(pin)}
      </svg>
    </>
  );
};
