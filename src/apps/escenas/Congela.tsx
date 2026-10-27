import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ENTRA_SALE, entre } from "../../comun/anim";
import { Cortes } from "../../comun/Cortes";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { Memoria, TarjetaApp } from "../componentes/Apps";
import { APPS, TEXTOS } from "../guion-apps";
import { MarcasApps } from "../linea-apps";

export type PropsCongela = { marcas: MarcasApps["congela"]; duracion: number };

const CHIP = { x: 540, y: 990, ancho: 860, alto: 300 };
const RANURAS = [-300, -100, 100, 300].map((dx) => ({ x: CHIP.x + dx, y: CHIP.y - 10 }));

/** Línea de consumo de energía (tipo osciloscopio): alta con la app abierta, plana dormida. */
const Consumo: React.FC<{ frame: number; nivel: number }> = ({ frame, nivel }) => {
  const d = Array.from({ length: 90 }, (_, i) => {
    const x = 110 + i * 9.5;
    const y = 470 - nivel * (40 + 30 * Math.sin(i * 0.7 + frame * 0.4)) * (0.6 + 0.4 * Math.sin(i * 0.2 + frame * 0.1));
    return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join("");
  return (
    <g>
      <rect x={90} y={370} width={900} height={130} rx={16} fill="rgba(8,9,11,0.8)" stroke="rgba(255,255,255,0.1)" />
      <path d={d} fill="none" stroke={nivel > 0.3 ? COLOR.naranja : COLOR.verde} strokeWidth={4} />
    </g>
  );
};

export const Congela: React.FC<PropsCongela> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.congela;
  const s = (seg: number) => seg * fps;

  // La app abierta se achica y entra en la memoria; al "congela" se congela.
  const guarda = entre(frame, s(0.5), m.congela - s(0.1), ENTRA_SALE);
  const hielo = entre(frame, m.congela - s(0.1), m.congela + s(0.4));
  const destino = RANURAS[1];
  const app = {
    x: interpolate(guarda, [0, 1], [540, destino.x]),
    y: interpolate(guarda, [0, 1], [820, destino.y]),
    ancho: interpolate(guarda, [0, 1], [340, 150]),
    alto: interpolate(guarda, [0, 1], [580, 240]),
  };
  const consumo = 1 - hielo;

  return (
    <Escena name="Congela">
      <Sfx efecto="whoosh" desde={s(0.5)} volumen={0.2} />
      <Sfx efecto="brillo" desde={m.congela} volumen={0.35} />
      <Sfx efecto="pop" desde={m.dormida} volumen={0.2} />
      <Cortes
        cortes={[
          { desde: 0, zoom: 1, foco: [540, 900] },
          { desde: m.congela, zoom: 1.7, foco: [destino.x, destino.y] },
          { desde: m.dormida, zoom: 2.3, foco: [destino.x + 20, destino.y - 40] },
          { desde: m.nada, zoom: 1.05, foco: [540, 820] },
        ]}
      >
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <Memoria x={CHIP.x} y={CHIP.y} ancho={CHIP.ancho} alto={CHIP.alto} />
          {RANURAS.map((r, k) =>
            k === 1 ? null : <TarjetaApp key={k} x={r.x} y={r.y} ancho={150} alto={240} app={APPS[(k + 2) % APPS.length]} frame={frame + k * 20} hielo={1} />,
          )}
          <TarjetaApp x={app.x} y={app.y} ancho={app.ancho} alto={app.alto} app={APPS[0]} frame={frame} hielo={hielo} />
          <Consumo frame={frame} nivel={consumo} />
        </svg>
      </Cortes>
      <AbsoluteFill style={{ opacity: frame < m.congela || frame >= m.nada ? 1 : 0 }}>
        <HudEtiqueta ancla={{ x: CHIP.x - 380, y: CHIP.y + 120 }} caja={{ x: 110, y: 1200 }} texto={T.memoria} color={COLOR.verde} aparece={s(0.8)} tamano={24} />
      </AbsoluteFill>
      <HudEtiqueta ancla={{ x: 540, y: 820 }} caja={{ x: 110, y: 600 }} texto={T.dormida} color="#9fd0ff" aparece={m.dormida + s(0.2)} desaparece={m.nada} tamano={28} />
      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={Math.round(14 * consumo)} unidad="%" prefijo={consumo < 0.5 ? "≈ " : ""} color={consumo < 0.5 ? COLOR.verde : COLOR.naranja} aparece={s(0.2)} />
    </Escena>
  );
};
