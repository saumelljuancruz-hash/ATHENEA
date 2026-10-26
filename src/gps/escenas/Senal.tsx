import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ENTRA_SALE, entre, flotar } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE } from "../../comun/tema";
import { Espacio, posicionOrbita, puntoEnGlobo, Satelite, ORBITAS, SATELITES } from "../componentes/Espacio";
import { DATOS, TEXTOS } from "../guion-gps";
import { MarcasGps } from "../linea-gps";

export type PropsSenal = { marcas: MarcasGps["senal"]; duracion: number };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Satélite protagonista (arriba a la derecha) y dos secundarios. */
const HEROE = { x: 770, y: 430 };
const OTROS = [
  { x: 210, y: 470 },
  { x: 520, y: 330 },
];

const reloj = (seg: number) => {
  const h = Math.floor(seg / 3600) % 24;
  const m = Math.floor(seg / 60) % 60;
  const s = Math.floor(seg) % 60;
  const us = Math.floor((seg % 1) * 1e6);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(us).padStart(6, "0")}`;
};

export const Senal: React.FC<PropsSenal> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.senal;
  const s = (seg: number) => seg * fps;

  const aparecen = entre(frame, m.treinta - s(0.2), m.treinta + s(1.3));
  const cambio = entre(frame, m.hora - s(0.45), m.hora + s(0.35), ENTRA_SALE);

  const centro: [number, number] = [505, lerp(860, 1600, cambio) + flotar(frame, 220, 5)];
  const R = lerp(300, 700, cambio);
  const lon = lerp(-62 + frame * 0.03, DATOS.ubicacion[0], cambio);
  const lat = lerp(-48, DATOS.ubicacion[1] - 40, cambio);
  const pin = puntoEnGlobo(centro, R, lon, lat, DATOS.ubicacion);

  // Viaje de la señal del satélite al celular.
  const viaje = entre(frame, m.mide, m.mide + s(1.1));
  const verViaje = entre(frame, m.mide - s(0.2), m.mide);
  const heroe = { x: HEROE.x + flotar(frame, 160, 6), y: HEROE.y + flotar(frame, 200, 5, 40) };
  const destino = { x: pin.x, y: pin.y - 34 };
  const pulso = { x: lerp(heroe.x, destino.x, viaje), y: lerp(heroe.y, destino.y, viaje) };
  const medio = { x: (heroe.x + destino.x) / 2, y: (heroe.y + destino.y) / 2 };
  const etiquetaSat = posicionOrbita(ORBITAS[SATELITES[4].orbita], SATELITES[4].fase + frame * ORBITAS[SATELITES[4].orbita].vel, centro, R);

  return (
    <Escena name="Senal">
      <Sfx efecto="ping" desde={m.hora} />
      <Sfx efecto="ping" desde={m.mide + s(1.1)} volumen={0.3} />
      <Espacio
        frame={frame}
        centro={centro}
        R={R}
        lonCentro={lon}
        latCentro={lat}
        visibles={0.15 + 0.85 * aparecen * (1 - cambio)}
        verOrbitas={1 - cambio}
        transmiten={[2, 9, 14, 20, 27]}
        senales={0.6 * (1 - cambio)}
        ubicacion={DATOS.ubicacion}
      >
        {() =>
          cambio > 0 ? (
            <g opacity={cambio}>
              {OTROS.map((o, k) => (
                <g key={k}>
                  <line x1={o.x} y1={o.y} x2={destino.x} y2={destino.y} stroke={COLOR.verde} strokeWidth={1.5} strokeDasharray="3 8" opacity={0.35} />
                  <Satelite x={o.x + flotar(frame, 180, 4, k * 30)} y={o.y} tamano={44} angulo={-10} opacidad={0.7} />
                </g>
              ))}
              {/* Anillos: el satélite transmite la hora todo el tiempo */}
              {[0, 1, 2].map((k) => {
                const a = ((frame + k * 20) % 60) / 60;
                return <circle key={k} cx={heroe.x} cy={heroe.y} r={30 + a * 160} fill="none" stroke={COLOR.verde} strokeWidth={2} opacity={(1 - a) * 0.7} />;
              })}
              <line x1={heroe.x} y1={heroe.y} x2={destino.x} y2={destino.y} stroke={COLOR.verde} strokeWidth={2} strokeDasharray="6 8" opacity={0.5 * verViaje} />
              {verViaje > 0 && viaje < 1 ? (
                <>
                  <circle cx={pulso.x} cy={pulso.y} r={22} fill={COLOR.verde} opacity={0.25} />
                  <circle cx={pulso.x} cy={pulso.y} r={9} fill={COLOR.verde} />
                </>
              ) : null}
              <Satelite x={heroe.x} y={heroe.y} tamano={96} angulo={-18} brillo={0.6} />
            </g>
          ) : null
        }
      </Espacio>

      {/* Reloj del satélite */}
      <div
        style={{
          position: "absolute",
          left: 400,
          top: 560,
          opacity: entre(frame, m.hora, m.hora + 10),
          background: "rgba(8,9,11,0.8)",
          border: `1px solid ${COLOR.verde}88`,
          borderRadius: 8,
          padding: "10px 16px",
          fontFamily: FUENTE.mono,
          fontSize: 34,
          fontWeight: 700,
          color: COLOR.verde,
          translate: `0px ${flotar(frame, 160, 4)}px`,
        }}
      >
        {reloj(12 * 3600 + 4 * 60 + 7 + frame / fps)}
      </div>

      {/* Cronómetro del viaje */}
      <div
        style={{
          position: "absolute",
          left: medio.x - 230,
          top: medio.y - 30,
          opacity: verViaje,
          fontFamily: FUENTE.mono,
          fontSize: 30,
          fontWeight: 700,
          color: COLOR.texto,
          background: "rgba(8,9,11,0.8)",
          border: `1px solid ${COLOR.azul}88`,
          borderRadius: 6,
          padding: "6px 12px",
        }}
      >
        {interpolate(viaje, [0, 1], [0, DATOS.viajeSeg]).toFixed(3).replace(".", ",")} s
      </div>

      <AbsoluteFill>
        <HudEtiqueta ancla={{ x: etiquetaSat.x, y: etiquetaSat.y }} caja={{ x: etiquetaSat.x + 60, y: etiquetaSat.y - 120 }} texto={T.satelite} color={COLOR.verde} aparece={m.treinta + s(0.6)} desaparece={m.hora - s(0.45)} />
        <HudEtiqueta ancla={{ x: heroe.x - 40, y: heroe.y + 30 }} caja={{ x: heroe.x - 10, y: heroe.y + 220 }} lado="izquierda" texto={T.hora} color={COLOR.verde} aparece={m.hora + s(0.2)} desaparece={m.mide} />
        <HudEtiqueta ancla={medio} caja={{ x: medio.x + 70, y: medio.y + 70 }} texto={T.altura} color={COLOR.azul} aparece={m.distancia} tamano={26} />
      </AbsoluteFill>

      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      {frame < m.mide ? (
        <ContadorHud etiqueta={T.contador} valor={Math.round(DATOS.satelites * aparecen)} color={COLOR.verde} aparece={m.treinta} sale={m.mide - s(0.2)} />
      ) : (
        <ContadorHud etiqueta="DISTANCIA" valor={DATOS.alturaKm * entre(frame, m.distancia, m.distancia + s(0.7))} unidad="km" color={COLOR.azul} aparece={m.mide} />
      )}
    </Escena>
  );
};
