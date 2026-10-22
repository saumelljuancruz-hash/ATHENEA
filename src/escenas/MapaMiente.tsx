import { geoAzimuthalEqualArea, geoCentroid, geoCircle, geoPath } from "d3-geo";
import type { Polygon } from "geojson";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ENTRA_SALE, entre, flotar, resorte } from "../componentes/anim";
import { Escena } from "../componentes/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../componentes/Hud";
import { MapaMaqueta } from "../componentes/MapaMaqueta";
import { Sfx } from "../componentes/Sonido";
import {
  AFRICA,
  anillosAPath,
  crearProyeccion,
  EstadoMapa,
  GROENLANDIA,
  lerp,
  proyectarAnillos,
  proyectarPunto,
  trazar,
} from "../geo";
import { DATOS, TEXTOS } from "../guion-avion";
import { Marcas } from "../linea-de-tiempo";
import { COLOR } from "../tema";

export type PropsMapaMiente = { marcas: Marcas["mapaMiente"]; duracion: number };

const RADIO_GLOBO = 380;
const ESCALA_PLANA = 150;
const LON_CENTRO = -12;
const CENTRO_GREN = geoCentroid(GROENLANDIA) as [number, number];
const CENTRO_AFRICA: [number, number] = [19, 4];
const RATIO = DATOS.areaAfrica / DATOS.areaGroenlandia;
const ANILLO_GREN = (GROENLANDIA.geometry as Polygon).coordinates;

// Círculos de Tissot: mismo tamaño real, distinto tamaño en el mapa.
const TISSOT = [-60, 30].flatMap((lon) =>
  [0, 30, 60].map((lat) => ({ lon, lat, forma: geoCircle().center([lon, lat]).radius(8)() })),
);

