import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, flotar, resorte } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE } from "../../comun/tema";
import { Telefono } from "../../faceid/componentes/Telefono";
import { Cable, Rayo } from "../componentes/Bateria";
import { TEXTOS } from "../guion-bateria";
import { MarcasBateria } from "../linea-bateria";

export type PropsHook = { marcas: MarcasBateria["hook"]; duracion: number };

/** Dormitorio de noche: ventana con luna y estrellas, mesa de luz. */
export const Dormitorio: React.FC<{ frame: number }> = ({ frame }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="noche" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0f1626" />
        <stop offset="100%" stopColor="#16171a" />
      </linearGradient>
      <radialGradient id="luna" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f4f1e6" />
        <stop offset="70%" stopColor="#e6e1cf" />
        <stop offset="100%" stopColor="#e6e1cf" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#noche)" />
    {/* Ventana */}
    <rect x={560} y={230} width={330} height={420} rx={10} fill="#0a1020" stroke="#2c3344" strokeWidth={14} />
    {Array.from({ length: 22 }, (_, k) => (
      <circle key={k} cx={575 + random(`ex${k}`) * 300} cy={245 + random(`ey${k}`) * 390} r={1.5 + random(`er${k}`) * 2} fill="#fff" opacity={0.3 + 0.6 * Math.abs(Math.sin(frame / 30 + k))} />
    ))}
    <circle cx={790} cy={340} r={56} fill="url(#luna)" />
    <circle cx={812} cy={322} r={50} fill="#0a1020" />
    <line x1={725} y1={230} x2={725} y2={650} stroke="#2c3344" strokeWidth={8} />
    <line x1={560} y1={440} x2={890} y2={440} stroke="#2c3344" strokeWidth={8} />
    <rect x={540} y={650} width={370} height={24} rx={6} fill="#262a33" />
    {/* Mesa de luz */}
    <rect x={90} y={1130} width={830} height={46} rx={10} fill="#3a3027" />
    <rect x={130} y={1176} width={750} height={300} fill="#2a231d" />
  </svg>
);

export const Hook: React.FC<PropsHook> = ({ marcas: m, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.hook;
  const s = (seg: number) => seg * fps;

  const alarma = entre(frame, m.matando - s(0.15), m.matando + s(0.2)) * (1 - entre(frame, m.tranquilo - s(0.1), m.tranquilo + s(0.2)));
  const sello = resorte(frame, fps, m.tranquilo, { damping: 10, stiffness: 200 });
  const carga = interpolate(frame, [0, duracion], [62, 71]);
  const temblor = alarma * Math.sin(frame * 2.1) * 6;
  const zoom = interpolate(frame, [0, duracion], [1.04, 1.12]);
  const minutos = 47 + Math.floor(frame / s(1.2));
  const hora = `03:${String(minutos).padStart(2, "0")}`;

  return (
    <Escena entrada={false} name="Hook">
      <Sfx efecto="bip" desde={m.matando} volumen={0.25} />
      <Sfx efecto="ding" desde={m.tranquilo} volumen={0.3} />
      <AbsoluteFill style={{ scale: String(zoom), transformOrigin: "50% 45%" }}>
        <Dormitorio frame={frame} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <Cable d="M505 1100 C 505 1160 600 1150 700 1140 S 900 1160 1000 1250" largo={720} flujo={1} frame={frame} grosor={12} />
        </svg>
        {/* Luz de la pantalla sobre la pared */}
        <div style={{ position: "absolute", left: 505 - 320, top: 820 - 320, width: 640, height: 640, borderRadius: "50%", background: `radial-gradient(${alarma > 0.3 ? COLOR.rojo : COLOR.verde}33, transparent 65%)` }} />
        <Telefono ubicacion={{ x: 505 + temblor, y: 820 + flotar(frame, 200, 3), rot: 0, escala: 0.9 }} pantalla="apagada">
          <text x={0} y={-150} textAnchor="middle" fill={COLOR.texto} fontFamily={FUENTE.inter} fontWeight={300} fontSize={88}>
            {hora}
          </text>
          <text x={0} y={-100} textAnchor="middle" fill={COLOR.textoSuave} fontFamily={FUENTE.inter} fontSize={20}>
            martes
          </text>
          {/* Batería de la pantalla */}
          <g transform="translate(0 90)">
            <rect x={-70} y={-34} width={140} height={68} rx={14} fill="none" stroke={alarma > 0.3 ? COLOR.rojo : COLOR.texto} strokeWidth={5} />
            <rect x={70} y={-12} width={10} height={24} rx={3} fill={alarma > 0.3 ? COLOR.rojo : COLOR.texto} />
            <rect x={-62} y={-26} width={124 * (carga / 100)} height={52} rx={8} fill={alarma > 0.3 ? COLOR.rojo : COLOR.verde} />
            <Rayo x={0} y={0} tamano={44} color="#fff" opacidad={0.7 + 0.3 * Math.sin(frame / 7)} />
          </g>
          <text x={0} y={175} textAnchor="middle" fill={COLOR.textoSuave} fontFamily={FUENTE.mono} fontSize={22}>
            cargando · {Math.round(carga)}%
          </text>
        </Telefono>
      </AbsoluteFill>

      {/* "NO": sello de tranquilidad */}
      <div
        style={{
          position: "absolute",
          left: 505,
          top: 470,
          translate: "-50% -50%",
          rotate: "-8deg",
          scale: String(sello),
          border: `8px solid ${COLOR.verde}`,
          borderRadius: 18,
          padding: "4px 46px",
          fontFamily: FUENTE.inter,
          fontWeight: 800,
          fontSize: 120,
          letterSpacing: 6,
          color: COLOR.verde,
          background: "rgba(22,23,26,0.65)",
          boxShadow: `0 0 40px ${COLOR.verde}55`,
        }}
      >
        {T.no}
      </div>
      <ContadorHud etiqueta={T.contador} valor={carga} unidad="%" color={COLOR.verde} aparece={s(0.3)} />
    </Escena>
  );
};
