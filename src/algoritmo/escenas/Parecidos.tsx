import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { ENTRA_SALE, entre } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE } from "../../comun/tema";
import { Avatar, Persona } from "../componentes/Gente";
import { CATEGORIAS, TEXTOS } from "../guion-algoritmo";
import { MarcasAlgoritmo } from "../linea-algoritmo";

export type PropsParecidos = { marcas: MarcasAlgoritmo["parecidos"]; duracion: number };

/** Tu perfil: cuánto te gusta cada categoría. */
export const PERFIL = [0.88, 0.62, 0.3, 0.74, 0.46, 0.18];

/** Barras del perfil. */
export const BarrasPerfil: React.FC<{ x: number; y: number; ancho: number; paso: number; crecer: number[]; valores?: number[]; etiquetas?: boolean; frame: number }> = ({
  x,
  y,
  ancho,
  paso,
  crecer,
  valores = PERFIL,
  etiquetas = true,
  frame,
}) => (
  <>
    {CATEGORIAS.map((cat, k) => {
      const v = valores[k] * crecer[k] * (1 + 0.02 * Math.sin(frame / 12 + k));
      return (
        <div key={cat} style={{ position: "absolute", left: x, top: y + k * paso, width: ancho, display: "flex", alignItems: "center", gap: 18 }}>
          {etiquetas ? <div style={{ width: 150, fontFamily: FUENTE.mono, fontSize: 26, color: COLOR.textoSuave, textAlign: "right" }}>{cat}</div> : null}
          <div style={{ flex: 1, height: paso * 0.5, borderRadius: 999, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
            <div style={{ width: `${v * 100}%`, height: "100%", borderRadius: 999, background: COLOR.verde, opacity: 0.4 + 0.6 * valores[k] }} />
          </div>
        </div>
      );
    })}
  </>
);

// Grilla de personas.
const COLS = 13;
const FILAS = 12;
const GRILLA = { x: 110, y: 470, paso: 62 };

export const Parecidos: React.FC<PropsParecidos> = ({ marcas: m, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.parecidos;
  const s = (seg: number) => seg * fps;

  const crecer = CATEGORIAS.map((_, k) => entre(frame, m.perfil + k * 5, m.perfil + k * 5 + s(0.6)));
  const achica = entre(frame, m.millones - s(0.6), m.millones, ENTRA_SALE);
  const gente = entre(frame, m.millones - s(0.3), m.millones + s(0.6));
  const parecidas = entre(frame, m.parecidas - s(0.1), m.parecidas + s(0.5));
  const zoom = interpolate(frame, [m.millones, duracion], [1.15, 0.92], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const comparadas = interpolate(frame, [m.millones - s(0.3), duracion], [0, 3_400_000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const yo = { x: 470, y: 1000 };
  const personas = Array.from({ length: COLS * FILAS }, (_, i) => {
    const c = i % COLS;
    const f = Math.floor(i / COLS);
    const x = GRILLA.x + c * GRILLA.paso + (f % 2) * 20;
    const y = GRILLA.y + f * GRILLA.paso;
    const distancia = Math.hypot(x - yo.x, y - yo.y);
    return { x, y, parecida: random(`par${i}`) < 0.1, demora: distancia / 900, i };
  });

  return (
    <Escena name="Parecidos">
      <Sfx efecto="estirar" desde={m.perfil} volumen={0.25} />
      <Sfx efecto="burbujeo" desde={m.millones - s(0.2)} volumen={0.25} />
      <Sfx efecto="brillo" desde={m.parecidas} volumen={0.3} />

      {/* Parte 1: tu perfil */}
      <AbsoluteFill style={{ opacity: 1 - achica, scale: String(1 - 0.3 * achica) }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <Avatar x={470} y={500} r={80} anillo={0.95} />
        </svg>
        <BarrasPerfil x={90} y={680} ancho={760} paso={76} crecer={crecer} frame={frame} />
        <HudEtiqueta ancla={{ x: 560, y: 470 }} caja={{ x: 640, y: 400 }} texto={T.perfil} color={COLOR.verde} aparece={m.perfil + s(0.2)} tamano={24} />
      </AbsoluteFill>

      {/* Parte 2: millones de personas */}
      <AbsoluteFill style={{ opacity: gente, scale: String(zoom), transformOrigin: `${yo.x}px ${yo.y}px` }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {personas.map((p) => {
            const aparece = entre(frame, m.millones - s(0.3) + p.demora * s(0.8), m.millones + s(0.1) + p.demora * s(0.8));
            if (aparece <= 0) return null;
            const destaca = p.parecida ? parecidas : 0;
            return (
              <g key={p.i}>
                {destaca > 0 ? <line x1={yo.x} y1={yo.y} x2={p.x} y2={p.y} stroke={COLOR.verde} strokeWidth={2} opacity={0.35 * destaca} /> : null}
                <Persona
                  x={p.x}
                  y={p.y + Math.sin(frame / 20 + p.i) * 2}
                  r={20 * aparece * (1 + 0.3 * destaca)}
                  color={destaca > 0.5 ? COLOR.verde : "#6b717c"}
                  opacidad={1 - 0.6 * parecidas * (p.parecida ? 0 : 1)}
                />
              </g>
            );
          })}
          <circle cx={yo.x} cy={yo.y} r={64} fill="#16171a" />
          <Avatar x={yo.x} y={yo.y} r={46} anillo={0.95} brillo={parecidas} />
        </svg>
        <HudEtiqueta ancla={{ x: 300, y: 620 }} caja={{ x: 90, y: 420 }} texto={T.parecidos} color={COLOR.verde} aparece={m.parecidas + s(0.3)} tamano={24} />
      </AbsoluteFill>

      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={comparadas} color={COLOR.azul} aparece={m.millones - s(0.3)} />
    </Escena>
  );
};
