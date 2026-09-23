import type { Metadata } from "next";
import {
  Sparkles,
  Cpu,
  CircuitBoard,
  Code2,
  Lightbulb,
  Wrench,
  GraduationCap,
  CalendarDays,
  Clock,
  Bot,
  Trophy,
  Gamepad2,
  Gift,
  PartyPopper,
  CheckCircle2,
  Mail,
  ArrowUpRight,
  Users,
} from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { roboWorkshop } from "@/lib/data";

export const metadata: Metadata = {
  title: `${roboWorkshop.title} | ISTS`,
  description: `${roboWorkshop.tagline}. ${roboWorkshop.hook}`,
};

const quickFactIcons = [CalendarDays, Clock, GraduationCap, Cpu];
const learnIcons = [CircuitBoard, Code2, Lightbulb, Wrench];
const funIcons = [Gamepad2, Gift, PartyPopper];
const dayIcons = [Bot, Trophy];
const dayAccents = [
  { bg: "bg-cyan/10", text: "text-cyan", ring: "ring-cyan/20" },
  { bg: "bg-violet/10", text: "text-violet", ring: "ring-violet/20" },
] as const;

export default function RobotoShopPage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden px-5 pb-14 pt-16 sm:px-8 sm:pt-20">
        <div className="animate-blob absolute -left-24 top-0 h-72 w-72 rounded-full bg-gradient-to-br from-cyan/20 to-primary/20 blur-3xl" />
        <div className="animate-blob absolute -right-16 top-40 h-64 w-64 rounded-full bg-gradient-to-br from-violet/20 to-lime/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <Reveal className="flex flex-col items-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/5 px-4 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-cyan">
              <Sparkles size={12} className="text-lime" /> {roboWorkshop.status}
            </span>

            <div className="mt-5 flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan via-primary to-violet text-white shadow-lg shadow-primary/25">
                <Bot size={28} strokeWidth={2.2} />
              </span>
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {roboWorkshop.title}
              </h1>
            </div>

            <p className="mt-4 font-mono text-sm text-primary sm:text-base">
              {roboWorkshop.tagline}
            </p>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {roboWorkshop.hook}
            </p>
          </Reveal>

          <RevealGroup className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {roboWorkshop.quickFacts.map((f, i) => {
              const Icon = quickFactIcons[i % quickFactIcons.length];
              return (
                <RevealItem key={f.label}>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 font-mono text-xs text-muted shadow-sm">
                    <Icon size={13} className="text-cyan" />
                    {f.label}: <span className="font-semibold text-foreground">{f.value}</span>
                  </span>
                </RevealItem>
              );
            })}
          </RevealGroup>

          <Reveal delay={0.1} className="mt-8 flex flex-col items-center gap-3">
            <a
              href={roboWorkshop.registration.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan via-primary to-violet px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/35"
            >
              Register Now
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <p className="inline-flex max-w-md items-center gap-1.5 text-center font-mono text-[11px] text-muted-soft">
              <Users size={12} className="shrink-0" /> {roboWorkshop.registration.note}
            </p>
          </Reveal>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="px-5 py-6 sm:px-8">
        <Reveal className="card-surface glow-primary mx-auto flex max-w-4xl flex-col items-center gap-3 p-7 text-center shadow-md sm:p-9">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime/10 text-lime">
            <GraduationCap size={22} strokeWidth={2.2} />
          </span>
          <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
            Made for beginners
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            {roboWorkshop.audience}. If you&apos;ve never touched a circuit or written a line of
            code, this is exactly the workshop for you.
          </p>
        </Reveal>
      </section>

      {/* WHAT YOU'LL LEARN */}
      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Skills" title="What you'll learn" />

          <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2">
            {roboWorkshop.whatYoullLearn.map((item, i) => {
              const Icon = learnIcons[i % learnIcons.length];
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

      {/* TWO-DAY SCHEDULE */}
      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Schedule" title="Two days, here's the plan" />

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {roboWorkshop.days.map((day, i) => {
              const Icon = dayIcons[i % dayIcons.length];
              const accent = dayAccents[i % dayAccents.length];
              const isLastDay = i === roboWorkshop.days.length - 1;
              return (
                <Reveal key={day.day} delay={i * 0.08} className="h-full">
                  <div className={`card-surface relative h-full overflow-hidden p-6 shadow-sm ring-1 ${accent.ring} sm:p-7`}>
                    <div
                      className={`absolute -right-10 -top-10 h-36 w-36 rounded-full ${accent.bg} opacity-70 blur-2xl`}
                    />
                    <div className="relative flex items-center gap-3">
                      <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${accent.bg} ${accent.text}`}>
                        <Icon size={20} strokeWidth={2.2} />
                      </span>
                      <div>
                        <p className={`font-mono text-[11px] font-semibold uppercase tracking-wide ${accent.text}`}>
                          {day.day} &middot; {day.date}
                        </p>
                        <h3 className="font-display text-lg font-bold text-foreground">
                          {day.title}
                        </h3>
                      </div>
                    </div>

                    <ul className="relative mt-5 space-y-2.5">
                      {day.items.map((item) => {
                        const isCapstone = item.toLowerCase().startsWith("capstone");
                        return (
                          <li
                            key={item}
                            className={`flex items-start gap-2.5 rounded-lg px-2.5 py-1.5 text-sm leading-relaxed ${
                              isCapstone
                                ? `${accent.bg} font-semibold text-foreground`
                                : "text-foreground"
                            }`}
                          >
                            {isCapstone ? (
                              <Trophy size={14} className={`mt-0.5 shrink-0 ${accent.text}`} />
                            ) : (
                              <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-muted-soft" />
                            )}
                            {item}
                          </li>
                        );
                      })}
                    </ul>

                    {isLastDay && (
                      <p className="relative mt-4 font-mono text-[11px] text-muted-soft">
                        Everyone gets Day 2&apos;s finale to design &amp; show off their own capstone.
                      </p>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* FUN & PRIZES */}
      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="card-surface relative overflow-hidden p-7 shadow-sm sm:p-9">
            <div className="animate-blob absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-lime/20 to-cyan/20 blur-3xl" />
            <div className="relative flex flex-col items-center text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-lime/15 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-lime">
                <PartyPopper size={12} /> Not All Work
              </span>
              <h2 className="mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl">
                Fun &amp; mini prizes, built right in
              </h2>
            </div>

            <RevealGroup className="relative mt-8 grid gap-4 sm:grid-cols-3">
              {roboWorkshop.funStuff.map((item, i) => {
                const Icon = funIcons[i % funIcons.length];
                return (
                  <RevealItem key={item}>
                    <div className="flex h-full flex-col items-center gap-3 rounded-2xl border border-border bg-background-alt p-5 text-center">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime/10 text-lime">
                        <Icon size={18} strokeWidth={2.2} />
                      </span>
                      <p className="text-sm leading-relaxed text-foreground">{item}</p>
                    </div>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* WHAT TO BRING */}
      <section className="px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Before You Come" title="What to bring" />
          <RevealGroup className="mt-8 grid gap-3">
            {roboWorkshop.whatToBring.map((item) => (
              <RevealItem key={item}>
                <div className="card-surface flex items-center gap-3 p-4 shadow-sm">
                  <CheckCircle2 size={16} className="shrink-0 text-primary" strokeWidth={2.2} />
                  <p className="text-sm text-foreground">{item}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* GET A SEAT CTA */}
      <section id="get-a-seat" className="scroll-mt-24 px-5 pb-24 sm:px-8">
        <Reveal className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan via-primary to-violet px-8 py-14 text-center shadow-2xl shadow-primary/30 sm:px-14">
            <div className="absolute inset-0 bg-dot-grid opacity-20" />
            <h2 className="relative font-display text-2xl font-bold text-white sm:text-3xl">
              Seats are limited, on purpose
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
              We keep RobotoShop small so every beginner gets real hands-on help.{" "}
              {roboWorkshop.registration.note}
            </p>
            <a
              href={roboWorkshop.registration.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-primary shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              Register Now
              <ArrowUpRight size={16} />
            </a>
            <p className="relative mt-6 inline-flex items-center gap-2 font-mono text-xs text-white/70">
              <Mail size={13} />
              Questions? Reach out to the {roboWorkshop.contact.name}
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
