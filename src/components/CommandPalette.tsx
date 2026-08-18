"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Terminal, Search, Compass, ArrowRight, CornerDownLeft } from "lucide-react";
import { searchContent, searchIndex, type SearchResult } from "@/lib/searchIndex";
import { useJourneyMode } from "@/components/JourneyModeProvider";
import { useSound } from "@/components/SoundProvider";

const DEFAULT_PAGES = searchIndex.filter((r) => r.category === "Page");

type Entry =
  | { kind: "journey"; id: "journey-mode" }
  | { kind: "result"; id: string; result: SearchResult };

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const journeyMode = useJourneyMode();
  const { play } = useSound();

  const entries: Entry[] = useMemo(() => {
    if (query.trim()) {
      return searchContent(query).map((result) => ({ kind: "result" as const, id: result.id, result }));
    }
    return [
      { kind: "journey" as const, id: "journey-mode" as const },
      ...DEFAULT_PAGES.map((result) => ({ kind: "result" as const, id: result.id, result })),
    ];
  }, [query]);

  const [lastQuery, setLastQuery] = useState(query);
  const [lastOpen, setLastOpen] = useState(open);
  if (query !== lastQuery || open !== lastOpen) {
    setLastQuery(query);
    setLastOpen(open);
    setActiveIndex(0);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open && e.key === "/" && !isEditableTarget(e.target) && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setOpen(true);
        setQuery("");
        play("open");
      } else if (open && e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 30);
      document.body.style.overflow = "hidden";
      return () => {
        window.clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  const close = () => setOpen(false);

  const activate = (entry: Entry) => {
    if (entry.kind === "journey") {
      close();
      journeyMode.start();
      play("success");
      return;
    }
    const { result } = entry;
    play("click");
    if (result.sectionId && pathname === result.href) {
      close();
      document.getElementById(result.sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    close();
    router.push(result.sectionId ? `${result.href}#${result.sectionId}` : result.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % Math.max(entries.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + entries.length) % Math.max(entries.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const entry = entries[activeIndex];
      if (entry) activate(entry);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[300] flex items-start justify-center bg-foreground/40 px-5 pt-[12vh] backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="glow-primary card-surface w-full max-w-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-1.5 border-b border-border bg-background-alt px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 flex items-center gap-1.5 font-mono text-[11px] text-muted-soft">
                <Terminal size={12} /> ists.sh — command palette
              </span>
            </div>

            <div className="flex items-center gap-2.5 border-b border-border px-4 py-3.5">
              <Search size={16} className="shrink-0 text-primary" />
              <span className="font-mono text-sm text-muted-soft">$</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="search_ or jump to a section..."
                className="w-full bg-transparent font-mono text-sm text-foreground placeholder:text-muted-soft focus:outline-none"
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-2">
              {!query.trim() && (
                <div className="px-2.5 pb-1.5 pt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-soft">
                  Jump to section
                </div>
              )}
              {query.trim() && entries.length === 0 && (
                <div className="px-3 py-8 text-center font-mono text-sm text-muted-soft">
                  No results for &quot;{query}&quot;
                </div>
              )}
              {entries.map((entry, i) => {
                const active = i === activeIndex;
                if (entry.kind === "journey") {
                  return (
                    <button
                      key={entry.id}
                      onClick={() => activate(entry)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`mb-1 flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors cursor-pointer ${
                        active
                          ? "border-primary/30 bg-primary/10"
                          : "border-transparent hover:bg-background-alt"
                      }`}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-violet to-cyan text-white">
                        <Compass size={15} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-foreground">Journey Mode</span>
                        <span className="block truncate text-xs text-muted">
                          Sit back — let the site show you around
                        </span>
                      </span>
                      {active && <ArrowRight size={14} className="shrink-0 text-primary" />}
                    </button>
                  );
                }
                const { result } = entry;
                return (
                  <button
                    key={entry.id}
                    onClick={() => activate(entry)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`mb-1 flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors cursor-pointer ${
                      active ? "border-primary/30 bg-primary/10" : "border-transparent hover:bg-background-alt"
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-foreground">{result.title}</span>
                        <span className="shrink-0 rounded-full border border-border bg-background-alt px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-muted-soft">
                          {result.category}
                        </span>
                      </span>
                      {result.subtitle && (
                        <span className="block truncate text-xs text-muted">{result.subtitle}</span>
                      )}
                    </span>
                    {active && <ArrowRight size={14} className="shrink-0 text-primary" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4 border-t border-border bg-background-alt px-4 py-2.5 font-mono text-[10px] text-muted-soft">
              <span className="flex items-center gap-1">
                <span className="rounded border border-border bg-surface px-1.5 py-0.5">↑↓</span> navigate
              </span>
              <span className="flex items-center gap-1">
                <span className="rounded border border-border bg-surface px-1.5 py-0.5">
                  <CornerDownLeft size={9} />
                </span>
                select
              </span>
              <span className="flex items-center gap-1">
                <span className="rounded border border-border bg-surface px-1.5 py-0.5">esc</span> close
              </span>
              <span className="ml-auto flex items-center gap-1">
                <span className="rounded border border-border bg-surface px-1.5 py-0.5">/</span> open anytime
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
