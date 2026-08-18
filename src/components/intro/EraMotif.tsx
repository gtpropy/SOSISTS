"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Compass, CircuitBoard } from "lucide-react";
import type { Motif } from "@/lib/introScript";

function WheelIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="5.5" y1="5.5" x2="18.5" y2="18.5" />
      <line x1="18.5" y1="5.5" x2="5.5" y2="18.5" />
    </svg>
  );
}

export function EraMotif({ motif, className }: { motif: Motif; className?: string }) {
  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {motif !== "none" && (
          <motion.div
            key={motif}
            initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
            animate={{ opacity: 0.4, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.85, rotate: 8 }}
            transition={{ duration: 0.5 }}
          >
            {motif === "wheel" && <WheelIcon size={60} />}
            {motif === "compass" && <Compass size={60} strokeWidth={1.5} />}
            {motif === "circuit" && <CircuitBoard size={60} strokeWidth={1.5} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
