import type { Metadata } from "next";
import { UserCheck, ClipboardCheck, FlaskConical, Zap, Eye, Lock, ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import {
  eligibility,
  memberExpectations,
  safetyPolicies,
  membershipStatus,
  upcomingEvents,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Membership | ISTS",
  description: "Membership status, eligibility, and safety policy for ISTS.",
};

const safetyIcons = [FlaskConical, Zap, Eye];
const challenge = upcomingEvents[0];

export default function JoinPage() {
  return (
    <div>
      <PageHero
        eyebrow="Membership"
        title="Applications are currently closed"
        description={membershipStatus.message}
      />

      <section className="px-5 pb-4 sm:px-8">
        <Reveal className="mx-auto max-w-4xl">
          <div className="card-surface flex flex-col items-start gap-4 border-border p-6 shadow-sm sm:flex-row sm:items-center">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background-alt text-muted">
              <Lock size={20} strokeWidth={2.2} />
            </span>
            <div className="flex-1">
              <p className="font-display text-sm font-semibold text-foreground">
                {membershipStatus.label} — the roster on the Team page is final for this cycle.
              </p>
              <p className="mt-1 text-sm text-muted">
                Want to get involved right now? Register for the School Innovation Challenge below.
              </p>
            </div>
            {challenge?.registrationUrl && (
              <a
                href={challenge.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Register
                <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </Reveal>
      </section>

      {/* ELIGIBILITY + EXPECTATIONS */}
      <section className="px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            align="left"
            eyebrow="For Next Time"
            title="What we look for"
            description="A reference for the next open cycle."
          />
        </div>
        <div className="mx-auto mt-8 grid max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-muted-soft">Eligibility</p>
            <RevealGroup className="mt-4 grid gap-3">
              {eligibility.map((item) => (
                <RevealItem key={item}>
                  <div className="card-surface flex items-center gap-3 p-4 shadow-sm">
                    <UserCheck size={16} className="shrink-0 text-primary" strokeWidth={2.2} />
                    <p className="text-sm text-foreground">{item}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-muted-soft">Expectations</p>
            <RevealGroup className="mt-4 grid gap-3">
              {memberExpectations.map((item) => (
                <RevealItem key={item}>
                  <div className="card-surface flex items-center gap-3 p-4 shadow-sm">
                    <ClipboardCheck size={16} className="shrink-0 text-cyan" strokeWidth={2.2} />
                    <p className="text-sm text-foreground">{item}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* SAFETY */}
      <section id="safety" className="scroll-mt-24 px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Safety" title="Safety is the top priority" />

          <RevealGroup className="mt-10 grid gap-5 md:grid-cols-3">
            {safetyPolicies.map((policy, i) => {
              const Icon = safetyIcons[i % safetyIcons.length];
              return (
                <RevealItem key={policy.title}>
                  <div className="card-surface h-full p-6 shadow-sm">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber/10 text-amber">
                      <Icon size={18} strokeWidth={2.2} />
                    </span>
                    <h3 className="mt-3 font-display text-sm font-semibold text-foreground">
                      {policy.title}
                    </h3>
                    <ul className="mt-3 space-y-1.5">
                      {policy.points.map((point) => (
                        <li key={point} className="flex items-start gap-2 text-xs leading-relaxed text-muted">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber/60" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* FINAL CTA */}
      {challenge?.registrationUrl && (
        <section className="px-5 pb-24 sm:px-8">
          <Reveal className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-violet px-8 py-14 text-center shadow-2xl shadow-primary/30 sm:px-14">
              <div className="absolute inset-0 bg-dot-grid opacity-20" />
              <h2 className="relative font-display text-2xl font-bold text-white sm:text-3xl">
                {challenge.title}
              </h2>
              <p className="relative mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
                Registrations for the School Innovation Challenge are open now.
              </p>
              <a
                href={challenge.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-primary shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                Register Your Team
                <ArrowUpRight size={16} />
              </a>
            </div>
          </Reveal>
        </section>
      )}
    </div>
  );
}
