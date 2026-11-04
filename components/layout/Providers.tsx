"use client";

import { LazyMotion, MotionConfig } from "framer-motion";
import { LangProvider } from "@/lib/i18n";
import { QuoteProvider } from "@/lib/quote";
import { DemoStyleProvider } from "@/lib/demo-style";

// Las funciones de animación se cargan aparte, para que la página sea interactiva antes.
const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {/* reducedMotion="user": si el visitante pidió reducir movimiento, se desactivan los desplazamientos. */}
      <MotionConfig reducedMotion="user">
        <LangProvider>
          <QuoteProvider>
            <DemoStyleProvider>{children}</DemoStyleProvider>
          </QuoteProvider>
        </LangProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
