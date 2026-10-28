import React from "react";
import { COLOR } from "../tema";

/** Tonos de piel y de pelo para variar los personajes. */
export const PIELES = ["#f4caa6", "#e0a77c", "#b97a52", "#7d4f33"];
export const PELOS = ["#2b1d16", "#5a3a22", "#c98a3c", "#1b1b22"];

export type Expresion = "neutra" | "sonrisa" | "sorpresa" | "dolor" | "molestia" | "mareo" | "dormido" | "aburrido";

/** Parpadeo irregular: cada personaje parpadea a su ritmo (GUIA-REELS: animación humanizada). */
const parpadeo = (frame: number, semilla: number) => {
  const periodo = 150 + ((semilla * 53) % 110);
  const f = (frame + semilla * 37) % periodo;
  return f < 3 ? f / 3 : f < 7 ? 1 - (f - 3) / 4 : 0;
};

/**
 * Cabeza de frente (estilo ilustración plana): cara, orejas, pelo, ojos con parpadeo, cejas,
 * nariz, cachetes y boca según la expresión. Centro en (0, 0), ~150 px de alto con escala 1.
 */
export const Cabeza: React.FC<{
  piel?: string;
  pelo?: string;
  peinado?: "corto" | "largo" | "rulos";
  expresion?: Expresion;
  mirada?: [number, number];
  frame: number;
  semilla?: number;
  /** 0..1: tic del párpado izquierdo (para el ojo que late). */
  tic?: number;
}> = ({
  piel = PIELES[1],
  pelo = PELOS[0],
  peinado = "corto",
  expresion = "neutra",
  mirada = [0, 0],
  frame,
  semilla = 1,
  tic = 0,
}) => {
  const cerrado = expresion === "dormido" ? 1 : parpadeo(frame, semilla);
  const ojoAlto = expresion === "sorpresa" ? 18 : expresion === "aburrido" ? 9 : 15;
  const cejaY = expresion === "sorpresa" ? -40 : expresion === "molestia" ? -28 : -32;
  const cejaGiro = expresion === "molestia" || expresion === "dolor" ? 14 : expresion === "mareo" ? -10 : 0;
  const boca = {
    neutra: "M -18 44 Q 0 48 18 44",
    sonrisa: "M -26 38 Q 0 64 26 38",
    sorpresa: "",
    dolor: "M -26 46 Q -13 36 0 46 Q 13 56 26 46",
    molestia: "M -20 50 Q 0 40 20 50",
    mareo: "M -22 48 Q -8 40 4 48 Q 14 54 24 46",
    dormido: "M -12 46 Q 0 50 12 46",
    aburrido: "M -18 48 L 18 46",
  }[expresion];
  const ojo = (lado: -1 | 1) => {
    const cx = lado * 27;
    const t = lado === -1 ? tic : 0;
    const cierre = Math.min(1, cerrado + t * 0.7);
    if (expresion === "mareo") {
      return (
        <path
          key={lado}
          d={`M ${cx - 10} -4 a 10 10 0 1 1 10 10 a 6 6 0 1 1 -6 -6`}
          fill="none"
          stroke="#3a2a22"
          strokeWidth={4}
          strokeLinecap="round"
          transform={`rotate(${frame * 8 * lado} ${cx} 0)`}
        />
      );
    }
    return (
      <g key={lado}>
        <ellipse cx={cx} cy={0} rx={13} ry={ojoAlto} fill="#fff" />
        <circle cx={cx + mirada[0] * 5} cy={2 + mirada[1] * 5} r={7.5} fill="#3a2a22" />
        <circle cx={cx + mirada[0] * 5 + 2.5} cy={-1 + mirada[1] * 5} r={2.4} fill="#fff" />
        {/* Párpado */}
        <rect x={cx - 15} y={-ojoAlto - 2} width={30} height={(2 * ojoAlto + 4) * cierre} fill={piel} />
        {cierre > 0.9 ? (
          <path
            d={`M ${cx - 13} 2 Q ${cx} 9 ${cx + 13} 2`}
            fill="none"
            stroke="#3a2a22"
            strokeWidth={3}
            strokeLinecap="round"
          />
        ) : null}
      </g>
    );
  };
  return (
    <g>
      {peinado === "largo" ? (
        <path
          d="M -78 -20 C -90 -110 90 -110 78 -20 L 84 110 Q 60 130 40 110 L 30 0 L -30 0 L -40 110 Q -60 130 -84 110 Z"
          fill={pelo}
        />
      ) : null}
      <circle cx={-68} cy={8} r={15} fill={piel} />
      <circle cx={68} cy={8} r={15} fill={piel} />
      <ellipse cx={0} cy={0} rx={68} ry={78} fill={piel} />
      {/* Sombra suave de la cara */}
      <ellipse cx={14} cy={10} rx={52} ry={66} fill="#000" opacity={0.05} />
      {peinado === "rulos" ? (
        Array.from({ length: 9 }, (_, k) => (
          <circle key={k} cx={-60 + k * 15} cy={-62 - 10 * Math.sin((k / 8) * Math.PI)} r={22} fill={pelo} />
        ))
      ) : (
        <path
          d="M -70 -10 C -76 -86 -20 -100 6 -92 C 50 -100 80 -70 70 -14 C 60 -40 30 -52 -6 -50 C -34 -50 -56 -40 -70 -10 Z"
          fill={pelo}
        />
      )}
      {/* Cejas */}
      <g stroke={pelo} strokeWidth={6} strokeLinecap="round">
        <line x1={-38} y1={cejaY} x2={-16} y2={cejaY - 2} transform={`rotate(${-cejaGiro} -27 ${cejaY})`} />
        <line x1={16} y1={cejaY - 2} x2={38} y2={cejaY} transform={`rotate(${cejaGiro} 27 ${cejaY})`} />
      </g>
      {ojo(-1)}
      {ojo(1)}
      {/* Nariz y cachetes */}
      <path
        d="M -4 14 Q 2 26 10 22"
        fill="none"
        stroke="#000"
        strokeOpacity={0.18}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <ellipse cx={-42} cy={24} rx={13} ry={8} fill={COLOR.magenta} opacity={0.18} />
      <ellipse cx={42} cy={24} rx={13} ry={8} fill={COLOR.magenta} opacity={0.18} />
      {/* Boca */}
      {expresion === "sorpresa" ? (
        <ellipse cx={0} cy={48} rx={11} ry={14} fill="#7a2f2f" />
      ) : (
        <path
          d={boca}
          fill={expresion === "sonrisa" ? "#7a2f2f" : "none"}
          stroke="#7a2f2f"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </g>
  );
};

export type Pose = "parado" | "sentado";
export type Mano = [number, number];

/** Posiciones de manos típicas (relativas a la cadera). */
export const MANOS = {
  costados: { izq: [-108, -30] as Mano, der: [108, -30] as Mano },
  celular: { izq: [-34, -150] as Mano, der: [34, -150] as Mano },
  cabeza: { izq: [-108, -30] as Mano, der: [40, -372] as Mano },
  pierna: { izq: [-108, -30] as Mano, der: [44, -20] as Mano },
  ojo: { izq: [-108, -30] as Mano, der: [-30, -340] as Mano },
};

/**
 * Personaje de frente (ilustración plana, cálido). Origen en la cadera; la cabeza queda ~330 px arriba.
 * `piernaFloja` 0..1 dobla una pierna (pierna dormida); `tambaleo` lo hace oscilar (mareo).
 */
export const Personaje: React.FC<{
  x: number;
  y: number;
  escala?: number;
  pose?: Pose;
  piel?: string;
  pelo?: string;
  peinado?: "corto" | "largo" | "rulos";
  remera?: string;
  pantalon?: string;
  expresion?: Expresion;
  mirada?: [number, number];
  manos?: { izq: Mano; der: Mano };
  celular?: boolean;
  piernaFloja?: number;
  tambaleo?: number;
  tic?: number;
  frame: number;
  semilla?: number;
}> = ({
  x,
  y,
  escala = 1,
  pose = "parado",
  piel = PIELES[1],
  pelo = PELOS[0],
  peinado = "corto",
  remera = COLOR.azul,
  pantalon = "#3b4a6b",
  expresion = "neutra",
  mirada = [0, 0],
  manos = MANOS.costados,
  celular = false,
  piernaFloja = 0,
  tambaleo = 0,
  tic = 0,
  frame,
  semilla = 1,
}) => {
  // Respiración y balanceo propios de cada personaje.
  const respira = Math.sin(frame / 22 + semilla);
  const giro = tambaleo * (7 * Math.sin(frame / 9 + semilla) + 3 * Math.sin(frame / 4.3));
  const hombros: [Mano, Mano] = [
    [-80, -238 + respira * 1.5],
    [80, -238 + respira * 1.5],
  ];
  const brazo = (h: Mano, m: Mano, lado: number) => {
    const codo: Mano = [(h[0] + m[0]) / 2 + lado * 34, (h[1] + m[1]) / 2 + 26];
    return (
      <g key={lado}>
        <path
          d={`M ${h[0]} ${h[1]} Q ${codo[0]} ${codo[1]} ${m[0]} ${m[1]}`}
          fill="none"
          stroke={remera}
          strokeWidth={40}
          strokeLinecap="round"
        />
        <path
          d={`M ${(codo[0] + m[0]) / 2} ${(codo[1] + m[1]) / 2} L ${m[0]} ${m[1]}`}
          fill="none"
          stroke={piel}
          strokeWidth={30}
          strokeLinecap="round"
        />
        <circle cx={m[0]} cy={m[1]} r={21} fill={piel} />
      </g>
    );
  };
  const piernas =
    pose === "sentado" ? (
      <g>
        {[-1, 1].map((l) => (
          <g key={l}>
            {/* Pantorrilla y pie */}
            <path d={`M ${l * 52} 30 L ${l * 58} 120`} stroke={pantalon} strokeWidth={62} strokeLinecap="round" />
            <ellipse cx={l * 62} cy={150} rx={46} ry={22} fill="#2b2e35" />
            {/* Muslo hacia adelante: la rodilla mira a cámara */}
            <ellipse cx={l * 46} cy={-24} rx={50} ry={52} fill={pantalon} />
            <circle cx={l * 50} cy={14} r={40} fill={pantalon} />
            <circle cx={l * 50} cy={10} r={30} fill="#fff" opacity={0.08} />
          </g>
        ))}
      </g>
    ) : (
      <g>
        {[-1, 1].map((l) => {
          const floja = l === 1 ? piernaFloja : 0;
          return (
            <g key={l} transform={`rotate(${floja * (18 + 6 * Math.sin(frame / 3))} ${l * 40} -50)`}>
              <path
                d={`M ${l * 40} -60 L ${l * (44 + floja * 20)} ${180 - floja * 30}`}
                stroke={pantalon}
                strokeWidth={68}
                strokeLinecap="round"
              />
              <ellipse cx={l * (54 + floja * 24)} cy={212 - floja * 30} rx={48} ry={24} fill="#2b2e35" />
            </g>
          );
        })}
      </g>
    );
  return (
    <g transform={`translate(${x} ${y}) scale(${escala}) rotate(${giro} 0 200)`}>
      {/* Sombra en el piso */}
      <ellipse cx={0} cy={pose === "sentado" ? 172 : 236} rx={150} ry={22} fill="#000" opacity={0.12} />
      {piernas}
      {/* Torso */}
      <path
        d={`M -92 -228 Q -100 -120 -84 -40 Q 0 -10 84 -40 Q 100 -120 92 -228 Q 0 ${-262 + respira * 2} -92 -228 Z`}
        fill={remera}
      />
      <path d="M -30 -246 Q 0 -222 30 -246" fill="none" stroke="#000" strokeOpacity={0.15} strokeWidth={6} />
      {/* Cuello y cabeza */}
      <rect x={-20} y={-270} width={40} height={36} rx={12} fill={piel} />
      <g transform={`translate(0 ${-335 + respira * 2}) rotate(${2 * Math.sin(frame / 31 + semilla)})`}>
        <Cabeza
          piel={piel}
          pelo={pelo}
          peinado={peinado}
          expresion={expresion}
          mirada={mirada}
          frame={frame}
          semilla={semilla}
          tic={tic}
        />
      </g>
      {brazo(hombros[0], manos.izq, -1)}
      {brazo(hombros[1], manos.der, 1)}
      {celular ? (
        <g transform={`translate(0 ${-176 + respira})`}>
          <rect x={-36} y={-56} width={72} height={112} rx={12} fill="#22252b" stroke="#4a4e57" strokeWidth={3} />
          <rect
            x={-29}
            y={-48}
            width={58}
            height={92}
            rx={7}
            fill={COLOR.azul}
            opacity={0.55 + 0.2 * Math.sin(frame / 10)}
          />
          {/* Pulgares */}
          <circle cx={-30} cy={20} r={16} fill={piel} />
          <circle cx={30} cy={20} r={16} fill={piel} />
        </g>
      ) : null}
    </g>
  );
};
