"use client";

import { useState } from "react";
import { BrowserRoute, UpcomingRouteData } from "@/app/actions";
import WallRouteList from "@/components/WallRouteList";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { cn, getRouteColor } from "@/lib/utils";
import { GradeDisplay } from "@/components/GradeDisplay";
import { useBrowserRoutes } from "@/hooks/useRoutes";

class SeededRNG {
  private seed: number;

  constructor(seedString: string) {
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
      hash = (hash << 5) - hash + seedString.charCodeAt(i);
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
  const seedKey = `upcoming-${wallId}-${routeId}-${grade}`;
  const rng = new SeededRNG(seedKey);

  const r = () => Math.floor(rng.range(40, 60));
  const borderRadius = `${r()}% ${r()}% ${r()}% ${r()}% / ${r()}% ${r()}% ${r()}% ${r()}%`;

  const rotate = rng.range(-6, 6);
  const scale = rng.range(0.95, 1.05);
  const x = rng.range(-5, 5);
  const y = rng.range(-5, 5);

  return { borderRadius, rotate, scale, x, y };
}

interface WallPageContentProps {
  wallId: string;
  initialBrowserRoutes: BrowserRoute[];
  upcomingRoutes: UpcomingRouteData[];
}

export default function WallPageContent({
  wallId,
  initialBrowserRoutes,
  upcomingRoutes,
}: WallPageContentProps) {
  // Use cached routes - filters by wallId from the full cached dataset
  const { data: allRoutes = initialBrowserRoutes } = useBrowserRoutes(initialBrowserRoutes);
  const wallRoutes = allRoutes.filter((r) => r.wall_id === wallId);

  const [showUpcoming, setShowUpcoming] = useState(false);
  const hasUpcomingRoutes = upcomingRoutes.length > 0;

  return (
    <div className="flex-1 flex flex-col">
      {hasUpcomingRoutes && (
        <div className="px-4 py-3 border-b border-slate-200 bg-amber-50/50">
          <button
            onClick={() => setShowUpcoming(!showUpcoming)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all",
              showUpcoming
                ? "bg-amber-500 text-white shadow-md"
                : "bg-white text-amber-600 border border-amber-300 hover:bg-amber-100"
            )}
          >
            {showUpcoming ? <EyeOff className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            <span>
              {showUpcoming
                ? "Hide Upcoming Routes"
                : `Preview ${upcomingRoutes.length} Upcoming Routes`}
            </span>
          </button>
        </div>
      )}

      {showUpcoming && hasUpcomingRoutes && (
        <div className="border-b-2 border-dashed border-amber-300 bg-gradient-to-b from-amber-50 to-white">
          <div className="px-4 py-3 flex items-center gap-2 text-amber-700">
            <Sparkles className="w-5 h-5" />
            <span className="font-bold uppercase tracking-widest text-sm">Coming Soon</span>
            <span className="text-xs font-mono text-amber-500">{upcomingRoutes.length} routes</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 pb-8">
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12 max-w-7xl mx-auto">
              {upcomingRoutes.map((route, index) => {
                const styles = generateOrganicStyles(route.id, wallId, route.grade);

                return (
                  <div
                    key={route.id}
                    className="relative group w-[6.5rem] h-[6.5rem] md:w-36 md:h-36 lg:w-44 lg:h-44 shrink-0 opacity-75"
                    style={{
                      transform: `translate(${styles.x}px, ${styles.y}px)`,
                    }}
                  >
                    <div
                      className="w-full h-full shadow-lg transition-all duration-300 ease-out border-2 border-dashed border-amber-400"
                      style={{
                        backgroundColor: getRouteColor(route.color),
                        borderRadius: styles.borderRadius,
                        transform: `rotate(${styles.rotate}deg) scale(${styles.scale})`,
                      }}
                    >
                      <div className="absolute inset-0 opacity-20 bg-[url('/concrete-wall.png')] mix-blend-multiply pointer-events-none rounded-[inherit]" />

                      <div className="absolute inset-0 rounded-[inherit] ring-1 ring-black/5 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.1)] pointer-events-none" />

                      <div className="absolute inset-0 flex flex-col items-center justify-center p-2 md:p-3 lg:p-4 text-center">
                        <div className="relative z-10 bg-white/40 backdrop-blur-[2px] rounded-lg md:rounded-xl p-1 md:p-1.5 lg:p-2 min-w-[40px] md:min-w-[50px] lg:min-w-[60px] flex flex-col items-center justify-center shadow-sm">
                          <GradeDisplay
                            grade={route.grade}
                            difficulty={route.difficulty_label}
                            variant="badge"
                            className="text-base md:text-xl lg:text-3xl"
                          />
                        </div>

                        <div className="absolute top-1 right-1 md:top-3 md:right-3">
                          <div className="w-5 h-5 md:w-7 md:h-7 rounded-full flex items-center justify-center shadow-sm ring-2 ring-white/50 bg-amber-400 text-white">
                            <Sparkles className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
                          </div>
                        </div>

                        {route.setter_comment && (
                          <div className="absolute bottom-1 md:bottom-2 lg:bottom-4 left-0 right-0 px-1">
                            <div className="text-[6px] md:text-[8px] lg:text-[10px] font-mono text-black/60 bg-white/50 backdrop-blur-[2px] px-1 py-0.5 rounded truncate">
                              {route.setter_comment}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <WallRouteList routes={wallRoutes} />
    </div>
  );
}
