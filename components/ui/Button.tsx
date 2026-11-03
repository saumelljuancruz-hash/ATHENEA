import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "ghost" | "whatsapp";

const styles: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-fg hover:bg-primary-hover shadow-[0_10px_30px_-10px_var(--glow)] hover:shadow-[0_14px_40px_-10px_var(--glow)]",
  outline: "border border-line bg-surface/40 text-fg hover:border-fg/40 hover:bg-surface",
  ghost: "text-fg hover:bg-surface-2",
  whatsapp: "bg-whatsapp text-[#0b2e17] hover:brightness-105 shadow-[0_10px_30px_-12px_rgb(37_211_102/0.6)]",
};

export function buttonClass(variant: Variant = "primary", extra = "") {
  return `inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 ${styles[variant]} ${extra}`;
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type="button" className={buttonClass(variant, className)} {...props} />;
}

export function LinkButton({
  variant = "primary",
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant }) {
  return <a className={buttonClass(variant, className)} {...props} />;
}
