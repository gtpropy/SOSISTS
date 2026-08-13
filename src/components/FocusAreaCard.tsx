"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FlaskConical, Cog, Bot, Lightbulb, ArrowRight, type LucideIcon } from "lucide-react";
import { useSound } from "@/components/SoundProvider";
import type { FocusArea } from "@/lib/data";

const iconMap: Record<string, LucideIcon> = {
  chemistry: FlaskConical,
  "physics-engineering": Cog,
  robotics: Bot,
  "innovation-research": Lightbulb,
};

const accentMap = {
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    ring: "group-hover:ring-primary/30",
    glow: "group-hover:shadow-primary/20",
  },
  cyan: {
    bg: "bg-cyan/10",
    text: "text-cyan",
    ring: "group-hover:ring-cyan/30",
    glow: "group-hover:shadow-cyan/20",
  },
  violet: {
    bg: "bg-violet/10",
    text: "text-violet",
    ring: "group-hover:ring-violet/30",
    glow: "group-hover:shadow-violet/20",
  },
  lime: {
    bg: "bg-lime/10",
    text: "text-lime",
    ring: "group-hover:ring-lime/30",
    glow: "group-hover:shadow-lime/20",
  },
};

export function FocusAreaCard({ area, index = 0 }: { area: FocusArea; index?: number }) {
  const { play } = useSound();
  const Icon = iconMap[area.id] ?? Lightbulb;
  const accent = accentMap[area.accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={{ y: -6 }}
      className={`group card-surface relative flex flex-col gap-4 overflow-hidden p-6 shadow-sm ring-1 ring-transparent transition-all duration-300 hover:shadow-xl ${accent.ring} ${accent.glow}`}
      onMouseEnter={() => play("hover")}
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-transparent to-current opacity-[0.06] transition-transform duration-500 group-hover:scale-150" />
      <div className="flex items-center justify-between">
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent.bg} ${accent.text}`}>
          <Icon size={20} strokeWidth={2.2} />
        </span>
        <span className="font-mono text-xs text-muted-soft">{area.number}</span>
      </div>

      <div>
        <h3 className="font-display text-lg font-semibold text-foreground">{area.shortTitle}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{area.description}</p>
      </div>

      <Link
        href="/focus-areas"
        onClick={() => play("click")}
        className={`mt-auto inline-flex items-center gap-1.5 text-sm font-semibold ${accent.text}`}
      >
        Explore
        <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
}
