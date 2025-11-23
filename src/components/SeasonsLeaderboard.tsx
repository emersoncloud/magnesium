"use client";

import { SeasonEntry } from "@/app/seasons/actions";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { Trophy, Medal, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SeasonsLeaderboard({
  data,
  currentUserId,
}: {
  data: SeasonEntry[];
  currentUserId?: string;
}) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
        <p>No competitions recorded for this season yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((entry, index) => {
        const isCurrentUser = entry.userId === currentUserId;
        const rank = index + 1;

        return (
          <Card
            key={entry.userId}
            className={cn(
              "p-4 flex items-center gap-4 transition-all hover:scale-[1.01]",
              isCurrentUser
                ? "border-yellow-400/50 bg-yellow-50/10 shadow-lg shadow-yellow-900/5"
                : "border-slate-800/50 bg-slate-900/40"
            )}
          >
            {/* Rank */}
            <div className="w-8 flex justify-center">
              {rank === 1 ? (
                <Trophy className="w-6 h-6 text-yellow-400" />
              ) : rank === 2 ? (
                <Medal className="w-6 h-6 text-slate-300" />
              ) : rank === 3 ? (
                <Award className="w-6 h-6 text-amber-600" />
              ) : (
                <span className="text-lg font-bold text-slate-500">#{rank}</span>
              )}
            </div>

            {/* User Info */}
            <Link href={`/profile/${entry.userId}`} className="flex items-center gap-3 flex-1 group">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-800 border border-slate-700">
                {entry.userImage ? (
                  <Image
                    src={entry.userImage}
                    alt={entry.userName || "User"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-xs">
                    {entry.userName?.substring(0, 2).toUpperCase() || "??"}
                  </div>
                )}
              </div>
              <div>
                <div className="font-bold text-slate-200 group-hover:text-yellow-400 transition-colors">
                  {entry.userName || "Anonymous Climber"}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span>Best: {entry.topGrade || "-"}</span>
                </div>
              </div>
            </Link>

            {/* Stats */}
            <div className="flex items-center gap-6 text-right">
              <div className="hidden sm:block">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Sends</div>
                <div className="font-mono text-slate-300">{entry.sends}</div>
              </div>
              <div className="hidden sm:block">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Flashes</div>
                <div className="font-mono text-slate-300">{entry.flashes}</div>
              </div>
              <div className="w-20">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Score</div>
                <div className="text-xl font-black text-yellow-500 font-mono">
                  {entry.score.toLocaleString()}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
