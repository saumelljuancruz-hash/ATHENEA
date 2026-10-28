import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ContenedorVista, Vista } from "./vista";

/** Un encuadre: a partir de `desde` (frame) la cámara mira `foco` con `zoom` (y `giro`). */
export type Corte = { desde: number; zoom: number; foco: [number, number]; giro?: number; destino?: [number, number] };

const CENTRO: [number, number] = [540, 900];
const ANCHO = 1080;
const ALTO = 1920;
/** Zoom mínimo y margen: el dibujo siempre tapa toda la pantalla, aun con el vaivén y el giro de la cámara. */
const ZOOM_MINIMO = 1.04;
const MARGEN = 14;

/**
 * Ajusta la vista para que el lienzo de 1080×1920 cubra siempre la pantalla:
 * nunca se ve el borde del dibujo (antes, al alejar o correr la cámara, aparecían franjas).
 */
const cubrir = (v: Vista): Vista => {
  const zoom = Math.max(ZOOM_MINIMO, v.zoom);
  const limitar = (inicio: number, lado: number) => Math.min(-MARGEN, Math.max(lado - lado * zoom + MARGEN, inicio));
  const izquierda = limitar(v.destino[0] - v.foco[0] * zoom, ANCHO);
  const arriba = limitar(v.destino[1] - v.foco[1] * zoom, ALTO);
  return { ...v, zoom, destino: [izquierda + v.foco[0] * zoom, arriba + v.foco[1] * zoom] };
};

/**
 * Cámara "en mano": un vaivén chiquito e irregular (suma de senos con períodos que no coinciden),
 * para que la imagen nunca se vea quieta ni mecánica (GUIA-REELS: animación humanizada).
 */
export const pulsoMano = (frame: number, intensidad = 1) => ({
  x: intensidad * (3.2 * Math.sin(frame / 37) + 1.8 * Math.sin(frame / 23 + 1.3) + 0.8 * Math.sin(frame / 11 + 0.4)),
  y:
    intensidad *
    (2.6 * Math.sin(frame / 41 + 2.1) + 1.6 * Math.sin(frame / 19 + 0.7) + 0.7 * Math.sin(frame / 13 + 2.9)),
  giro: intensidad * (0.32 * Math.sin(frame / 53 + 0.5) + 0.14 * Math.sin(frame / 29 + 1.7)),
});

/**
 * Cambia de encuadre en cada corte con un resorte (llega rápido, se pasa apenas y se acomoda,
 * como una cámara manejada por una persona) y la cámara "respira" con un zoom lento y continuo.
 * El respiro no se reinicia en cada corte: antes el empuje volvía de 1,07 a 1 en un solo cuadro y
 * se veía un salto.
 */
export const vistaCortes = (frame: number, cortes: Corte[], fps = 60): Vista => {
  const lista = [...cortes].sort((a, b) => a.desde - b.desde);
  let i = 0;
  while (i < lista.length - 1 && frame >= lista[i + 1].desde) i++;
  const actual = lista[i];
  const previo = lista[Math.max(0, i - 1)];
  const t =
    i === 0 ? 1 : spring({ frame: frame - actual.desde, fps, config: { damping: 15, stiffness: 150, mass: 0.9 } });
  const mezcla = (a: number, b: number) => a + (b - a) * t;
  const respiro = 1 + 0.035 * (0.5 - 0.5 * Math.cos(frame / 110));
  const mano = pulsoMano(frame);
  const fa = previo.foco;
  const fb = actual.foco;
  const da = previo.destino ?? CENTRO;
  const db = actual.destino ?? CENTRO;
  return cubrir({
    zoom: mezcla(previo.zoom, actual.zoom) * respiro,
    giro: mezcla(previo.giro ?? 0, actual.giro ?? 0) + mano.giro,
    foco: [mezcla(fa[0], fb[0]), mezcla(fa[1], fb[1])],
    destino: [mezcla(da[0], db[0]) + mano.x, mezcla(da[1], db[1]) + mano.y],
  });
};

/** Envuelve el escenario con la cámara de cortes. */
export const Cortes: React.FC<{ cortes: Corte[]; children: React.ReactNode }> = ({ cortes, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return <ContenedorVista vista={vistaCortes(frame, cortes, fps)}>{children}</ContenedorVista>;
};
