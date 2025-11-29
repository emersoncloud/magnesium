"use client";

import { motion, AnimatePresence } from "framer-motion";
import { forwardRef, useImperativeHandle, useState, useCallback } from "react";

export interface ChalkDustHandle {
  burst: () => void;
}

interface ChalkDustProps {
  particleCount: number;
}

interface Particle {
  id: number;
  size: number;
  color: string;
  targetX: number;
  targetY: number;
  rotation: number;
  delay: number;
}

const DUST_COLORS = ["#94a3b8", "#cbd5e1", "#e2e8f0", "#f1f5f9", "#ffffff", "#d1d5db"];

export const ChalkDust = forwardRef<ChalkDustHandle, ChalkDustProps>(function ChalkDust(
  { particleCount },
  ref
) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [burstId, setBurstId] = useState(0);

  const createParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.random() - 0.5) * Math.PI * 1.2;
      const distance = 30 + Math.random() * 60;
      const upwardBias = -20 - Math.random() * 30;

      newParticles.push({
        id: i,
        size: 4 + Math.random() * 8,
        color: DUST_COLORS[Math.floor(Math.random() * DUST_COLORS.length)],
        targetX: Math.sin(angle) * distance,
        targetY: upwardBias + Math.cos(angle) * distance * 0.5,
        rotation: Math.random() * 720 - 360,
        delay: Math.random() * 0.05,
      });
    }
    return newParticles;
  }, [particleCount]);

  useImperativeHandle(ref, () => ({
    burst: () => {
      setBurstId((id) => id + 1);
      setParticles(createParticles());
      setTimeout(() => setParticles([]), 1000);
    },
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-visible">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={`${burstId}-${particle.id}`}
              className="absolute rounded-sm"
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                marginLeft: -particle.size / 2,
                marginTop: -particle.size / 2,
                boxShadow: `0 0 ${particle.size}px ${particle.color}`,
              }}
              initial={{
                x: 0,
                y: 0,
                scale: 0,
                opacity: 0,
                rotate: 0,
              }}
              animate={{
                x: particle.targetX,
                y: [0, particle.targetY - 10, particle.targetY + 40],
                scale: [0, 1.2, 0.8, 0],
                opacity: [0, 1, 0.8, 0],
                rotate: particle.rotation,
              }}
              transition={{
                duration: 0.8,
                delay: particle.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
                y: {
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                },
                scale: {
                  times: [0, 0.15, 0.5, 1],
                },
                opacity: {
                  times: [0, 0.1, 0.6, 1],
                },
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
});
