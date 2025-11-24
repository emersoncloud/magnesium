"use client";

import { BrowserRoute } from "@/app/actions";
import Link from "next/link";
import { Star, MessageSquare, Zap, CheckCircle2 } from "lucide-react";
import { cn, getRouteColor } from "@/lib/utils";
import { motion } from "framer-motion";
import { GradeDisplay } from "@/components/GradeDisplay";
import { usePathname } from "next/navigation";

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

export default function WallRouteList({ routes }: { routes: BrowserRoute[] }) {
  const pathname = usePathname();
  const pathnameMatchesRoutePattern = pathname.startsWith("/route/");
  const selectedRouteId = pathnameMatchesRoutePattern ? pathname.split("/route/")[1] : null;

  return (
    <motion.div
      className="flex-1 overflow-y-auto p-4 pb-32"
      layoutScroll
    >
      {routes.length === 0 ? (
        <div className="h-[50vh] w-full flex items-center justify-center">
          <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <p className="text-slate-400 font-black uppercase tracking-widest mb-2">No Routes</p>
            <p className="text-xs text-slate-400 font-mono">Awaiting Setter Action</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12 max-w-7xl mx-auto">
          {routes.map((route) => {
            const styles = generateOrganicStyles(route.id, route.wall_id, route.grade);
            const routeIsSelected = selectedRouteId === route.id;
            const selectedScaleMultiplier = routeIsSelected ? 1.15 : 1;
            const computedScale = styles.scale * selectedScaleMultiplier;

            return (
              <Link
                key={route.id}
                href={`/route/${route.id}`}
                className={cn(
                  "relative group w-24 h-24 md:w-32 md:h-32 lg:w-44 lg:h-44 flex-shrink-0 transition-[z-index] duration-300",
                  routeIsSelected ? "z-20" : "z-0 hover:z-10"
                )}
                style={{
                  transform: `translate(${styles.x}px, ${styles.y}px)`
                }}
              >
                <motion.div
                  layoutId={`route-card-${route.id}`}
                  className={cn(
                    "w-full h-full shadow-lg transition-all duration-300 ease-out",
                    routeIsSelected
                      ? "shadow-2xl ring-4 ring-white/50"
                      : "group-hover:scale-110 group-hover:shadow-2xl group-hover:rotate-0"
                  )}
                  style={{
                    backgroundColor: getRouteColor(route.color),
                    borderRadius: styles.borderRadius,
                    transform: `rotate(${routeIsSelected ? 0 : styles.rotate}deg) scale(${computedScale})`
                  }}
                >
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] mix-blend-multiply pointer-events-none rounded-[inherit]" />

                  <div className="absolute inset-0 rounded-[inherit] ring-1 ring-black/5 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.1)] pointer-events-none" />

                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">

                    <motion.div
                      layoutId={`route-grade-${route.id}`}
                      className="relative z-10 bg-white/40 backdrop-blur-[2px] rounded-xl p-2 min-w-[60px] flex flex-col items-center justify-center shadow-sm"
                    >
                      <GradeDisplay
                        grade={route.grade}
                        difficulty={route.difficulty_label}
                        variant="badge"
                        className="text-xl md:text-3xl"
                      />
                    </motion.div>

                    {route.user_status && (
                      <div className="absolute top-1 right-1 md:top-3 md:right-3">
                        <div className={cn(
                          "w-5 h-5 md:w-7 md:h-7 rounded-full flex items-center justify-center shadow-sm ring-2 ring-white/50",
                          route.user_status === "FLASH" ? "bg-yellow-400 text-black" : "bg-green-500 text-white"
                        )}>
                          {route.user_status === "FLASH" ? <Zap className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 fill-current" /> : <CheckCircle2 className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />}
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-2 md:bottom-4 left-0 right-0 flex items-center justify-center gap-1 md:gap-2 px-2">
                      {route.avg_rating > 0 && (
                        <div className="flex items-center gap-1 text-black/70 bg-white/30 backdrop-blur-[2px] px-1.5 py-0.5 rounded-full shadow-sm">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-[10px] md:text-xs font-bold">{route.avg_rating.toFixed(1)}</span>
                        </div>
                      )}

                      {route.comment_count > 0 && (
                        <div className="flex items-center gap-1 text-black/70 bg-white/30 backdrop-blur-[2px] px-1.5 py-0.5 rounded-full shadow-sm">
                          <MessageSquare className="w-3 h-3" />
                          <span className="text-[10px] md:text-xs font-bold">{route.comment_count}</span>
                        </div>
                      )}
                    </div>

                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
