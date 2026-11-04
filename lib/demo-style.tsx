"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { demoRestaurants, type DemoRestaurant } from "@/content/demo-menus";

type DemoId = DemoRestaurant["id"];

/** Estilo activo de la demo: lo cambia el selector de la demo y los botones "Ver demo" de los diseños. */
const DemoStyleContext = createContext<{ demoId: DemoId; setDemoId: (id: DemoId) => void } | null>(null);

export function DemoStyleProvider({ children }: { children: React.ReactNode }) {
  const [demoId, setDemoId] = useState<DemoId>(demoRestaurants[0].id);
  const value = useMemo(() => ({ demoId, setDemoId }), [demoId]);
  return <DemoStyleContext.Provider value={value}>{children}</DemoStyleContext.Provider>;
}

export function useDemoStyle() {
  const ctx = useContext(DemoStyleContext);
  if (!ctx) throw new Error("useDemoStyle debe usarse dentro de <DemoStyleProvider>");
  return ctx;
}
