import React, { useId } from "react";
import { Img, random, staticFile } from "remotion";
import liga from "../liga/equipos.json";
import { TEAL } from "./Props";
import { C, DISPLAY, MONO } from "../theme";

export type Equipo = (typeof liga.equipos)[number];
export const EQUIPOS = liga.equipos as Equipo[];
export const NUESTRO = liga.nuestro;
export const equipo = (id: string) => EQUIPOS.find((e) => e.id === id) as Equipo;

/** Misma cuenta que scripts/liga.mjs: localía extra por la hinchada. */
export const bonusHinchada = (hinchas: number) => 4 * Math.log10(hinchas + 1);
/** Bengalas = compartidos de los videos. Solo de local: +0,05 % de chance de ganar cada una, tope 90 %. */
export const POR_BENGALA = 0.0005;
export const TOPE_BENGALAS = 0.9;

/** Chance de ganarle de local a un rival puntual, con hinchas y bengalas (misma cuenta que scripts/liga.mjs). */
export const chanceLocalVs = (rival: string, hinchas: number, bengalas = 0) => {
  const d = (equipo(NUESTRO).fuerza + 3 + bonusHinchada(hinchas) - equipo(rival).fuerza) / 25;
  const lh = 1.35 * Math.exp(d);
  const la = 1.05 * Math.exp(-d);
  let base = 0;
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < i; j++) {
      base += poisson(lh, i) * poisson(la, j);
    }
  }
  return bengalas > 0 ? Math.max(base, Math.min(TOPE_BENGALAS, base + POR_BENGALA * bengalas)) : base;
};

/** Una bengala encendida: palo, llama roja que titila, chispas y humo. */
export const Bengala: React.FC<{ size: number; frame: number; seed?: number }> = ({ size, frame, seed = 0 }) => {
  const f = frame + seed * 7;
  const flick = 0.85 + 0.15 * Math.sin(f * 1.7) * Math.sin(f * 0.9 + 1);
  return (
    <svg width={size} height={size * 1.6} viewBox="-50 -110 100 160" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`bengala${seed}`} cx="0.5" cy="0.6" r="0.6">
          <stop offset="0" stopColor="#fff3c4" />
          <stop offset="0.35" stopColor="#ff8a3d" />
          <stop offset="1" stopColor="#ff2d2d" stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* Humo */}
      {[0, 1, 2].map((k) => {
        const t = ((f * 0.02 + k / 3) % 1 + 1) % 1;
        return <circle key={k} cx={Math.sin(t * 6 + k) * 14} cy={-40 - t * 70} r={12 + t * 22} fill="#c9a6a6" opacity={(1 - t) * 0.25} />;
      })}
      <circle cx={0} cy={-18} r={46 * flick} fill={`url(#bengala${seed})`} opacity={0.9} />
      <path d={`M -9 -6 C -14 -26 -4 -38 0 ${-52 * flick} C 4 -38 14 -26 9 -6 Z`} fill="#ffe0a3" />
      {new Array(6).fill(0).map((_, k) => {
        const a = k * 1.05 + f * 0.31;
        const r = 18 + ((f * 3 + k * 11) % 26);
        return <circle key={k} cx={Math.cos(a) * r} cy={-16 + Math.sin(a) * r * 0.7} r={2.4} fill="#fff1b8" />;
      })}
      <rect x={-5} y={-8} width={10} height={58} rx={4} fill="#7a1f1f" />
      <rect x={-5} y={-8} width={10} height={10} rx={3} fill="#ff4d3d" />
    </svg>
  );
};

const poisson = (l: number, k: number) => {
  let p = Math.exp(-l);
  for (let i = 1; i <= k; i++) {
    p *= l / i;
  }
  return p;
};

