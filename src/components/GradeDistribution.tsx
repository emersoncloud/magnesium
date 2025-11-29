"use client";

import { useMemo } from "react";

type ActivityLog = {
  id: string;
  action_type: string;
  route_grade: string | null;
  route_color: string | null;
};

export default function GradeDistribution({ activity }: { activity: ActivityLog[] }) {
  const distribution = useMemo(() => {
    const counts: Record<string, { sends: number; flashes: number }> = {};

    // Filter for sends and flashes
    const sends = activity.filter((a) => a.action_type === "SEND" || a.action_type === "FLASH");

    for (const log of sends) {
      const grade = log.route_grade || "Unknown";
      if (!counts[grade]) {
        counts[grade] = { sends: 0, flashes: 0 };
      }

      if (log.action_type === "FLASH") {
        counts[grade].flashes++;
      } else {
        counts[grade].sends++;
      }
    }

    // Sort grades (simple alphanumeric sort for now, ideally custom sort for V-scale)
    const sortedGrades = Object.keys(counts).sort((a, b) => {
      // Try to parse V-number
      const aNum = parseInt(a.replace("V", ""));
      const bNum = parseInt(b.replace("V", ""));
      if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
      return a.localeCompare(b);
    });

    return sortedGrades.map((grade) => ({
      grade,
      ...counts[grade],
      total: counts[grade].sends + counts[grade].flashes,
    }));
  }, [activity]);

  if (distribution.length === 0) return null;

  const maxCount = Math.max(...distribution.map((d) => d.total));

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Grade Distribution</h3>

      <div className="flex items-end gap-2 h-48 w-full overflow-x-auto pb-2">
        {distribution.map((d) => (
          <div key={d.grade} className="flex flex-col items-center gap-2 min-w-[40px] flex-1 group">
            <div className="relative w-full flex flex-col justify-end items-center gap-0.5 h-full">
              {/* Tooltip */}
              <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10">
                {d.flashes} Flash / {d.sends} Send
              </div>

              {/* Flash Bar */}
              {d.flashes > 0 && (
                <div
                  className="w-full bg-yellow-400 rounded-t-sm hover:bg-yellow-500 transition-colors"
                  style={{ height: `${(d.flashes / maxCount) * 100}%` }}
                />
              )}

              {/* Send Bar */}
              {d.sends > 0 && (
                <div
                  className={`w-full bg-green-500 hover:bg-green-600 transition-colors ${d.flashes === 0 ? "rounded-t-sm" : ""}`}
                  style={{ height: `${(d.sends / maxCount) * 100}%` }}
                />
              )}
            </div>
            <span className="text-xs font-bold text-gray-600">{d.grade}</span>
            <span className="text-[10px] text-gray-400 font-mono">{d.total}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-400 rounded-sm"></div>
          <span>Flash</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
          <span>Send</span>
        </div>
      </div>
    </div>
  );
}
