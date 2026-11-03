import { Reveal } from "./Reveal";

export function Section({
  id,
  children,
  className = "",
  labelledBy,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`relative px-4 py-20 sm:px-6 sm:py-28 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "center" | "left";
}) {
  const center = align === "center";
  return (
    <Reveal className={`mb-12 sm:mb-16 ${center ? "mx-auto max-w-2xl text-center" : "max-w-xl"}`}>
      <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        <span className="h-px w-6 bg-primary" aria-hidden />
        {eyebrow}
      </p>
      <h2 id={id} className="font-display text-3xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-muted text-pretty sm:text-lg">{subtitle}</p>}
    </Reveal>
  );
}
