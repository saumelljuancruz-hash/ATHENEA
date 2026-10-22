import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Avion } from "../componentes/Avion";
import { entre, flotar } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta } from "../../comun/Hud";
import { MapaMaqueta } from "../componentes/MapaMaqueta";
import {
  EstadoMapa,
  KM_GRAN_CIRCULO,
  NUEVA_YORK,
  polilineaAPath,
  proyectarPunto,
  puntoEnPolilinea,
  rutaGranCirculo,
  rutaRecta,
  TOKIO,
} from "../geo";
import { TEXTOS } from "../guion-avion";
import { MarcasAvion } from "../linea-avion";
import { COLOR, FUENTE } from "../../comun/tema";
import { acercar, PLACA_PACIFICO } from "./encuadres";

const GC = rutaGranCirculo(140);
const RECTA = rutaRecta(140);

export type PropsHook = { marcas: MarcasAvion["hook"]; duracion: number };

export const Hook: React.FC<PropsHook> = ({ marcas, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.hook;

  // Cámara: arranca levemente cerca y se aleja despacio (siempre en movimiento).
  const zoom = interpolate(frame, [0, duracion], [1.1, 1.0], { easing: Easing.out(Easing.quad) });
  const estado = acercar(PLACA_PACIFICO, zoom, undefined, [flotar(frame, 300, 8), flotar(frame, 260, 6, 40)]);

  const progreso = interpolate(frame, [0, Math.max(60, marcas.corto + 0.4 * fps)], [0.05, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const recta = entre(frame, marcas.vueltaEnorme, marcas.vueltaEnorme + 0.6 * fps);
  const engano = 1 - 0.65 * entre(frame, marcas.curva, marcas.curva + 0.4 * fps);
  const brillo = entre(frame, marcas.curva, marcas.curva + 0.3 * fps);

  return (
    <Escena entrada={false} name="Hook">
      <MapaMaqueta estado={estado}>
        {(p) => {
          const gc = GC.map((pt) => p(pt) as [number, number]);
          const rc = RECTA.map((pt) => p(pt) as [number, number]);
          const avion = puntoEnPolilinea(gc, progreso);
          const recorrido = gc.slice(0, Math.max(2, Math.ceil(progreso * (gc.length - 1)) + 1));
          recorrido[recorrido.length - 1] = [avion.x, avion.y];
          const rectaVisible = rc.slice(0, Math.max(1, Math.ceil(recta * (rc.length - 1)) + 1));
          const ny = p(NUEVA_YORK)!;
          const tk = p(TOKIO)!;
          return (
            <>
              <path d={polilineaAPath(gc)} fill="none" stroke={COLOR.verde} strokeOpacity={0.3} strokeWidth={3} strokeDasharray="2 10" strokeLinecap="round" />
              {recta > 0 ? (
                <path
                  d={polilineaAPath(rectaVisible)}
                  fill="none"
                  stroke={COLOR.rojo}
                  strokeWidth={5}
                  strokeDasharray="16 12"
                  strokeDashoffset={-frame * 0.8}
                  strokeLinecap="round"
                  opacity={engano}
                />
              ) : null}
              <path d={polilineaAPath(recorrido)} fill="none" stroke={COLOR.verde} strokeWidth={14 + 6 * brillo} strokeOpacity={0.18} strokeLinecap="round" />
              <path d={polilineaAPath(recorrido)} fill="none" stroke={COLOR.verde} strokeWidth={6} strokeLinecap="round" />
              {[ny, tk].map(([x, y], i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r={16 + 4 * Math.sin(frame / 10 + i)} fill={COLOR.verde} opacity={0.15} />
                  <circle cx={x} cy={y} r={8} fill="#fff" stroke={COLOR.verde} strokeWidth={3} />
                </g>
              ))}
              <text x={ny[0] - 6} y={ny[1] + 46} textAnchor="end" fill={COLOR.textoSuave} fontFamily={FUENTE.mono} fontSize={22} fontWeight={700}>
                {T.nuevaYork}
              </text>
              <text x={tk[0] + 4} y={tk[1] + 46} fill={COLOR.textoSuave} fontFamily={FUENTE.mono} fontSize={22} fontWeight={700}>
                {T.tokio}
              </text>
              <Avion x={avion.x} y={avion.y} angulo={avion.angulo} tamano={64} />
            </>
          );
        }}
      </MapaMaqueta>
      <Etiquetas marcas={marcas} estado={estado} />
      <ContadorHud
        etiqueta={T.contador}
        valor={KM_GRAN_CIRCULO * progreso}
        unidad="km"
        color={COLOR.verde}
        aparece={8}
      />
    </Escena>
  );
};

const Etiquetas: React.FC<{ marcas: MarcasAvion["hook"]; estado: EstadoMapa }> = ({ marcas, estado }) => {
  // El ancla es el punto medio de la recta roja.
  const medio = rutaRecta(2)[1];
  const p = proyectarPunto(estado, medio);
  return (
    <AbsoluteFill>
      <HudEtiqueta
        ancla={p}
        caja={{ x: p.x - 150, y: p.y + 120 }}
        texto={TEXTOS.hook.pregunta}
        color={COLOR.rojo}
        aparece={marcas.vueltaEnorme + 14}
        desaparece={marcas.corto}
        tamano={26}
      />
    </AbsoluteFill>
  );
};
