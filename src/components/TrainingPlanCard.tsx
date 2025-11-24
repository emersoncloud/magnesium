"use client";

import { SavedTrainingPlan } from "@/app/actions";
import { TrendingUp, BarChart3, Target, Pencil, Globe, Lock, Calendar } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TrainingPlanCardProps {
  plan: SavedTrainingPlan;
  showAuthor?: boolean;
}

const typeIcons = {
  progression: TrendingUp,
  volume: BarChart3,
  project: Target,
  custom: Pencil,
};

const typeColors = {
  progression: "bg-blue-100 text-blue-700",
  volume: "bg-green-100 text-green-700",
  project: "bg-yellow-100 text-yellow-700",
  custom: "bg-purple-100 text-purple-700",
};

export default function TrainingPlanCard({ plan, showAuthor }: TrainingPlanCardProps) {
  const Icon = typeIcons[plan.type];
  const formattedDate = plan.created_at
    ? new Date(plan.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <Link
      href={`/train/${plan.id}`}
      className="block bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-slate-300 transition-all"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-800 truncate">{plan.name}</h3>
            {showAuthor && plan.user_name && (
              <p className="text-sm text-slate-500 truncate">by {plan.user_name}</p>
            )}
          </div>
          <div className={cn("p-2 rounded-lg flex-shrink-0", typeColors[plan.type])}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">
            {plan.base_grade}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 capitalize">
            {plan.length}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">
            {plan.routes.length} routes
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </div>
          <div className="flex items-center gap-1">
            {plan.is_public ? (
              <>
                <Globe className="w-3 h-3" />
                Public
              </>
            ) : (
              <>
                <Lock className="w-3 h-3" />
                Private
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
