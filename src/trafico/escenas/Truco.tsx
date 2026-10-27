import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { entre } from "../../comun/anim";
import { Cortes, vistaCortes } from "../../comun/Cortes";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { aPantalla } from "../../comun/vista";
import { AutoArriba, CALLE_PRINCIPAL, CarritoArriba, colorTrafico, MapaCiudad, PuntoCelular } from "../componentes/Ciudad";
import { DATOS, TEXTOS } from "../guion-trafico";
import { MarcasTrafico } from "../linea-trafico";

export type PropsTruco = { marcas: MarcasTrafico["truco"]; duracion: number };

const COLORES_AUTOS = ["#e6e8ec", "#4aa3ff", "#ff9a3c", "#9aa0a8", "#ff5a4e", "#c9cdd4", "#3ee0c0"];

export const Truco: React.FC<PropsTruco> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.truco;
  const s = (seg: number) => seg * fps;

  const lento = entre(frame, m.lento - s(0.2), m.lento + s(1.2));
  const velocidad = (f: number) => interpolate(f, [m.lento - s(0.2), m.lento + s(1.2)], [DATOS.velocidadCalle, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Distancia recorrida (px): 50 km/h ≈ 6 px por frame.
  let recorrido = 0;
  for (let f = 0; f < frame; f++) recorrido += (velocidad(f) / DATOS.velocidadCalle) * 6;
  const separacion = interpolate(lento, [0, 1], [230, 104]);

  const fantasma = entre(frame, m.autos, m.autos + s(0.4));
  const celulares = entre(frame, m.celulares - s(0.1), m.celulares + s(0.3));
  const trafico = entre(frame, m.trafico - s(0.2), m.trafico + s(0.6));
  const carrito = entre(frame, m.trafico + s(0.5), m.trafico + s(1));

  const cortes = [
    { desde: 0, zoom: 1.45, foco: [540, CALLE_PRINCIPAL] as [number, number] },
    { desde: m.exacto, zoom: 2.4, foco: [600, CALLE_PRINCIPAL] as [number, number] },
    { desde: m.celulares, zoom: 1.7, foco: [540, CALLE_PRINCIPAL] as [number, number] },
    { desde: m.lento, zoom: 1.35, foco: [540, CALLE_PRINCIPAL] as [number, number] },
    { desde: m.trafico, zoom: 1.0, foco: [540, CALLE_PRINCIPAL + 60] as [number, number] },
  ];
  const vista = vistaCortes(frame, cortes);

  const autos = COLORES_AUTOS.map((color, i) => {
    const x = ((i * separacion + recorrido) % (COLORES_AUTOS.length * separacion)) - 120 + (1080 - COLORES_AUTOS.length * separacion) / 2;
    return { x, color, i };
  });

  return (
    <Escena name="Truco">
      <Sfx efecto="estirar" desde={m.autos} volumen={0.2} />
      <Sfx efecto="ping" desde={m.celulares} volumen={0.3} />
      <Sfx efecto="zumbido" desde={m.trafico} volumen={0.18} />
      <Cortes cortes={cortes}>
        <MapaCiudad frame={frame} otras={null}>
          <rect x={-50} y={CALLE_PRINCIPAL - 9} width={1180} height={18} rx={9} fill={colorTrafico(trafico)} />
          {autos.map((a) => (
            <g key={a.i}>
              <AutoArriba x={a.x} y={CALLE_PRINCIPAL} color={a.color} opacidad={1 - 0.75 * fantasma} />
              {fantasma > 0 ? <AutoArriba x={a.x} y={CALLE_PRINCIPAL} color={a.color} fantasma opacidad={fantasma * (1 - 0.5 * celulares)} /> : null}
              {celulares > 0 ? <PuntoCelular x={a.x} y={CALLE_PRINCIPAL} frame={frame} r={9 * celulares} color={colorTrafico(trafico)} fase={a.i} /> : null}
            </g>
          ))}
          {carrito > 0 ? (
            <g opacity={carrito}>
              <rect x={-50} y={CALLE_PRINCIPAL + 341} width={1180} height={18} rx={9} fill={COLOR.rojo} />
              <CarritoArriba x={300 + (frame - m.trafico) * 0.4} y={CALLE_PRINCIPAL + 350} frame={frame} />
            </g>
          ) : null}
        </MapaCiudad>
      </Cortes>

      <AbsoluteFill>
        <HudEtiqueta ancla={aPantalla([autos[3].x, CALLE_PRINCIPAL - 24], vista)} caja={{ x: 120, y: 620 }} texto={T.autos} color={COLOR.rojo} aparece={m.autos + s(0.2)} desaparece={m.celulares} tamano={26} />
        <HudEtiqueta ancla={aPantalla([autos[4].x, CALLE_PRINCIPAL - 12], vista)} caja={{ x: 120, y: 620 }} texto={T.celulares} color={COLOR.verde} aparece={m.celulares + s(0.2)} desaparece={m.trafico} tamano={26} />
        <HudEtiqueta ancla={aPantalla([540, CALLE_PRINCIPAL - 16], vista)} caja={{ x: 120, y: 640 }} texto={T.lento} color={COLOR.rojo} aparece={m.trafico + s(0.2)} tamano={26} />
      </AbsoluteFill>

      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={velocidad(frame)} unidad=" km/h" color={colorTrafico(lento)} aparece={m.lento - s(0.3)} />
    </Escena>
  );
};
