"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { Play } from "lucide-react";
import { HumanFigure } from "@/components/intro/HumanFigure";
import { FireGlow } from "@/components/intro/FireGlow";
import { EraMotif } from "@/components/intro/EraMotif";
import { scriptLines, lineIndexAt, AUDIO_DURATION, type BgStage } from "@/lib/introScript";
import { useSound } from "@/components/SoundProvider";

type Phase = "gate" | "playing" | "exiting";

const BG_LAYERS: Record<BgStage, string> = {
  ember: "radial-gradient(circle at 50% 65%, #1a0f08 0%, #05040a 65%)",
  warm: "radial-gradient(circle at 55% 60%, #3a1d0a 0%, #140b06 55%, #05040a 100%)",
  cool: "radial-gradient(circle at 55% 45%, rgba(99,102,241,0.35) 0%, rgba(8,8,20,0.92) 55%, #05040a 100%)",
};

export function IntroSequence({
  onComplete,
  autoStart = false,
}: {
  onComplete: () => void;
  autoStart?: boolean;
}) {
  const [phase, setPhase] = useState<Phase>(autoStart ? "playing" : "gate");
  const [lineIndex, setLineIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const { play } = useSound();
  const progress = useMotionValue(0);
  const progressWidth = useTransform(progress, (v) => `${v * 100}%`);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onComplete();
    } else if (autoStart) {
      play("open");
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;

    const tick = () => {
      const audio = audioRef.current;
      if (audio) {
        progress.set(Math.min(audio.currentTime / AUDIO_DURATION, 1));
        setLineIndex((prev) => {
          const next = lineIndexAt(audio.currentTime);
          return next !== prev ? next : prev;
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, progress]);

  const begin = () => {
    setPhase("playing");
    play("open");
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  };

  const finish = () => {
    onComplete();
  };

  const handleEnded = () => {
    setPhase("exiting");
    window.setTimeout(finish, 550);
  };

  const skip = () => {
    audioRef.current?.pause();
    play("click");
    finish();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = scriptLines[lineIndex];
  const bgOrder: BgStage[] = ["ember", "warm", "cool"];

  return (
    <motion.div
      className="fixed inset-0 z-[200] overflow-hidden bg-[#05040a] text-center"
      animate={{ opacity: phase === "exiting" ? 0 : 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      role="dialog"
      aria-modal="true"
      aria-label="ISTS intro"
    >
      <audio ref={audioRef} src="/intro-narration.mp3" preload="auto" onEnded={handleEnded} />

      {bgOrder.map((stage) => (
        <motion.div
          key={stage}
          className="pointer-events-none absolute inset-0"
          animate={{ opacity: current.bg === stage ? 1 : 0 }}
          transition={{ duration: 1.1 }}
          style={{ background: BG_LAYERS[stage] }}
        />
      ))}

      {phase !== "gate" && (
        <button
          onClick={skip}
          className="absolute right-5 top-5 z-20 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40 transition-colors hover:text-white/80 cursor-pointer"
        >
          Skip
        </button>
      )}

      <AnimatePresence>
        {phase === "gate" && (
          <motion.div
            key="gate"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 px-6"
          >
            <button
              onClick={begin}
              className="group flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary via-violet to-cyan text-white shadow-2xl shadow-primary/40 transition-transform hover:scale-105 cursor-pointer"
              aria-label="Begin intro"
            >
              <Play size={24} className="ml-1" fill="currentColor" />
            </button>
            <div>
              <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Welcome to ISTS</h1>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-white/50">
                A short story, with sound — tap to begin
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {phase !== "gate" && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute rounded-full blur-[100px]"
            style={{
              width: 460,
              height: 460,
              left: "50%",
              bottom: "16%",
              transform: "translateX(-50%)",
              background: "radial-gradient(circle, rgba(217,119,6,0.5), transparent 70%)",
            }}
            animate={{ opacity: current.bg === "cool" ? 0 : 1 }}
            transition={{ duration: 1 }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute rounded-full blur-[100px]"
            style={{
              width: 460,
              height: 460,
              left: "50%",
              bottom: "16%",
              transform: "translateX(-50%)",
              background: "radial-gradient(circle, rgba(34,211,238,0.45), transparent 70%)",
            }}
            animate={{ opacity: current.bg === "cool" ? 1 : 0 }}
            transition={{ duration: 1 }}
          />

          <div className="absolute inset-0 flex items-end justify-center pb-[28%]">
            <div
              aria-hidden
              className="absolute bottom-[26%] h-6 w-56 rounded-full bg-black/50 blur-xl"
            />
            <div className="relative flex items-end" style={{ height: "46vh", maxHeight: 380 }}>
              <HumanFigure
                pose={current.pose}
                className="h-full w-auto text-[#2e1a0a] transition-[filter] duration-1000"
                style={{
                  filter:
                    current.bg === "cool"
                      ? "drop-shadow(0 16px 22px rgba(0,0,0,0.55)) drop-shadow(0 0 16px rgba(34,211,238,0.55))"
                      : "drop-shadow(0 16px 22px rgba(0,0,0,0.55)) drop-shadow(0 0 16px rgba(251,191,36,0.55))",
                }}
              />
              <FireGlow stage={current.fireStage} className="-ml-3 h-[85%] w-auto" />
            </div>
          </div>

          <div className="absolute right-[10%] top-[16%] sm:right-[16%]">
            <EraMotif motif={current.motif} className="text-white" />
          </div>

          <div className="absolute inset-x-0 bottom-[11%] flex justify-center px-6">
            <AnimatePresence mode="wait">
              <motion.p
                key={lineIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="max-w-lg font-display text-lg font-medium text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.85)] sm:text-xl"
              >
                {current.text}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="absolute inset-x-0 bottom-6 flex justify-center px-10">
            <div className="h-1 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-violet to-cyan"
                style={{ width: progressWidth }}
              />
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
