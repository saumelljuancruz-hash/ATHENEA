"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { MaintenanceId, PlanId } from "@/content/pricing";

/** Estado compartido: el plan elegido en "Planes" se refleja en el configurador y el contacto. */
type QuoteState = {
  planId: PlanId;
  setPlanId: (id: PlanId) => void;
  extraIds: string[];
  toggleExtra: (id: string) => void;
  maintenanceId: MaintenanceId;
  setMaintenanceId: (id: MaintenanceId) => void;
};

const QuoteContext = createContext<QuoteState | null>(null);

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [planId, setPlanId] = useState<PlanId>("pro");
  const [extraIds, setExtraIds] = useState<string[]>([]);
  const [maintenanceId, setMaintenanceId] = useState<MaintenanceId>("esencial");

  const value = useMemo<QuoteState>(
    () => ({
      planId,
      setPlanId,
      extraIds,
      toggleExtra: (id) => setExtraIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
      maintenanceId,
      setMaintenanceId,
    }),
    [planId, extraIds, maintenanceId],
  );

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote debe usarse dentro de <QuoteProvider>");
  return ctx;
}
