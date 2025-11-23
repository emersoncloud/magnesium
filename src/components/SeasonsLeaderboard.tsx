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
          <div
            key={entry.userId}
            className={cn(
              "relative group transition-all duration-200 hover:-translate-y-1",
              isCurrentUser ? "z-10" : "z-0"
            )}
          >
            {/* Card Background & Border */}
            <div className={cn(
              "absolute inset-0 border-2 border-black transition-all duration-200",
              isCurrentUser
                ? "bg-yellow-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            )} />

            {/* Content */}
            <div className="relative p-4 flex items-center gap-4">
              {/* Rank Badge */}
              <div className={cn(
                "w-12 h-12 flex items-center justify-center font-black text-xl border-2 border-black transform -skew-x-12",
                rank === 1 ? "bg-yellow-400 text-black" :
                  rank === 2 ? "bg-slate-200 text-black" :
                    rank === 3 ? "bg-orange-300 text-black" :
                      "bg-white text-slate-400"
              )}>
                <span className="transform skew-x-12">
                  {rank === 1 ? <Trophy className="w-5 h-5" /> :
                    rank === 2 ? <Medal className="w-5 h-5" /> :
                      rank === 3 ? <Award className="w-5 h-5" /> :
                        `#${rank}`}
                </span>
              </div>

              {/* User Info */}
              <Link href={`/profile/${entry.userId}`} className="flex items-center gap-4 flex-1 group/link">
                <div className="relative w-10 h-10 border-2 border-black overflow-hidden bg-slate-100">
                  {entry.userImage ? (
                    <Image
                      src={entry.userImage}
                      alt={entry.userName || "User"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-black text-sm">
                      {entry.userName?.substring(0, 2).toUpperCase() || "??"}
                    </div>
                  )}
                </div>

                <div>
                  <div className={cn(
                    "font-black uppercase tracking-tight text-lg leading-none group-hover/link:text-yellow-600 transition-colors",
                    isCurrentUser ? "text-black" : "text-slate-800"
                  )}>
                    {entry.userName || "Anonymous Climber"}
                    {isCurrentUser && <span className="ml-2 text-[10px] bg-black text-white px-1.5 py-0.5 rounded-sm align-middle tracking-widest font-mono">YOU</span>}
                  </div>
                  <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
                    Best: <span className="font-bold text-black">{entry.topGrade || "-"}</span>
                  </div>
                </div>
              </Link>

              {/* Stats Grid */}
              <div className="flex items-center gap-6 text-right">
                <div className="hidden sm:block">
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">Sends</div>
                  <div className="font-mono font-bold text-black">{entry.sends}</div>
                </div>
                <div className="hidden sm:block">
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">Flashes</div>
                  <div className="font-mono font-bold text-black">{entry.flashes}</div>
                </div>
                <div className="w-24 pl-4 border-l-2 border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">Score</div>
                  <div className="text-2xl font-black text-black leading-none tracking-tighter">
                    {entry.score.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
