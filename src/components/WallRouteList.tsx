"use client";

import { BrowserRoute } from "@/app/actions";
import Link from "next/link";
import { Star, MessageSquare, Zap, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Deterministic blob shapes
const BLOB_SHAPES = [
  "60% 40% 30% 70% / 60% 30% 70% 40%",
  "30% 70% 70% 30% / 30% 30% 70% 70%",
  "50% 50% 20% 80% / 25% 80% 20% 75%",
  "70% 30% 30% 70% / 60% 40% 60% 40%",
  "40% 60% 60% 40% / 40% 60% 40% 60%",
  "30% 70% 50% 50% / 30% 30% 70% 70%",
  "60% 40% 40% 60% / 70% 30% 70% 30%",
  "50% 50% 40% 60% / 50% 50% 60% 40%",
];

function getBlobShape(seed: string) {
  // Simple hash to pick a shape
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % BLOB_SHAPES.length;
  return BLOB_SHAPES[index];
}

export default function WallRouteList({ routes }: { routes: BrowserRoute[] }) {
  return (
    <motion.div 
      className="flex-1 overflow-y-auto p-4 md:p-8 pb-24"
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
          {routes.map((route) => {
            // Hash based on multiple properties for more variety
            const seed = `${route.wall_id}-${route.grade}-${route.color}-${route.set_date}`;
            const borderRadius = getBlobShape(seed);
            
            return (
              <Link
                key={route.id}
                href={`/route/${route.id}`}
                className="group relative flex items-center justify-center aspect-square z-0 hover:z-10 transition-all duration-300"
              >
                <motion.div
                  layoutId={`route-card-${route.id}`}
                  className="absolute inset-0 w-full h-full shadow-lg transition-transform duration-300 ease-out group-hover:scale-105 group-hover:shadow-xl"
                  style={{ 
                    backgroundColor: route.color,
                    borderRadius: borderRadius,
                  }}
                >
                  {/* Texture Overlay */}
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] mix-blend-multiply pointer-events-none rounded-[inherit]" />
                  
                  {/* Inner Shadow/Highlight for 3D effect */}
                  <div className="absolute inset-0 rounded-[inherit] ring-1 ring-black/5 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.1)] pointer-events-none" />

                  {/* Content Container */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    
                    {/* Grade */}
                    <motion.div layoutId={`route-grade-${route.id}`} className="relative z-10">
                      <span className="text-3xl md:text-4xl font-black text-black/80 drop-shadow-sm">
                        {route.grade}
                      </span>
                      {route.difficulty_label && (
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-black/60 mt-1">
                          {route.difficulty_label}
                        </span>
                      )}
                    </motion.div>

                    {/* Top Right: Status */}
                    {route.user_status && (
                      <div className="absolute top-3 right-3 md:top-4 md:right-4">
                        <div className={cn(
                          "w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-sm ring-2 ring-white/50",
                          route.user_status === "FLASH" ? "bg-yellow-400 text-black" : "bg-green-500 text-white"
                        )}>
                          {route.user_status === "FLASH" ? <Zap className="w-3 h-3 md:w-4 md:h-4 fill-current" /> : <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" />}
                        </div>
                      </div>
                    )}

                    {/* Bottom Info Row */}
                    <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3 md:gap-4 px-4">
                      {/* Rating */}
                      {route.avg_rating > 0 && (
                        <div className="flex items-center gap-1 text-black/70 bg-white/30 backdrop-blur-[2px] px-1.5 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs font-bold">{route.avg_rating.toFixed(1)}</span>
                        </div>
                      )}
                      
                      {/* Comments */}
                      {route.comment_count > 0 && (
                        <div className="flex items-center gap-1 text-black/70 bg-white/30 backdrop-blur-[2px] px-1.5 py-0.5 rounded-full">
                          <MessageSquare className="w-3 h-3" />
                          <span className="text-xs font-bold">{route.comment_count}</span>
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
