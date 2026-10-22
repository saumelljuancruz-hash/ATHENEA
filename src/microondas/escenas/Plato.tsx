import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, flotar } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { colorTemp } from "../componentes/Microondas";
import { TEXTOS } from "../guion-microondas";
import { MarcasMicroondas } from "../linea-microondas";

export type PropsPlato = { marcas: MarcasMicroondas["plato"]; duracion: number };

/** Corte lateral del plato con la comida encima. */
const PLATO = { cx: 505, y: 900, ancho: 780, grosor: 48 };
const COMIDA = { x0: 265, x1: 745, alto: 170 };

export const Plato: React.FC<PropsPlato> = ({ marcas: m, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.plato;
  const s = (seg: number) => seg * fps;

  const calorPlato = entre(frame, m.tocar - s(0.1), duracion);
  const flechas = entre(frame, m.tocar - s(0.15), m.tocar + s(0.2));
  const y = PLATO.y + flotar(frame, 180, 5);
  const { cx, ancho, grosor } = PLATO;
  const izq = cx - ancho / 2;
  const der = cx + ancho / 2;

  // Perfil del plato: base plana con borde que sube.
  const plato = `M${izq},${y - 46} Q${izq + 40},${y} ${izq + 120},${y} L${der - 120},${y} Q${der - 40},${y} ${der},${y - 46}
    L${der - 6},${y - 46 + grosor * 0.5} Q${der - 50},${y + grosor} ${der - 120},${y + grosor} L${izq + 120},${y + grosor} Q${izq + 50},${y + grosor} ${izq + 6},${y - 46 + grosor * 0.5} Z`;
  const comida = `M${COMIDA.x0},${y} C${COMIDA.x0 + 20},${y - COMIDA.alto} ${COMIDA.x1 - 20},${y - COMIDA.alto} ${COMIDA.x1},${y} Z`;

  return (
    <Escena name="Plato">
      <Sfx efecto="ding" desde={duracion - s(0.45)} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="plComida" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff3b2f" />
            <stop offset="100%" stopColor={COLOR.naranjaCalor} />
          </linearGradient>
          <linearGradient id="plCalor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colorTemp(0.25 + 0.45 * calorPlato)} />
            <stop offset={`${Math.round(20 + 70 * calorPlato)}%`} stopColor={colorTemp(0.1 + 0.25 * calorPlato)} />
            <stop offset="100%" stopColor="#c9ced6" />
          </linearGradient>
          <clipPath id="plCorte">
            <rect x={0} y={y - 40} width={1080} height={200} />
          </clipPath>
        </defs>

        {/* Ondas que bajan y atraviesan todo */}
        {[0, 1, 2, 3, 4, 5].map((k) => {
          const x = 200 + k * 125;
          const d = Array.from({ length: 70 }, (_, i) => {
            const yy = 330 + i * 12;
            return `${i ? "L" : "M"}${x + 16 * Math.sin(i * 0.5 - frame * 0.35 + k)},${yy}`;
          }).join("");
          return <path key={k} d={d} fill="none" stroke={COLOR.verde} strokeOpacity={0.55} strokeWidth={3} strokeLinecap="round" />;
        })}

        {/* Sombra y plato */}
        <ellipse cx={cx + 20} cy={y + grosor + 30} rx={ancho * 0.48} ry={22} fill="#000" opacity={0.35} />
        <path d={plato} fill="url(#plCalor)" stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
        <path d={comida} fill="url(#plComida)" stroke="rgba(255,255,255,0.25)" strokeWidth={2} />
        {/* Vapor */}
        {[0, 1, 2].map((k) => (
          <path
            key={k}
            d={`M${400 + k * 100} ${y - 170} q 14 -26 0 -52 q -14 -26 0 -52`}
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth={5}
            strokeLinecap="round"
            transform={`translate(0 ${-((frame * 1.2 + k * 30) % 60)})`}
            opacity={0.6}
          />
        ))}
        {/* Flechas de calor: de la comida al plato */}
        <g opacity={flechas}>
          {Array.from({ length: 6 }, (_, k) => {
            const x = COMIDA.x0 + 50 + k * 68;
            const baja = ((frame * 1.1 + k * 9) % 34) * flechas;
            return (
              <g key={k} transform={`translate(${x} ${y - 22 + baja})`} clipPath="url(#plCorte)">
                <line x1={0} y1={-6} x2={0} y2={22} stroke={COLOR.naranjaCalor} strokeWidth={5} strokeLinecap="round" />
                <path d="M-9 14 L0 28 L9 14" fill="none" stroke={COLOR.naranjaCalor} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
              </g>
            );
          })}
        </g>
      </svg>

      <AbsoluteFill>
        <HudEtiqueta ancla={{ x: der - 130, y: y + grosor / 2 }} caja={{ x: der - 160, y: y + 200 }} lado="izquierda" texto={T.atraviesan} color={COLOR.verde} aparece={m.plato + s(0.2)} desaparece={m.tocar} />
        <HudEtiqueta ancla={{ x: COMIDA.x0 + 120, y: y + 10 }} caja={{ x: 150, y: y + 200 }} texto={T.contacto} color={COLOR.naranjaCalor} aparece={m.tocar + s(0.15)} tamano={26} />
      </AbsoluteFill>

      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={interpolate(calorPlato, [0, 1], [20, 46])} unidad="°C" color={colorTemp(0.2 + 0.5 * calorPlato)} aparece={6} />
    </Escena>
  );
};
