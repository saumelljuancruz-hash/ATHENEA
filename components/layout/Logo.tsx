import { site } from "@/content/site";

function splitName(name: string) {
  const [first, ...rest] = name.split(" ");
  return { first, rest: rest.join(" ") };
}

/** Logo: monograma + nombre. Reemplázalo por tu logo cuando lo tengas. */
export function Logo({ compact = false }: { compact?: boolean }) {
  const full = splitName(site.name);
  const short = splitName(site.shortName);
  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-full bg-primary font-display text-lg font-semibold italic leading-none text-primary-fg"
      >
        {full.first.charAt(0)}
      </span>
      <span className="font-display text-[17px] font-semibold leading-none tracking-tight whitespace-nowrap">
        <span className={`sm:hidden ${compact ? "max-[380px]:hidden" : ""}`}>
          {short.first} <span className="italic text-primary">{short.rest}</span>
        </span>
        <span className="hidden sm:inline">
          {full.first} <span className="italic text-primary">{full.rest}</span>
        </span>
      </span>
    </span>
  );
}
