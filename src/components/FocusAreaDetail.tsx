"use client";

import { motion } from "framer-motion";
import { FlaskConical, Cog, Bot, Lightbulb, CheckCircle2, type LucideIcon } from "lucide-react";
import type { FocusArea } from "@/lib/data";

const iconMap: Record<string, LucideIcon> = {
  chemistry: FlaskConical,
  "physics-engineering": Cog,
  robotics: Bot,
  "innovation-research": Lightbulb,
};

const accentMap = {
  primary: { text: "text-primary", bg: "bg-primary/10", grad: "from-primary/15" },
  cyan: { text: "text-cyan", bg: "bg-cyan/10", grad: "from-cyan/15" },
  violet: { text: "text-violet", bg: "bg-violet/10", grad: "from-violet/15" },
  lime: { text: "text-lime", bg: "bg-lime/10", grad: "from-lime/15" },
};

export function FocusAreaDetail({ area, reverse = false }: { area: FocusArea; reverse?: boolean }) {
  const Icon = iconMap[area.id] ?? Lightbulb;
  const accent = accentMap[area.accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14 ${
        reverse ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${accent.grad} to-transparent p-10 sm:p-14`}>
        <div className="card-surface relative mx-auto flex aspect-square w-full max-w-xs items-center justify-center shadow-xl">
          <Icon size={72} strokeWidth={1.3} className={accent.text} />
          <span className="absolute right-4 top-4 font-mono text-xs text-muted-soft">
            {area.number}
          </span>
        </div>
      </div>

      <div>
        <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${accent.bg} ${accent.text}`}>
          <Icon size={20} strokeWidth={2.2} />
        </span>
        <h3 className="mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl">
          {area.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{area.description}</p>

        <ul className="mt-6 space-y-3">
          {area.activities.map((act) => (
            <li key={act} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground">
              <CheckCircle2 size={17} className={`mt-0.5 shrink-0 ${accent.text}`} strokeWidth={2.2} />
              {act}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
