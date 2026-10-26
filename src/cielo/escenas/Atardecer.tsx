import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { ENTRA_SALE, entre, flotar } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { AZUL_LUZ, onda } from "../componentes/Luz";
import { Paisaje } from "../componentes/Paisaje";
import { DATOS, TEXTOS } from "../guion-cielo";
import { MarcasCielo } from "../linea-cielo";

export type PropsAtardecer = { marcas: MarcasCielo["atardecer"]; duracion: number };

/** Diagrama: la Tierra (arco grande abajo) con su capa de aire. */
const TIERRA = { cx: 505, cy: 1900, r: 1050 };
const AIRE = 170;
const YO = { x: 505, y: TIERRA.cy - TIERRA.r };

export const Atardecer: React.FC<PropsAtardecer> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.atardecer;
  const s = (seg: number) => seg * fps;

  // El sol baja: de arriba (poco aire) al horizonte (mucho aire).
  const baja = entre(frame, m.aire - s(0.6), m.aire + s(0.6), ENTRA_SALE);
  const angulo = interpolate(baja, [0, 1], [-Math.PI / 2, -0.06]); // dirección desde el observador
  const lejos = interpolate(baja, [0, 1], [480, 470]);
  const sol = { x: YO.x + Math.cos(angulo) * lejos, y: YO.y + Math.sin(angulo) * lejos };
  // Largo del camino dentro de la capa de aire (geometría del círculo).
  const dx = Math.cos(angulo);
  const dy = Math.sin(angulo);
  const ox = YO.x - TIERRA.cx;
  const oy = YO.y - TIERRA.cy;
  const R2 = (TIERRA.r + AIRE) ** 2;
  const b = ox * dx + oy * dy;
  const tAire = -b + Math.sqrt(b * b - (ox * ox + oy * oy - R2));
  const borde = { x: YO.x + dx * tAire, y: YO.y + dy * tAire };
  const masaAire = interpolate(baja, [0, 1], [1, DATOS.aireHorizonte], { easing: (t) => t * t * t });

  const perdida = entre(frame, m.camino - s(0.2), m.camino + s(1.2));
  const final = entre(frame, m.rojos - s(0.3), m.rojos + s(0.6), ENTRA_SALE);
  const colorHaz = (u: number) => interpolateColors(u * perdida, [0, 0.4, 0.75, 1], ["#ffffff", "#ffe08a", "#ff9a3c", "#ff4a2e"]);

  return (
    <Escena name="Atardecer">
      <Sfx efecto="whoosh" desde={m.aire - s(0.6)} volumen={0.2} />
      <Sfx efecto="brillo" desde={m.rojos} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 1 - final }}>
        <defs>
          <radialGradient id="atAire" cx="50%" cy="50%" r="50%">
            <stop offset={`${(TIERRA.r / (TIERRA.r + AIRE)) * 100}%`} stopColor={AZUL_LUZ} stopOpacity={0.35} />
            <stop offset="100%" stopColor={AZUL_LUZ} stopOpacity={0.04} />
          </radialGradient>
          <linearGradient id="atTierra" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b4249" />
            <stop offset="100%" stopColor="#1c1f23" />
          </linearGradient>
        </defs>
        <circle cx={TIERRA.cx} cy={TIERRA.cy} r={TIERRA.r + AIRE} fill="url(#atAire)" />
        <circle cx={TIERRA.cx} cy={TIERRA.cy} r={TIERRA.r} fill="url(#atTierra)" stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
        {/* Sol y haz hasta el observador; en el camino largo, el azul se escapa */}
        <circle cx={sol.x} cy={sol.y} r={52} fill="#fff1c7" />
        <circle cx={sol.x} cy={sol.y} r={110} fill="#ffe7a0" opacity={0.18} />
        {Array.from({ length: 24 }, (_, k) => {
          const u0 = k / 24;
          const u1 = (k + 1) / 24;
          const p0 = { x: sol.x + (YO.x - sol.x) * u0, y: sol.y + (YO.y - sol.y) * u0 };
          const p1 = { x: sol.x + (YO.x - sol.x) * u1, y: sol.y + (YO.y - sol.y) * u1 };
          // Fracción del camino ya recorrida dentro del aire.
          const dentro = Math.min(1, Math.max(0, 1 - Math.hypot(YO.x - p0.x, YO.y - p0.y) / Math.max(1, tAire)));
          return <line key={k} x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke={colorHaz(dentro)} strokeWidth={8} strokeLinecap="round" />;
        })}
        {perdida > 0
          ? Array.from({ length: 9 }, (_, k) => {
              const u = 0.15 + (k / 9) * 0.75;
              const p = { x: borde.x + (YO.x - borde.x) * u, y: borde.y + (YO.y - borde.y) * u };
              const ciclo = ((frame + k * 9) % 36) / 36;
              const a = -Math.PI / 2 + (k % 2 ? 0.9 : -0.6);
              return (
                <path
                  key={k}
                  d={onda(p.x, p.y, p.x + Math.cos(a) * (40 + ciclo * 90), p.y + Math.sin(a) * (40 + ciclo * 90), 22, 5, frame * 0.5)}
                  fill="none"
                  stroke={AZUL_LUZ}
                  strokeWidth={3.5}
                  opacity={perdida * (1 - ciclo)}
                />
              );
            })
          : null}
        <circle cx={YO.x} cy={YO.y - 16} r={14} fill="#e3e6ea" />
        <rect x={YO.x - 12} y={YO.y - 4} width={24} height={30} rx={8} fill="#c9cdd4" />
      </svg>

      {final > 0 ? (
        <AbsoluteFill style={{ opacity: final }}>
          <Paisaje hora={1} sol={{ x: 700, y: 960 + flotar(frame, 200, 4), r: 90 }} frame={frame} mirada={0.4} horizonte={980} />
        </AbsoluteFill>
      ) : null}

      <AbsoluteFill style={{ opacity: 1 - final }}>
        <HudEtiqueta ancla={{ x: YO.x + 8, y: YO.y - 200 }} caja={{ x: YO.x + 70, y: YO.y - 420 }} texto={T.mediodia} color={COLOR.azul} aparece={s(0.3)} desaparece={m.aire - s(0.6)} />
        <HudEtiqueta ancla={{ x: (borde.x + YO.x) / 2, y: (borde.y + YO.y) / 2 - 10 }} caja={{ x: 560, y: 1000 }} texto={T.tarde} color={COLOR.naranjaCalor} aparece={m.aire + s(0.4)} desaparece={m.camino} />
        <HudEtiqueta ancla={{ x: (borde.x * 0.6 + YO.x * 0.4), y: (borde.y * 0.6 + YO.y * 0.4) - 30 }} caja={{ x: 520, y: 1000 }} texto={T.pierde} color={COLOR.azul} aparece={m.camino + s(0.2)} />
      </AbsoluteFill>

      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} prefijo="×" valor={masaAire} color={COLOR.naranjaCalor} aparece={s(0.2)} />
    </Escena>
  );
};
