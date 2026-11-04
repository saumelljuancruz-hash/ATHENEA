/** "USD 250" / "USD 1,250" */
export function usd(value: number) {
  return `USD ${Math.round(value).toLocaleString("en-US")}`;
}

/** Precio del menú de la demo: "$11" o "$2.50". */
export function money(value: number, symbol = "$") {
  return `${symbol}${Number.isInteger(value) ? value : value.toFixed(2)}`;
}

/** Scroll suave a una sección (respeta "reducir movimiento"). */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}
