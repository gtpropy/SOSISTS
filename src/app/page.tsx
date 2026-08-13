"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Users, ImageIcon, CalendarClock } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Typewriter } from "@/components/Typewriter";
import { Counter } from "@/components/Counter";
import { TerminalCard } from "@/components/TerminalCard";
import { MarqueeStrip } from "@/components/MarqueeStrip";
import { FocusAreaCard } from "@/components/FocusAreaCard";
import { ShowcaseGallery } from "@/components/ShowcaseGallery";
import { UpcomingEvents } from "@/components/UpcomingEvents";
import { Scrollytelling } from "@/components/Scrollytelling";
import { useSound } from "@/components/SoundProvider";
import { siteMeta, stats, focusAreas, executiveTeam, upcomingEvents, journey } from "@/lib/data";

export default function Home() {
  const { play } = useSound();
  const president = executiveTeam[0];
  const challenge = upcomingEvents[0];

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
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
              A student-led, teacher-supervised STEM society at SOS Hermann Minor School.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <a
                href={challenge.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => play("hover")}
                onClick={() => play("click")}
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/35"
              >
                Register for Innovation Challenge
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
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

      {/* SHOWCASE GALLERY */}
      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            align="left"
            eyebrow="Inside ISTS"
            title={
              <span className="inline-flex items-center gap-2">
                <ImageIcon size={22} className="text-primary" /> A quick look
              </span>
            }
          />
          <div className="mt-8">
            <ShowcaseGallery />
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            align="left"
            eyebrow="Upcoming"
            title={
              <span className="inline-flex items-center gap-2">
                <CalendarClock size={22} className="text-primary" /> What&apos;s next
              </span>
            }
          />
          <div className="mt-8">
            <UpcomingEvents events={upcomingEvents} />
          </div>
        </div>
      </section>

      <MarqueeStrip />

      {/* SCROLLYTELLING */}
      <section className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="How It Works"
            title="From curiosity to showcase"
            className="mb-16"
          />
          <Scrollytelling steps={journey} />
        </div>
      </section>

      {/* FOCUS AREAS */}
      <section className="relative px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Core Focus Areas" title="Four disciplines. One mission." />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {focusAreas.map((area, i) => (
              <FocusAreaCard key={area.id} area={area} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* TEAM TEASER */}
      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="card-surface relative overflow-hidden p-8 shadow-sm sm:p-12">
            <div className="animate-blob absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-primary/20 to-violet/20 blur-3xl" />
            <div className="relative grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-primary">
                  <Users size={12} /> Led by Students
                </span>
                <h2 className="mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl">
                  A full executive committee, run by students.
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
                  Founded by <strong className="text-foreground">{siteMeta.founder}</strong>, led by
                  President <strong className="text-foreground">{president.name}</strong>.
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
            <h2 className="relative font-display text-2xl font-bold text-white sm:text-3xl">
              Ready to build something?
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
              Membership is closed for now — but the School Innovation Challenge is open to
              registered teams.
            </p>
            <a
              href={challenge.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => play("hover")}
              onClick={() => play("click")}
              className="relative mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-primary shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              Register Your Team
              <ArrowUpRight size={16} />
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
