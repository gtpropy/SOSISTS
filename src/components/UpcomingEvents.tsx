"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight, ArrowRight } from "lucide-react";
import { useSound } from "@/components/SoundProvider";

export interface SpotlightCta {
  label: string;
  href: string;
  external?: boolean;
}

export interface SpotlightProps {
  status: string;
  title: string;
  subtitle?: string;
  blurb: string;
  quickFacts: { label: string; value: string }[];
  primaryCta: SpotlightCta;
  secondaryCta?: SpotlightCta;
}

/** Generic homepage "what's happening" spotlight card — feed it whichever event is current. */
export function UpcomingEvents({
  status,
  title,
  subtitle,
  blurb,
  quickFacts,
  primaryCta,
  secondaryCta,
}: SpotlightProps) {
  const { play } = useSound();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="card-surface glow-primary relative overflow-hidden p-6 shadow-md sm:p-8"
    >
      <div className="animate-blob absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-primary/20 to-violet/20 blur-3xl" />

      <div className="relative flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-lime/15 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-lime">
          <Sparkles size={12} /> {status}
        </span>
        {quickFacts.map((m) => (
          <span
            key={m.label}
            className="rounded-full border border-border bg-background-alt px-3 py-1 font-mono text-[11px] text-muted"
          >
            {m.label}: <span className="text-foreground">{m.value}</span>
          </span>
        ))}
      </div>

      <h3 className="relative mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl">
        {title} {subtitle && <span className="text-muted-soft">· {subtitle}</span>}
      </h3>
      <p className="relative mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        {blurb}
      </p>

      <div className="relative mt-6 flex flex-wrap items-center gap-3">
        {primaryCta.external ? (
          <a
            href={primaryCta.href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => play("hover")}
            onClick={() => play("click")}
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/35"
          >
            {primaryCta.label}
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        ) : (
          <Link
            href={primaryCta.href}
            onMouseEnter={() => play("hover")}
            onClick={() => play("click")}
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/35"
          >
            {primaryCta.label}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        )}

        {secondaryCta && (
          <Link
            href={secondaryCta.href}
            onMouseEnter={() => play("hover")}
            onClick={() => play("click")}
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
          >
            {secondaryCta.label}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}
