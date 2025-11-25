"use client";

import { BrowserRoute } from "@/app/actions";
import { Star, MessageSquare, Zap, CheckCircle2 } from "lucide-react";
import { cn, getRouteColor } from "@/lib/utils";
import { motion } from "framer-motion";
import { GradeDisplay } from "@/components/GradeDisplay";

class SeededRNG {
  private seed: number;

  constructor(seedString: string) {
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
      hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
      hash |= 0;
    }
    this.seed = Math.abs(hash);
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  range(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }
}

function generateOrganicStyles(routeId: string, wallId: string, grade: string) {
  const seedKey = `${wallId}-${routeId}-${grade}`;
  const rng = new SeededRNG(seedKey);

  const r = () => Math.floor(rng.range(40, 60));
  const borderRadius = `${r()}% ${r()}% ${r()}% ${r()}% / ${r()}% ${r()}% ${r()}% ${r()}%`;

  const rotate = rng.range(-6, 6);
  const scale = rng.range(0.95, 1.05);
  const x = rng.range(-5, 5);
  const y = rng.range(-5, 5);

  return { borderRadius, rotate, scale, x, y };
}

interface RouteHoldProps {
  route: BrowserRoute;
  isSelected?: boolean;
  showStats?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function RouteHold({
  route,
  isSelected = false,
  showStats = true,
  size = "md",
  className,
  onClick,
  children,
}: RouteHoldProps) {
  const styles = generateOrganicStyles(route.id, route.wall_id, route.grade);
  const selectedScaleMultiplier = isSelected ? 1.15 : 1;
  const computedScale = styles.scale * selectedScaleMultiplier;

  const sizeClasses = {
    sm: "w-16 h-16 md:w-20 md:h-20",
    md: "w-24 h-24 md:w-32 md:h-32",
    lg: "w-24 h-24 md:w-32 md:h-32 lg:w-44 lg:h-44",
  };

  const gradeSizeClasses = {
    sm: "text-sm md:text-base",
    md: "text-lg md:text-xl",
    lg: "text-xl md:text-3xl",
  };

  const Component = onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={cn(
        "relative group flex-shrink-0 transition-[z-index] duration-300",
        sizeClasses[size],
        isSelected ? "z-20" : "z-0 hover:z-10",
        onClick && "cursor-pointer",
        className
      )}
      style={{
        transform: `translate(${styles.x}px, ${styles.y}px)`
      }}
    >
      <motion.div
        layoutId={`route-hold-${route.id}`}
        className={cn(
          "w-full h-full shadow-lg transition-all duration-300 ease-out relative",
          isSelected
            ? "shadow-2xl ring-4 ring-white/50"
            : "group-hover:scale-110 group-hover:shadow-2xl group-hover:rotate-0"
        )}
        style={{
          backgroundColor: getRouteColor(route.color),
          borderRadius: styles.borderRadius,
          transform: `rotate(${isSelected ? 0 : styles.rotate}deg) scale(${computedScale})`
        }}
      >
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] mix-blend-multiply pointer-events-none rounded-[inherit]" />

        <div className="absolute inset-0 rounded-[inherit] ring-1 ring-black/5 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.1)] pointer-events-none" />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
          <motion.div
            layoutId={`route-grade-hold-${route.id}`}
            className="relative z-10 bg-white/40 backdrop-blur-[2px] rounded-xl p-1.5 min-w-[40px] flex flex-col items-center justify-center shadow-sm"
          >
            <GradeDisplay
              grade={route.grade}
              difficulty={route.difficulty_label}
              variant="badge"
              className={gradeSizeClasses[size]}
            />
          </motion.div>

          {route.user_status && (
            <div className="absolute top-1 right-1">
              <div className={cn(
                "w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center shadow-sm ring-2 ring-white/50",
                route.user_status === "FLASH" ? "bg-yellow-400 text-black" : "bg-green-500 text-white"
              )}>
                {route.user_status === "FLASH" ? <Zap className="w-2 h-2 md:w-2.5 md:h-2.5 fill-current" /> : <CheckCircle2 className="w-2 h-2 md:w-2.5 md:h-2.5" />}
              </div>
            </div>
          )}

          {showStats && (route.avg_rating > 0 || route.comment_count > 0) && (
            <div className="absolute bottom-1 md:bottom-2 left-0 right-0 flex items-center justify-center gap-1 px-1">
              {route.avg_rating > 0 && (
                <div className="flex items-center gap-0.5 text-black/70 bg-white/30 backdrop-blur-[2px] px-1 py-0.5 rounded-full shadow-sm">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  <span className="text-[8px] md:text-[10px] font-bold">{route.avg_rating.toFixed(1)}</span>
                </div>
              )}

              {route.comment_count > 0 && (
                <div className="flex items-center gap-0.5 text-black/70 bg-white/30 backdrop-blur-[2px] px-1 py-0.5 rounded-full shadow-sm">
                  <MessageSquare className="w-2.5 h-2.5" />
                  <span className="text-[8px] md:text-[10px] font-bold">{route.comment_count}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {children}
      </motion.div>
    </Component>
  );
}
