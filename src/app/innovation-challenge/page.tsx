import type { Metadata } from "next";
import {
  Sparkles,
  ArrowUpRight,
  ScanLine,
  MonitorPlay,
  BellRing,
  Smartphone,
  LayoutDashboard,
  Users,
  Target,
  ShieldAlert,
  Gavel,
  Trophy,
  Award,
  CalendarClock,
  MapPin,
  Clock,
  Mail,
} from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { challenge } from "@/lib/data";

export const metadata: Metadata = {
  title: `${challenge.title} ${challenge.edition} | ISTS`,
  description: `${challenge.hook} Problem statement: ${challenge.problemTitle}.`,
};

const requirementIcons = [LayoutDashboard, ScanLine, MonitorPlay, BellRing, Smartphone];
const howItWorksIcons = [Users, Target, ArrowUpRight, Trophy];

export default function InnovationChallengePage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden px-5 pb-14 pt-16 sm:px-8 sm:pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal className="flex flex-col items-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-primary">
              <Sparkles size={12} className="text-lime" /> {challenge.edition} · {challenge.status}
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {challenge.title}
            </h1>
            <p className="mt-3 font-mono text-sm text-primary sm:text-base">{challenge.tagline}</p>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {challenge.hook}
            </p>
          </Reveal>

          <RevealGroup className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {challenge.quickFacts.map((f) => (
              <RevealItem key={f.label}>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 font-mono text-xs text-muted shadow-sm">
                  {f.label}: <span className="font-semibold text-foreground">{f.value}</span>
                </span>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.1} className="mt-8">
            <a
              href={challenge.registration.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/35"
            >
              Register Your Team
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="px-5 py-10 sm:px-8">
        <Reveal className="card-surface glow-primary mx-auto max-w-4xl p-7 shadow-md sm:p-9">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-primary">
            <Target size={12} /> The Problem
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl">
            {challenge.problemTitle}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            {challenge.problemBody}
          </p>
        </Reveal>
      </section>

      {/* SOLUTION MUST DO */}
      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Requirements" title="Your solution must do this" />

          <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2">
            {challenge.fullRules.solutionMustDo.map((item, i) => {
              const Icon = requirementIcons[i % requirementIcons.length];
              return (
                <RevealItem key={item}>
                  <div className="card-surface flex h-full items-start gap-3.5 p-5 shadow-sm">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
                      <Icon size={16} strokeWidth={2.2} />
                    </span>
                    <p className="text-sm leading-relaxed text-foreground">{item}</p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Process" title="How it works" />

          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {challenge.howItWorks.map((step, i) => {
              const Icon = howItWorksIcons[i % howItWorksIcons.length];
              return (
                <RevealItem key={step}>
                  <div className="card-surface relative h-full p-5 shadow-sm">
                    <span className="absolute right-4 top-4 font-display text-2xl font-bold text-border-strong">
                      {i + 1}
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon size={16} strokeWidth={2.2} />
                    </span>
                    <p className="mt-3 text-sm leading-relaxed text-foreground">{step}</p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* FULL RULES */}
      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Rules" title="The full rules" />

          <RevealGroup className="mt-10 grid gap-5 md:grid-cols-3">
            <RevealItem>
              <div className="card-surface h-full p-6 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime/10 text-lime">
                  <Users size={18} strokeWidth={2.2} />
                </span>
                <h3 className="mt-3 font-display text-sm font-semibold text-foreground">
                  Who Can Join
                </h3>
                <ul className="mt-3 space-y-1.5">
                  {challenge.fullRules.who.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-xs leading-relaxed text-muted">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-lime/60" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>

            <RevealItem>
              <div className="card-surface h-full p-6 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
                  <Target size={18} strokeWidth={2.2} />
                </span>
                <h3 className="mt-3 font-display text-sm font-semibold text-foreground">
                  The Problem Scope
                </h3>
                <ul className="mt-3 space-y-1.5">
                  {challenge.fullRules.problemScope.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-xs leading-relaxed text-muted">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan/60" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>

            <RevealItem>
              <div className="card-surface h-full p-6 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber/10 text-amber">
                  <ShieldAlert size={18} strokeWidth={2.2} />
                </span>
                <h3 className="mt-3 font-display text-sm font-semibold text-foreground">
                  Conduct
                </h3>
                <ul className="mt-3 space-y-1.5">
                  {challenge.fullRules.conduct.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-xs leading-relaxed text-muted">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber/60" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      {/* JUDGING + PRIZES */}
      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          <Reveal className="card-surface p-7 shadow-sm sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-violet/10 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-violet">
              <Gavel size={12} /> Judging
            </span>
            <p className="mt-3 text-sm text-muted">Every team is scored on the same rubric.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {challenge.judging.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-border bg-background-alt px-3.5 py-1.5 text-sm text-foreground"
                >
                  {c}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08} className="card-surface p-7 shadow-sm sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-lime/10 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-lime">
              <Trophy size={12} /> Prizes
            </span>
            <div className="mt-5 flex items-start gap-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lime/10 text-lime">
                <Trophy size={16} strokeWidth={2.2} />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Winning Team</p>
                <p className="text-sm text-muted">{challenge.prizes.winner}</p>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Award size={16} strokeWidth={2.2} />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Every Team</p>
                <p className="text-sm text-muted">{challenge.prizes.participation}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* EVENT DAY */}
      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Event Day" title="What to expect" />

          <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal className="card-surface p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-primary" />
                <p className="text-sm text-foreground">
                  {challenge.quickFacts.find((f) => f.label === "Venue")?.value}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <CalendarClock size={16} className="text-primary" />
                <p className="text-sm text-foreground">
                  {challenge.quickFacts.find((f) => f.label === "When")?.value}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <Clock size={16} className="text-primary" />
                <p className="text-sm text-foreground">
                  Team size: {challenge.quickFacts.find((f) => f.label === "Team Size")?.value}
                </p>
              </div>
            </Reveal>

            <RevealGroup className="grid gap-3">
              {challenge.eventDaySchedule.map((item, i) => (
                <RevealItem key={item}>
                  <div className="card-surface flex items-center gap-4 p-4 shadow-sm">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-mono text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <p className="text-sm text-foreground">{item}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* REGISTER CTA */}
      <section className="px-5 pb-24 sm:px-8">
        <Reveal className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-violet px-8 py-14 text-center shadow-2xl shadow-primary/30 sm:px-14">
            <div className="absolute inset-0 bg-dot-grid opacity-20" />
            <h2 className="relative font-display text-2xl font-bold text-white sm:text-3xl">
              Register your team
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
              {challenge.registration.note}
            </p>
            <a
              href={challenge.registration.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-primary shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              Open Registration Form
              <ArrowUpRight size={16} />
            </a>
            <p className="relative mt-6 inline-flex items-center gap-2 font-mono text-xs text-white/70">
              <Mail size={13} />
              Questions? Contact {challenge.contact.name}, {challenge.contact.role}
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