/** Probabilidad promedio de que el club gane de local contra los 9 rivales. */
export const chanceDeLocal = (hinchas: number) => {
  const yo = equipo(NUESTRO);
  const rivales = EQUIPOS.filter((e) => e.id !== NUESTRO);
  const total = rivales.reduce((acc, r) => {
    const d = (yo.fuerza + 3 + bonusHinchada(hinchas) - r.fuerza) / 25;
    const lh = 1.35 * Math.exp(d);
    const la = 1.05 * Math.exp(-d);
    let gana = 0;
    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < i; j++) {
        gana += poisson(lh, i) * poisson(la, j);
      }
    }
    return acc + gana;
  }, 0);
  return total / rivales.length;
};

/** Pelota clásica de gajos, girando. */
export const Ball: React.FC<{ size: number; spin?: number; style?: React.CSSProperties }> = ({ size, spin = 0, style }) => {
  const id = useId();
  const pent = (cx: number, cy: number, r: number, rot: number) =>
    new Array(5)
      .fill(0)
      .map((_, k) => {
        const a = ((rot + k * 72 - 90) * Math.PI) / 180;
        return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
      })
      .join(" ");
  return (
    <svg width={size} height={size} viewBox="-100 -100 200 200" style={{ overflow: "visible", ...style }}>
      <defs>
        <radialGradient id={`${id}g`} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.7" stopColor="#dfe5ee" />
          <stop offset="1" stopColor="#8a94a6" />
        </radialGradient>
        <clipPath id={`${id}c`}>
          <circle r={96} />
        </clipPath>
      </defs>
      <circle r={96} fill={`url(#${id}g)`} stroke="#1a1f2b" strokeWidth={4} />
      <g clipPath={`url(#${id}c)`} transform={`rotate(${spin})`}>
        <polygon points={pent(0, 0, 32, 0)} fill="#141821" />
        {[0, 1, 2, 3, 4].map((k) => {
          const a = ((k * 72 - 90) * Math.PI) / 180;
          const cx = Math.cos(a) * 86;
          const cy = Math.sin(a) * 86;
          const ia = ((k * 72 - 90) * Math.PI) / 180;
          return (
            <g key={k}>
              <line x1={Math.cos(ia) * 32} y1={Math.sin(ia) * 32} x2={cx * 0.72} y2={cy * 0.72} stroke="#141821" strokeWidth={4} />
              <polygon points={pent(cx, cy, 30, 180 + k * 72)} fill="#141821" />
            </g>
          );
        })}
      </g>
      <ellipse cx={-34} cy={-40} rx={30} ry={18} fill="#fff" opacity={0.5} transform="rotate(-30 -34 -40)" />
    </svg>
  );
};

