"use client";

import { useCallback, useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container, ISourceOptions } from "@tsparticles/engine";

export interface ChalkParticlesHandle {
  burst: () => void;
}

interface ChalkParticlesProps {
  particleCount: number;
}

export const ChalkParticles = forwardRef<ChalkParticlesHandle, ChalkParticlesProps>(
  function ChalkParticles({ particleCount }, ref) {
    const [initialized, setInitialized] = useState(false);
    const containerRef = useRef<Container | null>(null);

    useEffect(() => {
      initParticlesEngine(async (engine) => {
        await loadSlim(engine);
      }).then(() => {
        setInitialized(true);
      });
    }, []);

    const particlesLoaded = useCallback(async (loadedContainer?: Container) => {
      if (loadedContainer) {
        containerRef.current = loadedContainer;
      }
    }, []);

    useImperativeHandle(ref, () => ({
      burst: () => {
        const container = containerRef.current;
        if (!container) return;

        const emittersPlugin = container.plugins.get("emitters");
        if (
          emittersPlugin &&
          typeof (emittersPlugin as { play?: () => void }).play === "function"
        ) {
          (emittersPlugin as { play: () => void }).play();
        }
      },
    }));

    const chalkParticleOptions: ISourceOptions = {
      fullScreen: { enable: false },
      background: { color: "transparent" },
      fpsLimit: 60,
      particles: {
        number: { value: 0 },
        color: {
          value: ["#94a3b8", "#cbd5e1", "#e2e8f0", "#f1f5f9"],
        },
        shape: {
          type: ["square", "circle"],
        },
        opacity: {
          value: { min: 0.6, max: 1 },
          animation: {
            enable: true,
            speed: 1,
            sync: false,
            destroy: "min",
          },
        },
        size: {
          value: { min: 3, max: 8 },
          animation: {
            enable: true,
            speed: 4,
            sync: false,
            destroy: "min",
          },
        },
        move: {
          enable: true,
          speed: { min: 4, max: 12 },
          direction: "none",
          random: true,
          outModes: { default: "destroy" },
          gravity: {
            enable: true,
            acceleration: 6,
          },
        },
        rotate: {
          value: { min: 0, max: 360 },
          animation: {
            enable: true,
            speed: 20,
            sync: false,
          },
        },
        life: {
          duration: { value: 1 },
          count: 1,
        },
      },
      emitters: {
        position: { x: 50, y: 50 },
        rate: {
          quantity: particleCount,
          delay: 0,
        },
        size: {
          width: 20,
          height: 20,
        },
        life: {
          count: 1,
          duration: 0.1,
        },
        autoPlay: false,
      },
      detectRetina: true,
    };

    if (!initialized) {
      return null;
    }

    return (
      <Particles
        id="chalk-particles"
        className="absolute inset-0 pointer-events-none z-20"
        particlesLoaded={particlesLoaded}
        options={chalkParticleOptions}
      />
    );
  }
);
