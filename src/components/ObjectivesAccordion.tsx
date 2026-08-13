"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Lightbulb,
  Cpu,
  Trophy,
  Users,
  Microscope,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { useSound } from "@/components/SoundProvider";
import type { ObjectiveGroup } from "@/lib/data";

const iconMap: Record<string, LucideIcon> = {
  academic: GraduationCap,
  innovation: Lightbulb,
  technology: Cpu,
  competition: Trophy,
  leadership: Users,
  research: Microscope,
};

export function ObjectivesAccordion({ groups }: { groups: ObjectiveGroup[] }) {
  const [openId, setOpenId] = useState<string>(groups[0]?.id ?? "");
  const { play } = useSound();

  return (
    <div className="flex flex-col gap-3">
      {groups.map((group) => {
        const Icon = iconMap[group.id] ?? Lightbulb;
        const open = openId === group.id;
        return (
          <div key={group.id} className="card-surface overflow-hidden shadow-sm">
            <button
              onClick={() => {
                setOpenId(open ? "" : group.id);
                play("click");
              }}
              onMouseEnter={() => play("hover")}
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
            >
              <div className="flex items-center gap-4">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    open ? "bg-primary text-white" : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon size={18} strokeWidth={2.2} />
                </span>
                <div>
                  <p className="font-mono text-[11px] text-muted-soft">{group.number}</p>
                  <h3 className="font-display text-base font-semibold text-foreground sm:text-lg">
                    {group.title}
                  </h3>
                </div>
              </div>
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="shrink-0 text-muted-soft"
              >
                <ChevronDown size={18} />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-border px-5 pb-6 pt-4 sm:px-6">
                    <p className="text-sm leading-relaxed text-muted">{group.intro}</p>
                    <ul className="mt-4 space-y-2.5">
                      {group.items.map((item) => (
                        <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
