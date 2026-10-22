import React from "react";
import { AbsoluteFill } from "remotion";
import { Camara, dibujarBusto, dibujarMalla, dibujarPuntos, OpcionesPuntos } from "../cabeza";
import { Lienzo } from "./Lienzo";
import { aLienzo, Pantalla, SENSORES, Telefono, Ubicacion } from "./Telefono";

/** Cámara 2D sobre todo el escenario: zoom y giro alrededor de `foco`, que se lleva a `destino`. */
export type Vista = { zoom: number; giro: number; foco: [number, number]; destino: [number, number] };

export const VISTA_NEUTRA: Vista = { zoom: 1, giro: 0, foco: [540, 960], destino: [540, 960] };

export const aPantalla = ([x, y]: [number, number], v: Vista) => {
  const a = (v.giro * Math.PI) / 180;
  const dx = (x - v.foco[0]) * v.zoom;
  const dy = (y - v.foco[1]) * v.zoom;
  return { x: v.destino[0] + dx * Math.cos(a) - dy * Math.sin(a), y: v.destino[1] + dx * Math.sin(a) + dy * Math.cos(a) };
};

/**
 * Busto + puntos/malla en canvas, con el teléfono delante. Todo comparte la
 * misma "cámara 2D" (`vista`) para poder hacer zoom al notch.
 */
export const Escenario: React.FC<{
  cam: Camara;
  vista?: Vista;
  busto?: { luz?: number; opacidad?: number };
  puntos?: Omit<OpcionesPuntos, "origen">;
  malla?: { progreso?: number; color?: string; opacidad?: number };
  /** Dibujos extra en el canvas (otra malla, una foto, etc.). */
  extra?: (ctx: CanvasRenderingContext2D) => void;
  telefono?: { ubicacion: Ubicacion; pantalla?: Pantalla; apertura?: number; emision?: number } | null;
  /** Desenfoque del busto (profundidad de campo). */
  desenfoqueBusto?: number;
}> = ({ cam, vista = VISTA_NEUTRA, busto, puntos, malla, extra, telefono, desenfoqueBusto = 0 }) => {
  const origen = telefono ? aLienzo(SENSORES.proyector, telefono.ubicacion) : undefined;
  return (
    <AbsoluteFill
      style={{
        transformOrigin: "0 0",
        transform: `translate(${vista.destino[0]}px, ${vista.destino[1]}px) rotate(${vista.giro}deg) scale(${vista.zoom}) translate(${-vista.foco[0]}px, ${-vista.foco[1]}px)`,
      }}
    >
      {/* Dos capas: el busto puede desenfocarse (profundidad de campo) y los puntos quedan nítidos. */}
      <Lienzo
        style={{ filter: desenfoqueBusto > 0.2 ? `blur(${desenfoqueBusto}px)` : undefined }}
        dibujar={(ctx) => {
          if (busto) dibujarBusto(ctx, cam, busto);
          if (malla) dibujarMalla(ctx, cam, malla);
          extra?.(ctx);
        }}
      />
      {puntos ? <Lienzo dibujar={(ctx) => dibujarPuntos(ctx, cam, { ...puntos, origen })} /> : null}
      {telefono ? (
        <Telefono
          ubicacion={telefono.ubicacion}
          pantalla={telefono.pantalla}
          apertura={telefono.apertura}
          emision={telefono.emision}
        />
      ) : null}
    </AbsoluteFill>
  );
};
