import React, { useLayoutEffect, useRef, useState } from "react";
import { AbsoluteFill, continueRender, delayRender } from "remotion";
import { Logo } from "./CierreCTA";
import { COLOR, FUENTE } from "./tema";

export type LineaPortada = { texto: string; color?: string };

const ANCHO_TEXTO = 920;
const MAXIMO = 175;

/** Una línea de título que se agranda hasta llenar `ancho` (sin pasarse de `maximo`). */
export const LineaAjustada: React.FC<{ linea: LineaPortada; ancho?: number; maximo?: number }> = ({
  linea,
  ancho: anchoTexto = ANCHO_TEXTO,
  maximo = MAXIMO,
}) => {
  const medida = useRef<HTMLSpanElement>(null);
  const [tamano, setTamano] = useState(100);
  const [espera] = useState(() => delayRender("Midiendo el título de la portada"));
  const estilo: React.CSSProperties = { fontFamily: FUENTE.inter, fontWeight: 800, letterSpacing: -2, whiteSpace: "nowrap" };
  useLayoutEffect(() => {
    document.fonts.ready.then(() => {
      // Se mide una copia invisible a 100 px y se escala a lo ancho.
      const ancho = medida.current?.getBoundingClientRect().width || anchoTexto;
      setTamano(Math.min(maximo, Math.floor((100 * anchoTexto) / ancho)));
      continueRender(espera);
    });
  }, [espera, anchoTexto, maximo]);
  return (
    <>
      <span ref={medida} style={{ ...estilo, fontSize: 100, position: "absolute", visibility: "hidden" }}>
        {linea.texto}
      </span>
      <div
        style={{
          ...estilo,
          fontSize: tamano,
          lineHeight: 1.0,
          color: linea.color ?? COLOR.texto,
          textShadow: linea.color ? `0 0 40px ${linea.color}66` : "0 6px 30px rgba(0,0,0,0.6)",
        }}
      >
        {linea.texto}
      </div>
    </>
  );
};

/**
 * Portada (imagen fija) de un Reel: arte arriba, pregunta gigante abajo y la cuenta.
 * Todo lo importante queda dentro del recorte 4:5 de la grilla (y 285–1635).
 */
export const Portada: React.FC<{
  fondo: React.ReactNode;
  etiqueta: { texto: string; color: string };
  lineas: LineaPortada[];
  subrayado: string;
  logo: string;
  usuario: string;
}> = ({ fondo, etiqueta, lineas, subrayado, logo, usuario }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.fondoOscuro, overflow: "hidden" }}>
      {fondo}
      {/* Oscurece abajo para que el título se lea siempre */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(22,23,26,0) 45%, rgba(22,23,26,0.92) 62%, #16171a 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(22,23,26,0.85) 0%, rgba(22,23,26,0) 22%)" }} />

      {/* Cuenta */}
      <div style={{ position: "absolute", left: 80, top: 300, display: "flex", alignItems: "center", gap: 20 }}>
        <Logo disponible src={logo} />
        <div style={{ fontFamily: FUENTE.mono, fontWeight: 700, fontSize: 30, color: COLOR.texto }}>{usuario}</div>
      </div>

      {/* Etiqueta + título */}
      <div style={{ position: "absolute", left: 80, right: 80, bottom: 1920 - 1590 }}>
        <div
          style={{
            display: "inline-block",
            fontFamily: FUENTE.mono,
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: 3,
            color: etiqueta.color,
            border: `3px solid ${etiqueta.color}`,
            background: `linear-gradient(${etiqueta.color}26, ${etiqueta.color}26), rgba(22,23,26,0.92)`,
            borderRadius: 12,
            padding: "8px 20px",
            marginBottom: 28,
          }}
        >
          {etiqueta.texto}
        </div>
        {lineas.map((l, k) => (
          <LineaAjustada key={k} linea={l} />
        ))}
        <div style={{ width: 260, height: 14, borderRadius: 7, background: subrayado, marginTop: 26, boxShadow: `0 0 30px ${subrayado}88` }} />
      </div>
    </AbsoluteFill>
  );
};
