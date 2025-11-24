"use client";

import { cn } from "@/lib/utils";

interface ChalkBlockProps {
  scale?: number;
  className?: string;
}

export function ChalkBlock({ scale = 1, className }: ChalkBlockProps) {
  const size = 40 * scale;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={cn("chalk-block", className)}
    >
      {/* Main chalk block - simple rounded square */}
      <rect
        x="2"
        y="2"
        width="36"
        height="36"
        rx="4"
        className="fill-slate-800"
      />

      {/* Inner border for depth */}
      <rect
        x="4"
        y="4"
        width="32"
        height="32"
        rx="3"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        opacity="0.15"
      />

      {/* Chalk dust marks on the block */}
      <rect x="8" y="10" width="6" height="4" rx="1" fill="white" opacity="0.6" />
      <rect x="20" y="8" width="8" height="3" rx="1" fill="white" opacity="0.5" />
      <rect x="12" y="20" width="5" height="5" rx="1" fill="white" opacity="0.4" />
      <rect x="26" y="18" width="6" height="4" rx="1" fill="white" opacity="0.55" />
      <rect x="10" y="28" width="7" height="3" rx="1" fill="white" opacity="0.45" />
      <rect x="22" y="26" width="5" height="5" rx="1" fill="white" opacity="0.5" />
    </svg>
  );
}
