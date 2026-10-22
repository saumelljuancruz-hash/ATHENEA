import { EstadoMapa, lerp } from "../geo";

type Rect = [[number, number], [number, number]];

/** Placa de Mercator centrada en el Pacífico Norte: Tokio a la izquierda, Nueva York a la derecha. */
export const PLACA_PACIFICO: EstadoMapa = {
  aplanado: 1,
  mercator: 1,
  radioGlobo: 400 / 295,
  escala: 295,
  centro: [540, 1049],
  rotacion: [147, 0, 0],
  recorte: [
    [56, 330],
    [1024, 1111],
  ],
};

export const FOCO_MAPA: [number, number] = [540, 720];

/** Acerca la "cámara" alrededor de un foco de pantalla, con desplazamiento opcional. */
export const acercar = (
  e: EstadoMapa,
  zoom: number,
  foco: [number, number] = FOCO_MAPA,
  desplazamiento: [number, number] = [0, 0],
): EstadoMapa => {
  const mover = ([x, y]: [number, number]): [number, number] => [
    foco[0] + (x - foco[0]) * zoom + desplazamiento[0],
    foco[1] + (y - foco[1]) * zoom + desplazamiento[1],
  ];
  return {
    ...e,
    escala: e.escala * zoom,
    centro: mover(e.centro),
    recorte: e.recorte ? [mover(e.recorte[0]), mover(e.recorte[1])] : e.recorte,
  };
};

export const lerpRect = (a: Rect, b: Rect, t: number): Rect => [
  [lerp(a[0][0], b[0][0], t), lerp(a[0][1], b[0][1], t)],
  [lerp(a[1][0], b[1][0], t), lerp(a[1][1], b[1][1], t)],
];
