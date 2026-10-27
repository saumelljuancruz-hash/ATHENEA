import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { ContenedorVista, Vista } from "./vista";

/** Un encuadre: a partir de `desde` (frame) la cámara mira `foco` con `zoom` (y `giro`). */
export type Corte = { desde: number; zoom: number; foco: [number, number]; giro?: number; destino?: [number, number] };

const CENTRO: [number, number] = [540, 900];
const RAPIDO = Easing.bezier(0.7, 0, 0.2, 1);

/**
 * Cambia de encuadre en cada corte con un movimiento rápido (≈ 0,15 s) y, entre cortes,
 * sigue empujando la cámara un poco: nunca queda quieta (GUIA-REELS: cortes cada 2–3 s).
 */
export const vistaCortes = (frame: number, cortes: Corte[], transicion = 9): Vista => {
  const lista = [...cortes].sort((a, b) => a.desde - b.desde);
  let i = 0;
  while (i < lista.length - 1 && frame >= lista[i + 1].desde) i++;
  const actual = lista[i];
  const previo = lista[Math.max(0, i - 1)];
  const t = i === 0 ? 1 : interpolate(frame, [actual.desde, actual.desde + transicion], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: RAPIDO });
  const mezcla = (a: number, b: number) => a + (b - a) * t;
  const empuje = 1 + 0.0009 * Math.max(0, frame - actual.desde);
  const fa = previo.foco;
  const fb = actual.foco;
  const da = previo.destino ?? CENTRO;
  const db = actual.destino ?? CENTRO;
  return {
    zoom: mezcla(previo.zoom, actual.zoom) * Math.min(1.08, empuje),
    giro: mezcla(previo.giro ?? 0, actual.giro ?? 0),
    foco: [mezcla(fa[0], fb[0]), mezcla(fa[1], fb[1])],
    destino: [mezcla(da[0], db[0]), mezcla(da[1], db[1])],
  };
};

/** Envuelve el escenario con la cámara de cortes. */
export const Cortes: React.FC<{ cortes: Corte[]; children: React.ReactNode }> = ({ cortes, children }) => {
  const frame = useCurrentFrame();
  return <ContenedorVista vista={vistaCortes(frame, cortes)}>{children}</ContenedorVista>;
};
