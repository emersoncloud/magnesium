"use client";

import { WALLS } from "@/lib/constants/walls";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";

type WallSelectorProps = {
  selectedWallId: string | null;
  onSelectWall: (wallId: string) => void;
  onDeselectWall: () => void;
};

export function WallSelector({ selectedWallId, onSelectWall, onDeselectWall }: WallSelectorProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
      <div className="flex items-center gap-1 px-2 py-1.5 bg-black/60 backdrop-blur-md rounded-xl overflow-x-auto max-w-[90vw]">
        {WALLS.map((wall) => {
          const isSelected = selectedWallId === wall.id;
          return (
            <button
              key={wall.id}
              onClick={() => onSelectWall(wall.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
                isSelected
                  ? "bg-red-600 text-white shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              {wall.name}
            </button>
          );
        })}
      </div>

      {selectedWallId && (
        <button
          onClick={onDeselectWall}
          className="p-2 bg-black/60 backdrop-blur-md rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          title="Reset view"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
