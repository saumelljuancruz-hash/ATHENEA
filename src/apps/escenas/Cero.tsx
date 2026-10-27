import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, resorte } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, TituloSeccion } from "../../comun/Hud";
import { Planos } from "../../comun/Planos";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE } from "../../comun/tema";
import { IconoApp, Pedazos, TarjetaApp } from "../componentes/Apps";
import { APPS, TEXTOS } from "../guion-apps";
import { MarcasApps } from "../linea-apps";

export type PropsCero = { marcas: MarcasApps["cero"]; duracion: number };

// Gráfico de energía: despertar (lomita chica) contra abrir de cero (pico grande).
const G = { x: 110, y: 520, ancho: 820, alto: 520 };
const curva = (t: number, alto: number, centro: number, ancho: number) => alto * Math.exp(-(((t - centro) / ancho) ** 2));

const Grafico: React.FC<{ progreso: number; etiquetas: { despertar: string; abrir: string } }> = ({ progreso, etiquetas }) => {
  const puntos = (alto: number, centro: number, ancho: number) =>
    Array.from({ length: 101 }, (_, i) => {
      const t = (i / 100) * progreso;
      return `${i ? "L" : "M"}${(G.x + t * G.ancho).toFixed(1)},${(G.y + G.alto - curva(t, alto, centro, ancho)).toFixed(1)}`;
    }).join("");
  const area = (alto: number, centro: number, ancho: number, color: string) => (
    <path d={`${puntos(alto, centro, ancho)} L${G.x + progreso * G.ancho},${G.y + G.alto} L${G.x},${G.y + G.alto} Z`} fill={color} opacity={0.25} />
  );
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <rect x={G.x - 30} y={G.y - 60} width={G.ancho + 60} height={G.alto + 110} rx={24} fill="rgba(8,9,11,0.6)" stroke="rgba(255,255,255,0.08)" />
      <line x1={G.x} x2={G.x + G.ancho} y1={G.y + G.alto} y2={G.y + G.alto} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
      {area(G.alto * 0.85, 0.5, 0.16, COLOR.rojo)}
      <path d={puntos(G.alto * 0.85, 0.5, 0.16)} fill="none" stroke={COLOR.rojo} strokeWidth={6} />
      {area(G.alto * 0.16, 0.5, 0.08, COLOR.verde)}
      <path d={puntos(G.alto * 0.16, 0.5, 0.08)} fill="none" stroke={COLOR.verde} strokeWidth={6} />
      <g opacity={progreso > 0.55 ? 1 : 0} fontFamily={FUENTE.mono} fontWeight={700} fontSize={28}>
        <text x={G.x + G.ancho * 0.56} y={G.y + 70} fill={COLOR.rojo}>
          {etiquetas.abrir}
        </text>
        <text x={G.x + G.ancho * 0.56} y={G.y + G.alto - G.alto * 0.16 - 20} fill={COLOR.verde}>
          {etiquetas.despertar}
        </text>
      </g>
    </svg>
  );
};

export const Cero: React.FC<PropsCero> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.cero;
  const s = (seg: number) => seg * fps;

  const rompe = entre(frame, m.cerras, m.cerras + s(0.7));
  const carga = entre(frame, m.cero - s(0.1), m.despertarla - s(0.3));
  const arma = entre(frame, m.cargar - s(0.1), m.despertarla - s(0.4));
  const grafico = entre(frame, m.despertarla - s(0.1), m.despertarla + s(1.3));
  const fuente = resorte(frame, fps, m.apple, { damping: 12 });
  const cpu =
    frame < m.cerras
      ? 3
      : frame < m.cero
        ? 8
        : frame < m.despertarla - s(0.3)
          ? 70 + 20 * Math.abs(Math.sin(frame / 3))
          : interpolate(frame, [m.despertarla - s(0.3), m.despertarla + s(0.4)], [80, 4], { extrapolateRight: "clamp" });

  return (
    <Escena name="Cero">
      <Sfx efecto="whoosh" desde={m.cerras} volumen={0.3} />
      <Sfx efecto="pop" desde={m.cerras + s(0.15)} volumen={0.3} />
      <Sfx efecto="motor" desde={m.cero} volumen={0.15} />
      <Sfx efecto="ding" desde={m.despertarla} volumen={0.25} />
      <Sfx efecto="ping" desde={m.apple} volumen={0.3} />
      <Planos
        planos={[
          {
            desde: 0,
            contenido: (
              <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
                {rompe < 0.05 ? (
                  <TarjetaApp x={540} y={850 - 200 * entre(frame, m.cerras - s(0.3), m.cerras)} ancho={360} alto={620} app={APPS[0]} frame={frame} hielo={1} />
                ) : (
                  <Pedazos x={540} y={650} ancho={360} alto={620} color={APPS[0].color} t={rompe} />
                )}
              </svg>
            ),
          },
          {
            desde: m.cero - s(0.1),
            contenido: (
              <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
                {arma < 1 ? <Pedazos x={540} y={850} ancho={360} alto={620} color={APPS[0].color} t={arma} inverso /> : <TarjetaApp x={540} y={850} ancho={360} alto={620} app={APPS[0]} frame={frame} />}
                <g opacity={1 - arma}>
                  <IconoApp x={540} y={620} tamano={160} app={APPS[0]} />
                </g>
                <rect x={240} y={1180} width={600} height={22} rx={11} fill="rgba(255,255,255,0.12)" />
                <rect x={240} y={1180} width={600 * carga} height={22} rx={11} fill={COLOR.naranja} />
              </svg>
            ),
          },
          { desde: m.despertarla - s(0.1), contenido: <Grafico progreso={grafico} etiquetas={{ despertar: T.despertar, abrir: T.abrir }} /> },
        ]}
      />
      <div
        style={{
          position: "absolute",
          left: 540,
          top: 1150,
          translate: "-50% 0",
          scale: String(fuente),
          fontFamily: FUENTE.mono,
          fontWeight: 700,
          fontSize: 34,
          color: COLOR.texto,
          background: "rgba(8,9,11,0.85)",
          border: `2px solid ${COLOR.verde}`,
          borderRadius: 12,
          padding: "10px 24px",
          whiteSpace: "nowrap",
        }}
      >
        ✓ {T.fuente}
      </div>
      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={cpu} unidad="%" color={cpu > 40 ? COLOR.rojo : COLOR.verde} aparece={s(0.2)} />
    </Escena>
  );
};
