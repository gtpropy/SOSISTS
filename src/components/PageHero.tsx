"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
}

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-16 sm:px-8 sm:pt-20">
      <div className="mx-auto max-w-4xl text-center">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-primary"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse-glow" />
          {eyebrow}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-5 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
}
