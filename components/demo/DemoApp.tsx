"use client";

import Image from "next/image";
import { AnimatePresence, m } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import type { DemoItem, DemoRestaurant } from "@/content/demo-menus";
import { useLang } from "@/lib/i18n";
import { money } from "@/lib/format";
import { IconArrowLeft, IconBag, IconCheck, IconMinus, IconPlus, IconWhatsApp } from "@/components/ui/Icons";

type View = "menu" | "cart" | "chat";
type Mode = "delivery" | "pickup";

const fontFor = (f: DemoRestaurant["theme"]["font"]) =>
  f === "serif"
    ? "var(--font-fraunces), Georgia, serif"
    : f === "rounded"
      ? "ui-rounded, 'SF Pro Rounded', 'Nunito', var(--font-inter), system-ui, sans-serif"
      : "var(--font-inter), system-ui, sans-serif";

/** Mini web de restaurante funcionando dentro del celular. */
export function DemoApp({ restaurant }: { restaurant: DemoRestaurant }) {
  const { t, l } = useLang();
  const th = restaurant.theme;
  const [cart, setCart] = useState<Record<string, number>>({});
  const [view, setView] = useState<View>("menu");
  const [activeCat, setActiveCat] = useState(restaurant.categories[0].id);
  const [name, setName] = useState("");
  const [mode, setMode] = useState<Mode>("delivery");
  const [address, setAddress] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const allItems = useMemo(() => restaurant.categories.flatMap((c) => c.items), [restaurant]);
  const lines = allItems.filter((i) => cart[i.id]).map((i) => ({ item: i, qty: cart[i.id] }));
  const count = lines.reduce((s, x) => s + x.qty, 0);
  const total = lines.reduce((s, x) => s + x.qty * x.item.price, 0);
  const fmt = (n: number) => money(n, restaurant.currency);

  const change = (id: string, delta: number) =>
    setCart((prev) => {
      const next = { ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) };
      if (next[id] === 0) delete next[id];
      return next;
    });

  const goToCategory = (id: string) => {
    setActiveCat(id);
    const box = scrollRef.current;
    const target = box?.querySelector<HTMLElement>(`[data-cat="${id}"]`);
    if (box && target) box.scrollTo({ top: target.offsetTop - 88, behavior: "smooth" });
  };

  const onScroll = () => {
    const box = scrollRef.current;
    if (!box) return;
    setScrolled(box.scrollTop > 110);
    let current = restaurant.categories[0].id;
    const atBottom = box.scrollTop + box.clientHeight >= box.scrollHeight - 4;
    box.querySelectorAll<HTMLElement>("[data-cat]").forEach((el) => {
      if (atBottom || el.offsetTop - 100 <= box.scrollTop) current = el.dataset.cat!;
    });
    if (current !== activeCat) setActiveCat(current);
  };

  const message = [
    t.demo.msgHello(restaurant.name),
    "",
    ...lines.map((x) => `• ${x.qty}× ${l(x.item.name)} — ${fmt(x.qty * x.item.price)}`),
    "",
    `*${t.demo.msgTotal}: ${fmt(total)}*`,
    `${t.demo.msgName}: ${name.trim() || t.demo.defaultName}`,
    `${t.demo.msgMode}: ${mode === "delivery" ? t.demo.delivery : t.demo.pickup}`,
    ...(mode === "delivery" && address.trim() ? [`${t.demo.msgAddress}: ${address.trim()}`] : []),
    "",
    t.demo.msgThanks,
  ].join("\n");

  const reset = () => {
    setCart({});
    setView("menu");
  };

  const slide = {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
    transition: { type: "spring" as const, stiffness: 320, damping: 34 },
  };

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: th.bg, color: th.text }}>
      {/* barra de estado: tapa el contenido bajo la isla al hacer scroll */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[15] h-9 transition-opacity duration-200" style={{ background: th.bg, opacity: scrolled ? 1 : 0 }} />

      {/* ---------- MENÚ ---------- */}
      <div ref={scrollRef} onScroll={onScroll} inert={view !== "menu"} className="no-scrollbar relative flex-1 overflow-y-auto overscroll-contain pb-24">
        <header className="relative h-40 shrink-0">
          <Image src={restaurant.categories[0].items[0].image} alt="" fill sizes="280px" className="object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${th.bg} 2%, rgb(0 0 0 / 0.35) 60%, rgb(0 0 0 / 0.15))` }} />
          <div className="absolute inset-x-0 bottom-0 px-4 pb-2">
            <p className="text-[26px] font-bold leading-none" style={{ fontFamily: fontFor(th.font), fontStyle: th.font === "serif" ? "italic" : "normal" }}>
              {restaurant.name}
            </p>
            <p className="mt-1 text-[11px]" style={{ color: th.muted }}>
              {l(restaurant.tagline)}
            </p>
          </div>
        </header>

        <nav
          aria-label={l({ es: "Categorías del menú", en: "Menu categories" })}
          className="no-scrollbar sticky top-9 z-10 flex gap-1.5 overflow-x-auto px-3 py-2.5"
          style={{ background: th.bg }}
        >
          {restaurant.categories.map((c) => {
            const on = activeCat === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => goToCategory(c.id)}
                aria-current={on ? "true" : undefined}
                className="relative isolate shrink-0 rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition-colors"
                style={{ color: on ? th.primaryText : th.text, background: on ? "transparent" : `${th.text}0D` }}
              >
                {on && <m.span layoutId={`cat-${restaurant.id}`} className="absolute inset-0 -z-10 rounded-full" style={{ background: th.primary }} />}
                {l(c.name)}
              </button>
            );
          })}
        </nav>

        {restaurant.categories.map((c) => (
          <section key={c.id} data-cat={c.id} className="px-3 pt-2" aria-label={l(c.name)}>
            <h3 className="mb-2 mt-1 text-[13px] font-bold uppercase tracking-wider" style={{ color: th.muted }}>
              {l(c.name)}
            </h3>
            <ul className="flex flex-col gap-2">
              {c.items.map((item) => (
                <MenuRow key={item.id} item={item} qty={cart[item.id] ?? 0} onChange={change} restaurant={restaurant} />
              ))}
            </ul>
          </section>
        ))}
        <p className="px-4 pb-4 pt-6 text-center text-[10px]" style={{ color: th.muted }}>
          {restaurant.name} · {l({ es: "Web de demostración", en: "Demo website" })}
        </p>
      </div>

      {/* pista inicial */}
      <AnimatePresence>
        {count === 0 && view === "menu" && (
          <m.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pointer-events-none absolute inset-x-6 bottom-5 rounded-full px-3 py-2 text-center text-[11px] font-medium shadow-lg"
            style={{ background: th.text, color: th.bg }}
          >
            👆 {t.demo.hint}
          </m.p>
        )}
      </AnimatePresence>

      {/* barra del carrito */}
      <AnimatePresence>
        {count > 0 && view === "menu" && (
          <m.div initial={{ y: 90 }} animate={{ y: 0 }} exit={{ y: 90 }} transition={{ type: "spring", stiffness: 380, damping: 30 }} className="absolute inset-x-3 bottom-3 z-20">
            <button
              type="button"
              onClick={() => setView("cart")}
              className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-[13px] font-semibold shadow-[0_10px_30px_-8px_rgb(0_0_0/0.5)]"
              style={{ background: th.primary, color: th.primaryText }}
            >
              <span className="flex items-center gap-2.5">
                <span className="relative">
                  <IconBag width={18} height={18} />
                  <m.span
                    key={count}
                    initial={{ scale: 0.3 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full text-[9.5px] font-bold"
                    style={{ background: th.primaryText, color: th.primary }}
                  >
                    {count}
                  </m.span>
                </span>
                {t.demo.viewCart}
              </span>
              <span aria-live="polite">
                <span className="sr-only">{t.demo.items(count)}, </span>
                {fmt(total)}
              </span>
            </button>
          </m.div>
        )}
      </AnimatePresence>

      {/* ---------- CARRITO ---------- */}
      <AnimatePresence>
        {view === "cart" && (
          <m.div {...slide} inert={view !== "cart"} className="absolute inset-0 z-30 flex flex-col" style={{ background: th.bg }}>
            <div className="flex items-center gap-2 px-3 pb-3 pt-11">
              <button type="button" onClick={() => setView("menu")} aria-label={t.demo.back} className="grid size-9 place-items-center rounded-full" style={{ background: `${th.text}10` }}>
                <IconArrowLeft width={18} height={18} />
              </button>
              <h3 className="text-[17px] font-bold" style={{ fontFamily: fontFor(th.font) }}>
                {t.demo.cartTitle}
              </h3>
            </div>

            <div className="no-scrollbar flex-1 overflow-y-auto px-3">
              {lines.length === 0 ? (
                <p className="py-10 text-center text-sm" style={{ color: th.muted }}>
                  {t.demo.emptyCart}
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  <AnimatePresence initial={false}>
                    {lines.map(({ item, qty }) => (
                      <m.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-2.5 rounded-2xl p-2" style={{ background: th.surface }}>
                          <Image src={item.image} alt="" width={44} height={44} className="size-11 rounded-xl object-cover" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[12.5px] font-semibold">{l(item.name)}</p>
                            <p className="text-[11.5px]" style={{ color: th.muted }}>
                              {fmt(item.price * qty)}
                            </p>
                          </div>
                          <Stepper qty={qty} item={item} onChange={change} restaurant={restaurant} />
                        </div>
                      </m.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}

              <div className="mt-4 space-y-2.5 text-[12px]">
                <label className="block">
                  <span className="mb-1 block font-semibold">{t.demo.yourName}</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.demo.namePlaceholder}
                    className="w-full rounded-xl border px-3 py-2 text-[13px] outline-none focus:ring-2"
                    style={{ background: th.surface, borderColor: `${th.text}1A`, color: th.text, ["--tw-ring-color" as string]: th.primary }}
                  />
                </label>
                <div role="radiogroup" aria-label={t.demo.msgMode} className="grid grid-cols-2 gap-1 rounded-xl p-1" style={{ background: `${th.text}0D` }}>
                  {(["delivery", "pickup"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      role="radio"
                      aria-checked={mode === m}
                      onClick={() => setMode(m)}
                      className="rounded-lg px-2 py-1.5 text-[11.5px] font-semibold transition-colors"
                      style={mode === m ? { background: th.surface, color: th.text, boxShadow: "0 1px 4px rgb(0 0 0 / 0.12)" } : { color: th.muted }}
                    >
                      {m === "delivery" ? t.demo.delivery : t.demo.pickup}
                    </button>
                  ))}
                </div>
                {mode === "delivery" && (
                  <label className="block">
                    <span className="mb-1 block font-semibold">{t.demo.address}</span>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={t.demo.addressPlaceholder}
                      className="w-full rounded-xl border px-3 py-2 text-[13px] outline-none focus:ring-2"
                      style={{ background: th.surface, borderColor: `${th.text}1A`, color: th.text, ["--tw-ring-color" as string]: th.primary }}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="border-t px-3 pb-4 pt-3" style={{ borderColor: `${th.text}14` }}>
              <div className="mb-2.5 flex items-baseline justify-between">
                <span className="text-[13px] font-semibold">{t.demo.total}</span>
                <m.span key={total} initial={{ scale: 1.15 }} animate={{ scale: 1 }} className="text-[20px] font-bold" style={{ fontFamily: fontFor(th.font) }}>
                  {fmt(total)}
                </m.span>
              </div>
              <button
                type="button"
                disabled={count === 0}
                onClick={() => setView("chat")}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-3 text-[13.5px] font-bold text-[#0b2e17] transition-transform active:scale-[0.97] disabled:opacity-40"
              >
                <IconWhatsApp width={18} height={18} />
                {t.demo.send}
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* ---------- CHAT (lo que recibe el local) ---------- */}
      <AnimatePresence>
        {view === "chat" && (
          <m.div {...slide} className="absolute inset-0 z-40 flex flex-col bg-[#ECE5DD] text-[#111]">
            <div className="flex items-center gap-2.5 bg-[#075E54] px-3 pb-2.5 pt-11 text-white">
              <button type="button" onClick={() => setView("cart")} aria-label={t.demo.back} className="grid size-8 place-items-center rounded-full hover:bg-white/10">
                <IconArrowLeft width={18} height={18} />
              </button>
              <span className="grid size-8 place-items-center rounded-full text-[13px] font-bold" style={{ background: th.primary, color: th.primaryText }}>
                {restaurant.name.charAt(0)}
              </span>
              <div className="leading-tight">
                <p className="text-[13.5px] font-semibold">{restaurant.name}</p>
                <p className="text-[10.5px] opacity-80">{t.demo.chatSubtitle}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-3" style={{ backgroundImage: "radial-gradient(rgb(0 0 0 / 0.04) 1px, transparent 1px)", backgroundSize: "14px 14px" }}>
              <p className="mx-auto mb-3 w-fit rounded-md bg-[#FFF5C4] px-2.5 py-1 text-center text-[10px] text-black/70">{t.demo.chatTitle} 👇</p>
              <m.div
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.35, type: "spring", stiffness: 260, damping: 22 }}
                className="ml-auto w-[88%] rounded-xl rounded-tr-sm bg-[#DCF8C6] px-2.5 pb-1.5 pt-2 text-[11.5px] leading-[1.45] shadow-sm"
              >
                <WaText text={message} />
                <p className="mt-0.5 flex items-center justify-end gap-0.5 text-[9.5px] text-black/45">
                  {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  <span className="flex text-[#34B7F1]">
                    <IconCheck width={11} height={11} strokeWidth={3} />
                    <IconCheck width={11} height={11} strokeWidth={3} className="-ml-1.5" />
                  </span>
                </p>
              </m.div>
              <m.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-4 rounded-xl bg-white/80 p-2.5 text-center text-[10.5px] leading-snug text-black/70">
                ✅ {t.demo.chatNote}
              </m.p>
            </div>

            <div className="bg-[#F0F0F0] p-3">
              <button type="button" onClick={reset} className="w-full rounded-full px-4 py-2.5 text-[12.5px] font-bold" style={{ background: th.primary, color: th.primaryText }}>
                {t.demo.restart}
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuRow({
  item,
  qty,
  onChange,
  restaurant,
}: {
  item: DemoItem;
  qty: number;
  onChange: (id: string, d: number) => void;
  restaurant: DemoRestaurant;
}) {
  const { l } = useLang();
  const th = restaurant.theme;
  return (
    <li className="flex gap-2.5 rounded-2xl p-2 shadow-[0_2px_10px_rgb(0_0_0/0.06)]" style={{ background: th.surface }}>
      <div className="relative size-[68px] shrink-0 overflow-hidden rounded-xl">
        <Image src={item.image} alt={l(item.name)} fill sizes="68px" className="object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold leading-tight">
          <span className="truncate">{l(item.name)}</span>
          {item.badge && (
            <span className="shrink-0 rounded px-1 py-px text-[8.5px] font-bold uppercase tracking-wide" style={{ background: `${th.primary}22`, color: th.text }}>
              {l(item.badge)}
            </span>
          )}
        </p>
        <p className="mt-0.5 line-clamp-2 text-[10.5px] leading-snug" style={{ color: th.muted }}>
          {l(item.description)}
        </p>
        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="text-[13px] font-bold">{money(item.price, restaurant.currency)}</span>
          <Stepper qty={qty} item={item} onChange={onChange} restaurant={restaurant} />
        </div>
      </div>
    </li>
  );
}

function Stepper({
  qty,
  item,
  onChange,
  restaurant,
}: {
  qty: number;
  item: DemoItem;
  onChange: (id: string, d: number) => void;
  restaurant: DemoRestaurant;
}) {
  const { t, l } = useLang();
  const th = restaurant.theme;
  const name = l(item.name);
  return (
    <div className="flex items-center gap-1">
      <AnimatePresence initial={false}>
        {qty > 0 && (
          <m.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="flex items-center gap-1 overflow-hidden">
            <button
              type="button"
              onClick={() => onChange(item.id, -1)}
              aria-label={t.demo.removeItem(name)}
              className="grid size-7 place-items-center rounded-full"
              style={{ background: `${th.text}12`, color: th.text }}
            >
              <IconMinus width={14} height={14} />
            </button>
            <m.span key={qty} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-4 text-center text-[12.5px] font-bold tabular-nums" aria-live="polite">
              {qty}
            </m.span>
          </m.div>
        )}
      </AnimatePresence>
      <m.button
        type="button"
        whileTap={{ scale: 0.85 }}
        onClick={() => onChange(item.id, 1)}
        aria-label={t.demo.addItem(name)}
        className="grid size-7 place-items-center rounded-full shadow-sm"
        style={{ background: th.primary, color: th.primaryText }}
      >
        <IconPlus width={14} height={14} strokeWidth={2.5} />
      </m.button>
    </div>
  );
}

/** Muestra el mensaje con el formato de WhatsApp (*negrita*). */
function WaText({ text }: { text: string }) {
  return (
    <div className="whitespace-pre-wrap break-words">
      {text.split("\n").map((line, i) => {
        const parts = line.split(/(\*[^*]+\*)/g);
        return (
          <span key={i} className="block min-h-[0.7em]">
            {parts.map((p, j) => (p.startsWith("*") && p.endsWith("*") ? <strong key={j}>{p.slice(1, -1)}</strong> : <span key={j}>{p}</span>))}
          </span>
        );
      })}
    </div>
  );
}
