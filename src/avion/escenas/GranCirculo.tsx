import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Avion } from "../componentes/Avion";
import { entre, flotar, formatear } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { MapaMaqueta } from "../componentes/MapaMaqueta";
import {
  EstadoMapa,
  KM_GRAN_CIRCULO,
  KM_RECTA,
  NUEVA_YORK,
  polilineaAPath,
  proyectarPunto,
  puntoEnPolilinea,
  rutaGranCirculo,
  rutaRecta,
  TOKIO,
} from "../geo";
import { DATOS, TEXTOS } from "../guion-avion";
import { MarcasAvion } from "../linea-avion";
import { COLOR } from "../../comun/tema";
import { acercar, PLACA_PACIFICO } from "./encuadres";

export type PropsGranCirculo = { marcas: MarcasAvion["granCirculo"]; duracion: number };

const GC = rutaGranCirculo(140);
const RECTA = rutaRecta(140);
const AHORRO_KM = KM_RECTA - KM_GRAN_CIRCULO;
const AHORRO_H = AHORRO_KM / DATOS.velocidadCrucero;

export const GranCirculo: React.FC<PropsGranCirculo> = ({ marcas, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.granCirculo;

  const estado = acercar(
    PLACA_PACIFICO,
    interpolate(frame, [0, duracion], [1, 1.05]),
    undefined,
    [flotar(frame, 300, 6), flotar(frame, 240, 5)],
  );

  const recta = entre(frame, 4, 4 + 0.5 * fps);
  // Carrera: misma velocidad, el verde llega primero.
  const carrera = interpolate(frame, [0.2 * fps, duracion - 0.25 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const pVerde = carrera;
  const pRojo = carrera * (KM_GRAN_CIRCULO / KM_RECTA);
  const ahorro = entre(frame, marcas.granCirculo, marcas.granCirculo + 1.1 * fps);

  return (
    <Escena name="GranCirculo">
      <MapaMaqueta estado={estado}>
        {(proj) => {
          const gc = GC.map((pt) => proj(pt) as [number, number]);
          const rc = RECTA.map((pt) => proj(pt) as [number, number]);
          const av = puntoEnPolilinea(gc, pVerde);
          const ar = puntoEnPolilinea(rc, pRojo);
          const rectaVisible = rc.slice(0, Math.max(1, Math.ceil(recta * (rc.length - 1)) + 1));
          return (
            <>
              <path d={polilineaAPath(rectaVisible)} fill="none" stroke={COLOR.rojo} strokeWidth={5} strokeDasharray="16 12" strokeDashoffset={-frame * 0.8} strokeLinecap="round" />
              <path d={polilineaAPath(gc)} fill="none" stroke={COLOR.verde} strokeWidth={16} strokeOpacity={0.16 + 0.06 * Math.sin(frame / 8)} strokeLinecap="round" />
              <path d={polilineaAPath(gc)} fill="none" stroke={COLOR.verde} strokeWidth={6} strokeLinecap="round" />
              {[NUEVA_YORK, TOKIO].map((pt, i) => {
                const [x, y] = proj(pt) as [number, number];
                return <circle key={i} cx={x} cy={y} r={8} fill="#fff" stroke={COLOR.verde} strokeWidth={3} />;
              })}
              <Avion x={ar.x} y={ar.y} angulo={ar.angulo} tamano={50} color="#ffb3ad" opacidad={0.85} altura={16} />
              <Avion x={av.x} y={av.y} angulo={av.angulo} tamano={60} />
            </>
          );
        }}
      </MapaMaqueta>

      <Etiquetas estado={estado} marcas={marcas} />
      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud
        etiqueta={T.contador}
        valor={AHORRO_KM * ahorro}
        unidad="km"
        color={COLOR.verde}
        aparece={marcas.granCirculo}
        extra={ahorro > 0.5 ? `≈ ${formatear(AHORRO_H, 1)} ${T.horasSufijo}` : undefined}
      />
    </Escena>
  );
};

const Etiquetas: React.FC<{ estado: EstadoMapa; marcas: MarcasAvion["granCirculo"] }> = ({ estado, marcas }) => {
  const T = TEXTOS.granCirculo;
  const rojo = proyectarPunto(estado, RECTA[55]);
  const pico = proyectarPunto(estado, GC[62]);
  const horas = proyectarPunto(estado, GC[30]);
  const comb = proyectarPunto(estado, GC[105]);
  return (
    <AbsoluteFill>
      <HudEtiqueta ancla={rojo} caja={{ x: rojo.x - 60, y: rojo.y + 120 }} lado="izquierda" texto={T.recta} color={COLOR.rojo} aparece={10} />
      <HudEtiqueta ancla={pico} caja={{ x: pico.x - 60, y: pico.y + 150 }} lado="izquierda" texto={T.curva} color={COLOR.verde} aparece={marcas.granCirculo} />
      <HudEtiqueta ancla={horas} caja={{ x: horas.x - 20, y: horas.y + 230 }} lado="izquierda" texto={T.horas} color={COLOR.verde} aparece={marcas.horas} />
      <HudEtiqueta ancla={comb} caja={{ x: comb.x + 20, y: comb.y + 330 }} texto={T.combustible} color={COLOR.verde} aparece={marcas.combustible} />
    </AbsoluteFill>
  );
};
