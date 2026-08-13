"use client";

import { motion } from "framer-motion";
import { Mic2, Trophy, Award, Globe2, ArrowUpRight, type LucideIcon } from "lucide-react";
import type { EventBlock } from "@/lib/data";

const iconMap: Record<string, LucideIcon> = {
  weekly: Mic2,
  monthly: Trophy,
  "grand-term": Award,
  "inter-school": Globe2,
};

const accents = ["primary", "cyan", "violet", "lime"] as const;
const accentClasses = {
  primary: { bg: "bg-primary/10", text: "text-primary", badge: "bg-primary/10 text-primary" },
  cyan: { bg: "bg-cyan/10", text: "text-cyan", badge: "bg-cyan/10 text-cyan" },
  violet: { bg: "bg-violet/10", text: "text-violet", badge: "bg-violet/10 text-violet" },
  lime: { bg: "bg-lime/10", text: "text-lime", badge: "bg-lime/10 text-lime" },
};

export function EventCard({ event, index }: { event: EventBlock; index: number }) {
  const Icon = iconMap[event.id] ?? Mic2;
  const accent = accentClasses[accents[index % accents.length]];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay: (index % 2) * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={{ y: -5 }}
      className="card-surface group relative flex h-full flex-col gap-4 overflow-hidden p-7 shadow-sm transition-shadow duration-300 hover:shadow-xl"
    >
      <div
        className={`absolute -right-8 -top-8 h-32 w-32 rounded-full ${accent.bg} opacity-60 blur-2xl transition-transform duration-500 group-hover:scale-125`}
      />
      <div className="relative flex items-center justify-between">
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent.bg} ${accent.text}`}>
          <Icon size={22} strokeWidth={2.2} />
        </span>
        <span className={`rounded-full px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide ${accent.badge}`}>
          {event.cadence}
        </span>
      </div>

      <div className="relative">
        <h3 className="font-display text-xl font-bold text-foreground">{event.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{event.description}</p>
      </div>

      <ul className="relative mt-1 space-y-2.5 border-t border-border pt-4">
        {event.details.map((d) => (
          <li key={d} className="flex items-start gap-2 text-sm leading-relaxed text-foreground">
            <ArrowUpRight size={14} className={`mt-0.5 shrink-0 ${accent.text}`} />
            {d}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
