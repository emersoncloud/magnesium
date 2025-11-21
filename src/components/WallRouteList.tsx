"use client";

import { BrowserRoute } from "@/app/actions";
import Link from "next/link";
import { Star, MessageSquare, User, Calendar, CheckCircle2, Zap, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function WallRouteList({ routes }: { routes: BrowserRoute[] }) {
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  // Select first route by default on desktop, or none on mobile? 
  // Let's select none to let them browse the "tape" first.
  
  const selectedRoute = routes.find(r => r.id === selectedRouteId);

  return (
    <div className="flex-1 flex flex-col h-full relative">
      
      {/* Tape Rack (Horizontal Scroll) */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide flex items-center px-4 md:px-12 gap-1 md:gap-2 pb-32 pt-8">
        {routes.map((route) => {
          const isSelected = selectedRouteId === route.id;

          return (
            <button
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              className={cn(
                "group relative h-[50vh] md:h-[60vh] transition-all duration-300 ease-out snap-center flex-shrink-0",
                "w-16 md:w-20", // Narrow strips
                isSelected ? "scale-105 z-10 ring-4 ring-black/10" : "hover:scale-105 hover:z-10 opacity-90 hover:opacity-100"
              )}
            >
              <div 
                className="h-full w-full rounded-sm shadow-md flex flex-col items-center justify-between py-4 overflow-hidden relative"
                style={{ backgroundColor: route.color }}
              >
                {/* Texture Overlay */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/fabric-of-squares.png')] mix-blend-overlay pointer-events-none" />
                
                {/* Top: Grade */}
                <div className="relative z-10 bg-white/90 backdrop-blur-sm px-1 py-2 rounded-sm shadow-sm min-w-[2.5rem]">
                  <span className="block text-xl md:text-2xl font-black text-black text-center leading-none">
                    {route.grade}
                  </span>
                </div>

                {/* Middle: Vertical Text (Optional Name/Label) */}
                {route.difficulty_label && (
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 mix-blend-multiply">
                     <div className="transform -rotate-90 whitespace-nowrap">
                       <span className="text-lg font-black uppercase tracking-widest text-black">
                         {route.difficulty_label}
                       </span>
                     </div>
                   </div>
                )}

                {/* Bottom: Status Dot */}
                <div className="relative z-10">
                  {route.user_status && (
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center shadow-sm",
                      route.user_status === "FLASH" ? "bg-yellow-400 text-black" : "bg-green-500 text-white"
                    )}>
                      {route.user_status === "FLASH" ? <Zap className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}

        {/* Empty State */}
        {routes.length === 0 && (
          <div className="h-[50vh] w-full flex items-center justify-center">
            <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
              <p className="text-slate-400 font-black uppercase tracking-widest mb-2">No Routes</p>
              <p className="text-xs text-slate-400 font-mono">Awaiting Setter Action</p>
            </div>
          </div>
        )}
        
        {/* Spacer */}
        <div className="w-4 md:w-32 flex-shrink-0 snap-center" />
      </div>

      {/* Details Panel (Fixed Bottom) */}
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-out z-50",
          selectedRoute ? "translate-y-0" : "translate-y-full"
        )}
      >
        {selectedRoute && (
          <div className="max-w-3xl mx-auto p-4 md:p-6 pb-8 safe-area-bottom">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="bg-slate-100 border-slate-200 text-slate-600 font-mono">
                    {selectedRoute.grade}
                  </Badge>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                    {selectedRoute.color} Route
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight leading-none">
                  {selectedRoute.difficulty_label || selectedRoute.grade}
                </h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedRouteId(null)} className="h-8 w-8 p-0 rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Star className={cn("w-4 h-4", selectedRoute.avg_rating > 0 ? "fill-yellow-400 text-yellow-400" : "text-slate-300")} />
                <span className="font-bold text-slate-700">
                  {selectedRoute.avg_rating > 0 ? selectedRoute.avg_rating.toFixed(1) : "-"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-slate-700">{selectedRoute.comment_count}</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-bold text-slate-700 truncate">{selectedRoute.setter_name}</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-bold text-slate-700">{new Date(selectedRoute.set_date).toLocaleDateString()}</span>
              </div>
            </div>

            <Link href={`/route/${selectedRoute.id}`} className="block">
              <Button className="w-full" size="lg">
                View Route Details
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
