"use client";

import { RoutePlan } from "@/app/actions";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getRouteColor } from "@/lib/utils";
import { Check, Zap, Star, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { WALLS } from "@/lib/constants/walls";

export default function RoutePlanView({ plan }: { plan: RoutePlan }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black uppercase tracking-widest">Today&apos;s Training</h2>
        <p className="text-slate-500 font-mono text-sm">Based on your max grade</p>
      </div>

      <div className="grid gap-8">
        {/* Warm Up */}
        <PlanSection section={plan.warmUp} color="border-l-green-500" />

        {/* Main Set */}
        <PlanSection section={plan.mainSet} color="border-l-blue-500" />

        {/* Challenge */}
        <PlanSection section={plan.challenge} color="border-l-red-500" />
      </div>
    </div>
  );
}

function PlanSection({ section, color }: { section: RoutePlan["warmUp"], color: string }) {
  return (
    <div className="space-y-4">
      <div className={`pl-4 border-l-4 ${color}`}>
        <h3 className="text-xl font-bold flex items-center gap-2">
          {section.title}
        </h3>
        <p className="text-slate-500 text-sm">{section.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {section.routes.map((route) => (
          <Link key={route.id} href={`/route/${route.id}`} className="group">
            <Card className="h-full p-4 hover:shadow-md transition-all border-2 border-transparent hover:border-black group-hover:-translate-y-1">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full ring-1 ring-slate-100"
                    style={{ backgroundColor: getRouteColor(route.color) }}
                  />
                  <span className="font-mono text-xs uppercase text-slate-500">{route.color}</span>
                </div>
                <div className="flex gap-1">
                  {route.user_status === "SEND" && <Check className="w-4 h-4 text-green-500" />}
                  {route.user_status === "FLASH" && <Zap className="w-4 h-4 text-yellow-500 fill-current" />}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-2xl font-black text-slate-800">
                  {route.difficulty_label || route.grade}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {WALLS.find(w => w.id === route.wall_id)?.name || route.wall_id}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 mt-auto pt-3 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  {route.avg_rating > 0 && (
                    <span className="flex items-center gap-1 text-yellow-600">
                      <Star className="w-3 h-3 fill-current" /> {route.avg_rating.toFixed(1)}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> {route.comment_count}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-violet-600" />
              </div>
            </Card>
          </Link>
        ))}
        {section.routes.length === 0 && (
          <div className="col-span-full p-8 text-center border-2 border-dashed border-slate-200 rounded-lg text-slate-400 font-mono text-sm">
            No suitable routes found for this section.
          </div>
        )}
      </div>
    </div>
  );
}
