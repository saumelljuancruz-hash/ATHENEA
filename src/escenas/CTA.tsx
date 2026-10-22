import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Avion } from "../componentes/Avion";
import { entre, flotar, resorte } from "../componentes/anim";
import { Escena } from "../componentes/Escena";
import { Fondo } from "../componentes/Fondo";
import { MapaMaqueta } from "../componentes/MapaMaqueta";
import { Sfx } from "../componentes/Sonido";
import { polilineaAPath, puntoEnPolilinea, rutaGranCirculo } from "../geo";
import { CUENTA, TEXTOS } from "../guion-avion";
import { Marcas } from "../linea-de-tiempo";
import { COLOR, FUENTE, SEGURO } from "../tema";
import { PLACA_PACIFICO } from "./encuadres";

export type PropsCTA = { marcas: Marcas["cta"]; duracion: number; logoDisponible: boolean };

const GC = rutaGranCirculo(100);
const CENTRO_X = (SEGURO.izquierda + (SEGURO.ancho - SEGURO.derecha)) / 2;
const PANTALLA = { ancho: 400, alto: 711 };
const ESCALA_MINI = PANTALLA.ancho / 1080;
const TELEFONO = { ancho: 436, alto: 790, top: 430 };
const BOTON_Y = 600; // dentro de la pantalla

export const CTA: React.FC<PropsCTA> = ({ duracion, logoDisponible }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.cta;

  const toque1 = Math.round(Math.max(0.55 * fps, duracion * 0.2));
  const toque2 = Math.round(Math.max(toque1 + 0.65 * fps, duracion * 0.48));
  const salidaDedo = toque2 + Math.round(0.45 * fps);

  const cabecera = resorte(frame, fps, 2, { damping: 16 });
  const titulo = resorte(frame, fps, 6, { damping: 12, stiffness: 160 });
  const subrayado = entre(frame, 14, 30);
  const telefono = resorte(frame, fps, 4, { damping: 15, stiffness: 120 });

  const estadoBoton = frame < toque1 + 3 ? 0 : frame < toque2 + 3 ? 1 : 2;
  const popBoton = resorte(frame, fps, estadoBoton === 0 ? 0 : estadoBoton === 1 ? toque1 + 3 : toque2 + 3, {
    damping: 9,
    stiffness: 220,
  });
  const presion = (t: number) => 1 - 0.08 * Math.max(0, 1 - Math.abs(frame - t) / 4);

  // Dedo: entra, toca dos veces y se va (el último tramo queda limpio).
  const telTop = TELEFONO.top + interpolate(telefono, [0, 1], [500, 0]) + flotar(frame, 200, 6);
  const boton = { x: CENTRO_X, y: telTop + (TELEFONO.alto - PANTALLA.alto) / 2 + BOTON_Y };
  const llegada = entre(frame, toque1 - 0.4 * fps, toque1 - 2);
  const levanta = Math.max(0, Math.sin(Math.PI * entre(frame, toque1 + 4, toque2 - 2))) * 70;
  const salida = entre(frame, toque2 + 6, salidaDedo);
  const dedo = {
    x: interpolate(llegada, [0, 1], [900, boton.x + 30]) + salida * 520,
    y: interpolate(llegada, [0, 1], [1700, boton.y + 6]) - levanta + salida * 700,
    escala: presion(toque1) * presion(toque2),
  };

  const textos = [T.comentar, T.seguir, T.siguiendo];
  const estilos: React.CSSProperties[] = [
    { border: `3px solid ${COLOR.naranja}`, color: COLOR.texto, background: "rgba(255,154,60,0.12)" },
    { border: `3px solid ${COLOR.verde}`, color: "#0d1412", background: COLOR.verde },
    { border: "3px solid rgba(255,255,255,0.25)", color: COLOR.verde, background: "rgba(255,255,255,0.08)" },
  ];

  return (
    <Escena name="CTA">
      <Sfx efecto="tap" desde={toque1} />
      <Sfx efecto="pop" desde={toque1 + 3} />
      <Sfx efecto="tap" desde={toque2} />
      <Sfx efecto="pop" desde={toque2 + 3} />

      {/* Cabecera: logo + usuario */}
      <div
        style={{
          position: "absolute",
          left: CENTRO_X,
          top: SEGURO.arriba + 10,
          translate: `-50% ${interpolate(cabecera, [0, 1], [-30, 0])}px`,
          opacity: cabecera,
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <Logo disponible={logoDisponible} />
        <div style={{ fontFamily: FUENTE.mono, fontWeight: 700, fontSize: 30, color: COLOR.texto }}>{CUENTA.usuario}</div>
      </div>

      {/* Título con subrayado naranja */}
      <div
        style={{
          position: "absolute",
          left: CENTRO_X,
          top: 228,
          translate: "-50% 0",
          scale: String(titulo),
          textAlign: "center",
        }}
      >
        <div style={{ fontFamily: FUENTE.inter, fontWeight: 800, fontSize: 100, color: COLOR.texto, letterSpacing: -1, lineHeight: 1, whiteSpace: "nowrap" }}>
          {T.titulo}
        </div>
        <div
          style={{
            height: 12,
            marginTop: 14,
            borderRadius: 6,
            background: COLOR.naranja,
            width: `${subrayado * 100}%`,
            marginLeft: `${(1 - subrayado) * 50}%`,
            boxShadow: `0 0 24px ${COLOR.naranja}77`,
          }}
        />
      </div>

      {/* Teléfono con este mismo Reel */}
      <div
        style={{
          position: "absolute",
          left: CENTRO_X - TELEFONO.ancho / 2,
          top: telTop,
          width: TELEFONO.ancho,
          height: TELEFONO.alto,
          rotate: `${flotar(frame, 260, 1.2)}deg`,
          borderRadius: 64,
          background: "linear-gradient(145deg, #3a3d44, #121316)",
          boxShadow: "0 60px 110px rgba(0,0,0,0.65), inset 0 0 0 2px rgba(255,255,255,0.12)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: (TELEFONO.ancho - PANTALLA.ancho) / 2,
            top: (TELEFONO.alto - PANTALLA.alto) / 2,
            width: PANTALLA.ancho,
            height: PANTALLA.alto,
            borderRadius: 46,
            overflow: "hidden",
            background: COLOR.fondoOscuro,
          }}
        >
          <MiniReel frame={frame} />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: BOTON_Y,
              translate: "-50% -50%",
              scale: String(interpolate(popBoton, [0, 1], [0.85, 1])),
              ...estilos[estadoBoton],
              borderRadius: 999,
              padding: "14px 30px",
              fontFamily: FUENTE.inter,
              fontWeight: 800,
              fontSize: 30,
              whiteSpace: "nowrap",
              boxShadow: "0 10px 26px rgba(0,0,0,0.45)",
            }}
          >
            {textos[estadoBoton]}
          </div>
          {[toque1, toque2].map((t) =>
            frame >= t && frame < t + 22 ? (
              <div
                key={t}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: BOTON_Y,
                  width: 40,
                  height: 40,
                  translate: "-50% -50%",
                  borderRadius: "50%",
                  border: `3px solid ${t === toque1 ? COLOR.naranja : COLOR.verde}`,
                  scale: String(1 + (frame - t) * 0.35),
                  opacity: 1 - (frame - t) / 22,
                }}
              />
            ) : null,
          )}
        </div>
        <div style={{ position: "absolute", left: "50%", top: 24, width: 110, height: 30, translate: "-50% 0", borderRadius: 15, background: "#08090b" }} />
      </div>

      {frame < salidaDedo + 2 ? <Dedo x={dedo.x} y={dedo.y} escala={dedo.escala} /> : null}
    </Escena>
  );
};

