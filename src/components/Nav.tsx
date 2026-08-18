"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Volume2, VolumeX, Music2, Cpu, Lock } from "lucide-react";
import { useSound } from "@/components/SoundProvider";
import { useMusic } from "@/components/MusicProvider";
import { membershipStatus } from "@/lib/data";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/focus-areas", label: "Focus Areas" },
  { href: "/events", label: "Events" },
  { href: "/innovation-challenge", label: "SIC 2026" },
  { href: "/team", label: "Team" },
  { href: "/join", label: "Membership" },
];

export function Nav() {
  const pathname = usePathname();
  const { enabled, toggle, play } = useSound();
  const { enabled: musicEnabled, toggle: toggleMusic } = useMusic();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface/80 backdrop-blur-xl border-b border-border shadow-[0_4px_30px_-10px_rgba(67,56,202,0.15)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href="/"
          onMouseEnter={() => play("hover")}
          onClick={() => play("navigate")}
          className="group flex items-center gap-2.5"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-violet to-cyan text-white shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6">
            <Cpu size={18} strokeWidth={2.4} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              ISTS<span className="text-primary">.</span>
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-soft">
              SOS Hermann Gmeiner
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => play("hover")}
                onClick={() => play("navigate")}
                className="relative px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-primary"
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-primary/10"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className={`relative z-10 ${active ? "text-primary" : ""}`}>{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label={enabled ? "Mute sound effects" : "Enable sound effects"}
            onClick={toggle}
            onMouseEnter={() => play("hover")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-primary/40 hover:text-primary cursor-pointer"
          >
            {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button
            aria-label={musicEnabled ? "Mute background music" : "Play background music"}
            onClick={() => {
              toggleMusic();
              play("click");
            }}
            onMouseEnter={() => play("hover")}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors cursor-pointer ${
              musicEnabled
                ? "border-primary/30 bg-primary/5 text-primary"
                : "border-border bg-surface text-muted-soft hover:border-primary/40 hover:text-primary"
            }`}
          >
            <Music2 size={16} />
          </button>

          <Link
            href="/join"
            onMouseEnter={() => play("hover")}
            onClick={() => play("click")}
            className={
              membershipStatus.open
                ? "hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/35 sm:inline-block"
                : "hidden items-center gap-1.5 rounded-full border border-border bg-background-alt px-4 py-2 font-mono text-xs font-medium text-muted transition-colors hover:border-primary/30 hover:text-primary sm:inline-flex"
            }
          >
            {membershipStatus.open ? "Join ISTS" : (
              <>
                <Lock size={12} /> {membershipStatus.label}
              </>
            )}
          </Link>

          <button
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground md:hidden cursor-pointer"
            onClick={() => {
              setOpen((o) => !o);
              play("click");
            }}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border bg-surface/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => play("navigate")}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted hover:bg-background-alt"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