const Icono: React.FC<{ tipo: string; color: string; fondo: string }> = ({ tipo, color, fondo }) => {
  switch (tipo) {
    case "manzana":
      return (
        <g>
          <circle cx={100} cy={94} r={30} fill={color} />
          <path d="M 100 66 C 100 56 104 50 110 46" stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" />
          <ellipse cx={116} cy={56} rx={12} ry={6} fill={color} transform="rotate(-30 116 56)" />
        </g>
      );
    case "explosion":
      return (
        <polygon
          fill={color}
          points={new Array(20)
            .fill(0)
            .map((_, k) => {
              const a = (k / 20) * Math.PI * 2;
              const r = k % 2 ? 18 : 44;
              return `${100 + Math.cos(a) * r},${86 + Math.sin(a) * r}`;
            })
            .join(" ")}
        />
      );
    case "agujero":
      return (
        <g>
          <ellipse cx={100} cy={86} rx={50} ry={16} fill="none" stroke={color} strokeWidth={6} />
          <ellipse cx={100} cy={86} rx={34} ry={10} fill="none" stroke={color} strokeWidth={4} opacity={0.7} />
          <circle cx={100} cy={86} r={18} fill="#000" stroke={color} strokeWidth={3} />
        </g>
      );
    case "atomo":
      return (
        <g fill="none" stroke={color} strokeWidth={5}>
          {[0, 60, 120].map((r) => (
            <ellipse key={r} cx={100} cy={86} rx={46} ry={15} transform={`rotate(${r} 100 86)`} />
          ))}
          <circle cx={100} cy={86} r={8} fill={color} />
        </g>
      );
    case "hoja":
      return (
        <g>
          <path d="M 66 116 C 60 70 96 50 138 52 C 140 94 112 122 66 116 Z" fill={color} />
          <path d="M 70 112 C 92 94 110 76 130 60" stroke={fondo} strokeWidth={4} fill="none" />
        </g>
      );
    case "pi":
      return (
        <text x={100} y={122} textAnchor="middle" fontFamily={DISPLAY} fontWeight={900} fontSize={96} fill={color}>
          π
        </text>
      );
    case "ola":
      return <path d="M 50 104 C 60 60 100 50 120 70 C 104 70 98 86 112 96 C 124 104 140 98 150 90 L 150 112 H 50 Z" fill={color} />;
    case "estrella":
      return (
        <polygon
          fill={color}
          points={new Array(10)
            .fill(0)
            .map((_, k) => {
              const a = ((k * 36 - 90) * Math.PI) / 180;
              const r = k % 2 ? 18 : 44;
              return `${100 + Math.cos(a) * r},${88 + Math.sin(a) * r}`;
            })
            .join(" ")}
        />
      );
    case "iman":
      return (
        <g>
          <path d="M 70 54 V 92 A 30 30 0 0 0 130 92 V 54" fill="none" stroke={color} strokeWidth={18} />
          <rect x={61} y={48} width={18} height={16} fill="#fff" />
          <rect x={121} y={48} width={18} height={16} fill="#fff" />
        </g>
      );
    default:
      return (
        <text x={100} y={128} textAnchor="middle" fontFamily={DISPLAY} fontWeight={900} fontSize={110} fill={color}>
          ?
        </text>
      );
  }
};

/** Escudo de un equipo: forma de escudo, banda con la sigla e ícono. */
export const Crest: React.FC<{ team: Equipo; size: number; blank?: boolean; glow?: number }> = ({ team, size, blank = false, glow = 0 }) => {
  const id = useId();
  const escudo = (team as { escudo?: string }).escudo;
  if (escudo && !blank) {
    // El escudo que eligieron los seguidores, recortado sobre transparente.
    return (
      <div style={{ width: size, height: size * 1.2, display: "flex", alignItems: "center", justifyContent: "center", filter: glow > 0 ? `drop-shadow(0 0 ${24 * glow}px ${team.colores[0]})` : undefined }}>
        <Img src={staticFile(escudo)} style={{ height: size * 1.18, width: "auto" }} />
      </div>
    );
  }
  const [a, b] = team.colores;
  const shield = "M 100 6 L 190 30 V 110 C 190 170 150 210 100 234 C 50 210 10 170 10 110 V 30 Z";
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 200 240" style={{ overflow: "visible", filter: glow > 0 ? `drop-shadow(0 0 ${24 * glow}px ${b})` : undefined }}>
      <defs>
        <clipPath id={`${id}s`}>
          <path d={shield} />
        </clipPath>
      </defs>
      {blank ? (
        <path d={shield} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.5)" strokeWidth={6} strokeDasharray="18 12" />
      ) : (
        <>
          <g clipPath={`url(#${id}s)`}>
            <rect width={200} height={240} fill={a} />
            <rect y={138} width={200} height={44} fill={b} />
          </g>
          <path d={shield} fill="none" stroke={b} strokeWidth={8} />
        </>
      )}
      <Icono tipo={blank ? "pregunta" : team.icono} color={blank ? "rgba(255,255,255,0.7)" : b} fondo={a} />
      {blank ? null : (
        <text x={100} y={171} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={30} fill={a}>
          {team.sigla}
        </text>
      )}
    </svg>
  );
};

