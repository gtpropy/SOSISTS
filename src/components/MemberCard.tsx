"use client";

import { motion } from "framer-motion";
import { useSound } from "@/components/SoundProvider";
import { roleDescriptions, type ExecMember } from "@/lib/data";

const gradients = [
  "from-primary to-violet",
  "from-cyan to-primary",
  "from-violet to-cyan",
  "from-lime to-cyan",
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
  const gradient = gradients[index % gradients.length];
  const description = roleDescriptions[member.role];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.06, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={{ y: -5 }}
      onMouseEnter={() => play("hover")}
      className="card-surface group flex h-full flex-col items-center gap-3 p-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-lg"
    >
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} font-display text-lg font-bold text-white shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3`}
      >
        {initials(member.name)}
      </div>
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">{member.name}</h3>
        <span className="mt-1 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-primary">
          {member.role}
        </span>
      </div>
      {!compact && description && (
        <p className="mt-1 text-xs leading-relaxed text-muted">{description}</p>
      )}
    </motion.div>
  );
}
