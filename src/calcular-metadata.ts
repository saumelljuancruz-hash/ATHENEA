import { ALL_FORMATS, Input, UrlSource } from "mediabunny";
import { CalculateMetadataFunction, staticFile } from "remotion";
import { ARCHIVOS, CUENTA } from "./guion-avion";
import { PalabraConTiempo, TIMESTAMPS_ESTIMADOS } from "./timestamps-estimados";

export const FPS = 60;
const MIN_FRAMES = 1800;
const MAX_FRAMES = 2400;
const COLA_SEGUNDOS = 0.5;

export type PropsReel = {
  palabras: PalabraConTiempo[];
  fuenteTimestamps: "json" | "estimados-escalados" | "estimados";
  duracionVoz: number;
  vozDisponible: boolean;
  logoDisponible: boolean;
};

export const PROPS_POR_DEFECTO: PropsReel = {
  palabras: TIMESTAMPS_ESTIMADOS,
  fuenteTimestamps: "estimados",
  duracionVoz: TIMESTAMPS_ESTIMADOS[TIMESTAMPS_ESTIMADOS.length - 1].fin + 0.3,
  vozDisponible: false,
  logoDisponible: false,
};

const existe = async (src: string, signal?: AbortSignal) => {
  try {
    const r = await fetch(src, { method: "HEAD", signal });
    return r.ok;
  } catch {
    return false;
  }
};

const duracionAudio = async (src: string) => {
  const input = new Input({ formats: ALL_FORMATS, source: new UrlSource(src) });
  try {
    return await input.computeDuration();
  } finally {
    input.dispose();
  }
};

type Crudo = Record<string, unknown>;

const num = (o: Crudo, ...claves: string[]) => {
  for (const c of claves) {
    if (typeof o[c] === "number") {
      return c.endsWith("Ms") ? (o[c] as number) / 1000 : (o[c] as number);
    }
  }
  return null;
};

/**
 * Acepta los formatos más comunes:
 * - [{word|text|palabra, start|inicio|startMs, end|fin|endMs}]
 * - {words: [...]} · {palabras: [...]} · {segments: [{words: [...]}]} (Whisper)
 * - Alineación de ElevenLabs: {characters, character_start_times_seconds, character_end_times_seconds}
 */
export const parsearTimestamps = (json: unknown): PalabraConTiempo[] => {
  const o = json as Crudo;
  const alineacion = (o?.alignment ?? o?.normalized_alignment ?? o) as Crudo;
  if (Array.isArray(alineacion?.characters)) {
    const chars = alineacion.characters as string[];
    const ini = alineacion.character_start_times_seconds as number[];
    const fin = alineacion.character_end_times_seconds as number[];
    const salida: PalabraConTiempo[] = [];
    let actual: PalabraConTiempo | null = null;
    chars.forEach((c, i) => {
      if (/\s/.test(c)) {
        if (actual) salida.push(actual);
        actual = null;
        return;
      }
      if (!actual) actual = { palabra: "", inicio: ini[i], fin: fin[i] };
      actual.palabra += c;
      actual.fin = fin[i];
    });
    if (actual) salida.push(actual);
    return salida;
  }

  let lista: unknown[] = [];
  if (Array.isArray(json)) lista = json;
  else if (Array.isArray(o?.words)) lista = o.words as unknown[];
  else if (Array.isArray(o?.palabras)) lista = o.palabras as unknown[];
  else if (Array.isArray(o?.segments)) {
    lista = (o.segments as Crudo[]).flatMap((s) => (s.words as unknown[]) ?? []);
  }

  return lista
    .map((x) => x as Crudo)
    .filter((x) => x.type !== "spacing")
    .map((x) => ({
      palabra: String(x.word ?? x.text ?? x.palabra ?? x.punctuated_word ?? "").trim(),
      inicio: num(x, "start", "inicio", "startMs", "start_time") ?? 0,
      fin: num(x, "end", "fin", "endMs", "end_time") ?? 0,
    }))
    .filter((p) => p.palabra.length > 0);
};

export const calcularMetadata: CalculateMetadataFunction<PropsReel> = async ({
  props,
  abortSignal,
}) => {
  const srcVoz = staticFile(ARCHIVOS.voz);
  const [vozDisponible, logoDisponible] = await Promise.all([
    existe(srcVoz, abortSignal),
    existe(staticFile(CUENTA.logo), abortSignal),
  ]);

  const duracionReal = vozDisponible ? await duracionAudio(srcVoz) : null;

  let palabras: PalabraConTiempo[] | null = null;
  try {
    const r = await fetch(staticFile(ARCHIVOS.timestamps), { signal: abortSignal });
    if (r.ok) {
      const p = parsearTimestamps(await r.json());
      if (p.length > 0) palabras = p;
    }
  } catch {
    palabras = null;
  }

  let fuenteTimestamps: PropsReel["fuenteTimestamps"] = "json";
  if (!palabras) {
    const finEstimado = TIMESTAMPS_ESTIMADOS[TIMESTAMPS_ESTIMADOS.length - 1].fin;
    // La voz suele terminar ~0.2 s antes del final del archivo.
    const k = duracionReal ? (duracionReal - 0.2) / finEstimado : 1;
    palabras = TIMESTAMPS_ESTIMADOS.map((p) => ({
      palabra: p.palabra,
      inicio: p.inicio * k,
      fin: p.fin * k,
    }));
    fuenteTimestamps = duracionReal ? "estimados-escalados" : "estimados";
  }

  const duracionVoz = duracionReal ?? palabras[palabras.length - 1].fin + 0.3;
  const durationInFrames = Math.min(
    MAX_FRAMES,
    Math.max(MIN_FRAMES, Math.ceil((duracionVoz + COLA_SEGUNDOS) * FPS)),
  );

  return {
    durationInFrames,
    defaultOutName: "avion",
    props: {
      ...props,
      palabras,
      fuenteTimestamps,
      duracionVoz,
      vozDisponible,
      logoDisponible,
    },
  };
};
