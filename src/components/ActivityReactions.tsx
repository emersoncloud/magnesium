"use client";

import { useState, useOptimistic, useTransition } from "react";
import { Heart, Flame, PartyPopper } from "lucide-react";
import { toggleActivityReaction } from "@/app/actions";
import { cn } from "@/lib/utils";

type ReactionType = "LIKE" | "FIRE" | "CELEBRATE";

interface ActivityReactionsProps {
  activityId: string;
  initialReactions?: {
    likes: number;
    fires: number;
    celebrates: number;
    userReactions: ReactionType[];
  };
  variant?: "light" | "dark";
}

export default function ActivityReactions({
  activityId,
  initialReactions = { likes: 0, fires: 0, celebrates: 0, userReactions: [] },
  variant = "dark",
}: ActivityReactionsProps) {
  const [isPending, startTransition] = useTransition();
  const [reactions, setReactions] = useState(initialReactions);

  const [optimisticReactions, addOptimisticReaction] = useOptimistic(
    reactions,
    (state, newReaction: { type: ReactionType; action: "add" | "remove" }) => {
      const countKey =
        newReaction.type === "LIKE"
          ? "likes"
          : newReaction.type === "FIRE"
            ? "fires"
            : "celebrates";
      const newCount = newReaction.action === "add" ? state[countKey] + 1 : state[countKey] - 1;
      const newUserReactions =
        newReaction.action === "add"
          ? [...state.userReactions, newReaction.type]
          : state.userReactions.filter((r) => r !== newReaction.type);

      return {
        ...state,
        [countKey]: newCount,
        userReactions: newUserReactions,
      };
    }
  );

  const handleReaction = (type: ReactionType) => {
    const isActive = optimisticReactions.userReactions.includes(type);
    const action = isActive ? "remove" : "add";

    startTransition(async () => {
      addOptimisticReaction({ type, action });

      try {
        await toggleActivityReaction(activityId, type);

        setReactions((prev) => {
          const countKey = type === "LIKE" ? "likes" : type === "FIRE" ? "fires" : "celebrates";
          const newCount = action === "add" ? prev[countKey] + 1 : prev[countKey] - 1;
          const newUserReactions =
            action === "add"
              ? [...prev.userReactions, type]
              : prev.userReactions.filter((r) => r !== type);

          return {
            ...prev,
            [countKey]: newCount,
            userReactions: newUserReactions,
          };
        });
      } catch {
        setReactions((prev) => prev);
      }
    });
  };

  const buttonBaseClass =
    variant === "light" ? "text-white/70 hover:bg-white/20" : "text-slate-400 hover:bg-slate-100";

  const activeColors = {
    LIKE: variant === "light" ? "text-white" : "text-red-500",
    FIRE: variant === "light" ? "text-white" : "text-orange-500",
    CELEBRATE: variant === "light" ? "text-white" : "text-purple-500",
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => handleReaction("LIKE")}
        disabled={isPending}
        className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold transition-all active:scale-95",
          buttonBaseClass,
          optimisticReactions.userReactions.includes("LIKE") && activeColors.LIKE
        )}
      >
        <Heart
          className={cn(
            "w-4 h-4",
            optimisticReactions.userReactions.includes("LIKE") && "fill-current"
          )}
        />
        {optimisticReactions.likes > 0 && <span>{optimisticReactions.likes}</span>}
      </button>

      <button
        onClick={() => handleReaction("FIRE")}
        disabled={isPending}
        className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold transition-all active:scale-95",
          buttonBaseClass,
          optimisticReactions.userReactions.includes("FIRE") && activeColors.FIRE
        )}
      >
        <Flame
          className={cn(
            "w-4 h-4",
            optimisticReactions.userReactions.includes("FIRE") && "fill-current"
          )}
        />
        {optimisticReactions.fires > 0 && <span>{optimisticReactions.fires}</span>}
      </button>

      <button
        onClick={() => handleReaction("CELEBRATE")}
        disabled={isPending}
        className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold transition-all active:scale-95",
          buttonBaseClass,
          optimisticReactions.userReactions.includes("CELEBRATE") && activeColors.CELEBRATE
        )}
      >
        <PartyPopper className="w-4 h-4" />
        {optimisticReactions.celebrates > 0 && <span>{optimisticReactions.celebrates}</span>}
      </button>
    </div>
  );
}
