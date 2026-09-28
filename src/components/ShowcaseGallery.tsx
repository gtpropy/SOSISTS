"use client";

import type { CSSProperties, MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { PhysicsIcon, ChemistryIcon, TechIcon, InnovationIcon } from "@/components/icons/ConceptIcons";

const ORBIT_DURATION = 32; // seconds per full revolution

const ITEMS = [
  { Icon: PhysicsIcon, label: "Physics", accent: "primary" },
  { Icon: ChemistryIcon, label: "Chemistry", accent: "lime" },
  { Icon: TechIcon, label: "Tech", accent: "cyan" },
  { Icon: InnovationIcon, label: "Innovation", accent: "violet" },
] as const;

const accentClasses: Record<(typeof ITEMS)[number]["accent"], string> = {
  primary: "bg-primary/12 text-primary ring-primary/25",
  lime: "bg-lime/12 text-lime ring-lime/25",
  cyan: "bg-cyan/12 text-cyan ring-cyan/25",
  violet: "bg-violet/12 text-violet ring-violet/25",
};

/**
 * An interactive orbit: four focus-area icons revolve around a glowing
 * central "rift" (a continuous, CSS-only animation — no JS loop, cheap on
 * low-end devices), while the whole cluster tilts toward the cursor for a
 * light parallax feel. Each orbit item is phase-offset via a *negative*
 * animation-delay on the same shared keyframes, which evenly spaces the
 * four items around the circle without needing four separate keyframe
 * sets; a counter-rotating inner wrapper keeps each icon upright as its
 * orbit carries it around.
 */
export function ShowcaseGallery() {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 140, damping: 18, mass: 0.4 });
  const springY = useSpring(rotateY, { stiffness: 140, damping: 18, mass: 0.4 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 18);
    rotateX.set((0.5 - py) * 18);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[420px] overflow-hidden py-6 sm:max-w-[480px]"
      style={
        {
          "--orbit-r": "clamp(80px, 30vw, 152px)",
          perspective: "900px",
        } as CSSProperties
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" }}
      >
        {/* Outer decorative rings */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[calc(var(--orbit-r)*2.35)] w-[calc(var(--orbit-r)*2.35)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary/20" />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[calc(var(--orbit-r)*1.55)] w-[calc(var(--orbit-r)*1.55)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet/15"
          style={{ animation: `orbit-spin 46s linear infinite` }}
        />

        {/* The rift */}
        <div
          className="absolute left-1/2 top-1/2 h-20 w-20 rounded-full sm:h-24 sm:w-24"
          style={{
            animation: "rift-pulse 4.2s ease-in-out infinite",
            background:
              "radial-gradient(circle at 42% 38%, var(--cyan-light), var(--primary) 48%, var(--violet) 85%)",
            boxShadow: "0 0 46px 6px var(--glow-primary), 0 0 90px 20px var(--glow-violet)",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-20 w-20 rounded-full mix-blend-overlay sm:h-24 sm:w-24"
          style={{
            animation: "rift-pulse 4.2s ease-in-out infinite",
            background: "conic-gradient(from 0deg, transparent, white, transparent 40%)",
            opacity: 0.5,
          }}
        />

        {/* Orbiting focus-area icons */}
        {ITEMS.map((item, i) => {
          const delay = `${-((i * ORBIT_DURATION) / ITEMS.length)}s`;
          const Icon = item.Icon;
          return (
            <div
              key={item.label}
              className="absolute inset-0"
              style={{ animation: `orbit-spin ${ORBIT_DURATION}s linear infinite`, animationDelay: delay }}
            >
              <div
                className="absolute left-1/2 top-1/2"
                style={{ transform: "translate(-50%, -50%) translateY(calc(-1 * var(--orbit-r)))" }}
              >
                <div
                  style={{
                    animation: `orbit-spin-reverse ${ORBIT_DURATION}s linear infinite`,
                    animationDelay: delay,
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.12 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="flex flex-col items-center gap-1.5"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <span
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-md ring-1 backdrop-blur-sm sm:h-16 sm:w-16 ${accentClasses[item.accent]}`}
                    >
                      <Icon className="h-8 w-8 sm:h-9 sm:w-9" />
                    </span>
                    <span className="rounded-full bg-surface/90 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-muted shadow-sm ring-1 ring-border">
                      {item.label}
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