const MiniReel: React.FC<{ frame: number }> = ({ frame }) => {
  const vuelta = (frame % 150) / 150;
  return (
    <AbsoluteFill style={{ width: 1080, height: 1920, scale: String(ESCALA_MINI), transformOrigin: "0 0" }}>
      <Fondo />
      <MapaMaqueta estado={{ ...PLACA_PACIFICO, rotacion: [147 + Math.sin(frame / 50) * 2, 0, 0] }} mostrarGrilla={false}>
        {(p) => {
          const pts = GC.map((pt) => p(pt) as [number, number]);
          const a = puntoEnPolilinea(pts, vuelta);
          return (
            <>
              <path d={polilineaAPath(pts)} fill="none" stroke={COLOR.verde} strokeWidth={10} strokeLinecap="round" />
              <Avion x={a.x} y={a.y} angulo={a.angulo} tamano={90} />
            </>
          );
        }}
      </MapaMaqueta>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1240, textAlign: "center", fontFamily: FUENTE.inter, fontWeight: 800, fontSize: 84, color: COLOR.texto }}>
        ES UNA <span style={{ color: COLOR.verde }}>RECTA</span>
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", right: 46, top: 1080 + i * 150, width: 84, height: 84, borderRadius: 42, background: "rgba(255,255,255,0.18)" }} />
      ))}
    </AbsoluteFill>
  );
};

const Logo: React.FC<{ disponible: boolean }> = ({ disponible }) =>
  disponible ? (
    <div
      style={{
        width: 96,
        height: 96,
        borderRadius: 48,
        overflow: "hidden",
        border: "2px solid rgba(255,255,255,0.18)",
        boxShadow: `0 0 24px ${COLOR.verde}55`,
      }}
    >
      {/* El logo trae margen oscuro: se amplía para que se lean los anillos. */}
      <Img src={staticFile(CUENTA.logo)} style={{ width: "100%", height: "100%", objectFit: "cover", scale: "1.45" }} />
    </div>
  ) : (
    <div
      style={{
        width: 84,
        height: 84,
        borderRadius: 42,
        border: `3px solid ${COLOR.verde}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FUENTE.inter,
        fontWeight: 800,
        fontSize: 30,
        color: COLOR.verde,
        background: "rgba(62,224,192,0.1)",
      }}
    >
      NT
    </div>
  );

/** Dedo ilustrado; (x, y) es la punta. */
const Dedo: React.FC<{ x: number; y: number; escala: number }> = ({ x, y, escala }) => (
  <svg
    width={260}
    height={420}
    viewBox="0 0 260 420"
    style={{
      position: "absolute",
      left: x - 70,
      top: y - 20,
      scale: String(escala),
      transformOrigin: "70px 20px",
      rotate: "-18deg",
      filter: "drop-shadow(18px 30px 24px rgba(0,0,0,0.5))",
    }}
  >
    <defs>
      <linearGradient id="piel" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#f6cfb0" />
        <stop offset="100%" stopColor="#d99c76" />
      </linearGradient>
    </defs>
    <path d="M30 60 C30 20 110 20 110 60 L112 250 C150 230 210 240 230 290 L240 420 L20 420 L28 260 Z" fill="url(#piel)" />
    <path d="M44 52 C44 30 96 30 96 52 L96 96 C80 104 60 104 44 96 Z" fill="#fbe4d3" opacity={0.85} />
  </svg>
);
