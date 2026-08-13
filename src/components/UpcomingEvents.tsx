"use client";

import { motion } from "framer-motion";
import { Sparkles, Smartphone, ScanLine, MonitorPlay, BellRing, ArrowUpRight } from "lucide-react";
import { useSound } from "@/components/SoundProvider";
import type { UpcomingEvent } from "@/lib/data";

const highlightIcons = [ScanLine, MonitorPlay, BellRing, Smartphone];

export function UpcomingEvents({ events }: { events: UpcomingEvent[] }) {
  const { play } = useSound();

  return (
    <div className="flex flex-col gap-5">
      {events.map((event, i) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, delay: i * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="card-surface glow-primary relative overflow-hidden p-6 shadow-md sm:p-8"
        >
          <div className="animate-blob absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-primary/20 to-violet/20 blur-3xl" />

          <div className="relative flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lime/15 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-lime">
              <Sparkles size={12} /> {event.status}
            </span>
            {event.meta.map((m) => (
              <span
                key={m.label}
                className="rounded-full border border-border bg-background-alt px-3 py-1 font-mono text-[11px] text-muted"
              >
                {m.label}: <span className="text-foreground">{m.value}</span>
              </span>
            ))}
          </div>

          <h3 className="relative mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl">
            {event.title}
          </h3>
          <p className="relative mt-1.5 font-mono text-sm text-primary">{event.tagline}</p>
          <p className="relative mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            {event.description}
          </p>

          <div className="relative mt-6 grid gap-3 sm:grid-cols-2">
            {event.highlights.map((h, idx) => {
              const Icon = highlightIcons[idx % highlightIcons.length];
              return (
                <div
                  key={h}
                  className="flex items-start gap-2.5 rounded-xl border border-border bg-background-alt/60 p-3"
                >
                  <Icon size={16} className="mt-0.5 shrink-0 text-cyan" strokeWidth={2.2} />
                  <p className="text-sm leading-snug text-foreground">{h}</p>
                </div>
              );
            })}
          </div>

          {event.registrationUrl && (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => play("hover")}
              onClick={() => play("click")}
              className="group relative mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/35"
            >
              Register Your Team
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          )}
        </motion.div>
      ))}
    </div>
  );
}
