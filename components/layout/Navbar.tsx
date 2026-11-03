"use client";

import { AnimatePresence, m, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { buttonClass } from "@/components/ui/Button";
import { IconMenu, IconMoon, IconSun, IconX } from "@/components/ui/Icons";
import { Logo } from "./Logo";

const SECTIONS = ["demo", "ahorro", "proyectos", "planes", "presupuesto", "proceso", "faq"] as const;

export function Navbar() {
  const { t } = useLang();
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => setCompact(y > 24));

  const labels: Record<(typeof SECTIONS)[number], string> = {
    demo: t.nav.demo,
    ahorro: t.nav.savings,
    proyectos: t.nav.work,
    planes: t.nav.pricing,
    presupuesto: t.nav.quote,
    proceso: t.nav.process,
    faq: t.nav.faq,
  };

  // Resalta la sección visible.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Menú móvil: bloquea scroll y cierra con Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <a
        href="#contenido"
        className="sr-only z-[60] rounded-full bg-primary px-4 py-2 font-semibold text-primary-fg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {t.nav.skip}
      </a>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
        <m.nav
          aria-label="Principal"
          animate={{ paddingTop: compact ? 8 : 14, paddingBottom: compact ? 8 : 14 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full px-3 transition-[background-color,border-color,box-shadow] duration-300 sm:px-4 ${
            compact || open
              ? "border border-line bg-bg/80 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.35)] backdrop-blur-xl"
              : "border border-transparent"
          }`}
        >
          <a href="#inicio" className="flex items-center gap-2 rounded-full pl-1">
            <Logo compact={compact} />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {SECTIONS.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? "true" : undefined}
                  className={`relative isolate rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                    active === id ? "text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {active === id && (
                    <m.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-surface-2"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  {labels[id]}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            <LangToggle />
            <ThemeToggle />
            <a href="#contacto" className={buttonClass("primary", "max-sm:hidden !min-h-10 !px-4 !py-2 text-sm")}>
              {t.nav.cta}
            </a>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.nav.close : t.nav.menu}
              className="grid size-10 place-items-center rounded-full text-fg hover:bg-surface-2 lg:hidden"
            >
              {open ? <IconX /> : <IconMenu />}
            </button>
          </div>
        </m.nav>

        <AnimatePresence>
          {open && (
            <m.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl border border-line bg-bg/95 p-3 shadow-2xl backdrop-blur-xl lg:hidden"
            >
              <ul className="grid gap-1">
                {SECTIONS.map((id, i) => (
                  <m.li key={id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i }}>
                    <a
                      href={`#${id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-xl hover:bg-surface-2"
                    >
                      {labels[id]}
                      <span className="text-xs text-muted">0{i + 1}</span>
                    </a>
                  </m.li>
                ))}
              </ul>
              <a href="#contacto" onClick={() => setOpen(false)} className={buttonClass("primary", "mt-2 w-full")}>
                {t.hero.cta}
              </a>
            </m.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

function LangToggle() {
  const { lang, setLang, t } = useLang();
  return (
    <div role="group" aria-label={t.nav.langLabel} className="flex items-center rounded-full border border-line p-0.5 text-xs font-semibold">
      {(["es", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          lang={l}
          className={`relative isolate rounded-full px-2.5 py-1.5 uppercase transition-colors ${lang === l ? "text-primary-fg" : "text-muted hover:text-fg"}`}
        >
          {lang === l && (
            <m.span layoutId="lang-pill" className="absolute inset-0 -z-10 rounded-full bg-primary" transition={{ type: "spring", stiffness: 500, damping: 35 }} />
          )}
          {l}
        </button>
      ))}
    </div>
  );
}

function ThemeToggle() {
  const { t } = useLang();
  const [dark, setDark] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lee el tema aplicado por el script inicial
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? t.nav.themeToLight : t.nav.themeToDark}
      className="grid size-10 place-items-center overflow-hidden rounded-full text-fg hover:bg-surface-2"
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={dark ? "moon" : "sun"}
          initial={{ y: 14, opacity: 0, rotate: -40 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -14, opacity: 0, rotate: 40 }}
          transition={{ duration: 0.2 }}
        >
          {dark ? <IconMoon /> : <IconSun />}
        </m.span>
      </AnimatePresence>
    </button>
  );
}
