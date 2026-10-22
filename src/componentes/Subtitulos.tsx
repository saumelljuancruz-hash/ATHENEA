import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PALABRAS_CLAVE, SUBTITULOS } from "../guion-avion";
import { normalizar } from "../linea-de-tiempo";
import { COLOR, FUENTE, SEGURO } from "../tema";
import { PalabraConTiempo } from "../timestamps-estimados";

type Bloque = { palabras: PalabraConTiempo[]; inicio: number; fin: number };

const CLAVES = new Set(PALABRAS_CLAVE.map(normalizar));

/** Agrupa las palabras en bloques de 2–4, cortando en la puntuación. */
export const armarBloques = (palabras: PalabraConTiempo[]): Bloque[] => {
  const bloques: Bloque[] = [];
  let actual: PalabraConTiempo[] = [];
  const cerrar = () => {
    if (actual.length) {
      bloques.push({ palabras: actual, inicio: actual[0].inicio, fin: actual[actual.length - 1].fin });
    }
    actual = [];
  };
  palabras.forEach((p, i) => {
    actual.push(p);
    const siguiente = palabras[i + 1];
    const texto = [...actual, ...(siguiente ? [siguiente] : [])].map((w) => w.palabra).join(" ");
    const puntuacion = /[.,?!;:]$/.test(p.palabra);
    const silencio = siguiente ? siguiente.inicio - p.fin > 0.6 : true;
    const lleno =
      actual.length >= 4 ||
      (actual.length >= SUBTITULOS.maxPalabras && texto.length > SUBTITULOS.maxCaracteresCon4);
    // Evita dejar una palabra suelta al final de una frase.
    const quedaUna = siguiente && /[.,?!;:]$/.test(siguiente.palabra) && actual.length < 4 && !puntuacion;
    if (puntuacion || silencio || (lleno && !quedaUna)) cerrar();
  });
  cerrar();
  return bloques;
};

export const Subtitulos: React.FC<{
  palabras: PalabraConTiempo[];
  ocultar: (frame: number) => boolean;
}> = ({ palabras, ocultar }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bloques = useMemo(() => armarBloques(palabras), [palabras]);
  const t = frame / fps;

  const i = bloques.findIndex((b, k) => {
    const hasta = Math.min(b.fin + 0.45, bloques[k + 1]?.inicio ?? Infinity);
    return t >= b.inicio - 0.06 && t < hasta;
  });
  if (i < 0 || ocultar(frame)) return null;
  const bloque = bloques[i];
  const entrada = interpolate(t, [bloque.inicio - 0.06, bloque.inicio + 0.08], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: SEGURO.izquierda,
          right: SEGURO.derecha,
          top: 1290,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignContent: "flex-start",
          gap: "0 18px",
          fontFamily: FUENTE.inter,
          fontWeight: 700,
          fontSize: 64,
          lineHeight: 1.15,
          textAlign: "center",
          translate: `0px ${(1 - entrada) * 14}px`,
          opacity: entrada,
        }}
      >
        {bloque.palabras.map((p, k) => {
          const dicha = t >= p.inicio - 0.04;
          const pop = interpolate(t, [p.inicio - 0.04, p.inicio + 0.1], [0.82, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const clave = CLAVES.has(normalizar(p.palabra));
          return (
            <span
              key={k}
              style={{
                color: clave ? COLOR.verde : COLOR.texto,
                opacity: dicha ? 1 : 0.28,
                scale: String(pop),
                display: "inline-block",
                textShadow: "0 4px 0 rgba(0,0,0,0.35), 0 6px 22px rgba(0,0,0,0.85)",
              }}
            >
              {p.palabra}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