/** Orden fijo en que se van ocupando los lugares de cada cancha. */
const orden = (n: number) =>
  new Array(n)
    .fill(0)
    .map((_, i) => i)
    .sort((x, y) => random(`asiento${n}-${x}`) - random(`asiento${n}-${y}`));
const ORDEN: Record<number, number[]> = { 100: orden(100), 1000: orden(1000), 10000: orden(10000) };

/**
 * Cómo es cada tribuna: el potrero tiene 4 tablones de madera de 25 lugares;
 * la cancha de barrio, 10 escalones de cemento de 100.
 */
const TRIBUNA = {
  100: { filas: 4, porFila: 25, paso: 92, inset: 22, escalon: 22, contra: 70, hincha: 1.35, achica: 0.06, bob: 4, madera: true },
  1000: { filas: 10, porFila: 100, paso: 40, inset: 9, escalon: 12, contra: 28, hincha: 0.42, achica: 0.02, bob: 2, madera: false },
} as const;

/** 10.000 butacas en 30 anillos elípticos alrededor de la cancha (vista desde arriba). */
const BUTACAS_ESTADIO: [number, number][] = (() => {
  const anillos = 30;
  const per = (a: number, b: number) => Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
  const radios = new Array(anillos).fill(0).map((_, k) => [262 + k * 8.6, 178 + k * 8.4] as const);
  const total = radios.reduce((acc, [a, b]) => acc + per(a, b), 0);
  const cuantos = radios.map(([a, b]) => Math.round((per(a, b) / total) * 10000));
  cuantos[anillos - 1] += 10000 - cuantos.reduce((x, y) => x + y, 0);
  const out: [number, number][] = [];
  radios.forEach(([a, b], k) => {
    for (let j = 0; j < cuantos[k]; j++) {
      const t = (j / cuantos[k]) * Math.PI * 2 + k * 0.37;
      out.push([540 + Math.cos(t) * a, 450 + Math.sin(t) * b]);
    }
  });
  return out;
})();

const EstadioArriba: React.FC<{ hinchas: number; vos: number; width: number; color: string; bengalas?: number; frame?: number }> = ({ hinchas, vos, width, color, bengalas = 0, frame = 0 }) => {
  const orden = ORDEN[10000];
  const ocupados = new Set(orden.slice(0, Math.max(0, Math.min(10000, Math.floor(hinchas)))));
  const tuyo = orden[Math.min(9999, Math.floor(hinchas))];
  return (
    <svg width={width} height={(width / 1080) * 900} viewBox="0 0 1080 900" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="luzEstadio" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#fff6c8" stopOpacity={0.18} />
          <stop offset="1" stopColor="#fff6c8" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={540} cy={450} rx={530} ry={440} fill="#151a24" stroke="#3a4256" strokeWidth={6} />
      <ellipse cx={540} cy={450} rx={258} ry={174} fill="#1a6a32" />
      <rect x={360} y={335} width={360} height={230} fill="none" stroke="#fff" strokeOpacity={0.6} strokeWidth={3} />
      <line x1={540} y1={335} x2={540} y2={565} stroke="#fff" strokeOpacity={0.6} strokeWidth={3} />
      <circle cx={540} cy={450} r={34} fill="none" stroke="#fff" strokeOpacity={0.6} strokeWidth={3} />
      <rect x={360} y={405} width={40} height={90} fill="none" stroke="#fff" strokeOpacity={0.6} strokeWidth={3} />
      <rect x={680} y={405} width={40} height={90} fill="none" stroke="#fff" strokeOpacity={0.6} strokeWidth={3} />
      {BUTACAS_ESTADIO.map(([x, y], i) => (ocupados.has(i) ? <circle key={i} cx={x} cy={y} r={2.8} fill={color} /> : <circle key={i} cx={x} cy={y} r={2.2} fill="#2e3646" />))}
      {new Array(Math.min(300, Math.floor(bengalas))).fill(0).map((_, k) => {
        // Cada bengala se prende sobre un hincha ocupado, y titila.
        const [x, y] = BUTACAS_ESTADIO[orden[(k * 37) % Math.max(1, Math.min(10000, Math.floor(hinchas)))]];
        const fl = 0.75 + 0.25 * Math.sin(frame * 0.9 + k * 1.3);
        return (
          <g key={`b${k}`}>
            <circle cx={x} cy={y} r={16 * fl} fill="#ff4d2d" opacity={0.35} />
            <circle cx={x} cy={y} r={5} fill="#ffe0a3" />
          </g>
        );
      })}
      {vos > 0 ? (
        <g opacity={vos}>
          <circle cx={BUTACAS_ESTADIO[tuyo][0]} cy={BUTACAS_ESTADIO[tuyo][1]} r={26 * vos} fill={C.yellow} opacity={0.4} />
          <circle cx={BUTACAS_ESTADIO[tuyo][0]} cy={BUTACAS_ESTADIO[tuyo][1]} r={7} fill={C.yellow} />
        </g>
      ) : null}
      {[
        [60, 70],
        [1020, 70],
        [60, 830],
        [1020, 830],
      ].map(([x, y]) => (
        <g key={`${x}${y}`}>
          <rect x={x - 26} y={y - 12} width={52} height={24} rx={5} fill="#3a4256" />
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={x - 14 + k * 14} cy={y} r={5} fill="#fff6c8" />
          ))}
        </g>
      ))}
      <ellipse cx={540} cy={450} rx={540} ry={450} fill="url(#luzEstadio)" />
    </svg>
  );
};

