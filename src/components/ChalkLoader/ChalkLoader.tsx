"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChalkBlock } from "./ChalkBlock";
import { ChalkDust, type ChalkDustHandle } from "./ChalkDust";

type ChalkLoaderSize = "sm" | "md" | "lg";

interface ChalkLoaderProps {
  size?: ChalkLoaderSize;
  className?: string;
  showText?: boolean;
  textContent?: string;
}

const SIZE_CONFIG = {
  sm: {
    containerWidth: 100,
    containerHeight: 80,
    blockScale: 0.5,
    particleCount: 12,
    textSize: "text-[8px]",
    blockSpread: 28,
    showText: false,
  },
  md: {
    containerWidth: 160,
    containerHeight: 120,
    blockScale: 0.75,
    particleCount: 20,
    textSize: "text-xs",
    blockSpread: 40,
    showText: true,
  },
  lg: {
    containerWidth: 220,
    containerHeight: 160,
    blockScale: 1,
    particleCount: 30,
    textSize: "text-sm",
    blockSpread: 55,
    showText: true,
  },
} as const;

type AnimationPhase = "ready" | "windup" | "swing" | "impact" | "recoil" | "reset";

export function ChalkLoader({
  size = "lg",
  className,
  showText,
  textContent = "Loading...",
}: ChalkLoaderProps) {
  const config = SIZE_CONFIG[size];
  const [phase, setPhase] = useState<AnimationPhase>("ready");
  const dustRef = useRef<ChalkDustHandle>(null);
  const shouldShowText = showText ?? config.showText;

  useEffect(() => {
    let mounted = true;

    const runSequence = async () => {
      while (mounted) {
        setPhase("ready");
        await sleep(300);
        if (!mounted) break;

        setPhase("windup");
        await sleep(250);
        if (!mounted) break;

        setPhase("swing");
        await sleep(180);
        if (!mounted) break;

        setPhase("impact");
        dustRef.current?.burst();
        await sleep(80);
        if (!mounted) break;

        setPhase("recoil");
        await sleep(250);
        if (!mounted) break;

        setPhase("reset");
        await sleep(400);
      }
    };

    runSequence();
    return () => {
      mounted = false;
    };
  }, []);

  const spread = config.blockSpread;

  const leftVariants = {
    ready: { x: -spread, y: 0, rotate: -15, scale: 1 },
    windup: { x: -spread - 10, y: -5, rotate: -25, scale: 1.02 },
    swing: { x: -8, y: 0, rotate: 5, scale: 1 },
    impact: { x: -2, y: 0, rotate: 8, scale: 1.15 },
    recoil: { x: -20, y: 5, rotate: -10, scale: 1.05 },
    reset: { x: -spread, y: 0, rotate: -15, scale: 1 },
  };

  const rightVariants = {
    ready: { x: spread, y: 0, rotate: 15, scale: 1 },
    windup: { x: spread + 10, y: -5, rotate: 25, scale: 1.02 },
    swing: { x: 8, y: 0, rotate: -5, scale: 1 },
    impact: { x: 2, y: 0, rotate: -8, scale: 1.15 },
    recoil: { x: 20, y: 5, rotate: 10, scale: 1.05 },
    reset: { x: spread, y: 0, rotate: 15, scale: 1 },
  };

  const getTransition = () => {
    switch (phase) {
      case "ready":
        return { duration: 0.3, ease: "easeOut" as const };
      case "windup":
        return { duration: 0.25, ease: [0.36, 0, 0.66, -0.56] as const };
      case "swing":
        return { duration: 0.15, ease: [0.22, 1, 0.36, 1] as const };
      case "impact":
        return { duration: 0.06, ease: "easeOut" as const };
      case "recoil":
        return { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] as const };
      case "reset":
        return { duration: 0.35, ease: [0.45, 0, 0.55, 1] as const };
    }
  };

  return (
    <div
      className={cn("relative flex flex-col items-center justify-center", className)}
      style={{
        width: config.containerWidth,
        height: config.containerHeight + (shouldShowText ? 32 : 0),
      }}
    >
      <div
        className="relative overflow-visible"
        style={{
          width: config.containerWidth,
          height: config.containerHeight,
        }}
      >
        <ChalkDust ref={dustRef} particleCount={config.particleCount} />

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={leftVariants[phase]}
            transition={getTransition()}
            style={{ willChange: "transform" }}
          >
            <ChalkBlock scale={config.blockScale} />
          </motion.div>
          <motion.div
            animate={rightVariants[phase]}
            transition={getTransition()}
            style={{ willChange: "transform" }}
          >
            <ChalkBlock scale={config.blockScale} />
          </motion.div>
        </div>
      </div>

      {shouldShowText && (
        <motion.p
          className={cn(
            "text-slate-400 font-mono uppercase tracking-widest transform -skew-x-12",
            config.textSize
          )}
          animate={{
            opacity: phase === "impact" ? 1 : 0.6,
          }}
          transition={{ duration: 0.1 }}
        >
          <span className="skew-x-12 inline-block">{textContent}</span>
        </motion.p>
      )}
    </div>
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
