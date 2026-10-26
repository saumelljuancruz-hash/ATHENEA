import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ENTRA_SALE, entre, flotar, resorte } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE } from "../../comun/tema";
import { Pin, Satelite } from "../componentes/Espacio";
import { Plano } from "../componentes/Plano";
import { DATOS, TEXTOS } from "../guion-gps";
import { MarcasGps } from "../linea-gps";
import { OBJETIVO } from "./Cuatro";

export type PropsTiempo = { marcas: MarcasGps["tiempo"]; duracion: number };

const formatoHora = (us: number) => {
  const seg = 8 * 3600 + us / 1e6;
  const h = Math.floor(seg / 3600) % 24;
  const m = Math.floor(seg / 60) % 60;
  const s = Math.floor(seg) % 60;
  const micro = Math.floor(us % 1e6);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(micro).padStart(6, "0")}`;
};

/** Tarjeta de reloj digital. */
const Reloj: React.FC<{ y: number; titulo: string; texto: string; color: string; opacidad: number; icono: React.ReactNode; resaltar?: string }> = ({
  y,
  titulo,
  texto,
  color,
  opacidad,
  icono,
  resaltar,
}) => (
  <div
    style={{
      position: "absolute",
      left: 110,
      top: y,
      width: 740,
      opacity: opacidad,
      background: "rgba(8,9,11,0.78)",
      border: `1px solid ${color}88`,
      borderLeft: `5px solid ${color}`,
      borderRadius: 10,
      padding: "18px 24px",
      display: "flex",
      alignItems: "center",
      gap: 26,
      boxShadow: "0 24px 50px rgba(0,0,0,0.45)",
    }}
  >
    <svg width={90} height={90} viewBox="-45 -45 90 90">
      {icono}
    </svg>
    <div>
      <div style={{ fontFamily: FUENTE.mono, fontSize: 22, letterSpacing: 2, color: COLOR.textoSuave }}>{titulo}</div>
      <div style={{ fontFamily: FUENTE.mono, fontSize: 50, fontWeight: 700, color }}>
        {texto.slice(0, -6)}
        <span style={{ color: resaltar ?? color }}>{texto.slice(-6)}</span>
      </div>
    </div>
  </div>
);

export const Tiempo: React.FC<PropsTiempo> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.tiempo;
  const s = (seg: number) => seg * fps;

  // 1) Dos relojes: el del satélite se adelanta. 2) En el mapa, el error crece si no se corrige.
  const relojes = entre(frame, 4, 16) * (1 - entre(frame, m.corregir - s(0.4), m.corregir, ENTRA_SALE));
  const mapa = entre(frame, m.corregir - s(0.2), m.corregir + s(0.3), ENTRA_SALE);
  const adelanto = DATOS.adelantoMicroseg * entre(frame, m.microsegundos - s(0.3), m.microsegundos + s(0.9));
  const base = (frame / fps) * 1e6 * 0.37;
  const deriva = entre(frame, m.corregir + s(0.2), m.diez + s(0.6));
  const errorKm = DATOS.errorKmDia * deriva;
  const corrige = resorte(frame, fps, m.diez + s(0.7), { damping: 14 });
  const fantasma = { x: OBJETIVO.x - 280 * deriva, y: OBJETIVO.y + 260 * deriva };

  return (
    <Escena name="Tiempo">
      <Sfx efecto="bip" desde={m.microsegundos} volumen={0.25} />
      <Sfx efecto="ping" desde={m.diez + s(0.7)} />

      {/* Relojes */}
      <AbsoluteFill style={{ translate: `0px ${flotar(frame, 200, 5)}px` }}>
        <Reloj
          y={520}
          titulo={T.tierra}
          texto={formatoHora(base)}
          color={COLOR.azul}
          opacidad={relojes}
          icono={
            <g>
              <circle r={34} fill="#2a5d8f" />
              <path d="M-20 -10 q10 -14 22 -6 q8 8 18 2 M-26 12 q14 -6 24 4 q8 6 20 0" stroke="#4f8a57" strokeWidth={8} fill="none" strokeLinecap="round" />
              <circle r={34} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
            </g>
          }
        />
        <Reloj
          y={760}
          titulo={T.satelite}
          texto={formatoHora(base + adelanto)}
          color={COLOR.verde}
          resaltar={adelanto > 1 ? COLOR.naranjaCalor : undefined}
          opacidad={relojes * entre(frame, 10, 22)}
          icono={<Satelite x={0} y={0} tamano={40} angulo={-15} />}
        />
        <div
          style={{
            position: "absolute",
            left: 110,
            top: 1000,
            opacity: relojes * entre(frame, m.microsegundos - s(0.2), m.microsegundos + s(0.2)),
            scale: String(resorte(frame, fps, m.microsegundos, { damping: 11 })),
            transformOrigin: "left center",
            fontFamily: FUENTE.inter,
            fontWeight: 800,
            fontSize: 72,
            color: COLOR.naranjaCalor,
          }}
        >
          {T.adelanto}
        </div>
      </AbsoluteFill>

      {/* Mapa: el error crece sin corrección */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: mapa }}>
        <Plano escala={interpolate(mapa, [0, 1], [0.9, 1])} />
        <line x1={OBJETIVO.x} y1={OBJETIVO.y} x2={fantasma.x} y2={fantasma.y} stroke={COLOR.rojo} strokeWidth={4} strokeDasharray="10 10" opacity={deriva > 0 ? 0.9 : 0} />
        {deriva > 0 ? <Pin x={fantasma.x} y={fantasma.y} tamano={52} color={COLOR.rojo} opacidad={0.9} /> : null}
        <Pin x={OBJETIVO.x} y={OBJETIVO.y} tamano={58} pulso={corrige > 0.1 ? ((frame % 40) / 40) : 0} />
      </svg>

      <AbsoluteFill style={{ opacity: mapa }}>
        <HudEtiqueta ancla={{ x: fantasma.x - 10, y: fantasma.y - 40 }} caja={{ x: fantasma.x - 60, y: fantasma.y + 120 }} lado="izquierda" texto={T.error} color={COLOR.rojo} aparece={m.corregir + s(0.6)} tamano={24} />
        <HudEtiqueta ancla={{ x: OBJETIVO.x + 10, y: OBJETIVO.y - 40 }} caja={{ x: OBJETIVO.x + 110, y: OBJETIVO.y - 180 }} texto={`✓ ${T.corregido}`} color={COLOR.verde} aparece={m.diez + s(0.7)} tamano={26} />
      </AbsoluteFill>

      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      {frame < m.corregir ? (
        <ContadorHud etiqueta="DIFERENCIA" prefijo="+" valor={adelanto} unidad="μs" color={COLOR.naranjaCalor} aparece={m.relojes} sale={m.corregir - s(0.3)} />
      ) : (
        <ContadorHud etiqueta={T.contador} valor={errorKm} decimales={1} unidad="km" color={COLOR.rojo} aparece={m.corregir} />
      )}
    </Escena>
  );
};
