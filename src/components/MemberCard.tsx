"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useSound } from "@/components/SoundProvider";
import { roleDescriptions, type ExecMember } from "@/lib/data";

const avatarGradients = [
  "from-primary to-violet",
  "from-cyan to-primary",
  "from-violet to-cyan",
  "from-lime to-cyan",
];

const accents = [
  { glow: "bg-primary/30", badge: "bg-primary/10 text-primary" },
  { glow: "bg-cyan/30", badge: "bg-cyan/10 text-cyan" },
  { glow: "bg-violet/30", badge: "bg-violet/10 text-violet" },
  { glow: "bg-lime/30", badge: "bg-lime/10 text-lime" },
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function MemberCard({
  member,
  index = 0,
  compact = false,
}: {
  member: ExecMember;
  index?: number;
  compact?: boolean;
}) {
  const { play } = useSound();
  const accent = accents[index % accents.length];
  const avatarGradient = avatarGradients[index % avatarGradients.length];
  const description = member.bio ?? roleDescriptions[member.role];
  const panelHeight = compact ? 128 : 172;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.06, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={{ y: -6 }}
      onMouseEnter={() => play("hover")}
      className="card-surface group relative flex h-full flex-col overflow-hidden text-center shadow-sm transition-shadow duration-300 hover:shadow-xl"
    >
      <div className="relative overflow-hidden bg-background-alt" style={{ height: panelHeight }}>
        <div className="bg-dot-grid absolute inset-0 opacity-70" />
        <div
          aria-hidden
          className={`animate-blob absolute -right-10 -top-10 h-32 w-32 rounded-full ${accent.glow} blur-3xl`}
        />
        <span aria-hidden className="absolute left-3 top-3 h-2.5 w-2.5 border-l border-t border-border" />
        <span aria-hidden className="absolute right-3 top-3 h-2.5 w-2.5 border-r border-t border-border" />

        {member.image ? (
          <div className="absolute inset-0">
            <Image
              src={member.image}
              alt={member.name}
              fill
              sizes="(max-width: 640px) 140px, 220px"
              className="object-contain object-bottom drop-shadow-[0_14px_18px_rgba(15,23,42,0.28)] transition-transform duration-300 group-hover:scale-[1.03] group-hover:-translate-y-1"
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${avatarGradient} font-display text-lg font-bold text-white shadow-md`}
            >
              {initials(member.name)}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col items-center gap-2 px-5 pb-6 pt-4">
        <h3 className="font-display text-base font-semibold text-foreground">{member.name}</h3>
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide ${accent.badge}`}
        >
          {member.role}
        </span>
        {!compact && description && (
          <p className="mt-1 line-clamp-4 text-xs leading-relaxed text-muted">{description}</p>
        )}
      </div>
    </motion.div>
  );
}