/** La cancha que le toca a una hinchada: potrero (100), barrio (1.000) o estadio (10.000). */
export const capacidadPara = (hinchas: number): 100 | 1000 | 10000 => (hinchas >= 1000 ? 10000 : hinchas >= 100 ? 1000 : 100);

/** Un hincha sentado. */
const Hincha: React.FC<{ x: number; y: number; s: number; color: string; bob: number }> = ({ x, y, s, color, bob }) => (
  <g transform={`translate(${x} ${y - bob}) scale(${s})`}>
    <rect x={-11} y={-26} width={22} height={24} rx={9} fill={color} />
    <circle cx={0} cy={-36} r={10} fill={color} />
  </g>
);

/**
 * La cancha con su tribuna: el potrero (100 lugares, tablones de madera) o la
 * cancha de barrio (1.000, escalones de cemento), con alambrado y un pedazo de
 * cancha. `hinchas` lugares ocupados; `vos` ilumina el lugar siguiente.
 */
export const Potrero: React.FC<{ hinchas: number; vos?: number; frame: number; width?: number; color?: string; capacidad?: 100 | 1000 | 10000; bengalas?: number }> = ({ hinchas, vos = 0, frame, width = 1080, color = TEAL, capacidad = 100, bengalas = 0 }) => {
  if (capacidad === 10000) {
    return <EstadioArriba hinchas={hinchas} vos={vos} width={width} color={color} bengalas={bengalas} frame={frame} />;
  }
  const t = TRIBUNA[capacidad];
  const orden = ORDEN[capacidad];
  const ocupados = new Set(orden.slice(0, Math.max(0, Math.min(capacidad, Math.floor(hinchas)))));
  const tuyo = orden[Math.min(capacidad - 1, Math.floor(hinchas))];
  return (
    <svg width={width} height={(width / 1080) * 900} viewBox="0 0 1080 900" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="pasto" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d6b34" />
          <stop offset="1" stopColor="#0d3a1b" />
        </linearGradient>
        <linearGradient id="madera" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9a6b3f" />
          <stop offset="1" stopColor="#5a3b20" />
        </linearGradient>
        <linearGradient id="cemento" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a93a4" />
          <stop offset="1" stopColor="#5c6475" />
        </linearGradient>
        <radialGradient id="luz" cx="0.5" cy="0" r="1">
          <stop offset="0" stopColor="#fff6c8" stopOpacity={0.35} />
          <stop offset="1" stopColor="#fff6c8" stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* Torre de luz */}
      <rect x={70} y={40} width={10} height={380} fill="#2b3142" />
      <rect x={30} y={20} width={90} height={40} rx={6} fill="#3a4256" />
      {[0, 1, 2].map((k) => (
        <circle key={k} cx={48 + k * 27} cy={40} r={9} fill="#fff6c8" />
      ))}
      <path d="M 75 40 L -100 900 L 700 900 Z" fill="url(#luz)" />
      {/* Tablones: la fila 0 es la de adelante */}
      {new Array(t.filas).fill(0).map((_, k) => {
        const r = t.filas - 1 - k;
        const y = 520 - r * t.paso;
        const inset = r * t.inset;
        const x0 = 70 + inset;
        const w = 940 - inset * 2;
        const vacio = w / t.porFila;
        return (
          <g key={r}>
            <rect x={x0 - 6} y={y} width={w + 12} height={t.escalon} rx={t.madera ? 4 : 2} fill={t.madera ? "url(#madera)" : "url(#cemento)"} />
            <rect x={x0 - 6} y={y + t.escalon} width={w + 12} height={t.contra} fill={t.madera ? "#1a130c" : "#262b36"} opacity={0.85} />
            {t.madera
              ? [0, 0.25, 0.5, 0.75, 1].map((f) => <rect key={f} x={x0 + f * w - 5} y={y + 22} width={10} height={70} fill="#3a2a18" />)
              : null}
            {new Array(t.porFila).fill(0).map((__, c) => {
              const i = r * t.porFila + c;
              const x = x0 + (c + 0.5) * vacio;
              const s = (1 - r * t.achica) * t.hincha;
              if (i === tuyo && vos > 0) {
                return (
                  <g key={c} opacity={vos}>
                    <circle cx={x} cy={y - 30 * t.hincha} r={(t.madera ? 34 : 44) * vos} fill={C.yellow} opacity={t.madera ? 0.3 : 0.4} />
                    <Hincha x={x} y={y} s={s * (t.madera ? 1 + (1 - vos) * 0.8 : 3.4)} color={C.yellow} bob={0} />
                  </g>
                );
              }
              if (ocupados.has(i)) {
                return <Hincha key={c} x={x} y={y} s={s} color={color} bob={Math.max(0, Math.sin(frame * 0.25 + i)) * t.bob} />;
              }
              return <rect key={c} x={x - vacio * 0.3} y={y - 3} width={vacio * 0.6} height={3} rx={1.5} fill={t.madera ? "#c9a06e" : "#b8c0cf"} opacity={0.5} />;
            })}
          </g>
        );
      })}
      {/* Alambrado */}
      <g stroke="#8b95a8" strokeWidth={2} opacity={0.45}>
        {new Array(28).fill(0).map((_, k) => (
          <line key={`a${k}`} x1={20 + k * 40} y1={600} x2={60 + k * 40} y2={680} />
        ))}
        {new Array(28).fill(0).map((_, k) => (
          <line key={`b${k}`} x1={60 + k * 40} y1={600} x2={20 + k * 40} y2={680} />
        ))}
      </g>
      <rect x={0} y={596} width={1080} height={6} fill="#5d6678" />
      {/* Cancha */}
      <path d="M -40 690 H 1120 L 1180 900 H -100 Z" fill="url(#pasto)" />
      <path d="M 120 720 H 960 L 1010 900 M 120 720 L 70 900" stroke="#ffffff" strokeOpacity={0.55} strokeWidth={5} fill="none" />
      <ellipse cx={540} cy={880} rx={170} ry={50} fill="none" stroke="#fff" strokeOpacity={0.55} strokeWidth={5} />
    </svg>
  );
};

