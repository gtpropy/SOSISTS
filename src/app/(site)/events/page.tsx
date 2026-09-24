import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { EventCard } from "@/components/EventCard";
import { EventGallery } from "@/components/EventGallery";
import { events, sicGallery } from "@/lib/data";

export const metadata: Metadata = {
  title: "Events & Calendar | ISTS",
  description:
    "Weekly innovation seminars, monthly major events, the Grand Term Event, and inter-school collaboration — the event structure of ISTS.",
};

export default function EventsPage() {
  return (
    <div>
      <PageHero
        eyebrow="Events"
        title="A rhythm that keeps ISTS active"
        description="Weekly learning, monthly builds, and a grand term-end showcase."
      />

      {/* SIC 2026 RECAP — a huge success */}
      <section className="px-5 pt-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <Reveal className="flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-lime/15 px-4 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-lime">
              <Sparkles size={12} /> SIC 2026 · A Huge Success
            </span>
            <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              The School Innovation Challenge was a huge success 🎉
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              {sicGallery.caption} Thank you to every team, mentor, and judge who
              showed up and built something real.
            </p>
          </Reveal>

          <div className="mt-8">
            <EventGallery />
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2">
          {events.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>

        <Reveal className="mx-auto mt-6 max-w-6xl">
          <div className="card-surface p-6 text-center shadow-sm">
            <p className="text-sm leading-relaxed text-muted">
              Judged on creativity, accuracy, teamwork &amp; safety — with awards including{" "}
              <strong className="text-foreground">Best Innovation Project</strong> and{" "}
              <strong className="text-foreground">Most Promising Young Scientist</strong>.
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
