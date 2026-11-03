"use client";

import { AnimatePresence, m, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { whatsappLink } from "@/content/site";
import { useLang } from "@/lib/i18n";
import { IconWhatsApp } from "@/components/ui/Icons";

/** Botón flotante de WhatsApp: aparece después de bajar un poco. */
export function WhatsAppFab() {
  const { t } = useLang();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > 500));

  return (
    <AnimatePresence>
      {visible && (
        <m.a
          href={whatsappLink(t.contact.fabMessage)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.contact.fabLabel}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="group fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-whatsapp p-4 text-[#0b2e17] shadow-[0_12px_32px_-8px_rgb(37_211_102/0.7)] sm:bottom-7 sm:right-7"
        >
          <span aria-hidden className="absolute inset-0 -z-10 animate-ping rounded-full bg-whatsapp opacity-25 [animation-duration:2.5s]" />
          <IconWhatsApp width={26} height={26} />
          <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold transition-all duration-300 group-hover:max-w-52 group-hover:pr-1 sm:inline">
            {t.contact.fabLabel}
          </span>
        </m.a>
      )}
    </AnimatePresence>
  );
}
