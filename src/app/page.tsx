"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  CalendarClock,
  Bot,
  Microscope,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Typewriter } from "@/components/Typewriter";
import { Counter } from "@/components/Counter";
import { TerminalCard } from "@/components/TerminalCard";
import { MarqueeStrip } from "@/components/MarqueeStrip";
import { FocusAreaCard } from "@/components/FocusAreaCard";
import { useSound } from "@/components/SoundProvider";
import { siteMeta, stats, focusAreas, events, executiveTeam } from "@/lib/data";

const highlights = [
  {
    icon: Sparkles,
    title: "Hands-On Learning",
    body: "Experiments, workshops, and demonstrations that turn textbook theory into things you build.",
    accent: "text-primary bg-primary/10",
  },
  {
    icon: CalendarClock,
    title: "Weekly Seminars",
    body: "Every Monday — student and guest-led talks on AI, space, cybersecurity, and more.",
    accent: "text-cyan bg-cyan/10",
  },
  {
    icon: Bot,
    title: "Robotics & AI",
    body: "Arduino, sensors, automation, and artificial intelligence — beginner-friendly, always.",
    accent: "text-violet bg-violet/10",
  },
  {
    icon: Microscope,
    title: "Research & Innovation",
    body: "Term-end showcases where student research, prototypes, and ideas take the spotlight.",
    accent: "text-lime bg-lime/10",
  },
];

export default function Home() {
  const { play } = useSound();
  const president = executiveTeam[0];

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-primary"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse-glow" />
              {siteMeta.school}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Innovation, Science
              <br />
              &amp; <span className="text-gradient">Technology Society</span>
            </motion.h1>

            <div className="mt-5 h-8 font-mono text-lg font-medium text-primary sm:text-xl">
              <Typewriter text={`"${siteMeta.motto}"`} />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
            >
              {siteMeta.tagline} Open to every student from Grade 6 and above — beginners and
              builders alike.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/join"
                onMouseEnter={() => play("hover")}
                onClick={() => play("click")}
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/35"
              >
                Join the Society
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/focus-areas"
                onMouseEnter={() => play("hover")}
                onClick={() => play("click")}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
              >
                Explore Focus Areas
              </Link>
            </motion.div>

            <RevealGroup className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((s) => (
                <RevealItem key={s.label}>
                  <div className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                    <Counter value={s.value} className="text-gradient" />
                  </div>
                  <div className="mt-1 font-mono text-[11px] uppercase tracking-wide text-muted-soft">
                    {s.label}
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <div className="flex justify-center lg:justify-end">
            <TerminalCard />
          </div>
        </div>
      </section>

      <MarqueeStrip />

      {/* HIGHLIGHTS */}
      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Why ISTS"
            title="Where curiosity turns into craft"
            description="A structured, student-led, teacher-supervised platform to explore science and technology beyond the regular classroom."
          />

          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((h) => (
              <RevealItem key={h.title}>
                <div className="card-surface group h-full p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${h.accent}`}
                  >
                    <h.icon size={20} strokeWidth={2.2} />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                    {h.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{h.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* FOCUS AREAS */}
      <section className="relative px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Core Focus Areas"
            title="Four disciplines. One mission."
            description="From safe chemistry demonstrations to robotics builds and research showcases — structured learning across the STEM spectrum."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {focusAreas.map((area, i) => (
              <FocusAreaCard key={area.id} area={area} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* EVENT RHYTHM */}
      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Event Rhythm"
            title="Weekly seminars. Monthly events. Grand showcases."
            description="A balanced calendar that keeps the society active every single week of the term."
          />

          <div className="relative mt-14">
            <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-border md:block" />
            <div className="space-y-8 md:space-y-0">
              {events.map((e, i) => (
                <Reveal
                  key={e.id}
                  delay={i * 0.08}
                  className={`relative flex flex-col gap-4 md:mb-4 md:flex-row md:items-center ${
                    i % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="md:w-1/2">
                    <div
                      className={`card-surface p-6 shadow-sm ${i % 2 === 1 ? "md:ml-8" : "md:mr-8"}`}
                    >
                      <span className="font-mono text-[11px] uppercase tracking-wide text-cyan">
                        {e.cadence}
                      </span>
                      <h3 className="mt-1.5 font-display text-lg font-semibold text-foreground">
                        {e.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{e.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 hidden h-3 w-3 -translate-x-1/2 rounded-full bg-primary ring-4 ring-primary/20 md:block" />
                  <div className="md:w-1/2" />
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal className="mt-10 flex justify-center">
            <Link
              href="/events"
              onMouseEnter={() => play("hover")}
              onClick={() => play("click")}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
            >
              See the full event structure
              <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* TEAM TEASER */}
      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="card-surface relative overflow-hidden p-8 shadow-sm sm:p-12">
            <div className="animate-blob absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-primary/20 to-violet/20 blur-3xl" />
            <div className="relative grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-primary">
                  <Users size={12} /> Led by Students
                </span>
                <h2 className="mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl">
                  {executiveTeam.length + 7} students. One executive committee.
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
                  Founded and chaired by <strong className="text-foreground">{siteMeta.founder}</strong>,
                  led by President <strong className="text-foreground">{president.name}</strong>, and
                  run by a full executive committee spanning finance, robotics, media, research, and
                  events.
                </p>
                <Link
                  href="/team"
                  onMouseEnter={() => play("hover")}
                  onClick={() => play("click")}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Meet the Team
                  <ArrowRight size={16} />
                </Link>
              </div>
              <div className="flex flex-wrap gap-2 md:max-w-xs md:justify-end">
                {["President", "VP", "Secretary", "Finance", "IT & Robotics", "Research", "Events", "Media"].map(
                  (role) => (
                    <span
                      key={role}
                      className="rounded-full border border-border bg-background-alt px-3 py-1.5 font-mono text-[11px] text-muted"
                    >
                      {role}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-24 pt-4 sm:px-8">
        <Reveal className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-violet px-8 py-14 text-center shadow-2xl shadow-primary/30 sm:px-14">
            <div className="absolute inset-0 bg-dot-grid opacity-20" />
            <ShieldCheck className="mx-auto h-10 w-10 text-white/80" strokeWidth={1.6} />
            <h2 className="relative mt-4 font-display text-2xl font-bold text-white sm:text-3xl">
              Curious, disciplined, and ready to build?
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
              No prior experience required — just curiosity, dedication, and a willingness to
              learn. Membership is open to every student from Grade 6 and above.
            </p>
            <Link
              href="/join"
              onMouseEnter={() => play("hover")}
              onClick={() => play("click")}
              className="relative mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-primary shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              View Membership Details
              <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
