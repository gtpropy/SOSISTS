"use client";

import { useRef } from "react";
import Link from "next/link";
import { Cpu, ArrowUpRight } from "lucide-react";
import { useSound } from "@/components/SoundProvider";
import { useAdmin } from "@/components/AdminProvider";
import { siteMeta } from "@/lib/data";

// Hidden admin unlock: tap the copyright line this many times, quickly, to
// reveal the admin key prompt. Deliberately invisible otherwise — no hint,
// no styling change — so it stays out of the way for every other visitor.
const SECRET_TAPS = 6;
const SECRET_WINDOW_MS = 2500;

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/about", label: "Vision & Mission" },
      { href: "/focus-areas", label: "Focus Areas" },
      { href: "/events", label: "Events & Calendar" },
      { href: "/robotoshop", label: "RobotoShop" },
      { href: "/innovation-challenge", label: "SIC 2026 Recap" },
    ],
  },
  {
    title: "Society",
    links: [
      { href: "/team", label: "Executive Team" },
      { href: "/join", label: "Membership" },
      { href: "/join#safety", label: "Safety Policy" },
    ],
  },
];

export function Footer() {
  const { play } = useSound();
  const { openModal, unlocked } = useAdmin();
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSecretTap = () => {
    if (unlocked) return;
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    if (tapCount.current >= SECRET_TAPS) {
      tapCount.current = 0;
      openModal();
      return;
    }
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, SECRET_WINDOW_MS);
  };

  return (
    <footer className="relative mt-24 border-t border-border bg-surface/70 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-violet to-cyan text-white">
                <Cpu size={18} />
              </span>
              <span className="font-display text-lg font-bold text-foreground">
                {siteMeta.shortName}
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {siteMeta.name} at {siteMeta.school} — a student-led, teacher-supervised platform
              for science, technology, robotics, and innovation.
            </p>
            <p className="mt-4 font-mono text-xs text-primary">“{siteMeta.motto}”</p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="font-display text-sm font-semibold text-foreground">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      onMouseEnter={() => play("hover")}
                      onClick={() => play("navigate")}
                      className="group inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-primary"
                    >
                      {l.label}
                      <ArrowUpRight
                        size={13}
                        className="opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-soft sm:flex-row">
          <button
            type="button"
            onClick={handleSecretTap}
            className="cursor-default select-none bg-transparent p-0 text-left text-xs text-muted-soft"
          >
            © {new Date().getFullYear()} {siteMeta.shortName} · {siteMeta.school}
          </button>
          <p className="font-mono">
            founded by {siteMeta.founder} — {siteMeta.founderRole}
          </p>
        </div>
      </div>
    </footer>
  );
}
