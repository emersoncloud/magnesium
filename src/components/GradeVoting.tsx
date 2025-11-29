"use client";

import { voteGrade } from "@/app/actions";
import { cn } from "@/lib/utils";
import { ThumbsDown, ThumbsUp, Minus, Turtle, Rabbit, Smile } from "lucide-react";
import { useOptimistic, useTransition, useState } from "react";

type GradeVote = -1 | 0 | 1; // -1: Soft, 0: Fair, 1: Hard

export default function GradeVoting({
  routeId,
  initialVotes,
  userVote,
}: {
  routeId: string;
  initialVotes: number[];
  userVote: number | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [pendingVote, setPendingVote] = useState<GradeVote | null>(null);

  // Calculate initial counts
  const getCounts = (votes: number[]) => ({
    soft: votes.filter((v) => v === -1).length,
    fair: votes.filter((v) => v === 0).length,
    hard: votes.filter((v) => v === 1).length,
  });

  const [optimisticState, setOptimisticState] = useOptimistic(
    { votes: initialVotes, userVote },
    (state, newVote: number) => {
      // Remove previous vote if exists
      const filteredVotes =
        state.userVote !== null
          ? state.votes.filter((_, i) => i !== state.votes.indexOf(state.userVote!))
          : state.votes;

      return {
        votes: [...filteredVotes, newVote],
        userVote: newVote,
      };
    }
  );

  const counts = getCounts(optimisticState.votes);
  const totalVotes = optimisticState.votes.length;

  const handleVoteClick = (vote: GradeVote) => {
    if (vote === 0) {
      // Fair - submit immediately
      handleSubmitVote(0);
    } else {
      // Show reasons
      setPendingVote(vote);
    }
  };

  const handleSubmitVote = async (vote: GradeVote, reason?: string) => {
    setPendingVote(null);
    startTransition(async () => {
      setOptimisticState(vote);
      await voteGrade(routeId, vote, reason);
    });
  };

  const REASONS = {
    [-1]: ["Tall Beta", "Soft", "Juggy"],
    [1]: ["Scrunchy", "Reachy", "Sandbagged", "Technical"],
  };

  if (pendingVote !== null) {
    return (
      <div className="bg-white border border-slate-200 p-6 shadow-sm">
        <h3 className="font-mono text-xs uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
          Why is it {pendingVote === -1 ? "Easier" : "Tougher"}?
        </h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {REASONS[pendingVote as -1 | 1].map((reason) => (
            <button
              key={reason}
              onClick={() => handleSubmitVote(pendingVote, reason)}
              disabled={isPending}
              className="p-3 border-2 border-slate-100 hover:border-slate-300 text-slate-600 hover:text-black text-xs font-bold uppercase tracking-wider transition-all"
            >
              {reason}
            </button>
          ))}
        </div>
        <button
          onClick={() => setPendingVote(null)}
          className="w-full p-2 text-xs text-slate-400 hover:text-slate-600 font-mono uppercase tracking-widest"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 p-6 shadow-sm">
      <h3 className="font-mono text-xs uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
        Grade Consensus
      </h3>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <button
          onClick={() => handleVoteClick(-1)}
          disabled={isPending}
          className={cn(
            "flex flex-col items-center justify-center p-3 border-2 transition-all",
            optimisticState.userVote === -1
              ? "border-green-500 bg-green-50 text-green-700"
              : "border-slate-100 hover:border-green-200 text-slate-500 hover:text-green-600"
          )}
        >
          <Turtle className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Easier</span>
        </button>

        <button
          onClick={() => handleVoteClick(0)}
          disabled={isPending}
          className={cn(
            "flex flex-col items-center justify-center p-3 border-2 transition-all",
            optimisticState.userVote === 0
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-slate-100 hover:border-blue-200 text-slate-500 hover:text-blue-600"
          )}
        >
          <Smile className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Fair</span>
        </button>

        <button
          onClick={() => handleVoteClick(1)}
          disabled={isPending}
          className={cn(
            "flex flex-col items-center justify-center p-3 border-2 transition-all",
            optimisticState.userVote === 1
              ? "border-red-500 bg-red-50 text-red-700"
              : "border-slate-100 hover:border-red-200 text-slate-500 hover:text-red-600"
          )}
        >
          <Rabbit className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Tougher</span>
        </button>
      </div>

      {/* Progress Bars */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-8 text-right font-mono text-slate-400">Easier</span>
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${totalVotes ? (counts.soft / totalVotes) * 100 : 0}%` }}
            />
          </div>
          <span className="w-6 font-mono text-slate-500">{counts.soft}</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="w-8 text-right font-mono text-slate-400">Fair</span>
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${totalVotes ? (counts.fair / totalVotes) * 100 : 0}%` }}
            />
          </div>
          <span className="w-6 font-mono text-slate-500">{counts.fair}</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="w-8 text-right font-mono text-slate-400">Tougher</span>
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-500"
              style={{ width: `${totalVotes ? (counts.hard / totalVotes) * 100 : 0}%` }}
            />
          </div>
          <span className="w-6 font-mono text-slate-500">{counts.hard}</span>
        </div>
      </div>
    </div>
  );
}
