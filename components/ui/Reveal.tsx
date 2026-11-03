"use client";

import { m, type HTMLMotionProps } from "framer-motion";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  /** Desplazamiento vertical inicial en px. */
  y?: number;
  /** Etiqueta HTML a usar (li dentro de listas). */
  as?: "div" | "li";
};

/** Aparece suavemente al entrar en pantalla (una sola vez). */
export function Reveal({ delay = 0, y = 24, as = "div", children, ...rest }: RevealProps) {
  const Comp = (as === "li" ? m.li : m.div) as typeof m.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
