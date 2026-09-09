"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Camera, ArrowRight } from "lucide-react";
import { useSound } from "@/components/SoundProvider";
import type { Challenge } from "@/lib/data";

export function UpcomingEvents({ challenge }: { challenge: Challenge }) {
  const { play } = useSound();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="card-surface glow-primary relative overflow-hidden p-6 shadow-md sm:p-8"
    >
      <div className="animate-blob absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-lime/20 to-primary/20 blur-3xl" />

      <div className="relative flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-lime/15 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-lime">
          <Sparkles size={12} /> {challenge.status}
        </span>
        {challenge.quickFacts.map((m) => (
          <span
            key={m.label}
            className="rounded-full border border-border bg-background-alt px-3 py-1 font-mono text-[11px] text-muted"
          >
            {m.label}: <span className="text-foreground">{m.value}</span>
          </span>
        ))}
      </div>

      <h3 className="relative mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl">
        {challenge.title} <span className="text-muted-soft">· {challenge.edition}</span>
      </h3>
      <p className="relative mt-1.5 font-mono text-sm text-primary">{challenge.problemTitle}</p>
      <p className="relative mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        The School Innovation Challenge was a huge success — thank you to every team, mentor,
        and judge who took part. Take a look back at how it went.
      </p>

      <div className="relative mt-6 flex flex-wrap items-center gap-3">
        <Link
          href="/events"
          onMouseEnter={() => play("hover")}
          onClick={() => play("click")}
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/35"
        >
          See the Photos
          <Camera size={16} className="transition-transform group-hover:scale-110" />
        </Link>
        <Link
          href={`/${challenge.slug}`}
          onMouseEnter={() => play("hover")}
          onClick={() => play("click")}
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
        >
          View Recap
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}
