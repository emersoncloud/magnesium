"use client";

import { Card } from "@/components/ui/Card";
import { Zap, GripHorizontal } from "lucide-react";

type ActivityLog = {
  style: string | null;
  hold_type: string | null;
  action_type: string;
};

export default function StyleBreakdown({ activity }: { activity: ActivityLog[] }) {
  // Filter for sends/flashes only
  const sends = activity.filter((a) => a.action_type === "SEND" || a.action_type === "FLASH");

  const styleCounts: Record<string, number> = {};
  const holdCounts: Record<string, number> = {};

  sends.forEach((log) => {
    if (log.style) {
      styleCounts[log.style] = (styleCounts[log.style] || 0) + 1;
    }
    if (log.hold_type) {
      holdCounts[log.hold_type] = (holdCounts[log.hold_type] || 0) + 1;
    }
  });

  const sortedStyles = Object.entries(styleCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const sortedHolds = Object.entries(holdCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (sortedStyles.length === 0 && sortedHolds.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Style Breakdown */}
      <Card className="p-6">
        <h3 className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4" /> Top Styles
        </h3>
        <div className="space-y-3">
          {sortedStyles.map(([style, count]) => (
            <div key={style} className="flex items-center justify-between">
              <span className="font-bold text-slate-700">{style}</span>
              <div className="flex items-center gap-2">
                <div className="h-2 bg-slate-100 rounded-full w-24 overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${(count / sends.length) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-slate-400 w-6 text-right">{count}</span>
              </div>
            </div>
          ))}
          {sortedStyles.length === 0 && (
            <div className="text-slate-400 text-sm italic">No style data available</div>
          )}
        </div>
      </Card>

      {/* Hold Type Breakdown */}
      <Card className="p-6">
        <h3 className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
          <GripHorizontal className="w-4 h-4" /> Top Holds
        </h3>
        <div className="space-y-3">
          {sortedHolds.map(([hold, count]) => (
            <div key={hold} className="flex items-center justify-between">
              <span className="font-bold text-slate-700">{hold}</span>
              <div className="flex items-center gap-2">
                <div className="h-2 bg-slate-100 rounded-full w-24 overflow-hidden">
                  <div
                    className="h-full bg-orange-500"
                    style={{ width: `${(count / sends.length) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-slate-400 w-6 text-right">{count}</span>
              </div>
            </div>
          ))}
          {sortedHolds.length === 0 && (
            <div className="text-slate-400 text-sm italic">No hold data available</div>
          )}
        </div>
      </Card>
    </div>
  );
}
