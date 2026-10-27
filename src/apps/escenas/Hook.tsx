import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, flotar, resorte } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { GanchoPantalla, LineaGancho } from "../../comun/Gancho";
import { ContadorHud } from "../../comun/Hud";
import { Planos } from "../../comun/Planos";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE } from "../../comun/tema";
import { Pila } from "../../bateria/componentes/Bateria";
import { Telefono } from "../../faceid/componentes/Telefono";
import { TarjetaApp } from "../componentes/Apps";
import { APPS, TEXTOS } from "../guion-apps";
import { MarcasApps } from "../linea-apps";

export type PropsHook = { marcas: MarcasApps["hook"]; duracion: number };

const RITMO = 16;

/** Selector de apps en la pantalla del teléfono, cerrando una app tras otra (coordenadas del teléfono). */
export const CerrandoApps: React.FC<{ frame: number }> = ({ frame }) => {
  const k = Math.floor(frame / RITMO);
  const p = Easing.in(Easing.cubic)((frame % RITMO) / RITMO);
  return (
    <g>
      <rect x={-138} y={-298} width={276} height={596} rx={34} fill="#101114" />
      <TarjetaApp x={0} y={20} ancho={190} alto={380} app={APPS[(k + 1) % APPS.length]} frame={frame} rot={0} opacidad={0.5 + 0.5 * p} />
      <TarjetaApp x={0} y={20 - p * 520} ancho={190} alto={380} app={APPS[k % APPS.length]} frame={frame} opacidad={1 - p * 0.8} />
      {/* Dedo que desliza */}
      <circle cx={0} cy={200 - p * 320} r={28} fill="#fff" opacity={0.35 * (1 - p)} />
    </g>
  );
};

export const Hook: React.FC<PropsHook> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.hook;
  const s = (seg: number) => seg * fps;

  const cerradas = Math.min(20, Math.floor(frame / RITMO) + Math.floor(entre(frame, m.veinte - s(0.3), m.veinte + s(0.8)) * 12));
  const descarga = entre(frame, m.mas - s(0.1), m.mas + s(1.4));
  const sello = resorte(frame, fps, m.mito, { damping: 9, stiffness: 220 });

  return (
    <Escena entrada={false} name="Hook">
      {Array.from({ length: Math.floor((m.mas - s(0.2)) / RITMO) }, (_, k) => (
        <Sfx key={k} efecto="whoosh" desde={k * RITMO + 6} volumen={0.08} />
      ))}
      <Sfx efecto="bip" desde={m.mas} volumen={0.3} />
      <Sfx efecto="tap" desde={m.mito} volumen={0.5} />
      <Planos
        planos={[
          {
            desde: 0,
            contenido: (
              <AbsoluteFill style={{ scale: String(interpolate(frame, [0, m.veinte], [1, 1.12], { extrapolateRight: "clamp" })) }}>
                <Telefono ubicacion={{ x: 540, y: 1020 + flotar(frame, 180, 5), rot: flotar(frame, 240, 1.5), escala: 0.9 }} pantalla="apagada">
                  <CerrandoApps frame={frame} />
                </Telefono>
              </AbsoluteFill>
            ),
          },
          {
            desde: m.mas - s(0.1),
            contenido: (
              <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
                <Pila x={520} y={900} alto={640} nivel={interpolate(descarga, [0, 1], [0.62, 0.18])} frame={frame} />
              </svg>
            ),
          },
        ]}
      />
      <div
        style={{
          position: "absolute",
          left: 520,
          top: 700,
          translate: "-50% -50%",
          rotate: "-12deg",
          scale: String(sello),
          border: `8px solid ${COLOR.rojo}`,
          borderRadius: 18,
          padding: "6px 40px",
          fontFamily: FUENTE.inter,
          fontWeight: 800,
          fontSize: 120,
          letterSpacing: 6,
          color: COLOR.rojo,
          background: "rgba(22,23,26,0.7)",
          boxShadow: `0 0 40px ${COLOR.rojo}55`,
        }}
      >
        {T.mito}
      </div>
      <GanchoPantalla lineas={T.gancho as LineaGancho[]} hasta={m.mas - s(0.1)} />
      <ContadorHud etiqueta={T.contador} valor={cerradas} color={COLOR.rojo} aparece={s(0.2)} sale={m.mas} />
    </Escena>
  );
};
