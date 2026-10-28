import React from "react";
import { COLOR, FUENTE } from "../../comun/tema";
import { Acaro, POROS, SuperficiePiel } from "./Piel";

/** El poro que se ve dentro de la lupa. */
export const PORO_LUPA = POROS[5];

/** Lupa circular (HTML) que muestra la piel aumentada con un ácaro asomando del poro. */
export const Lupa: React.FC<{ x: number; y: number; r: number; zoom: number; asoma: number; frame: number; etiqueta: string; noche?: number }> = ({
  x,
  y,
  r,
  zoom,
  asoma,
  frame,
  etiqueta,
  noche = 0,
}) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r }}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        overflow: "hidden",
        border: `6px solid ${COLOR.verde}`,
        boxShadow: `0 0 50px ${COLOR.verde}55, inset 0 0 60px rgba(0,0,0,0.6)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 1080,
          height: 1920,
          transformOrigin: "0 0",
          transform: `translate(${r - PORO_LUPA.x * zoom}px, ${r - PORO_LUPA.y * zoom}px) scale(${zoom})`,
        }}
      >
        <SuperficiePiel poros={POROS} noche={noche}>
          <defs>
            <clipPath id="sobrePoro">
              <rect x={0} y={0} width={1080} height={PORO_LUPA.y + 4} />
            </clipPath>
          </defs>
          <g clipPath="url(#sobrePoro)">
            <Acaro x={PORO_LUPA.x} y={PORO_LUPA.y + 110 - asoma * 150} escala={0.55} frame={frame} camina={asoma} />
          </g>
        </SuperficiePiel>
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        right: -10,
        top: -6,
        fontFamily: FUENTE.mono,
        fontWeight: 700,
        fontSize: 26,
        color: COLOR.verde,
        background: "rgba(8,9,11,0.85)",
        border: `1px solid ${COLOR.verde}88`,
        borderRadius: 6,
        padding: "4px 10px",
      }}
    >
      {etiqueta}
    </div>
  </div>
);
