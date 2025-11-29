"use client";

import { TrainingPlanType } from "@/app/actions";
import { TrendingUp, BarChart3, Target, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrainingTypeSelectorProps {
  onSelect: (type: TrainingPlanType) => void;
}

const trainingTypes: {
  type: TrainingPlanType;
  name: string;
  description: string;
  icon: typeof TrendingUp;
  color: string;
}[] = [
  {
    type: "progression",
    name: "Progression",
    description: "Warm up, work your grade, then challenge yourself with harder routes.",
    icon: TrendingUp,
    color: "bg-blue-50 border-blue-200 hover:border-blue-400",
  },
  {
    type: "volume",
    name: "Volume",
    description: "High quantity at one grade level. Build endurance and movement quality.",
    icon: BarChart3,
    color: "bg-green-50 border-green-200 hover:border-green-400",
  },
  {
    type: "project",
    name: "Project",
    description: "Focus on a few hard routes. Work the moves and try to send.",
    icon: Target,
    color: "bg-yellow-50 border-yellow-200 hover:border-yellow-400",
  },
  {
    type: "custom",
    name: "Custom",
    description: "Build your own plan by selecting any routes you want.",
    icon: Pencil,
    color: "bg-purple-50 border-purple-200 hover:border-purple-400",
  },
];

export default function TrainingTypeSelector({ onSelect }: TrainingTypeSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">Choose Training Type</h2>
        <p className="text-sm text-slate-500 mt-1">
          Select the type of session you want to create.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trainingTypes.map(({ type, name, description, icon: Icon, color }) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={cn("p-6 rounded-xl border-2 text-left transition-all", color)}
          >
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-white shadow-sm">
                <Icon className="w-6 h-6 text-slate-700" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">{name}</h3>
                <p className="text-sm text-slate-600 mt-1">{description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