/** Ícono de un estadio según el nivel (0 potrero … 3 monumental). */
export const Estadio: React.FC<{ nivel: number; size: number; lit?: number }> = ({ nivel, size, lit = 0 }) => {
  const color = lit > 0.5 ? C.yellow : "rgba(255,255,255,0.55)";
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 200 140" style={{ overflow: "visible", filter: lit > 0 ? `drop-shadow(0 0 ${20 * lit}px ${C.yellow})` : undefined }}>
      {nivel === 0 ? (
        <g>
          <rect x={30} y={96} width={140} height={30} rx={4} fill="#2a7a3d" />
          {[0, 1, 2].map((r) => (
            <rect key={r} x={44 + r * 10} y={78 - r * 18} width={112 - r * 20} height={8} rx={3} fill={color} />
          ))}
        </g>
      ) : (
        <g>
          <ellipse cx={100} cy={84} rx={92} ry={46} fill="none" stroke={color} strokeWidth={nivel >= 2 ? 16 : 0} />
          {nivel === 1 ? (
            <>
              <rect x={22} y={44} width={156} height={14} rx={5} fill={color} />
              <rect x={22} y={110} width={156} height={14} rx={5} fill={color} />
            </>
          ) : null}
          {nivel === 3 ? <ellipse cx={100} cy={70} rx={98} ry={52} fill="none" stroke={color} strokeWidth={10} /> : null}
          <rect x={56} y={66} width={88} height={38} rx={4} fill="#2a7a3d" />
          <line x1={100} y1={66} x2={100} y2={104} stroke="#fff" strokeOpacity={0.6} strokeWidth={2} />
        </g>
      )}
    </svg>
  );
};

