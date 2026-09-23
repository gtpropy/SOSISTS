"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles, ArrowRight, Trophy, Camera } from "lucide-react";
import { useSound } from "@/components/SoundProvider";
import { useJourneyMode } from "@/components/JourneyModeProvider";
import { challenge } from "@/lib/data";

const SEEN_KEY = "sic-2026-success-seen";

export function SICAnnouncementModal() {
  const [open, setOpen] = useState(false);
  const { play } = useSound();
  const { active: journeyActive } = useJourneyMode();

  const [trackedJourneyActive, setTrackedJourneyActive] = useState(journeyActive);
  if (journeyActive !== trackedJourneyActive) {
    setTrackedJourneyActive(journeyActive);
    if (journeyActive) setOpen(false);
  }

  const journeyActiveRef = useRef(journeyActive);
  useEffect(() => {
    journeyActiveRef.current = journeyActive;
  }, [journeyActive]);

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) return;
    const timeout = setTimeout(() => {
      if (journeyActiveRef.current) return;
      sessionStorage.setItem(SEEN_KEY, "true");
      setOpen(true);
      play("open");
    }, 1100);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/40 p-5 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${challenge.title} — event recap`}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="card-surface glow-primary relative w-full max-w-md overflow-hidden p-7 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="animate-blob absolute -right-14 -top-14 h-48 w-48 rounded-full bg-gradient-to-br from-lime/20 to-primary/20 blur-3xl" />

            <button
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted-soft transition-colors hover:bg-background-alt hover:text-foreground cursor-pointer"
            >
              <X size={16} />
            </button>

            <span className="relative inline-flex items-center gap-1.5 rounded-full bg-lime/15 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-lime">
              <Sparkles size={12} /> {challenge.edition}
            </span>

            <h2 className="relative mt-4 font-display text-2xl font-bold leading-snug text-foreground sm:text-3xl">
              SIC was a huge success! 🎉
            </h2>
            <p className="relative mt-2.5 text-sm leading-relaxed text-muted">
              Thank you to every team, mentor, and judge who made the{" "}
              {challenge.title} unforgettable. The projects blew us away.
            </p>

            <div className="relative mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background-alt px-3 py-1 font-mono text-[11px] text-muted">
                <Trophy size={11} className="text-lime" /> Winners crowned
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background-alt px-3 py-1 font-mono text-[11px] text-muted">
                <Camera size={11} className="text-primary" /> Photos are in
              </span>
            </div>

            <div className="relative mt-6 flex items-center gap-3">
              <Link
                href="/events"
                onClick={() => {
                  play("click");
                  setOpen(false);
                }}
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                See the Photos
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-muted-soft transition-colors hover:text-foreground cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
