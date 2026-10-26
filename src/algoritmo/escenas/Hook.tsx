import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, flotar, resorte } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE } from "../../comun/tema";
import { Telefono } from "../../faceid/componentes/Telefono";
import { TEXTOS } from "../guion-algoritmo";
import { MarcasAlgoritmo } from "../linea-algoritmo";

export type PropsHook = { marcas: MarcasAlgoritmo["hook"]; duracion: number };

const TEL = { x: 470, y: 860, escala: 1.25 };

/** Un Reel cualquiera en la pantalla (coordenadas del teléfono). */
export const ReelEnPantalla: React.FC<{ frame: number; progreso: number; tono?: number }> = ({ frame, progreso, tono = 0 }) => (
  <g>
    <defs>
      <linearGradient id="reelFondo" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={tono ? "#3a2a4f" : "#1f3b4a"} />
        <stop offset="100%" stopColor="#14161a" />
      </linearGradient>
    </defs>
    <rect x={-138} y={-298} width={276} height={596} rx={34} fill="url(#reelFondo)" />
    {/* Formas que se mueven, como un video */}
    <circle cx={-30 + 40 * Math.sin(frame / 25)} cy={-60 + 30 * Math.cos(frame / 31)} r={62} fill={COLOR.verde} opacity={0.35} />
    <rect x={10 + 30 * Math.cos(frame / 22)} y={20 + 20 * Math.sin(frame / 18)} width={80} height={80} rx={14} fill={COLOR.azul} opacity={0.35} transform={`rotate(${frame * 0.8} ${50} ${60})`} />
    {/* Íconos laterales */}
    {[0, 1, 2].map((k) => (
      <circle key={k} cx={108} cy={60 + k * 56} r={16} fill="rgba(255,255,255,0.75)" />
    ))}
    <rect x={-112} y={196} width={150} height={12} rx={6} fill="rgba(255,255,255,0.6)" />
    <rect x={-112} y={218} width={100} height={10} rx={5} fill="rgba(255,255,255,0.35)" />
    {/* Barra de progreso */}
    <rect x={-124} y={270} width={248} height={6} rx={3} fill="rgba(255,255,255,0.25)" />
    <rect x={-124} y={270} width={248 * progreso} height={6} rx={3} fill="#fff" />
  </g>
);

export const Hook: React.FC<PropsHook> = ({ marcas: m, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.hook;
  const s = (seg: number) => seg * fps;

  const escaneo = entre(frame, m.sabe - s(0.1), m.sabe + s(0.3));
  const lineaY = -290 + ((frame * 6) % 580);
  const dato = resorte(frame, fps, m.dato, { damping: 12 });
  const zoom = interpolate(frame, [0, duracion], [1, 1.06]);
  // Un "chip" de dato por cada segundo mirado, que sale volando del teléfono.
  const segundos = Math.floor(frame / fps);

  return (
    <Escena entrada={false} name="Hook">
      <Sfx efecto="bip" desde={m.sabe} volumen={0.2} />
      <Sfx efecto="pop" desde={m.dato} volumen={0.3} />
      {Array.from({ length: Math.ceil(duracion / fps) }, (_, k) => (k > 0 ? <Sfx key={k} efecto="tap" desde={k * fps} volumen={0.12} /> : null))}
      <AbsoluteFill style={{ scale: String(zoom) }}>
        <Telefono ubicacion={{ x: TEL.x, y: TEL.y + flotar(frame, 200, 6), rot: flotar(frame, 260, 1.2), escala: TEL.escala }} pantalla="apagada">
          <ReelEnPantalla frame={frame} progreso={(frame / duracion) * 0.9} />
          {/* Escaneo: el video "te está mirando" */}
          <g opacity={escaneo}>
            <rect x={-138} y={lineaY - 40} width={276} height={40} fill={COLOR.verde} opacity={0.12} />
            <line x1={-138} x2={138} y1={lineaY} y2={lineaY} stroke={COLOR.verde} strokeWidth={3} />
            {[
              [-138, -298],
              [138, -298],
              [-138, 298],
              [138, 298],
            ].map(([x, y], k) => (
              <path key={k} d={`M ${x} ${y + (y < 0 ? 40 : -40)} L ${x} ${y} L ${x + (x < 0 ? 40 : -40)} ${y}`} fill="none" stroke={COLOR.verde} strokeWidth={6} />
            ))}
          </g>
        </Telefono>
        {/* Chips de segundos que vuelan hacia arriba */}
        {Array.from({ length: segundos }, (_, k) => {
          const t = (frame - (k + 1) * fps) / s(1.4);
          if (t > 1) return null;
          const x = TEL.x + 230 + 40 * Math.sin(k * 2.3);
          const y = TEL.y - 200 - t * 380;
          return (
            <div key={k} style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", opacity: Math.sin(Math.PI * Math.min(1, Math.max(0, t))), fontFamily: FUENTE.mono, fontWeight: 700, fontSize: 26, color: COLOR.verde, background: "rgba(8,9,11,0.85)", border: `1px solid ${COLOR.verde}88`, borderRadius: 6, padding: "4px 10px" }}>
              +1s
            </div>
          );
        })}
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          left: TEL.x,
          top: 360,
          translate: "-50% -50%",
          scale: String(dato),
          fontFamily: FUENTE.inter,
          fontWeight: 800,
          fontSize: 60,
          color: COLOR.texto,
          background: "rgba(22,23,26,0.85)",
          border: `3px solid ${COLOR.verde}`,
          borderRadius: 16,
          padding: "10px 28px",
          whiteSpace: "nowrap",
        }}
      >
        {T.dato}
      </div>
      <ContadorHud etiqueta={T.contador} valor={frame / fps} decimales={1} unidad=" s" color={COLOR.verde} aparece={s(0.2)} />
    </Escena>
  );
};
