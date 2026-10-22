import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ENTRA_SALE, entre, flotar, resorte } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE, SEGURO } from "../../comun/tema";
import { Camara, dibujarMalla, NUMEROS, proyectar, Vec3 } from "../cabeza";
import { Candado } from "../componentes/Candado";
import { Escenario } from "../componentes/Escenario";
import { TEXTOS } from "../guion-faceid";
import { MarcasFaceId } from "../linea-faceid";
import { CAM_BUSTO, conYaw } from "./encuadres";

export type PropsMapa3D = { marcas: MarcasFaceId["mapa3d"]; duracion: number };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const CANDADO = { x: 810, y: 1080 };

/** Foto plana (papel con una cara dibujada) en el plano z = `z`. */
const dibujarFoto = (ctx: CanvasRenderingContext2D, cam: Camara, opacidad: number, z = 0.95) => {
  if (opacidad <= 0) return;
  const p = (x: number, y: number) => proyectar([x, y, z] as Vec3, cam);
  const linea = (pts: [number, number][], cerrar = false) => {
    ctx.beginPath();
    pts.forEach(([x, y], i) => {
      const q = p(x, y);
      if (i === 0) ctx.moveTo(q.x, q.y);
      else ctx.lineTo(q.x, q.y);
    });
    if (cerrar) ctx.closePath();
  };
  const elipse = (cx: number, cy: number, rx: number, ry: number): [number, number][] =>
    Array.from({ length: 40 }, (_, i) => [cx + rx * Math.cos((i / 40) * 2 * Math.PI), cy + ry * Math.sin((i / 40) * 2 * Math.PI)]);
  ctx.save();
  ctx.globalAlpha = opacidad;
  linea([[-0.9, -1.15], [0.9, -1.15], [0.9, 1.1], [-0.9, 1.1]], true);
  ctx.fillStyle = "#c9cdd4";
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 30;
  ctx.fill();
  ctx.shadowBlur = 0;
  linea([[-0.8, -1.05], [0.8, -1.05], [0.8, 1.0], [-0.8, 1.0]], true);
  ctx.fillStyle = "#8d929b";
  ctx.fill();
  linea(elipse(0, 0, 0.55, 0.78), true);
  ctx.fillStyle = "#b4b8c0";
  ctx.fill();
  ctx.strokeStyle = "#5d626b";
  ctx.lineWidth = 3;
  for (const ojo of [-0.2, 0.2]) {
    linea(elipse(ojo, 0.12, 0.09, 0.035), true);
    ctx.stroke();
  }
  linea([[0, 0.05], [-0.05, -0.22], [0.05, -0.24]]);
  ctx.stroke();
  linea([[-0.15, -0.45], [0, -0.48], [0.15, -0.45]]);
  ctx.stroke();
  ctx.restore();
};

