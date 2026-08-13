"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Hammer, Lightbulb, Trophy, type LucideIcon } from "lucide-react";
import type { JourneyStep } from "@/lib/data";

const icons: Record<string, LucideIcon> = {
  Learn: BookOpen,
  Build: Hammer,
  Innovate: Lightbulb,
  Showcase: Trophy,
};

const accentBg: Record<JourneyStep["accent"], string> = {
  primary: "from-primary to-violet",
  cyan: "from-cyan to-primary",
  violet: "from-violet to-cyan",
  lime: "from-lime to-cyan",
};

export function Scrollytelling({ steps }: { steps: JourneyStep[] }) {
  const [active, setActive] = useState(0);
  const current = steps[active];
  const Icon = icons[current.title] ?? BookOpen;

  return (
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <motion.div
          key={active}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
          className={`relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-3xl bg-gradient-to-br p-7 text-white shadow-2xl sm:max-w-sm sm:p-8 lg:mx-0 ${accentBg[current.accent]}`}
        >
          <div className="absolute inset-0 bg-dot-grid opacity-20" />
          <span className="relative font-mono text-xs text-white/70">
            {current.step} / {String(steps.length).padStart(2, "0")}
          </span>
          <div className="relative mt-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 sm:h-16 sm:w-16">
            <Icon size={26} strokeWidth={2} />
          </div>
          <h3 className="relative mt-5 font-display text-2xl font-bold sm:text-3xl">{current.title}</h3>
          <p className="relative mt-2 max-w-[220px] text-xs leading-relaxed text-white/80 sm:text-sm">
            {current.body}
          </p>
          <div className="absolute bottom-6 left-7 right-7 flex gap-1.5 sm:left-8 sm:right-8">
            {steps.map((s, i) => (
              <span
                key={s.step}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  i === active ? "bg-white" : "bg-white/25"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col gap-20 py-2 sm:gap-28">
        {steps.map((s, i) => (
          <motion.div
            key={s.step}
            onViewportEnter={() => setActive(i)}
            viewport={{ amount: 0.6 }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex min-h-[24vh] flex-col justify-center lg:min-h-[32vh]"
          >
            <span className="font-mono text-xs text-muted-soft">Step {s.step}</span>
            <h4 className="mt-2 font-display text-xl font-bold text-foreground sm:text-2xl">{s.title}</h4>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted sm:text-base">{s.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
