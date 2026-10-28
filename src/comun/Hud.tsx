import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLOR, FUENTE, SEGURO } from "./tema";
import { entre, flotar, formatear, resorte } from "./anim";
import { Sfx } from "./Sonido";

type Punto = { x: number; y: number };

/**
 * Etiqueta HUD: punto en el objeto + línea de 1 px que se dibuja + cajita
 * con texto monoespaciado. `caja` es el punto donde la línea toca la caja.
 */
export const HudEtiqueta: React.FC<{
  ancla: Punto;
  caja: Punto;
  texto: string;
  color: string;
  aparece: number;
  desaparece?: number;
  /** "derecha": la caja crece hacia la derecha del punto de conexión. */
  lado?: "derecha" | "izquierda";
  tamano?: number;
  sonido?: boolean;
}> = ({ ancla, caja, texto, color, aparece, desaparece, lado = "derecha", tamano = 24, sonido = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const linea = entre(frame, aparece, aparece + 12);
  const pop = resorte(frame, fps, aparece + 8, { damping: 12, stiffness: 180 });
  const salida = desaparece === undefined ? 0 : entre(frame, desaparece, desaparece + 10);
  const opacidad = (frame >= aparece ? 1 : 0) * (1 - salida);
  if (opacidad <= 0) return sonido ? <Sfx efecto="pop" desde={aparece + 8} /> : null;

  const lx = ancla.x + (caja.x - ancla.x) * linea;
  const ly = ancla.y + (caja.y - ancla.y) * linea;
  const pulso = 1 + 0.25 * Math.sin((frame - aparece) / 8);
  const deriva = flotar(frame, 150, 3, aparece);

  return (
    <>
      {sonido ? <Sfx efecto="pop" desde={aparece + 8} /> : null}
      <AbsoluteFill style={{ opacity: opacidad, pointerEvents: "none" }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <circle cx={ancla.x} cy={ancla.y} r={9 * pulso} fill={color} opacity={0.18} />
          <circle cx={ancla.x} cy={ancla.y} r={4} fill={color} />
          <line x1={ancla.x} y1={ancla.y} x2={lx} y2={ly + deriva * linea} stroke={color} strokeWidth={1} />
        </svg>
        <div
          style={{
            position: "absolute",
            left: caja.x,
            top: caja.y + deriva,
            translate: lado === "derecha" ? "0 -50%" : "-100% -50%",
            scale: String(pop),
            transformOrigin: lado === "derecha" ? "left center" : "right center",
            background: COLOR.hudFondo,
            border: `1px solid ${color}88`,
            borderRadius: 6,
            padding: "10px 16px",
            fontFamily: FUENTE.mono,
            fontSize: tamano,
            fontWeight: 700,
            color: COLOR.texto,
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
          <span style={{ color }}>{texto}</span>
        </div>
      </AbsoluteFill>
    </>
  );
};

/** Badge "01" con borde verde agua + título en mayúsculas, arriba a la izquierda. */
export const TituloSeccion: React.FC<{ numero: string; titulo: string; aparece?: number; sale?: number }> = ({
  numero,
  titulo,
  aparece = 4,
  sale,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrada = resorte(frame, fps, aparece, { damping: 16 });
  const barrido = entre(frame, aparece + 4, aparece + 22);
  const salida = sale === undefined ? 0 : entre(frame, sale, sale + 10);
  return (
    <div
      style={{
        position: "absolute",
        left: SEGURO.izquierda,
        top: SEGURO.arriba + 20,
        display: "flex",
        alignItems: "center",
        gap: 20,
        opacity: entrada * (1 - salida),
        translate: `${interpolate(entrada, [0, 1], [-40, 0]) + flotar(frame, 240, 2)}px 0px`,
        background: "rgba(36,22,52,0.5)",
        borderRadius: 18,
        padding: "8px 20px 8px 8px",
      }}
    >
      <div
        style={{
          border: `3px solid ${COLOR.verde}`,
          borderRadius: 10,
          padding: "6px 14px",
          fontFamily: FUENTE.mono,
          fontWeight: 700,
          fontSize: 34,
          color: COLOR.verde,
          background: "rgba(62,224,192,0.08)",
          boxShadow: `0 0 24px ${COLOR.verde}33`,
        }}
      >
        {numero}
      </div>
      <div
        style={{
          fontFamily: FUENTE.inter,
          fontWeight: 800,
          fontSize: 48,
          letterSpacing: 1,
          color: COLOR.texto,
          clipPath: `inset(0 ${100 - barrido * 100}% 0 0)`,
          textShadow: "0 4px 18px rgba(0,0,0,0.6)",
        }}
      >
        {titulo}
      </div>
    </div>
  );
};

/** Contador HUD abajo a la izquierda (por encima de la franja de Instagram). */
export const ContadorHud: React.FC<{
  etiqueta: string;
  valor: number;
  decimales?: number;
  unidad?: string;
  color?: string;
  aparece?: number;
  sale?: number;
  extra?: string;
  prefijo?: string;
}> = ({ etiqueta, valor, decimales = 0, unidad = "", color = COLOR.azul, aparece = 6, sale, extra, prefijo = "" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrada = resorte(frame, fps, aparece, { damping: 18 });
  const salida = sale === undefined ? 0 : entre(frame, sale, sale + 10);
  const parpadeo = 0.55 + 0.45 * Math.abs(Math.sin(frame / 14));
  return (
    <div
      style={{
        position: "absolute",
        left: SEGURO.izquierda,
        bottom: SEGURO.abajo + 24,
        opacity: entrada * (1 - salida),
        translate: `0px ${interpolate(entrada, [0, 1], [30, 0])}px`,
        background: COLOR.hudFondo,
        border: `1px solid ${color}66`,
        borderLeft: `4px solid ${color}`,
        borderRadius: 6,
        padding: "12px 20px",
        fontFamily: FUENTE.mono,
        color: COLOR.texto,
        minWidth: 300,
      }}
    >
      <div
        style={{
          fontSize: 20,
          letterSpacing: 2,
          color: COLOR.textoSuave,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: 4, background: color, opacity: parpadeo }} />
        {etiqueta}
      </div>
      <div style={{ fontSize: 44, fontWeight: 700, color, marginTop: 2 }}>
        {prefijo}
        {formatear(valor, decimales)}
        {unidad ? <span style={{ fontSize: 26, marginLeft: 8, color: COLOR.texto }}>{unidad}</span> : null}
        {extra ? <span style={{ fontSize: 22, marginLeft: 14, color: COLOR.textoSuave }}>{extra}</span> : null}
      </div>
    </div>
  );
};
