"use client";

import Image from "next/image";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { IconBag, IconPlus, IconWhatsApp } from "@/components/ui/Icons";

const ITEMS = [
  { id: "margarita", name: { es: "Margarita", en: "Margherita" }, price: 11, img: "/images/demo/pizza-margarita.jpg" },
  { id: "pepperoni", name: { es: "Pepperoni", en: "Pepperoni" }, price: 13, img: "/images/demo/pizza-pepperoni.jpg" },
  { id: "tiramisu", name: { es: "Tiramisú", en: "Tiramisu" }, price: 6, img: "/images/demo/tiramisu.jpg" },
];

/** Secuencia: qué se toca en cada paso. */
const STEPS: { tap: string | null; count: number; notif: boolean }[] = [
  { tap: null, count: 0, notif: false },
  { tap: "margarita", count: 1, notif: false },
  { tap: "margarita", count: 2, notif: false },
  { tap: "tiramisu", count: 3, notif: false },
  { tap: "cart", count: 3, notif: false },
  { tap: null, count: 3, notif: true },
  { tap: null, count: 3, notif: true },
  { tap: null, count: 3, notif: true },
];
const TOTALS = [0, 11, 22, 28, 28, 28, 28, 28];

export function HeroPhone() {
  const { t, l } = useLang();
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 1300);
    return () => clearInterval(id);
  }, [reduce]);

  const current = reduce ? STEPS[5] : STEPS[step];
  const total = reduce ? 28 : TOTALS[step];

  return (
    <div className="relative">
      {/* brillo detrás del celular */}
      <div aria-hidden className="absolute left-1/2 top-1/2 -z-10 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 blur-[90px]" />

      <m.div
        initial={{ opacity: 0, y: 40, rotate: 4 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <PhoneFrame label={t.heroPhone.label}>
          <div className="absolute inset-0 flex flex-col bg-[#FFF8F0] text-[#2B1B14]" aria-hidden>
            {/* portada */}
            <div className="relative h-[34%] shrink-0">
              <Image src="/images/hero-restaurante.jpg" alt="" fill sizes="280px" className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="font-display text-2xl font-semibold italic leading-none">Forno Rosso</p>
                <p className="mt-1 text-[11px] opacity-85">{l({ es: "Pizza a la piedra", en: "Stone-baked pizza" })} · ★ 4.9</p>
              </div>
            </div>

            {/* chips */}
            <div className="flex gap-1.5 px-3 pt-3 text-[11px] font-semibold">
              <span className="rounded-full bg-[#C8361F] px-3 py-1 text-white">Pizzas</span>
              <span className="rounded-full bg-black/5 px-3 py-1">{l({ es: "Entradas", en: "Starters" })}</span>
              <span className="rounded-full bg-black/5 px-3 py-1">{l({ es: "Postres", en: "Desserts" })}</span>
            </div>

            {/* items */}
            <ul className="flex flex-col gap-2 px-3 pt-3">
              {ITEMS.map((it) => (
                <li key={it.id} className="flex items-center gap-2.5 rounded-2xl bg-white p-2 shadow-[0_2px_10px_rgb(0_0_0/0.05)]">
                  <Image src={it.img} alt="" width={52} height={52} className="size-[52px] rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold">{l(it.name)}</p>
                    <p className="text-[12px] text-[#7A6658]">${it.price}</p>
                  </div>
                  <m.span
                    animate={current.tap === it.id ? { scale: [1, 0.8, 1.1, 1] } : { scale: 1 }}
                    transition={{ duration: 0.45 }}
                    className="relative grid size-8 place-items-center rounded-full bg-[#C8361F] text-white"
                  >
                    <IconPlus width={16} height={16} />
                    {current.tap === it.id && <TapRing key={step} />}
                  </m.span>
                </li>
              ))}
            </ul>

            {/* barra del carrito */}
            <div className="mt-auto p-3">
              <m.div
                animate={{ y: current.count > 0 ? 0 : 80, scale: current.tap === "cart" ? [1, 0.95, 1] : 1 }}
                transition={{ y: { type: "spring", stiffness: 300, damping: 24 }, scale: { duration: 0.4 } }}
                className="relative flex items-center justify-between rounded-2xl bg-[#C8361F] px-4 py-3 text-white shadow-lg"
              >
                <span className="flex items-center gap-2 text-[13px] font-semibold">
                  <span className="relative">
                    <IconBag width={18} height={18} />
                    <m.span
                      key={current.count}
                      initial={{ scale: 0.4 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-white text-[10px] font-bold text-[#C8361F]"
                    >
                      {current.count}
                    </m.span>
                  </span>
                  {t.heroPhone.order}
                </span>
                <span className="text-[13px] font-bold">${total}</span>
                {current.tap === "cart" && <TapRing key={`c${step}`} />}
              </m.div>
            </div>

            {/* notificación de WhatsApp */}
            <AnimatePresence>
              {current.notif && (
                <m.div
                  initial={{ y: -90, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -90, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  className="absolute inset-x-2.5 top-10 z-20 flex gap-2.5 rounded-2xl bg-white/90 p-3 text-[#111] shadow-xl backdrop-blur-md"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#25D366] text-white">
                    <IconWhatsApp width={20} height={20} />
                  </span>
                  <div className="min-w-0 text-[11.5px] leading-snug">
                    <p className="flex justify-between font-semibold">
                      {t.heroPhone.notifTitle} <span className="font-normal text-black/50">{t.heroPhone.now}</span>
                    </p>
                    <p className="truncate text-black/70">{t.heroPhone.notifBody}</p>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </PhoneFrame>
      </m.div>

      {/* tarjetas flotantes */}
      <FloatCard className="-left-10 top-[18%] max-sm:hidden" delay={0.9}>
        <span className="font-display text-2xl font-semibold text-primary">0%</span>
        <span className="text-xs leading-tight text-muted">
          {l({ es: "comisión", en: "commission" })}
          <br />
          {l({ es: "por pedido", en: "per order" })}
        </span>
      </FloatCard>
      <FloatCard className="-right-2 bottom-[16%] sm:-right-8" delay={1.1} float={-8}>
        <span className="grid size-8 place-items-center rounded-full bg-whatsapp text-[#0b2e17]">
          <IconWhatsApp width={18} height={18} />
        </span>
        <span className="text-xs font-semibold leading-tight">
          {t.heroPhone.newOrder}
          <br />
          <span className="font-normal text-muted">$28 · 3 items</span>
        </span>
      </FloatCard>
    </div>
  );
}

function TapRing() {
  return (
    <m.span
      aria-hidden
      initial={{ scale: 0.6, opacity: 0.9 }}
      animate={{ scale: 2.2, opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="pointer-events-none absolute inset-0 m-auto size-8 rounded-full border-2 border-[#C8361F]"
    />
  );
}

function FloatCard({
  children,
  className,
  delay,
  float = 8,
}: {
  children: React.ReactNode;
  className: string;
  delay: number;
  float?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, y: reduce ? 0 : [0, float, 0] }}
      transition={{
        opacity: { delay, duration: 0.5 },
        scale: { delay, duration: 0.5 },
        y: { delay: delay + 0.5, duration: 4, repeat: Infinity, ease: "easeInOut" },
      }}
      className={`absolute z-10 flex items-center gap-2.5 rounded-2xl border border-line bg-surface/90 px-3.5 py-2.5 shadow-xl backdrop-blur-md ${className}`}
      aria-hidden
    >
      {children}
    </m.div>
  );
}
