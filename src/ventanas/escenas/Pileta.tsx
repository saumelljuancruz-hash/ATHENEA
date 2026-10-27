import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { entre } from "../../comun/anim";
import { Cortes } from "../../comun/Cortes";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Planos } from "../../comun/Planos";
import { Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { Fuselaje, Manometro, Pileta as Tanque } from "../componentes/Prueba";
import { Ventanilla } from "../componentes/Ventana";
import { DATOS, TEXTOS } from "../guion-ventanas";
import { MarcasVentanas } from "../linea-ventanas";

export type PropsPileta = { marcas: MarcasVentanas["pileta"]; duracion: number };

const ESQUINA = { x: 540 + 160, y: 900 - 200 };

export const Pileta: React.FC<PropsPileta> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.pileta;
  const s = (seg: number) => seg * fps;

  const baja = entre(frame, 0, m.pileta, Easing.inOut(Easing.cubic));
  const agua = entre(frame, m.pileta - s(0.2), m.pileta + s(1.2));
  // Cada ciclo infla y desinfla el fuselaje; con "miles de veces" el ritmo se acelera.
  const fase = interpolate(frame, [m.inflaron, m.miles, m.grieta], [0, 3, 40], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const infla = frame >= m.inflaron ? 0.5 - 0.5 * Math.cos(fase * 2 * Math.PI) : 0;
  const ciclos = Math.round(interpolate(frame, [m.miles, m.grieta], [3, DATOS.ciclos], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }));
  const grieta = entre(frame, m.grieta - s(0.1), m.grieta + s(1.2));

  const tanque = (
    <Tanque agua={agua} frame={frame}>
      <Fuselaje x={540} y={interpolate(baja, [0, 1], [700, 980])} largo={860} alto={240} infla={infla} grieta={grieta} />
      <Manometro x={890} y={440} valor={0.2 + 0.7 * infla} />
    </Tanque>
  );

  const cerca = (
    <Cortes
      cortes={[
        { desde: m.grieta - s(0.1), zoom: 1.2, foco: [540, 900] },
        { desde: m.ventana, zoom: 2.1, foco: [ESQUINA.x + 20, ESQUINA.y - 10] },
      ]}
    >
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <rect width={1080} height={1920} fill="#1f3550" />
        <Ventanilla x={540} y={900} ancho={320} alto={400} redondez={0} grieta={grieta} tension={grieta} />
      </svg>
    </Cortes>
  );

  return (
    <Escena name="Pileta">
      <Sfx efecto="burbujeo" desde={m.pileta} volumen={0.3} />
      <Sfx efecto="estirar" desde={m.inflaron} volumen={0.25} />
      <Sfx efecto="motor" desde={m.miles} volumen={0.12} />
      <Sfx efecto="estirar" desde={m.grieta} volumen={0.5} />
      <Planos
        planos={[
          { desde: 0, contenido: <AbsoluteFill style={{ scale: "1.05" }}>{tanque}</AbsoluteFill> },
          { desde: m.inflaron - s(0.1), contenido: <AbsoluteFill style={{ scale: "1.4", transformOrigin: "50% 52%" }}>{tanque}</AbsoluteFill> },
          { desde: m.miles - s(0.1), contenido: <AbsoluteFill style={{ scale: String(interpolate(frame, [m.miles, m.grieta], [1, 1.12])) }}>{tanque}</AbsoluteFill> },
          { desde: m.grieta - s(0.1), contenido: cerca },
        ]}
      />
      <AbsoluteFill style={{ opacity: frame < m.grieta - s(0.1) ? 1 : 0 }}>
        <HudEtiqueta ancla={{ x: 820, y: 470 }} caja={{ x: 420, y: 560 }} lado="izquierda" texto={T.presion} color={COLOR.naranja} aparece={m.inflaron + s(0.2)} tamano={26} />
      </AbsoluteFill>
      <HudEtiqueta ancla={{ x: 560, y: 860 }} caja={{ x: 110, y: 560 }} texto={T.grieta} color={COLOR.rojo} aparece={m.ventana + s(0.2)} tamano={30} />
      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={ciclos * (frame >= m.inflaron ? 1 : 0)} color={COLOR.naranja} aparece={m.inflaron} />
    </Escena>
  );
};