export const MapaMiente: React.FC<PropsMapaMiente> = ({ marcas, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.mapaMiente;
  const s = (seg: number) => seg * fps;

  // 1) Globo girando → 2) se abre (equirectangular) → 3) se estira (Mercator) → 4) zoom.
  const giro = interpolate(frame, [0, marcas.plana + s(0.9)], [55, LON_CENTRO], {
    extrapolateRight: "clamp",
    easing: ENTRA_SALE,
  });
  const abrir = entre(frame, marcas.plana, marcas.plana + s(0.9), ENTRA_SALE);
  const estirar = resorte(frame, fps, marcas.estirar, { damping: 8, stiffness: 110 });
  const zoom = entre(frame, marcas.groenlandia - s(0.35), marcas.groenlandia + s(0.6), ENTRA_SALE);

  const base: EstadoMapa = {
    aplanado: abrir,
    mercator: estirar,
    radioGlobo: RADIO_GLOBO / ESCALA_PLANA,
    escala: lerp(ESCALA_PLANA, 250, zoom) * (1 + 0.02 * entre(frame, marcas.groenlandia, duracion)),
    centro: [lerp(540, 540, zoom) + flotar(frame, 280, 6), lerp(800, 1078, zoom) + flotar(frame, 240, 5, 30)],
    rotacion: [-giro, -lerp(28, 0, abrir), 0],
    recorte: null,
  };

  const p = crearProyeccion(base);
  const verTissot =
    entre(frame, marcas.plana + s(0.4), marcas.plana + s(0.8)) *
    (1 - entre(frame, marcas.groenlandia - s(0.1), marcas.groenlandia + s(0.2)));
  const verGren = entre(frame, marcas.groenlandia, marcas.groenlandia + 10);
  const verAfrica = entre(frame, marcas.africa, marcas.africa + 10);

  // Groenlandia "real": proyección equivalente (áreas reales) centrada en Groenlandia,
  // escalada para que su área en pantalla sea 1/14 de la de África.
  const pAfrica = proyectarPunto(base, CENTRO_AFRICA);
  const areaAfrica = geoPath(p).area(AFRICA);
  const ea = geoAzimuthalEqualArea()
    .rotate([-CENTRO_GREN[0], -CENTRO_GREN[1]])
    .scale(base.escala)
    .translate([pAfrica.x, pAfrica.y]);
  const areaEa = geoPath(ea).area(GROENLANDIA);
  ea.scale(base.escala * Math.sqrt(areaAfrica / RATIO / Math.max(1, areaEa)));

  const viaje = resorte(frame, fps, marcas.realidad, { damping: 15, stiffness: 70 });
  const origen = proyectarAnillos((pt) => p(pt), ANILLO_GREN);
  const destino = proyectarAnillos((pt) => ea(pt), ANILLO_GREN);
  const salto = Math.sin(Math.PI * Math.min(1, viaje)) * 140;
  const copia = origen.map((anillo, i) =>
    anillo.map(([x, y], j): [number, number] => [
      lerp(x, destino[i][j][0], viaje),
      lerp(y, destino[i][j][1], viaje) - salto,
    ]),
  );
  const centroCopia = copia[0].reduce((a, [x, y]) => [a[0] + x / copia[0].length, a[1] + y / copia[0].length], [0, 0]);
  const pGren = proyectarPunto(base, CENTRO_GREN);
  const pEcuador = proyectarPunto(base, [30, 0]);
  const p60 = proyectarPunto(base, [30, 60]);
  const pAfricaSur = proyectarPunto(base, [22, -18]);

  return (
    <Escena name="MapaMiente">
      <Sfx efecto="estirar" desde={marcas.plana + 4} volumen={0.25} />
      <Sfx efecto="estirar" desde={marcas.estirar} />
      <Sfx efecto="whoosh" desde={marcas.groenlandia - s(0.35)} volumen={0.2} />
      <MapaMaqueta estado={base}>
        {(proj) => (
          <>
            {verTissot > 0
              ? TISSOT.map((c, i) => (
                  <path
                    key={i}
                    d={trazar(proj, c.forma)}
                    fill={COLOR.azul}
                    fillOpacity={0.35}
                    stroke={COLOR.azul}
                    strokeWidth={2}
                    opacity={verTissot}
                  />
                ))
              : null}
            {verAfrica > 0 ? (
              <path
                d={trazar(proj, AFRICA)}
                fill={COLOR.azul}
                fillOpacity={0.45 + 0.1 * Math.sin(frame / 9)}
                stroke={COLOR.azul}
                strokeWidth={2.5}
                opacity={verAfrica}
              />
            ) : null}
            {verGren > 0 ? (
              <path
                d={trazar(proj, GROENLANDIA)}
                fill={COLOR.rojo}
                fillOpacity={(0.5 + 0.1 * Math.sin(frame / 9)) * (1 - 0.6 * Math.min(1, viaje))}
                stroke={COLOR.rojo}
                strokeWidth={2.5}
                strokeDasharray={viaje > 0.05 ? "8 8" : undefined}
                opacity={verGren}
              />
            ) : null}
            {viaje > 0.001 ? (
              <path d={anillosAPath(copia)} fill={COLOR.rojo} fillOpacity={0.92} stroke="#fff" strokeWidth={2} />
            ) : null}
          </>
        )}
      </MapaMaqueta>

      <AbsoluteFill>
        <HudEtiqueta
          ancla={pEcuador}
          caja={{ x: pEcuador.x - 60, y: pEcuador.y + 80 }}
          lado="izquierda"
          texto={T.ecuador}
          color={COLOR.azul}
          aparece={marcas.estirar + s(0.15)}
          desaparece={marcas.groenlandia - s(0.1)}
        />
        <HudEtiqueta
          ancla={p60}
          caja={{ x: p60.x - 50, y: p60.y - 110 }}
          lado="izquierda"
          texto={T.polo}
          color={COLOR.azul}
          aparece={marcas.estirar + s(0.3)}
          desaparece={marcas.groenlandia - s(0.1)}
        />
        <HudEtiqueta
          ancla={pGren}
          caja={{ x: pGren.x + 150, y: pGren.y - 120 }}
          texto={T.groenlandia}
          color={COLOR.rojo}
          aparece={marcas.groenlandia + 6}
          desaparece={marcas.realidad}
        />
        <HudEtiqueta
          ancla={{ x: pAfrica.x + 40, y: pAfrica.y - 60 }}
          caja={{ x: pAfrica.x + 140, y: pAfrica.y - 230 }}
          texto={T.africa}
          color={COLOR.azul}
          aparece={marcas.africa + 6}
          desaparece={marcas.catorce}
        />
        <HudEtiqueta
          ancla={{ x: centroCopia[0], y: centroCopia[1] }}
          caja={{ x: centroCopia[0] - 130, y: centroCopia[1] - 120 }}
          lado="izquierda"
          texto={T.escalaReal}
          color={COLOR.rojo}
          aparece={marcas.realidad + s(0.55)}
        />
        <HudEtiqueta
          ancla={pAfricaSur}
          caja={{ x: 100, y: pAfricaSur.y + 45 }}
          texto={T.resultado}
          color={COLOR.azul}
          aparece={marcas.catorce}
          tamano={26}
        />
      </AbsoluteFill>

      <TituloSeccion numero={T.seccion} titulo={T.titulo} />

      <ContadorHud
        etiqueta={T.contadorEstirar}
        valor={1 + 3 * Math.min(1.15, estirar)}
        decimales={1}
        unidad="×"
        aparece={marcas.estirar}
        sale={marcas.groenlandia - s(0.2)}
      />
      {frame >= marcas.groenlandia ? (
        <ContadorHud
          etiqueta={T.contadorAfrica}
          valor={DATOS.areaAfrica * entre(frame, marcas.africa, marcas.africa + s(0.9))}
          unidad={T.unidadArea}
          aparece={marcas.africa}
          sale={marcas.catorce - 8}
        />
      ) : null}
      {frame >= marcas.catorce - 4 ? (
        <ContadorHud
          etiqueta={T.contadorRatio}
          valor={interpolate(entre(frame, marcas.catorce, marcas.catorce + s(0.8)), [0, 1], [1, RATIO])}
          decimales={1}
          unidad="×"
          aparece={marcas.catorce}
        />
      ) : null}
    </Escena>
  );
};
