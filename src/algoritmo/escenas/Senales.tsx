import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, flotar, resorte } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, TituloSeccion } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE } from "../../comun/tema";
import { Avatar } from "../componentes/Gente";
import { TEXTOS } from "../guion-algoritmo";
import { MarcasAlgoritmo } from "../linea-algoritmo";

export type PropsSenales = { marcas: MarcasAlgoritmo["senales"]; duracion: number };

const FILA = { x: 90, y: 440, ancho: 520, alto: 118, paso: 150 };
const PERFIL = { x: 790, y: 740, r: 78 };

export const Senales: React.FC<PropsSenales> = ({ marcas: m, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.senales;
  const s = (seg: number) => seg * fps;
  const momentos = [m.entero, m.repetis, m.pausas, m.compartis, m.rapido];

  const llegadas = momentos.map((t) => entre(frame, t + s(0.25), t + s(0.75)));
  const llegaron = llegadas.reduce((a, b) => a + b, 0);
  const datos = Math.round(interpolate(frame, [0, duracion], [3, 9]) + llegaron * 12);

  return (
    <Escena name="Senales">
      {momentos.map((t, k) => (
        <Sfx key={k} efecto="pop" desde={t} volumen={0.25} />
      ))}
      {momentos.map((t, k) => (
        <Sfx key={`p${k}`} efecto="ping" desde={t + s(0.6)} volumen={0.15} />
      ))}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {/* Trazos de cada señal hacia tu perfil */}
        {T.senales.map((sen, k) => {
          const y = FILA.y + k * FILA.paso + FILA.alto / 2;
          const a = entre(frame, momentos[k] + s(0.1), momentos[k] + s(0.3));
          const color = sen.valor.startsWith("+") ? COLOR.verde : COLOR.rojo;
          const p = (t: number) => {
            const x0 = FILA.x + FILA.ancho;
            const cx = (x0 + PERFIL.x) / 2;
            const u = 1 - t;
            return {
              x: u * u * x0 + 2 * u * t * cx + t * t * PERFIL.x,
              y: u * u * y + 2 * u * t * ((y + PERFIL.y) / 2 - 60) + t * t * PERFIL.y,
            };
          };
          const pt = p(llegadas[k]);
          const cuerpo = `M ${FILA.x + FILA.ancho} ${y} Q ${(FILA.x + FILA.ancho + PERFIL.x) / 2} ${(y + PERFIL.y) / 2 - 60} ${PERFIL.x} ${PERFIL.y}`;
          return (
            <g key={k} opacity={a}>
              <path d={cuerpo} fill="none" stroke={color} strokeWidth={2} strokeDasharray="4 10" opacity={0.5} />
              {llegadas[k] < 1 ? <circle cx={pt.x} cy={pt.y} r={12} fill={color} /> : null}
            </g>
          );
        })}
        <Avatar x={PERFIL.x} y={PERFIL.y + flotar(frame, 160, 6)} r={PERFIL.r} anillo={0.08 + llegaron / 5.5} brillo={llegadas.reduce((a, l) => a + Math.sin(Math.PI * l), 0)} />
      </svg>

      {/* Tarjetas de señales */}
      {T.senales.map((sen, k) => {
        const e = resorte(frame, fps, momentos[k] - s(0.1), { damping: 14 });
        const color = sen.valor.startsWith("+") ? COLOR.verde : COLOR.rojo;
        const activa = entre(frame, momentos[k] - s(0.1), momentos[k] + s(0.1)) * (1 - entre(frame, momentos[k] + s(0.7), momentos[k] + s(1.1)));
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: FILA.x,
              top: FILA.y + k * FILA.paso,
              width: FILA.ancho,
              height: FILA.alto,
              opacity: e,
              translate: `${interpolate(e, [0, 1], [-120, 0])}px 0`,
              display: "flex",
              alignItems: "center",
              gap: 24,
              padding: "0 26px",
              boxSizing: "border-box",
              background: "rgba(8,9,11,0.75)",
              border: `2px solid ${activa > 0.3 ? color : "rgba(255,255,255,0.12)"}`,
              borderRadius: 22,
              boxShadow: activa > 0.3 ? `0 0 30px ${color}55` : "none",
            }}
          >
            <div style={{ width: 70, height: 70, borderRadius: 18, background: `${color}22`, color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 800, fontFamily: FUENTE.inter }}>{sen.icono}</div>
            <div style={{ flex: 1, fontFamily: FUENTE.inter, fontWeight: 700, fontSize: 38, color: COLOR.texto }}>{sen.texto}</div>
            <div style={{ fontFamily: FUENTE.mono, fontWeight: 700, fontSize: 34, color }}>{sen.valor}</div>
          </div>
        );
      })}

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PERFIL.x, top: PERFIL.y + PERFIL.r + 40, translate: "-50% 0", fontFamily: FUENTE.mono, fontSize: 24, color: COLOR.verde, letterSpacing: 2 }}>{T.vos}</div>
      </AbsoluteFill>
      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={datos} color={COLOR.verde} aparece={s(0.2)} />
    </Escena>
  );
};