/** Camiseta sin escudo, del color que se le pase. */
export const Camiseta: React.FC<{ size: number; color: string; mark?: string }> = ({ size, color, mark = "?" }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
    <path d="M 64 18 L 30 34 L 4 76 L 36 94 L 46 82 V 188 H 154 V 82 L 164 94 L 196 76 L 170 34 L 136 18 C 128 38 72 38 64 18 Z" fill={color} stroke="rgba(255,255,255,0.5)" strokeWidth={5} strokeLinejoin="round" />
    <text x={100} y={136} textAnchor="middle" fontFamily={DISPLAY} fontWeight={900} fontSize={70} fill="rgba(255,255,255,0.85)">
      {mark}
    </text>
  </svg>
);

/** Globito de comentario de Instagram, genérico. */
export const Comentario: React.FC<{ texto: string; likes: number; corona?: boolean; style?: React.CSSProperties }> = ({ texto, likes, corona = false, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 24px", borderRadius: 26, background: "rgba(255,255,255,0.08)", border: `2px solid ${corona ? C.yellow : "rgba(255,255,255,0.16)"}`, boxShadow: corona ? `0 0 40px ${C.yellow}55` : "none", width: 640, ...style }}>
    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #3ee0c0, #2f8cff)", flexShrink: 0 }} />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 26, color: C.dim }}>@seguidor</div>
      <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 36, color: C.white }}>{texto}</div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <svg width={40} height={36} viewBox="0 0 40 36">
        <path d="M 20 34 C 6 24 2 16 2 10 A 9 9 0 0 1 20 6 A 9 9 0 0 1 38 10 C 38 16 34 24 20 34 Z" fill={likes > 0 ? "#ff3b5c" : "none"} stroke={likes > 0 ? "#ff3b5c" : C.dim} strokeWidth={3} />
      </svg>
      <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 24, color: C.dim }}>{likes}</div>
    </div>
  </div>
);

/** Ícono de comentar (globito). */
export const ComentarIcono: React.FC<{ filled: number; size: number }> = ({ filled, size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M 50 10 C 74 10 92 26 92 46 C 92 66 74 82 50 82 C 44 82 38 81 33 79 L 12 90 L 18 70 C 11 63 8 55 8 46 C 8 26 26 10 50 10 Z" fill={filled > 0 ? C.yellow : "transparent"} fillOpacity={filled} stroke={filled > 0.5 ? C.yellow : C.white} strokeWidth={7} strokeLinejoin="round" />
  </svg>
);
