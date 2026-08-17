"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useJourneyMode } from "@/components/JourneyModeProvider";
import { IntroSequence } from "@/components/IntroSequence";

const SECTIONS: { id: string; label: string }[] = [
  { id: "section-hero", label: "Welcome" },
  { id: "section-gallery", label: "Gallery" },
  { id: "section-upcoming", label: "Upcoming Events" },
  { id: "section-journey", label: "How It Works" },
  { id: "section-focus", label: "Focus Areas" },
  { id: "section-team-teaser", label: "The Team" },
  { id: "section-cta", label: "Get Involved" },
];

const DWELL_MS = 4200;

export function JourneyModeOverlay() {
  const { active, stop } = useJourneyMode();
  const pathname = usePathname();
  const router = useRouter();
  const [introDone, setIntroDone] = useState(false);
  const [sectionIndex, setSectionIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [trackedActive, setTrackedActive] = useState(active);
  if (active !== trackedActive) {
    setTrackedActive(active);
    if (active) {
      setIntroDone(false);
      setSectionIndex(0);
    }
  }

  useEffect(() => {
    if (active && pathname !== "/") {
      router.push("/");
    }
  }, [active, pathname, router]);

  const phase: "idle" | "navigating" | "intro" | "touring" = !active
    ? "idle"
    : pathname !== "/"
      ? "navigating"
      : !introDone
        ? "intro"
        : "touring";

  useEffect(() => {
    if (phase !== "touring") return;

    const section = SECTIONS[sectionIndex];
    document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth", block: "start" });

    timerRef.current = setTimeout(() => {
      if (sectionIndex < SECTIONS.length - 1) {
        setSectionIndex((i) => i + 1);
      } else {
        stop();
      }
    }, DWELL_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, sectionIndex]);

  const handleIntroComplete = () => setIntroDone(true);

  if (!active) return null;

  return (
    <>
      {phase === "intro" && <IntroSequence onComplete={handleIntroComplete} autoStart />}

      {phase === "touring" && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="pointer-events-none fixed inset-x-0 bottom-6 z-[250] flex justify-center px-4"
        >
          <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-border bg-surface/95 px-4 py-2.5 shadow-2xl backdrop-blur-xl">
            <span className="font-mono text-[11px] uppercase tracking-wide text-primary">
              Journey · {SECTIONS[sectionIndex].label}
            </span>
            <div className="flex items-center gap-1">
              {SECTIONS.map((s, i) => (
                <span
                  key={s.id}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i <= sectionIndex ? "w-5 bg-primary" : "w-1.5 bg-border"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={stop}
              aria-label="Exit journey mode"
              className="flex h-6 w-6 items-center justify-center rounded-full text-muted-soft transition-colors hover:bg-background-alt hover:text-foreground cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}