export const Mapa3D: React.FC<PropsMapa3D> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.mapa3d;
  const s = (seg: number) => seg * fps;

  const malla = entre(frame, m.mapa, m.mapa + s(0.9));
  const numeros = entre(frame, m.numeros, m.numeros + s(0.5)) * (1 - entre(frame, m.compara, m.compara + s(0.35)));
  const comparar = entre(frame, m.compara, m.compara + s(0.4)) * (1 - entre(frame, m.porEso, m.porEso + s(0.3)));
  const junta = entre(frame, m.guardo - s(0.2), m.guardo + s(0.5), ENTRA_SALE);
  const coincide = m.guardo + s(0.5);
  const oscuro = entre(frame, m.porEso, m.porEso + s(0.35)) * (1 - entre(frame, m.engana - s(0.1), m.engana + s(0.2)));
  const foto = entre(frame, m.engana, m.engana + s(0.35));
  const rechazo = m.engana + s(0.5);

  // La malla gira sin parar; con la foto, el giro muestra que es plana.
  const yaw = 0.5 * Math.sin(frame / 42) + (foto > 0 ? 0.35 * foto * Math.sin(frame / 30) : 0);
  const cam = conYaw(CAM_BUSTO, yaw, {
    escala: lerp(285, 215, numeros),
    centro: [lerp(560, 330, numeros), lerp(700, 690, numeros)],
  });
  const camGuardada: Camara = conYaw(CAM_BUSTO, yaw + 0.8 * (1 - junta), {
    escala: 285,
    centro: [560 + 330 * (1 - junta), 700 + 40 * (1 - junta)],
  });

  // Candado: se abre al coincidir, se cierra para las pruebas, se reabre a oscuras y rechaza la foto.
  const apertura =
    entre(frame, coincide, coincide + s(0.25)) * (1 - entre(frame, m.porEso, m.porEso + s(0.2))) +
    entre(frame, m.oscuras, m.oscuras + s(0.25)) * (1 - entre(frame, m.engana - s(0.1), m.engana + s(0.1)));
  const temblor = frame > rechazo && frame < rechazo + s(0.5) ? Math.sin((frame - rechazo) * 1.6) * 10 * (1 - (frame - rechazo) / s(0.5)) : 0;
  const colorCandado = foto > 0.5 ? COLOR.rojo : apertura > 0.5 ? COLOR.verde : COLOR.texto;
  const verCandado = entre(frame, m.compara, m.compara + s(0.3));
  const popCandado = resorte(frame, fps, m.compara, { damping: 12 });

  const coincidencia = foto > 0.5 ? 0 : 99.9 * junta;

  return (
    <Escena name="Mapa3D">
      <Sfx efecto="bip" desde={m.mapa} volumen={0.22} />
      <Sfx efecto="bip" desde={m.numeros} volumen={0.18} />
      <Sfx efecto="candado" desde={coincide} />
      <Sfx efecto="candado" desde={m.oscuras} volumen={0.4} />
      <Sfx efecto="tap" desde={rechazo} volumen={0.35} />

      <Escenario
        cam={cam}
        busto={{ luz: lerp(0.9, 0.06, oscuro), opacidad: (1 - 0.7 * malla) * (1 - foto) }}
        malla={{ progreso: malla, opacidad: (1 - 0.6 * oscuro) * (1 - foto) * (1 - 0.65 * numeros) }}
        puntos={
          foto > 0
            ? { aparicion: foto, aterrizaje: 1, sobrePlano: true, plano: 0.96, opacidad: foto }
            : { aparicion: 1, aterrizaje: 1, opacidad: lerp(1 - 0.6 * malla, 1, oscuro) * (1 - numeros) }
        }
        extra={(ctx) => {
          if (comparar > 0) dibujarMalla(ctx, camGuardada, { color: COLOR.azul, opacidad: comparar * 0.9 * (1 - 0.5 * junta) });
          dibujarFoto(ctx, cam, foto);
        }}
      />

      {/* Luces apagadas */}
      <AbsoluteFill style={{ background: "#050607", opacity: 0.55 * oscuro, pointerEvents: "none" }} />

      {/* Columna de números */}
      <div
        style={{
          position: "absolute",
          left: 600,
          top: 430,
          opacity: numeros,
          fontFamily: FUENTE.mono,
          fontSize: 25,
          lineHeight: 1.45,
          color: COLOR.azul,
          whiteSpace: "pre",
        }}
      >
        {NUMEROS.slice(0, 22).map((n, i) => (
          <div
            key={i}
            style={{
              opacity: entre(frame, m.numeros + i * 1.2, m.numeros + i * 1.2 + 6),
              translate: `${(1 - entre(frame, m.numeros + i * 1.2, m.numeros + i * 1.2 + 8)) * -120}px 0px`,
            }}
          >
            {n}
          </div>
        ))}
      </div>

      {/* Candado de estado */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: verCandado }}>
        <circle cx={CANDADO.x} cy={CANDADO.y} r={78 * popCandado} fill="rgba(8,9,11,0.78)" stroke={colorCandado} strokeWidth={3} />
        <Candado x={CANDADO.x} y={CANDADO.y + 4} tamano={78 * popCandado} apertura={apertura} color={colorCandado} temblor={temblor} />
      </svg>

      <AbsoluteFill>
        <HudEtiqueta ancla={{ x: 330, y: 470 }} caja={{ x: 600, y: 390 }} texto={T.numeros} color={COLOR.azul} aparece={m.numeros + 4} desaparece={m.compara} />
        <HudEtiqueta ancla={{ x: 560 + 330 * (1 - junta) + 120, y: 520 }} caja={{ x: 900 - 10, y: 380 }} lado="izquierda" texto={T.guardada} color={COLOR.azul} aparece={m.compara + 6} desaparece={m.guardo + s(0.2)} />
        <HudEtiqueta ancla={{ x: CANDADO.x - 70, y: CANDADO.y }} caja={{ x: CANDADO.x - 120, y: CANDADO.y + 130 }} lado="izquierda" texto={T.coincide} color={COLOR.verde} aparece={coincide} desaparece={m.porEso} />
        <HudEtiqueta ancla={{ x: CANDADO.x - 70, y: CANDADO.y }} caja={{ x: CANDADO.x - 120, y: CANDADO.y + 130 }} lado="izquierda" texto={T.oscuras} color={COLOR.verde} aparece={m.oscuras} desaparece={m.engana - s(0.1)} />
        <HudEtiqueta ancla={{ x: CANDADO.x - 70, y: CANDADO.y }} caja={{ x: CANDADO.x - 100, y: CANDADO.y + 130 }} lado="izquierda" texto={T.foto} color={COLOR.rojo} aparece={rechazo - 6} tamano={22} />
      </AbsoluteFill>

      {/* Indicador de luces apagadas */}
      <div
        style={{
          position: "absolute",
          left: SEGURO.izquierda,
          top: 230,
          opacity: oscuro,
          translate: `${interpolate(oscuro, [0, 1], [-20, 0])}px ${flotar(frame, 120, 2)}px`,
          background: "rgba(8,9,11,0.78)",
          border: `1px solid ${COLOR.magenta}88`,
          borderRadius: 6,
          padding: "8px 16px",
          fontFamily: FUENTE.mono,
          fontWeight: 700,
          fontSize: 24,
          color: COLOR.magenta,
        }}
      >
        ● {T.luces}
      </div>

      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud
        etiqueta={T.contador}
        valor={coincidencia}
        decimales={1}
        unidad="%"
        color={foto > 0.5 ? COLOR.rojo : COLOR.verde}
        aparece={m.compara}
      />
    </Escena>
  );
};
