"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useSound } from "@/components/SoundProvider";
import type { ExecMember } from "@/lib/data";

const accents = [
  { glow: "bg-primary/30", badge: "bg-primary/10 text-primary", bar: "bg-primary" },
  { glow: "bg-cyan/30", badge: "bg-cyan/10 text-cyan", bar: "bg-cyan" },
  { glow: "bg-violet/30", badge: "bg-violet/10 text-violet", bar: "bg-violet" },
  { glow: "bg-lime/30", badge: "bg-lime/10 text-lime", bar: "bg-lime" },
];

const AUTOPLAY_MS = 4500;

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function MemberStoryReel({ members }: { members: ExecMember[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(stickyRef, { amount: 0.4 });
  const { play } = useSound();

  useEffect(() => {
    if (!inView || paused) return;
    const t = setTimeout(() => {
      setActive((a) => (a + 1) % members.length);
    }, AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [active, inView, paused, members.length]);

  const current = members[active];
  const accent = accents[active % accents.length];

  const goTo = (i: number) => {
    setActive(((i % members.length) + members.length) % members.length);
    play("click");
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
      <div className="flex flex-col">
        {members.map((m, i) => (
          <motion.button
            key={m.name}
            onClick={() => goTo(i)}
            onViewportEnter={() => setActive(i)}
            viewport={{ amount: 0.6 }}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className={`flex min-h-[13vh] items-center gap-3 rounded-xl border-l-2 px-3 text-left transition-colors cursor-pointer ${
              i === active ? "border-primary bg-primary/5" : "border-transparent hover:bg-background-alt"
            }`}
          >
            <span className={`font-mono text-xs ${i === active ? "text-primary" : "text-muted-soft"}`}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1">
              <span
                className={`block truncate text-sm font-semibold ${i === active ? "text-foreground" : "text-muted"}`}
              >
                {m.name}
              </span>
              <span className="block truncate text-xs text-muted-soft">{m.role}</span>
            </span>
          </motion.button>
        ))}
      </div>

      <div ref={stickyRef} className="lg:sticky lg:top-28 lg:self-start">
        <div className="relative mx-auto w-full max-w-md pt-10">
          <div className="mb-3 flex gap-1 px-1">
            {members.map((_, i) => (
              <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-border">
                {i < active && <div className={`h-full w-full ${accent.bar}`} />}
                {i === active && (
                  <motion.div
                    key={active}
                    className={`h-full ${accent.bar}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                    style={{ transformOrigin: "left", width: "100%" }}
                  />
                )}
              </div>
            ))}
          </div>

          <div
            className="card-surface relative rounded-3xl shadow-2xl"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <button
              aria-label="Previous member"
              onClick={() => goTo(active - 1)}
              className="absolute inset-y-0 left-0 z-30 w-1/3 cursor-pointer"
            />
            <button
              aria-label="Next member"
              onClick={() => goTo(active + 1)}
              className="absolute inset-y-0 right-0 z-30 w-1/3 cursor-pointer"
            />

            <div className="relative overflow-hidden rounded-t-3xl bg-background-alt" style={{ height: 168 }}>
              <div className="bg-dot-grid absolute inset-0 opacity-70" />
              <div
                aria-hidden
                className={`animate-blob absolute -right-10 -top-10 h-32 w-32 rounded-full ${accent.glow} blur-3xl`}
              />
              <span aria-hidden className="absolute left-4 top-4 h-2.5 w-2.5 border-l border-t border-border" />
              <span aria-hidden className="absolute right-4 top-4 h-2.5 w-2.5 border-r border-t border-border" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={`text-${active}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 p-5"
                >
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide ${accent.badge}`}
                  >
                    {current.role}
                  </span>
                  <h3 className="mt-2 max-w-[62%] font-display text-lg font-bold text-foreground sm:text-xl">
                    {current.name}
                  </h3>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative rounded-b-3xl bg-surface p-5 pt-4">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`bio-${active}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="line-clamp-4 text-sm leading-relaxed text-muted"
                >
                  {current.bio}
                </motion.p>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              {current.image ? (
                <motion.div
                  key={`photo-${active}`}
                  initial={{ opacity: 0, y: 26, scale: 0.85, rotate: -6 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotate: -3 }}
                  exit={{ opacity: 0, y: -14, scale: 0.9 }}
                  transition={{ duration: 0.45, delay: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="pointer-events-none absolute -top-12 right-3 z-20 h-44 w-28 sm:-top-14 sm:h-52 sm:w-32"
                >
                  <Image
                    src={current.image}
                    alt={current.name}
                    fill
                    sizes="160px"
                    className="object-contain object-bottom drop-shadow-[0_14px_18px_rgba(15,23,42,0.3)]"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={`avatar-${active}`}
                  initial={{ opacity: 0, y: 16, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                  className="pointer-events-none absolute -top-8 right-4 z-20 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-violet to-cyan font-display text-lg font-bold text-white shadow-lg"
                >
                  {initials(current.name)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
