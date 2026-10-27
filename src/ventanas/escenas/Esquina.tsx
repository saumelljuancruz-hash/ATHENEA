import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ENTRA_SALE, entre } from "../../comun/anim";
import { Cortes } from "../../comun/Cortes";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Planos } from "../../comun/Planos";
import { Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { Fuerza, Nubes, Ventanilla } from "../componentes/Ventana";
import { TEXTOS } from "../guion-ventanas";
import { MarcasVentanas } from "../linea-ventanas";

export type PropsEsquina = { marcas: MarcasVentanas["esquina"]; duracion: number };

const V = { x: 540, y: 880, ancho: 300, alto: 380 };

/** Fuselaje moderno con una fila de ventanillas redondeadas y nubes. */
export const FilaModerna: React.FC<{ frame: number }> = ({ frame }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <rect width={1080} height={1920} fill="#8f949c" />
    {[0, 1, 2].map((k) => (
      <Ventanilla key={k} x={200 + k * 340} y={880} ancho={190} alto={280} redondez={1} panel={false} cielo={<Nubes x={200 + k * 340} y={880} frame={frame + k * 60} />} />
    ))}
  </svg>
);

export const Esquina: React.FC<PropsEsquina> = ({ marcas: m, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.esquina;
  const s = (seg: number) => seg * fps;

  const fuerza = entre(frame, 0, s(0.6));
  const tension = entre(frame, m.punto - s(0.3), m.punto + s(0.4));
  const redondez = entre(frame, m.curva - s(0.1), m.curva + s(0.7), ENTRA_SALE);
  const hoy = entre(frame, m.hoy, m.hoy + s(0.6));

  const cerca = (
    <Cortes
      cortes={[
        { desde: 0, zoom: 1.1, foco: [V.x, V.y] },
        { desde: m.punto, zoom: 2.2, foco: [V.x - V.ancho / 2, V.y - V.alto / 2] },
        { desde: m.curva, zoom: 1.15, foco: [V.x, V.y] },
        { desde: m.reparte, zoom: 1.6, foco: [V.x - V.ancho / 2 + 40, V.y - V.alto / 2 + 40] },
      ]}
    >
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <rect width={1080} height={1920} fill="#8f949c" />
        <Ventanilla x={V.x} y={V.y} ancho={V.ancho} alto={V.alto} redondez={redondez} tension={tension} panel={false} cielo={<Nubes x={V.x} y={V.y} frame={frame} />} />
        <Fuerza x={V.x} y={V.y} ancho={V.ancho} alto={V.alto} redondez={redondez} frame={frame} intensidad={fuerza} />
      </svg>
    </Cortes>
  );

  return (
    <Escena name="Esquina">
      <Sfx efecto="zumbido" desde={m.punto} volumen={0.2} />
      <Sfx efecto="estirar" desde={m.curva} volumen={0.3} />
      <Sfx efecto="brillo" desde={m.reparte} volumen={0.3} />
      <Sfx efecto="ding" desde={m.hoy + s(0.3)} volumen={0.3} />
      <Planos
        planos={[
          { desde: 0, contenido: cerca },
          { desde: m.hoy - s(0.1), contenido: <FilaModerna frame={frame} /> },
        ]}
      />
      <AbsoluteFill style={{ opacity: frame < m.hoy - s(0.1) ? 1 : 0 }}>
        <HudEtiqueta ancla={{ x: 470, y: 600 }} caja={{ x: 110, y: 470 }} texto={T.punto} color={COLOR.rojo} aparece={m.punto + s(0.2)} desaparece={m.curva} tamano={28} />
        <HudEtiqueta ancla={{ x: 540, y: 640 }} caja={{ x: 110, y: 470 }} texto={T.reparte} color={COLOR.verde} aparece={m.reparte + s(0.2)} tamano={28} />
      </AbsoluteFill>
      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={100 * hoy} unidad="%" color={COLOR.verde} aparece={m.hoy} sale={duracion} />
    </Escena>
  );
};
