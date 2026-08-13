import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { EventCard } from "@/components/EventCard";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { events } from "@/lib/data";

export const metadata: Metadata = {
  title: "Events & Calendar | ISTS",
  description:
    "Weekly innovation seminars, monthly major events, the Grand Term Event, and inter-school collaboration — the event structure of ISTS.",
};

const process = [
  "Selection of event theme & objectives",
  "Approval from faculty supervisor & administration",
  "Announcement to eligible students",
  "Registration of participants",
  "Preparation of materials, rules & venue",
  "Event execution with discipline & supervision",
  "Judging & evaluation where required",
  "Certificates, recognition & event report",
];

export default function EventsPage() {
  return (
    <div>
      <PageHero
        eyebrow="Section 9 — Event Structure & Calendar"
        title="A rhythm that keeps ISTS active every week"
        description="Weekly learning, monthly major activities, and grand term-end showcases — a balanced calendar built for consistency and depth over quantity."
      />

      <section className="px-5 py-10 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2">
          {events.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="How an event comes together"
            title="From idea to certificate"
            description="Every monthly and grand-term event follows the same disciplined process, planned by the executive committee under faculty supervision."
          />

          <RevealGroup className="mt-12 grid gap-3 sm:grid-cols-2">
            {process.map((step, i) => (
              <RevealItem key={step}>
                <div className="card-surface flex items-center gap-4 p-4 shadow-sm">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <p className="text-sm text-foreground">{step}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-8">
            <div className="card-surface p-6 text-center shadow-sm">
              <p className="text-sm leading-relaxed text-muted">
                Judging considers creativity, scientific accuracy, teamwork, and safety.
                Categories at the Grand Term Event include{" "}
                <strong className="text-foreground">Best Innovation Project</strong>,{" "}
                <strong className="text-foreground">Best Robotics Demonstration</strong>, and{" "}
                <strong className="text-foreground">Most Promising Young Scientist</strong>.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
