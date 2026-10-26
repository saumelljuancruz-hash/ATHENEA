import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ENTRA_SALE, entre, flotar, resorte } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { Cable, Cargador, Pila } from "../componentes/Bateria";
import { TEXTOS } from "../guion-bateria";
import { MarcasBateria } from "../linea-bateria";

export type PropsCorte = { marcas: MarcasBateria["corte"]; duracion: number };

/** Interruptor del chip de carga: `abierto` 0..1 levanta la palanca. */
const Interruptor: React.FC<{ x: number; y: number; abierto: number; frame: number }> = ({ x, y, abierto, frame }) => {
  const color = abierto > 0.5 ? COLOR.rojo : COLOR.verde;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-90} y={-70} width={180} height={140} rx={18} fill="#1d2026" stroke={color} strokeWidth={3} />
      {Array.from({ length: 5 }, (_, k) => (
        <g key={k}>
          <rect x={-78 + k * 36} y={-84} width={12} height={14} fill="#9aa0a8" />
          <rect x={-78 + k * 36} y={70} width={12} height={14} fill="#9aa0a8" />
        </g>
      ))}
      <circle cx={-46} cy={10} r={10} fill={color} />
      <circle cx={46} cy={10} r={10} fill={color} />
      <line x1={-46} y1={10} x2={-46 + 92 * Math.cos((abierto * 35 * Math.PI) / 180)} y2={10 - 92 * Math.sin((abierto * 35 * Math.PI) / 180)} stroke={color} strokeWidth={10} strokeLinecap="round" />
      {abierto > 0.5 ? <circle cx={46} cy={10} r={22 + 10 * Math.sin(frame / 4)} fill="none" stroke={COLOR.rojo} strokeWidth={3} opacity={0.6} /> : null}
    </g>
  );
};

export const Corte: React.FC<PropsCorte> = ({ marcas: m, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.corte;
  const s = (seg: number) => seg * fps;

  const nivel = interpolate(frame, [0, m.cien], [0.9, 1], { extrapolateRight: "clamp" });
  const lleno = resorte(frame, fps, m.cien, { damping: 12 });
  const abierto = entre(frame, m.corta - s(0.15), m.corta + s(0.25), ENTRA_SALE);
  const flujo = 1 - abierto;
  const corriente = interpolate(abierto, [0, 1], [2100, 0]) * (0.97 + 0.03 * Math.sin(frame / 3) * flujo);
  const zoom = interpolate(frame, [0, duracion], [1, 1.05]);
  const pila = { x: 600, y: 680 + flotar(frame, 180, 6) };

  return (
    <Escena name="Corte">
      <Sfx efecto="ding" desde={m.cien} volumen={0.3} />
      <Sfx efecto="tap" desde={m.corta} volumen={0.55} />
      <AbsoluteFill style={{ scale: String(zoom) }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {/* Cargador → chip → pila */}
          <Cable d={`M 170 1010 C 170 1090 250 1100 300 1100`} largo={300} flujo={1} frame={frame} />
          <Cable d={`M 420 1100 C 520 1100 ${pila.x} 1100 ${pila.x} ${pila.y + 330}`} largo={420} flujo={flujo} frame={frame} />
          <Cargador x={170} y={940} escala={1} />
          <Interruptor x={360} y={1090} abierto={abierto} frame={frame} />
          {/* Destello al llegar al 100 % */}
          <circle cx={pila.x} cy={pila.y} r={300 * lleno} fill="none" stroke={COLOR.verde} strokeWidth={4} opacity={(1 - lleno) * 0.9} />
          <Pila x={pila.x} y={pila.y} alto={600} nivel={nivel} frame={frame} cargando={flujo} />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill>
        <HudEtiqueta ancla={{ x: 170, y: 870 }} caja={{ x: 90, y: 780 }} texto={T.corriente} color={COLOR.azul} aparece={s(0.3)} desaparece={m.corta} tamano={22} />
        <HudEtiqueta ancla={{ x: 360, y: 1020 }} caja={{ x: 90, y: 780 }} texto={T.corta} color={COLOR.rojo} aparece={m.corta + s(0.2)} tamano={24} />
      </AbsoluteFill>
      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={corriente} unidad=" mA" color={abierto > 0.5 ? COLOR.rojo : COLOR.azul} aparece={s(0.2)} />
    </Escena>
  );
};
