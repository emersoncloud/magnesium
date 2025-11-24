"use client";

import { cn } from "@/lib/utils";

interface ChalkHandProps {
  side: "left" | "right";
  scale?: number;
  className?: string;
}

export function ChalkHand({ side, scale = 1, className }: ChalkHandProps) {
  const isLeft = side === "left";
  const transformStyle = isLeft ? "scaleX(-1)" : undefined;

  return (
    <svg
      viewBox="0 0 80 100"
      width={80 * scale}
      height={100 * scale}
      className={cn("chalk-hand", className)}
      style={{ transform: transformStyle }}
    >
      {/* Main palm - angular trapezoid shape */}
      <polygon
        points="15,35 65,30 70,75 10,80"
        className="fill-slate-900"
      />

      {/* Index finger - angular shard */}
      <polygon
        points="18,35 28,33 32,8 16,10"
        className="fill-slate-900"
      />

      {/* Middle finger - tallest shard */}
      <polygon
        points="30,32 42,30 46,2 28,4"
        className="fill-slate-900"
      />

      {/* Ring finger - angular shard */}
      <polygon
        points="44,30 56,32 62,10 48,6"
        className="fill-slate-900"
      />

      {/* Pinky finger - smaller angular shard */}
      <polygon
        points="58,34 68,38 76,18 64,12"
        className="fill-slate-900"
      />

      {/* Thumb - angled outward */}
      <polygon
        points="10,45 18,55 6,72 0,58"
        className="fill-slate-900"
      />

      {/* Chalk dust texture overlay - small angular shapes */}
      <g className="chalk-dust-static opacity-70">
        <polygon points="25,45 30,42 28,50" fill="white" />
        <polygon points="45,40 50,37 48,45" fill="white" />
        <polygon points="35,60 42,57 38,65" fill="white" />
        <polygon points="22,65 27,62 25,70" fill="white" />
        <polygon points="52,55 57,52 55,60" fill="white" />
        <polygon points="38,48 42,46 40,52" fill="white" />
        <polygon points="28,70 33,68 30,74" fill="white" />
      </g>

      {/* Highlight edge for depth */}
      <line
        x1="15"
        y1="35"
        x2="65"
        y2="30"
        stroke="white"
        strokeWidth="1.5"
        opacity="0.25"
      />

      {/* Finger tip highlights */}
      <line x1="16" y1="10" x2="32" y2="8" stroke="white" strokeWidth="1" opacity="0.2" />
      <line x1="28" y1="4" x2="46" y2="2" stroke="white" strokeWidth="1" opacity="0.2" />
      <line x1="48" y1="6" x2="62" y2="10" stroke="white" strokeWidth="1" opacity="0.2" />
    </svg>
  );
}
