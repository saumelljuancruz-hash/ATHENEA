import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Avion } from "../componentes/Avion";
import { ENTRA_SALE, entre, flotar, resorte } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { MapaMaqueta } from "../componentes/MapaMaqueta";
import { Sfx } from "../../comun/Sonido";
import {
  ALASKA,
  ALASKA_PUNTO,
  esVisible,
  EstadoMapa,
  lerp,
  NUEVA_YORK,
  polilineaAPath,
  proyectarPunto,
  puntoEnPolilinea,
  rutaGranCirculo,
  TOKIO,
  trazar,
} from "../geo";
import { TEXTOS } from "../guion-avion";
import { MarcasAvion } from "../linea-avion";
import { COLOR } from "../../comun/tema";
import { lerpRect, PLACA_PACIFICO } from "./encuadres";

export type PropsPrueba = { marcas: MarcasAvion["prueba"]; duracion: number };

const GC = rutaGranCirculo(140);
const MEDIO = GC[70];
const CENTRO_GLOBO: [number, number] = [540, 790];
const RECORTE_ABIERTO: [[number, number], [number, number]] = [
  [-600, -600],
  [1680, 2520],
];

export const Prueba: React.FC<PropsPrueba> = ({ marcas, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.prueba;
  const s = (seg: number) => seg * fps;

  // Globo girando hasta mostrar el gran círculo; al final se aplana en la placa del Hook.
  const giro = interpolate(frame, [0, marcas.nuevaYork + s(0.3)], [70, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const inicioAplanar = Math.max(marcas.vuela + s(0.3), Math.min(marcas.avion - s(0.15), duracion - s(1.05)));
  const aplanar = entre(frame, inicioAplanar, Math.min(duracion - 2, inicioAplanar + s(1)), ENTRA_SALE);

  const lonCentro = MEDIO[0] + giro + flotar(frame, 260, 3) * (1 - aplanar);
  const latCentro = MEDIO[1] - 6;
  const estado: EstadoMapa = {
    ...PLACA_PACIFICO,
    aplanado: aplanar,
    rotacion: [lerp(-lonCentro, PLACA_PACIFICO.rotacion[0], aplanar), lerp(-latCentro, 0, aplanar), 0],
    centro: [lerp(CENTRO_GLOBO[0], PLACA_PACIFICO.centro[0], aplanar), lerp(CENTRO_GLOBO[1], PLACA_PACIFICO.centro[1], aplanar)],
    recorte: lerpRect(RECORTE_ABIERTO, PLACA_PACIFICO.recorte!, Math.pow(aplanar, 0.6)),
  };

  // Hilo: aparece flojo, colgando, y se tensa con un rebote elástico.
  const dibujarHilo = entre(frame, marcas.hilo, marcas.hilo + s(0.45));
  const tension = resorte(frame, fps, marcas.nuevaYork - s(0.25), { damping: 6, stiffness: 90 });
  const comba = 260 * (1 - tension);
  const vuelo = interpolate(frame, [marcas.vuela, duracion - 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const latMax = Math.max(...GC.slice(0, Math.max(1, Math.round(vuelo * 140)) + 1).map((p) => p[1]));

  const ny = proyectarPunto(estado, NUEVA_YORK);
  const tk = proyectarPunto(estado, TOKIO);
  const ak = proyectarPunto(estado, ALASKA_PUNTO);
  const salenEtiquetas = inicioAplanar;

  return (
    <Escena name="Prueba">
      <Sfx efecto="whoosh" desde={inicioAplanar} volumen={0.22} />
      <Sfx efecto="estirar" desde={marcas.nuevaYork - s(0.25)} volumen={0.22} />
      <MapaMaqueta estado={estado}>
        {(p) => {
          const pts = GC.map((pt, i): [number, number] => {
            const [x, y] = p(pt) as [number, number];
            return [x, y + comba * Math.sin((Math.PI * i) / (GC.length - 1))];
          });
          const visibles = GC.map((pt) => esVisible(estado, pt));
          const hilo = pts.slice(0, Math.max(2, Math.round(dibujarHilo * (pts.length - 1)) + 1));
          const tramos: [number, number][][] = [[]];
          hilo.forEach((pt, i) => {
            if (visibles[i]) tramos[tramos.length - 1].push(pt);
            else if (tramos[tramos.length - 1].length) tramos.push([]);
          });
          const avion = puntoEnPolilinea(pts, vuelo);
          const verAlaska = entre(frame, marcas.alaska, marcas.alaska + 10) * (1 - aplanar);
          return (
            <>
              {verAlaska > 0 ? (
                <path d={trazar(p, ALASKA)} fill={COLOR.azul} fillOpacity={0.4 + 0.1 * Math.sin(frame / 8)} stroke={COLOR.azul} strokeWidth={2} opacity={verAlaska} />
              ) : null}
              {dibujarHilo > 0
                ? tramos.map((tr, i) => (
                    <g key={i}>
                      <path d={polilineaAPath(tr)} fill="none" stroke={COLOR.verde} strokeWidth={14} strokeOpacity={0.16} strokeLinecap="round" />
                      <path d={polilineaAPath(tr)} fill="none" stroke={COLOR.verde} strokeWidth={4.5} strokeLinecap="round" />
                    </g>
                  ))
                : null}
              {dibujarHilo > 0
                ? [NUEVA_YORK, TOKIO].map((pt, i) => {
                    const [x, y] = p(pt) as [number, number];
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r={15 + 4 * Math.sin(frame / 9 + i)} fill={COLOR.verde} opacity={0.18} />
                        <circle cx={x} cy={y} r={8} fill="#fff" stroke={COLOR.verde} strokeWidth={3} />
                      </g>
                    );
                  })
                : null}
              {frame >= marcas.vuela ? <Avion x={avion.x} y={avion.y} angulo={avion.angulo} tamano={60} /> : null}
            </>
          );
        }}
      </MapaMaqueta>

      <AbsoluteFill>
        <HudEtiqueta ancla={ny} caja={{ x: ny.x - 40, y: ny.y + 110 }} lado="izquierda" texto={T.nuevaYork} color={COLOR.azul} aparece={marcas.nuevaYork} desaparece={salenEtiquetas} />
        <HudEtiqueta ancla={tk} caja={{ x: tk.x + 40, y: tk.y + 110 }} texto={T.tokio} color={COLOR.azul} aparece={marcas.tokio} desaparece={salenEtiquetas} />
        <HudEtiqueta ancla={ak} caja={{ x: ak.x + 60, y: ak.y - 150 }} texto={T.alaska} color={COLOR.azul} aparece={marcas.alaska} desaparece={salenEtiquetas} />
      </AbsoluteFill>

      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud
        etiqueta={T.contador}
        valor={frame >= marcas.vuela ? latMax : 0}
        decimales={1}
        unidad="° N"
        color={COLOR.verde}
        aparece={marcas.vuela}
      />
    </Escena>
  );
};
