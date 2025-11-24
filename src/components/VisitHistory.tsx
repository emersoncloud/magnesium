"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Calendar, ChevronDown, ChevronUp, Zap, Check, CheckCircle2, X } from "lucide-react";
import { RouteBadge } from "@/components/RouteBadge";
import Link from "next/link";

type ActivityLog = {
  id: string;
  action_type: string;
  route_grade: string | null;
  route_label: string | null;
  created_at: Date | null;
  route_color: string | null;
  route_id: string | null;
  wall_id: string | null;
  setter_name: string | null;
  set_date: string | null;
};

export default function VisitHistory({ activity }: { activity: ActivityLog[] }) {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  // Group by Date
  const visits = activity.reduce((acc, log) => {
    if (!log.created_at) return acc;
    const date = new Date(log.created_at).toLocaleDateString(undefined, {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });

    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {} as Record<string, ActivityLog[]>);

  const sortedDates = Object.keys(visits).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  console.log(visits);
  return (
    <Card className="p-6">
      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2 mb-6">
        <Calendar className="w-4 h-4" /> Visit History
      </h3>

      <div className="space-y-4">
        {sortedDates.map((date) => {
          const logs = visits[date];
          const sends = logs.filter(l => l.action_type === "SEND").length;
          const flashes = logs.filter(l => l.action_type === "FLASH").length;
          const attempts = logs.filter(l => l.action_type === "ATTEMPT").length;

          // Find best send of the day
          const bestGrade = logs
            .filter(l => (l.action_type === "SEND" || l.action_type === "FLASH") && l.route_grade)
            .sort((a, b) => (b.route_grade || "").localeCompare(a.route_grade || "")) // Simple string sort for now, ideally use GRADES index
          [0]?.route_grade;

          const isExpanded = expandedDate === date;

          return (
            <div key={date} className="border border-slate-100 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedDate(isExpanded ? null : date)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
              >
                <div>
                  <div className="font-bold text-slate-900">{date}</div>
                  <div className="text-xs text-slate-500 mt-1 flex gap-3">
                    {(sends + flashes) > 0 && <span className="text-green-600 font-medium">{sends + flashes} Sends</span>}
                    {attempts > 0 && <span>{attempts} Attempts</span>}
                    {bestGrade && <span className="text-violet-600 font-bold">Best: {bestGrade}</span>}
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {isExpanded && (
                <div className="p-4 bg-white space-y-2 border-t border-slate-100">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {log.action_type === "FLASH" && <Zap className="w-3 h-3 text-yellow-500 fill-current" />}
                        {log.action_type === "SEND" && <Check className="w-3 h-3 text-green-500" />}
                        {log.action_type === "ATTEMPT" && <CheckCircle2 className="w-3 h-3 text-gray-500" />}
                        {log.action_type === "COMMENT" && <X className="w-3 h-3 text-red-500" />}
                        {log.action_type === "PROPOSE_GRADE" && <Check className="w-3 h-3 text-green-500" />}
                        {log.route_id && log.route_grade && log.route_color && log.action_type !== "DELETE" ? (
                          <Link href={`/route/${log.route_id}`}>
                            <RouteBadge
                              route={{
                                id: log.route_id,
                                grade: log.route_grade,
                                difficulty_label: log.route_label,
                                color: log.route_color,
                                wall_id: log.wall_id || "Unknown",
                                setter_name: log.setter_name || "Unknown",
                                set_date: log.set_date || new Date().toISOString(),
                              }}
                              className="scale-75 origin-left"
                              showSetDate={true}
                            />
                          </Link>
                        ) : (
                          <span className="font-medium text-slate-700">
                            {log.route_grade || "Unknown Route"} <span className="text-slate-400 font-normal">- {log.route_color}</span>
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">
                        {log.created_at ? new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {sortedDates.length === 0 && (
          <div className="text-center text-slate-400 italic py-4">No visits recorded.</div>
        )}
      </div>
    </Card>
  );
}
