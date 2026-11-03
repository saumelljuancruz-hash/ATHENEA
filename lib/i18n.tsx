"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { es, type Dict } from "@/content/i18n/es";
import { en } from "@/content/i18n/en";
import { site } from "@/content/site";
import type { L10n, Lang } from "@/content/types";

const dictionaries: Record<Lang, Dict> = { es, en };
const STORAGE_KEY = "lang";

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Textos de la interfaz en el idioma activo. */
  t: Dict;
  /** Traduce un texto de los archivos de datos ({ es, en }). */
  l: (text: L10n) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  // Idioma guardado o pedido por URL (?lang=en). Por defecto, español.
  useEffect(() => {
    let initial: Lang | null = null;
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (fromUrl === "en" || fromUrl === "es") initial = fromUrl;
    if (!initial) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === "en" || saved === "es") initial = saved;
      } catch {}
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza con el navegador una sola vez
    if (initial && initial !== "es") setLangState(initial);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = `${site.name} · ${dictionaries[lang].meta.title}`;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }, []);

  const value = useMemo<LangContextValue>(
    () => ({ lang, setLang, t: dictionaries[lang], l: (text) => text[lang] }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang debe usarse dentro de <LangProvider>");
  return ctx;
}
