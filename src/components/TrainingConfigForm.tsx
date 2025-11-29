"use client";

import { useState } from "react";
import { TrainingPlanType, TrainingPlanLength } from "@/app/actions";
import { GRADES } from "@/lib/constants/walls";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface TrainingConfigFormProps {
  type: TrainingPlanType;
  onGenerate: (baseGrade: string, length: TrainingPlanLength) => void;
  isPending: boolean;
}

const lengthOptions: { value: TrainingPlanLength; label: string; description: string }[] = [
  { value: "short", label: "Short", description: "~5 routes" },
  { value: "medium", label: "Medium", description: "~10 routes" },
  { value: "long", label: "Long", description: "~15 routes" },
];

const projectLengthOptions: { value: TrainingPlanLength; label: string; description: string }[] = [
  { value: "short", label: "Short", description: "1 route" },
  { value: "medium", label: "Medium", description: "2 routes" },
  { value: "long", label: "Long", description: "3 routes" },
];

const typeDescriptions: Record<TrainingPlanType, string> = {
  progression:
    "Configure your progression session. Routes will be selected based on your target grade.",
  volume: "Configure your volume session. All routes will be at your selected grade.",
  project: "Configure your project session. Routes will be above your target grade.",
  custom: "Start with an empty plan and add routes manually.",
};

export default function TrainingConfigForm({
  type,
  onGenerate,
  isPending,
}: TrainingConfigFormProps) {
  const [baseGrade, setBaseGrade] = useState("V3");
  const [length, setLength] = useState<TrainingPlanLength>("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(baseGrade, length);
  };

  const currentLengthOptions = type === "project" ? projectLengthOptions : lengthOptions;
  const isCustomType = type === "custom";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-800 capitalize">{type} Session</h2>
        <p className="text-sm text-slate-500 mt-1">{typeDescriptions[type]}</p>
      </div>

      {!isCustomType && (
        <>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">Target Grade</label>
            <select
              value={baseGrade}
              onChange={(e) => setBaseGrade(e.target.value)}
              className="w-full md:w-48 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rockmill focus:border-transparent"
            >
              {GRADES.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500">
              {type === "progression" && "Routes will range from below to above this grade."}
              {type === "volume" && "All routes will be at this exact grade."}
              {type === "project" && "Routes will be 1-2 grades above this."}
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">Session Length</label>
            <div className="flex gap-3">
              {currentLengthOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setLength(option.value)}
                  className={cn(
                    "flex-1 px-4 py-3 rounded-lg border-2 transition-all text-left",
                    length === option.value
                      ? "border-rockmill bg-rockmill/5"
                      : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  <div className="font-medium text-slate-800">{option.label}</div>
                  <div className="text-xs text-slate-500">{option.description}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full md:w-auto px-6 py-3 bg-rockmill text-white rounded-lg hover:bg-rockmill/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : isCustomType ? (
          "Start Building"
        ) : (
          "Generate Plan"
        )}
      </button>
    </form>
  );
}
