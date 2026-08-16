"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import type { Pose } from "@/lib/introScript";

const ARM_PATH =
  "M -8,0 C -10,0 -11,5 -11,10 L -10,68 C -10,79 -5,88 0,90 C 5,88 10,79 10,68 L 11,10 C 11,5 10,0 8,0 Z";

const STANDING_LEG_PATH =
  "M -10,0 C -12,0 -13,6 -13,11 L -11,128 C -11,140 -5,148 0,150 C 5,148 11,140 11,128 L 13,11 C 13,6 12,0 10,0 Z";

const CROUCH_BASE_PATH =
  "M -26,0 C -30,0 -32,4 -31,10 L -28,32 C -27,39 -21,43 -13,44 L -11,47 C -10,51 -6,53 0,53 C 6,53 10,51 11,47 L 13,44 C 21,43 27,39 28,32 L 31,10 C 32,4 30,0 26,0 C 16,-6 -16,-6 -26,0 Z";

const TORSO_PATH =
  "M 100,54 C 118,54 130,60 128,72 C 126,88 124,96 119,109 C 115,121 121,131 122,143 C 122,153 112,160 100,160 C 88,160 78,153 78,143 C 79,131 85,121 81,109 C 76,96 74,88 72,72 C 70,60 82,54 100,54 Z";

interface PoseConfig {
  upperBodyY: number;
  upperBodyRotate: number;
  legs: "stand" | "crouch";
  leftArmAngle: number;
  rightArmAngle: number;
  hammer: boolean;
}

const POSES: Record<Pose, PoseConfig> = {
  kneel: { upperBodyY: 60, upperBodyRotate: 12, legs: "crouch", leftArmAngle: -75, rightArmAngle: -95, hammer: false },
  forge: { upperBodyY: 0, upperBodyRotate: -4, legs: "stand", leftArmAngle: -25, rightArmAngle: -135, hammer: true },
  stand: { upperBodyY: 0, upperBodyRotate: 0, legs: "stand", leftArmAngle: 8, rightArmAngle: -8, hammer: false },
  reach: { upperBodyY: 0, upperBodyRotate: 0, legs: "stand", leftArmAngle: 10, rightArmAngle: -172, hammer: false },
};

const spring = { type: "spring" as const, stiffness: 120, damping: 16 };

function Limb({
  x,
  y,
  angle,
  path,
  transition = spring,
}: {
  x: number;
  y: number;
  angle: number | number[];
  path: string;
  transition?: object;
}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <motion.g animate={{ rotate: angle }} transition={transition} style={{ originX: 0.5, originY: 0 }}>
        <path d={path} />
      </motion.g>
    </g>
  );
}

export function HumanFigure({
  pose,
  className,
  style,
}: {
  pose: Pose;
  className?: string;
  style?: CSSProperties;
}) {
  const cfg = POSES[pose];

  return (
    <svg
      viewBox="0 0 200 320"
      className={className}
      style={{ ...style, overflow: "visible" }}
      fill="currentColor"
      aria-hidden
    >
      <g transform="translate(100, 190)">
        <motion.g animate={{ opacity: cfg.legs === "crouch" ? 1 : 0 }} transition={{ duration: 0.4 }}>
          <path d={CROUCH_BASE_PATH} />
        </motion.g>
      </g>

      <motion.g animate={{ opacity: cfg.legs === "stand" ? 1 : 0 }} transition={{ duration: 0.4 }}>
        <Limb x={83} y={152} angle={cfg.legs === "stand" ? -7 : 0} path={STANDING_LEG_PATH} />
        <Limb x={117} y={152} angle={cfg.legs === "stand" ? 7 : 0} path={STANDING_LEG_PATH} />
      </motion.g>

      <motion.g
        animate={{ y: cfg.upperBodyY, rotate: cfg.upperBodyRotate }}
        transition={spring}
        style={{ transformOrigin: "100px 150px" }}
      >
        <path d={TORSO_PATH} />
        <ellipse cx="100" cy="36" rx="15" ry="17" />

        <Limb x={78} y={68} angle={cfg.leftArmAngle} path={ARM_PATH} />
        <Limb
          x={122}
          y={68}
          angle={cfg.hammer ? [cfg.rightArmAngle, cfg.rightArmAngle + 55, cfg.rightArmAngle] : cfg.rightArmAngle}
          path={ARM_PATH}
          transition={cfg.hammer ? { duration: 0.7, repeat: Infinity, ease: "easeInOut" } : spring}
        />
      </motion.g>
    </svg>
  );
}
