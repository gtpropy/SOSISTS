"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Hammer, Cog, Lightbulb, Cpu, type LucideIcon } from "lucide-react";
import { useSound } from "@/components/SoundProvider";

interface Beat {
  Icon: LucideIcon;
  caption: string;
}

const beats: Beat[] = [
  { Icon: Flame, caption: "Since the first spark of fire," },
  { Icon: Hammer, caption: "humankind has never stopped building." },
  { Icon: Cog, caption: "Through every age," },
  { Icon: Lightbulb, caption: "every idea has pushed us forward." },
];

const BEAT_DURATION = 750;
const FINAL_HOLD = 1100;
const EXIT_DURATION = 450;

export function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [finalBeat, setFinalBeat] = useState(false);
  const [exiting, setExiting] = useState(false);
  const { play } = useSound();

  const finish = () => {
    document.body.style.overflow = "";
    play("click");
    onComplete();
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onComplete();
      return;
    }

    play("open");
    document.body.style.overflow = "hidden";

    const timers: ReturnType<typeof setTimeout>[] = [];
    beats.forEach((_, i) => {
      if (i === 0) return;
      timers.push(setTimeout(() => setStep(i), i * BEAT_DURATION));
    });
    timers.push(
      setTimeout(() => {
        setFinalBeat(true);
        play("success");
      }, beats.length * BEAT_DURATION),
    );
    timers.push(
      setTimeout(() => setExiting(true), beats.length * BEAT_DURATION + FINAL_HOLD),
    );
    timers.push(
      setTimeout(() => {
        document.body.style.overflow = "";
        onComplete();
      }, beats.length * BEAT_DURATION + FINAL_HOLD + EXIT_DURATION),
    );

    return () => {
      timers.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const CurrentIcon = finalBeat ? Cpu : beats[step].Icon;
  const totalDots = beats.length + 1;
  const currentIndex = finalBeat ? beats.length : step;

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-[#05060d] px-6 text-center cursor-pointer"
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: EXIT_DURATION / 1000, ease: "easeInOut" }}
      onClick={finish}
      role="dialog"
      aria-modal="true"
      aria-label="ISTS intro"
    >
      <div
        aria-hidden
        className="animate-blob absolute -top-32 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full opacity-30 blur-[110px]"
        style={{ background: "radial-gradient(circle, var(--primary-light), transparent 70%)" }}
      />

      <button
        onClick={(e) => {
          e.stopPropagation();
          finish();
        }}
        className="absolute right-5 top-5 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40 transition-colors hover:text-white/80 cursor-pointer"
      >
        Skip
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={finalBeat ? "final" : step}
          initial={{ opacity: 0, scale: 0.85, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative flex flex-col items-center"
        >
          <span
            className={`flex items-center justify-center rounded-3xl bg-gradient-to-br from-primary via-violet to-cyan text-white shadow-2xl shadow-primary/40 ${
              finalBeat ? "h-24 w-24" : "h-20 w-20"
            }`}
          >
            <CurrentIcon size={finalBeat ? 42 : 34} strokeWidth={2} />
          </span>

          {finalBeat ? (
            <>
              <h1 className="mt-7 font-display text-3xl font-bold text-white sm:text-4xl">
                Welcome to ISTS
              </h1>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-white/50">
                Learn. Build. Innovate.
              </p>
            </>
          ) : (
            <p className="mt-7 max-w-sm font-display text-lg font-medium text-white/90 sm:text-xl">
              {beats[step].caption}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-10 flex items-center gap-2">
        {Array.from({ length: totalDots }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i < currentIndex
                ? "w-6 bg-primary-light"
                : i === currentIndex
                  ? `w-6 ${finalBeat ? "bg-lime" : "bg-white/70"}`
                  : "w-1.5 bg-white/20"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
