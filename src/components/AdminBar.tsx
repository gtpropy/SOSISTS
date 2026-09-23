"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Copy, Check, RotateCcw, Lock } from "lucide-react";
import { useAdmin } from "@/components/AdminProvider";

export function AdminBar() {
  const { unlocked, rotationOverrides, resetRotations, lock } = useAdmin();
  const [copied, setCopied] = useState(false);

  const entries = Object.entries(rotationOverrides);

  const handleCopy = async () => {
    const text = entries.map(([file, deg]) => `${file}: ${deg}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard API unavailable — nothing we can do silently, leave the UI as-is
    }
  };

  return (
    <AnimatePresence>
      {unlocked && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-[90] flex justify-center px-4 pb-4"
        >
          <div className="flex flex-wrap items-center gap-2 rounded-full border border-border bg-surface/95 px-3 py-2 shadow-xl backdrop-blur-xl sm:gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-primary">
              <ShieldCheck size={12} /> Admin
            </span>

            <span className="font-mono text-[11px] text-muted">
              {entries.length === 0
                ? "Tap the rotate icon on any photo in the Events gallery"
                : `${entries.length} photo${entries.length === 1 ? "" : "s"} adjusted`}
            </span>

            {entries.length > 0 && (
              <>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background-alt px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary cursor-pointer"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied!" : "Copy fix list"}
                </button>
                <button
                  onClick={resetRotations}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background-alt px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-red-400/40 hover:text-red-500 cursor-pointer"
                >
                  <RotateCcw size={12} /> Reset
                </button>
              </>
            )}

            <button
              aria-label="Lock admin mode"
              onClick={lock}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background-alt text-muted-soft transition-colors hover:border-primary/40 hover:text-primary cursor-pointer"
            >
              <Lock size={12} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
