import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { flotar, resorte } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE } from "../../comun/tema";
import { TEXTOS } from "../guion-modoavion";
import { MarcasModoAvion } from "../linea-modoavion";

export type PropsZumbido = { marcas: MarcasModoAvion["zumbido"]; duracion: number };

/** Ráfagas "ti ti ti": tres pulsos cada 0,42 s, repetidos al ritmo de la voz. */
const PERIODO = 0.42;
const CICLO = 1.3;
const rafaga = (t: number) => {
  if (t < 0) return 0;
  const ciclo = t % CICLO;
  const k = Math.floor(ciclo / PERIODO);
  if (k > 2) return 0;
  const u = (ciclo - k * PERIODO) / 0.28;
  return u >= 0 && u <= 1 ? Math.sin(Math.PI * u) : 0;
};

/** Auriculares de piloto (vincha + almohadillas + micrófono). */
const Auriculares: React.FC<{ x: number; y: number; escala: number; vibra: number }> = ({ x, y, escala, vibra }) => (
  <g transform={`translate(${x + vibra * 6} ${y}) scale(${escala})`}>
    <path d="M-170 40 C -170 -170 170 -170 170 40" fill="none" stroke="#3a3d44" strokeWidth={34} strokeLinecap="round" />
    <path d="M-170 40 C -170 -170 170 -170 170 40" fill="none" stroke="#5d626c" strokeWidth={14} strokeLinecap="round" />
    {[-1, 1].map((l) => (
      <g key={l}>
        <rect x={l * 170 - 52} y={10} width={104} height={150} rx={46} fill="#2a2d33" stroke="#5d626c" strokeWidth={4} />
        <rect x={l * 170 - 38} y={28} width={76} height={114} rx={36} fill="#1a1c20" />
        <circle cx={l * 170} cy={85} r={18} fill={COLOR.rojo} opacity={0.15 + 0.6 * vibra} />
      </g>
    ))}
    <path d="M-170 140 C -170 230 -60 250 20 240" fill="none" stroke="#3a3d44" strokeWidth={10} strokeLinecap="round" />
    <rect x={14} y={226} width={46} height={28} rx={14} fill="#2a2d33" />
  </g>
);

export const Zumbido: React.FC<PropsZumbido> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.zumbido;
  const t = frame / fps;
  const inicio = m.titi / fps - 0.1;
  const pulso = rafaga(t - inicio);
  const entrada = resorte(frame, fps, 4, { damping: 14 });

  // Onda de audio de la cabina: voz suave + ráfagas de interferencia.
  const onda = Array.from({ length: 120 }, (_, i) => {
    const x = 90 + i * 7.1;
    const tt = t - (120 - i) * 0.006;
    const voz = 18 * Math.sin(i * 0.5 + frame * 0.3) * (0.6 + 0.4 * Math.sin(i * 0.11 + frame * 0.05));
    const ruido = rafaga(tt - inicio) * 120 * Math.sign(Math.sin(i * 2.7 + frame));
    return `${i ? "L" : "M"}${x.toFixed(1)},${(1080 + voz + ruido).toFixed(1)}`;
  }).join("");

  return (
    <Escena name="Zumbido">
      {[0, 1].map((k) => (
        <Sfx key={k} efecto="interferencia" desde={m.titi + k * CICLO * fps - 6} />
      ))}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="cabinaLuz" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#2a3a4f" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#16171a" stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#cabinaLuz)" />
        {/* Panel de la cabina, desenfocado al fondo */}
        <g opacity={0.35} style={{ filter: "blur(3px)" }}>
          {Array.from({ length: 10 }, (_, k) => (
            <circle key={k} cx={140 + k * 90} cy={300 + (k % 2) * 40} r={28} fill="none" stroke="#5d626c" strokeWidth={4} />
          ))}
        </g>
        <g transform={`translate(0 ${interpolate(entrada, [0, 1], [200, 0])})`} opacity={entrada}>
          <Auriculares x={505} y={540 + flotar(frame, 160, 6)} escala={1.1} vibra={pulso} />
        </g>
        <rect x={80} y={980} width={860} height={200} rx={16} fill="rgba(8,9,11,0.8)" stroke={`${pulso > 0.1 ? COLOR.rojo : COLOR.verde}66`} />
        <path d={onda} fill="none" stroke={pulso > 0.1 ? COLOR.rojo : COLOR.verde} strokeWidth={3} />
      </svg>

      {/* "ti ti ti" */}
      <div style={{ position: "absolute", left: 0, right: 150, top: 845, display: "flex", justifyContent: "center", gap: 30 }}>
        {[0, 1, 2].map((k) => {
          const visto = t - inicio >= 0 && ((t - inicio) % CICLO) >= k * PERIODO;
          const p = rafaga(t - inicio) * (Math.floor(((t - inicio) % CICLO) / PERIODO) === k ? 1 : 0);
          return (
            <span
              key={k}
              style={{
                fontFamily: FUENTE.inter,
                fontWeight: 800,
                fontSize: 70,
                color: COLOR.rojo,
                opacity: visto ? 0.35 + 0.65 * p : 0,
                scale: String(1 + 0.25 * p),
                display: "inline-block",
              }}
            >
              {T.titi.split(" ")[k]}
            </span>
          );
        })}
      </div>

      <AbsoluteFill>
        <HudEtiqueta ancla={{ x: 318, y: 640 }} caja={{ x: 80, y: 360 }} texto={T.piloto} color={COLOR.azul} aparece={m.auriculares} tamano={24} />
      </AbsoluteFill>

      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={pulso * 100} unidad="%" color={pulso > 0.1 ? COLOR.rojo : COLOR.verde} aparece={m.titi - 10} />
    </Escena>
  );
};
