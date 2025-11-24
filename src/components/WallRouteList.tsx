"use client";

import { BrowserRoute } from "@/app/actions";
import Link from "next/link";
import { Star, MessageSquare, Zap, CheckCircle2 } from "lucide-react";
import { cn, getRouteColor } from "@/lib/utils";
import { motion } from "framer-motion";
import { GradeDisplay } from "@/components/GradeDisplay";

/**
 * A simple Linear Congruential Generator for deterministic randomness.
 * We use this so the layout looks random but stays the same 
 * everytime you visit the page (no hydration errors).
 */
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

  /** Returns a float between 0 and 1 */
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  /** Returns number between min and max */
  range(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }
}

function generateOrganicStyles(routeId: string, wallId: string, grade: string) {
  const seedKey = `${wallId}-${routeId}-${grade}`;
  const rng = new SeededRNG(seedKey);

  // 1. Border Radius: 
  // We allow a wider range (30-70) to ensure they don't look too square,
  // but maintain enough internal space for the text.
  const r = () => Math.floor(rng.range(40, 60));
  const borderRadius = `${r()}% ${r()}% ${r()}% ${r()}% / ${r()}% ${r()}% ${r()}% ${r()}%`;

  // 2. Rotation: 
  // Rotate between -12deg and 12deg to break the grid lines
  const rotate = rng.range(-6, 6);

  // 3. Scale:
  // Vary size slightly (0.9 to 1.1) so they aren't all uniform visual weight
  const scale = rng.range(0.95, 1.05);

  // 4. Translation (The "Free Flow" Factor):
  // Nudge them slightly up/down/left/right so they don't align in rows
  const x = rng.range(-5, 5);
  const y = rng.range(-5, 5);

  return { borderRadius, rotate, scale, x, y };
}

export default function WallRouteList({ routes }: { routes: BrowserRoute[] }) {
  return (
    <motion.div
      className="flex-1 overflow-y-auto p-4 pb-32" // Added extra padding bottom
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
        /* LAYOUT CHANGE: 
           Replaced Grid with Flex-Wrap.
           gap-x-4 gap-y-12 ensures they cluster but have vertical breathing room for the random offsets.
        */
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12 max-w-7xl mx-auto">
          {routes.map((route) => {
            const styles = generateOrganicStyles(route.id, route.wall_id, route.grade);

            return (
              <Link
                key={route.id}
                href={`/route/${route.id}`}
                // SIZING CHANGE:
                // w-32 h-32 (Mobile) -> w-44 h-44 (Tablet) -> w-56 h-56 (Desktop)
                // This automatically handles your "smaller on smaller screens" request
                className="relative group z-0 hover:z-10 w-24 h-24 md:w-32 md:h-32 lg:w-44 lg:h-44 flex-shrink-0"
                style={{
                  // Apply the random nudge (translation) here on the container
                  transform: `translate(${styles.x}px, ${styles.y}px)`
                }}
              >
                <motion.div
                  layoutId={`route-card-${route.id}`}
                  className="w-full h-full shadow-lg transition-all duration-300 ease-out group-hover:scale-110 group-hover:shadow-2xl group-hover:rotate-0"
                  style={{
                    backgroundColor: getRouteColor(route.color),
                    borderRadius: styles.borderRadius,
                    // Apply rotation and scale to the blob itself
                    transform: `rotate(${styles.rotate}deg) scale(${styles.scale})`
                  }}
                >
                  {/* Texture Overlay */}
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] mix-blend-multiply pointer-events-none rounded-[inherit]" />

                  {/* Inner Shadow/Highlight for 3D effect */}
                  <div className="absolute inset-0 rounded-[inherit] ring-1 ring-black/5 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.1)] pointer-events-none" />

                  {/* Content Container - Counter-rotate to keep text straight? 
                      Optional: Currently I left text rotating with the blob for a sticker feel. 
                      If you want text straight, add transform: `rotate(${-styles.rotate}deg)` to this div.
                  */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">

                    {/* Grade */}
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

                    {/* Top Right: Status */}
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

                    {/* Bottom Info Row */}
                    <div className="absolute bottom-2 md:bottom-4 left-0 right-0 flex items-center justify-center gap-1 md:gap-2 px-2">
                      {/* Rating */}
                      {route.avg_rating > 0 && (
                        <div className="flex items-center gap-1 text-black/70 bg-white/30 backdrop-blur-[2px] px-1.5 py-0.5 rounded-full shadow-sm">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-[10px] md:text-xs font-bold">{route.avg_rating.toFixed(1)}</span>
                        </div>
                      )}

                      {/* Comments */}
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
