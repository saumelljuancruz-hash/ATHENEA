import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, flotar } from "../../comun/anim";
import { Cortes, vistaCortes } from "../../comun/Cortes";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Planos } from "../../comun/Planos";
import { Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { aPantalla } from "../../comun/vista";
import { CALLE_PRINCIPAL, colorTrafico, HORIZONTALES, MapaCiudad, PuntoCelular, VERTICALES } from "../componentes/Ciudad";
import { TEXTOS } from "../guion-trafico";
import { MarcasTrafico } from "../linea-trafico";

export type PropsNosotros = { marcas: MarcasTrafico["nosotros"]; duracion: number };

const TOTAL = 160;

/** Celulares de la ciudad moviéndose por las calles (los de la calle principal, lentos). */
export const puntosCiudad = (frame: number) =>
  Array.from({ length: TOTAL }, (_, i) => {
    const horizontal = random(`h${i}`) < 0.6;
    const calles = horizontal ? HORIZONTALES : VERTICALES;
    const linea = calles[Math.floor(random(`c${i}`) * calles.length)];
    const principal = horizontal && linea === CALLE_PRINCIPAL;
    const vel = principal ? 0.5 : 2 + 4 * random(`v${i}`);
    const sentido = random(`s${i}`) < 0.5 ? 1 : -1;
    const largo = horizontal ? 1300 : 2100;
    const pos = (((random(`o${i}`) * largo + sentido * vel * frame) % largo) + largo) % largo - 110;
    return { x: horizontal ? pos : linea, y: horizontal ? linea : pos, principal, i };
  });

/** Bolsillo de jean con el celular adentro, mandando su ubicación. */
const Bolsillo: React.FC<{ frame: number }> = ({ frame }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <rect width={1080} height={1920} fill="#25344a" />
    {Array.from({ length: 40 }, (_, k) => (
      <line key={k} x1={-200 + k * 40} y1={0} x2={k * 40 + 300} y2={1920} stroke="#2c3d56" strokeWidth={6} />
    ))}
    <g transform={`translate(540 ${960 + flotar(frame, 140, 8)})`}>
      {[0, 1, 2].map((k) => {
        const a = ((frame + k * 20) % 60) / 60;
        return <circle key={k} cx={0} cy={-330} r={40 + a * 260} fill="none" stroke={COLOR.verde} strokeWidth={5} opacity={1 - a} />;
      })}
      <rect x={-120} y={-380} width={240} height={420} rx={34} fill="#16171a" stroke="#4a4e57" strokeWidth={6} />
      <rect x={-104} y={-364} width={208} height={150} rx={22} fill={COLOR.verde} opacity={0.25 + 0.15 * Math.sin(frame / 6)} />
      <path d="M -300 -180 L 300 -180 L 270 260 Q 0 360 -270 260 Z" fill="#2f4a6e" stroke="#f0b35a" strokeWidth={6} strokeDasharray="18 12" />
    </g>
  </svg>
);

export const Nosotros: React.FC<PropsNosotros> = ({ marcas: m, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.nosotros;
  const s = (seg: number) => seg * fps;

  const visibles = Math.round(interpolate(frame, [0, m.nosotros + s(0.5)], [20, TOTAL], { extrapolateRight: "clamp" }));
  const rojo = entre(frame, m.rojo - s(0.1), m.rojo + s(0.4));
  const puntos = puntosCiudad(frame + 600).slice(0, visibles);
  const cortes = [
    { desde: 0, zoom: 1.3, foco: [540, CALLE_PRINCIPAL] as [number, number] },
    { desde: m.rojo, zoom: 2, foco: [540, CALLE_PRINCIPAL] as [number, number] },
    { desde: m.nosotros, zoom: 0.92, foco: [540, 1000] as [number, number] },
  ];
  const vista = vistaCortes(frame, cortes);
  const vos = puntos.find((p) => !p.principal && p.x > 250 && p.x < 800 && p.y > 600 && p.y < 1300) ?? puntos[0];

  const mapa = (
    <Cortes cortes={cortes}>
      <MapaCiudad frame={frame} rojo={1} otras={0.55}>
        {puntos.map((p) => (
          <PuntoCelular key={p.i} x={p.x} y={p.y} frame={frame} r={p.principal ? 9 : 7} color={p.principal ? COLOR.rojo : colorTrafico(0.25)} fase={p.i} />
        ))}
        <circle cx={540} cy={CALLE_PRINCIPAL} r={140 + 20 * Math.sin(frame / 6)} fill="none" stroke={COLOR.rojo} strokeWidth={6} opacity={rojo * (1 - entre(frame, m.nosotros, m.nosotros + 10))} />
      </MapaCiudad>
    </Cortes>
  );

  return (
    <Escena name="Nosotros">
      <Sfx efecto="ping" desde={m.rojo} volumen={0.25} />
      <Sfx efecto="burbujeo" desde={m.nosotros} volumen={0.25} />
      <Sfx efecto="tap" desde={m.bolsillo} volumen={0.4} />
      <Planos
        planos={[
          { desde: 0, contenido: mapa },
          { desde: m.bolsillo - s(0.1), contenido: <Bolsillo frame={frame} /> },
        ]}
      />
      <AbsoluteFill style={{ opacity: frame < m.bolsillo - s(0.1) ? 1 : 0 }}>
        <HudEtiqueta ancla={aPantalla([vos.x, vos.y], vista)} caja={{ x: 120, y: 560 }} texto={T.vos} color={COLOR.verde} aparece={m.nosotros + s(0.2)} tamano={28} />
      </AbsoluteFill>
      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={visibles} color={COLOR.verde} aparece={s(0.2)} sale={duracion} />
    </Escena>
  );
};
