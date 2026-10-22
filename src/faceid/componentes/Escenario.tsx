import React from "react";
import { ContenedorVista, Vista, VISTA_NEUTRA } from "../../comun/vista";
import { Camara, dibujarBusto, dibujarMalla, dibujarPuntos, OpcionesPuntos } from "../cabeza";
import { Lienzo } from "./Lienzo";
import { aLienzo, Pantalla, SENSORES, Telefono, Ubicacion } from "./Telefono";

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
    <ContenedorVista vista={vista}>
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
    </ContenedorVista>
  );
};
