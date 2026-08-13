import type { Metadata } from "next";
import {
  UserCheck,
  ClipboardList,
  ShieldCheck,
  FlaskConical,
  Zap,
  Eye,
  Mic2,
  MessageCircle,
  FileCheck2,
  Sparkles,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { eligibility, memberExpectations, safetyPolicies, siteMeta } from "@/lib/data";

export const metadata: Metadata = {
  title: "Join ISTS | Membership & Safety",
  description:
    "Eligibility, member expectations, code of conduct, and safety policy for joining the Innovation, Science & Technology Society (ISTS).",
};

const safetyIcons = [FlaskConical, Zap, Eye];

const joinSteps = [
  {
    icon: Mic2,
    title: "Come to a Monday seminar",
    body: "Weekly Innovation Seminars run every Monday during break time — the easiest way to see ISTS in action.",
  },
  {
    icon: MessageCircle,
    title: "Talk to a coordinator",
    body: "Speak with the Secretary, Joint Secretary, or any executive member about joining.",
  },
  {
    icon: FileCheck2,
    title: "Complete the membership process",
    body: "Confirm your eligibility, agree to the code of conduct, and register as an official member.",
  },
  {
    icon: Sparkles,
    title: "Start building",
    body: "Join a focus area, attend workshops, and take part in the next monthly event.",
  },
];

export default function JoinPage() {
  return (
    <div>
      <PageHero
        eyebrow="Section 6 — Membership & Eligibility"
        title="Beginners and builders — all welcome"
        description="Membership is open to every student from Grade 6 and above at SOS Hermann Minor School. Curiosity, dedication, and discipline matter more than prior experience."
      />

      {/* ELIGIBILITY */}
      <section className="px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            align="left"
            eyebrow="Eligibility"
            title="Students may apply for membership if they..."
          />

          <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2">
            {eligibility.map((item) => (
              <RevealItem key={item}>
                <div className="card-surface flex h-full items-start gap-3 p-5 shadow-sm">
                  <UserCheck size={18} className="mt-0.5 shrink-0 text-primary" strokeWidth={2.2} />
                  <p className="text-sm leading-relaxed text-foreground">{item}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* EXPECTATIONS */}
      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            align="left"
            eyebrow="Member Expectations"
            title="What ISTS asks of every member"
          />

          <RevealGroup className="mt-8 grid gap-3">
            {memberExpectations.map((item, i) => (
              <RevealItem key={item}>
                <div className="card-surface flex items-center gap-4 p-4 shadow-sm">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan/10 font-mono text-xs font-bold text-cyan">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-relaxed text-foreground">{item}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-6">
            <div className="card-surface flex items-start gap-4 border-primary/20 bg-primary/5 p-6 shadow-sm">
              <ClipboardList size={22} className="mt-0.5 shrink-0 text-primary" strokeWidth={2.2} />
              <p className="text-sm leading-relaxed text-muted">
                <strong className="text-foreground">Code of Responsibility:</strong> ISTS is not
                only a club for enjoyment but a platform for learning, leadership, and school
                representation. Members are expected to behave with maturity, punctuality, and
                respect, and to use the society&apos;s resources responsibly.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SAFETY */}
      <section id="safety" className="scroll-mt-24 px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Section 11 — Safety Policy"
            title="Safety is the top priority"
            description="Since ISTS involves experiments, electronics, robotics, and demonstrations, every activity is carefully supervised and approved."
          />

          <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3">
            {safetyPolicies.map((policy, i) => {
              const Icon = safetyIcons[i % safetyIcons.length];
              return (
                <RevealItem key={policy.title}>
                  <div className="card-surface h-full p-6 shadow-sm">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber/10 text-amber">
                      <Icon size={20} strokeWidth={2.2} />
                    </span>
                    <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                      {policy.title}
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {policy.points.map((point) => (
                        <li key={point} className="flex items-start gap-2 text-sm leading-relaxed text-muted">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber/60" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>

          <Reveal className="mt-8">
            <div className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 to-violet/5 p-6 text-center">
              <p className="font-mono text-sm text-primary">
                &ldquo;No experiment or project is successful if it is not safe, ethical, and
                responsible.&rdquo;
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW TO JOIN */}
      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="How to Join" title="Four steps to becoming a member" />

          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {joinSteps.map((step, i) => (
              <RevealItem key={step.title}>
                <div className="card-surface relative h-full p-6 shadow-sm">
                  <span className="absolute right-5 top-5 font-display text-3xl font-bold text-border-strong">
                    {i + 1}
                  </span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <step.icon size={20} strokeWidth={2.2} />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 pb-24 sm:px-8">
        <Reveal className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-violet px-8 py-14 text-center shadow-2xl shadow-primary/30 sm:px-14">
            <div className="absolute inset-0 bg-dot-grid opacity-20" />
            <ShieldCheck className="mx-auto h-10 w-10 text-white/80" strokeWidth={1.6} />
            <h2 className="relative mt-4 font-display text-2xl font-bold text-white sm:text-3xl">
              {siteMeta.motto}
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
              See you at the next Weekly Innovation Seminar — every Monday, during break time.
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
