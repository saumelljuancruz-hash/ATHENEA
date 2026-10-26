import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ENTRA_SALE, entre, flotar } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { Paisaje } from "../../cielo/componentes/Paisaje";
import { Anillos, AvionLateral, Torre } from "../componentes/Vuelo";
import { DATOS, TEXTOS } from "../guion-modoavion";
import { MarcasModoAvion } from "../linea-modoavion";

export type PropsAntenas = { marcas: MarcasModoAvion["antenas"]; duracion: number };

const HORIZONTE = 1080;
const TORRES = [
  { x: 130, y: HORIZONTE + 150 },
  { x: 420, y: HORIZONTE + 110 },
  { x: 700, y: HORIZONTE + 170 },
];

/** Router de wifi de la cabina con ondas que quedan adentro del avión. */
const RouterWifi: React.FC<{ x: number; y: number; frame: number; aparece: number }> = ({ x, y, frame, aparece }) => (
  <g opacity={aparece} transform={`translate(${x} ${y})`}>
    {[0, 1, 2].map((k) => {
      const a = ((frame + k * 12) % 36) / 36;
      return (
        <path
          key={k}
          d={`M ${-30 - a * 150} ${-a * 30} A ${30 + a * 150} ${30 + a * 150} 0 0 1 ${30 + a * 150} ${-a * 30}`}
          fill="none"
          stroke={COLOR.verde}
          strokeWidth={4}
          opacity={1 - a}
        />
      );
    })}
    <rect x={-26} y={-8} width={52} height={22} rx={6} fill="#2a2d33" stroke={COLOR.verde} strokeWidth={2} />
    <circle cx={-12} cy={3} r={3} fill={COLOR.verde} opacity={0.5 + 0.5 * Math.sin(frame / 4)} />
  </g>
);

export const Antenas: React.FC<PropsAntenas> = ({ marcas: m, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.antenas;
  const s = (seg: number) => seg * fps;

  const prenden = entre(frame, m.cientos - s(0.2), m.tierra - s(0.4));
  const llegan = entre(frame, m.tierra - s(0.3), m.tierra + s(0.6));
  const ruido = entre(frame, m.ruido - s(0.2), m.ruido + s(0.4));
  const wifi = entre(frame, m.wifi - s(0.3), m.wifi + s(0.5), ENTRA_SALE);
  // Con el wifi del avión, los celulares dejan de buscar antenas.
  const buscan = prenden * (1 - wifi);
  const saturada = llegan * (1 - wifi);
  const zoom = interpolate(frame, [0, duracion], [1, 1.06]);
  const avion = { x: 520, y: 470 + flotar(frame, 150, 8) };

  return (
    <Escena name="Antenas">
      <Sfx efecto="pop" desde={m.cientos} volumen={0.2} />
      <Sfx efecto="zumbido" desde={m.tierra} volumen={0.18} />
      <Sfx efecto="brillo" desde={m.wifi} volumen={0.3} />
      <AbsoluteFill style={{ scale: String(zoom) }}>
        <Paisaje hora={0.12} saturacion={0.7} sol={{ x: 920, y: 240 }} frame={frame} horizonte={HORIZONTE} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {/* Muchos celulares buscando a la vez: un anillo por fila de asientos */}
          {Array.from({ length: 7 }, (_, k) => (
            <Anillos
              key={k}
              x={avion.x - 220 + k * 72}
              y={avion.y + 40}
              frame={frame}
              intensidad={buscan * (0.5 + 0.5 * llegan)}
              alcance={250 + 420 * llegan}
              periodo={34}
              desfase={k * 7}
              color={saturada > 0.5 ? COLOR.rojo : COLOR.verde}
            />
          ))}
          {TORRES.map((t, k) => (
            <Torre key={k} x={t.x + (saturada > 0.5 ? Math.sin(frame * 1.7 + k) * 2 * ruido : 0)} y={t.y} escala={0.9} frame={frame} saturada={saturada} recibe={buscan * llegan} />
          ))}
          <AvionLateral x={avion.x} y={avion.y} escala={1.08} inclinacion={-2} corte={1} celulares={prenden} frame={frame}>
            <RouterWifi x={0} y={-22} frame={frame} aparece={wifi} />
          </AvionLateral>
        </svg>
      </AbsoluteFill>

      <AbsoluteFill>
        <HudEtiqueta ancla={{ x: TORRES[1].x, y: TORRES[1].y - 190 }} caja={{ x: TORRES[1].x + 60, y: TORRES[1].y - 320 }} texto={T.saturada} color={COLOR.rojo} aparece={m.tierra + s(0.3)} desaparece={m.wifi} tamano={24} />
        <HudEtiqueta ancla={{ x: avion.x, y: avion.y - 30 }} caja={{ x: 280, y: avion.y + 230 }} texto={T.wifi} color={COLOR.verde} aparece={m.wifi + s(0.2)} tamano={24} />
      </AbsoluteFill>

      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={DATOS.pasajeros * buscan} color={saturada > 0.5 ? COLOR.rojo : COLOR.verde} aparece={m.cientos - s(0.2)} />
    </Escena>
  );
};
