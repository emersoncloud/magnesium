import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { cn, parseDateString } from "@/lib/utils";
import { Flame } from "lucide-react";

interface SetCardProps {
  wallName: string;
  routeCount: number;
  date?: string;
  colors?: string[];
  wallId?: string;
  className?: string;
  changingDate?: string | null; // YYYY-MM-DD format - when the wall will be reset
  onClick?: () => void;
}

const COLOR_MAP: Record<string, string> = {
  Purple: "bg-[var(--color-route-purple)]",
  Pink: "bg-[var(--color-route-pink)]",
  Blue: "bg-[var(--color-route-blue)]",
  Yellow: "bg-[var(--color-route-yellow)]",
  Orange: "bg-[var(--color-route-orange)]",
  Black: "bg-[var(--color-route-black)]",
  White: "bg-[var(--color-route-white)]",
  Green: "bg-[var(--color-route-green)]",
  Tan: "bg-[var(--color-route-tan)]",
  Wood: "bg-[var(--color-route-wood)]",
};

function hashStringToNumber(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getNormalizedWidths(colors: string[]): number[] {
  if (colors.length === 0) return [];

  const rawWidths = colors.map((colorName) => {
    const hash = hashStringToNumber(colorName);
    return 1 + (hash % 100) / 100;
  });

  const totalRawWidth = rawWidths.reduce((sum, w) => sum + w, 0);
  return rawWidths.map((w) => (w / totalRawWidth) * 100);
}

export function SetCard({
  wallName,
  routeCount,
  date,
  colors = [],
  wallId,
  className,
  changingDate,
  onClick,
}: SetCardProps) {
  const sevenDaysInMs = 1000 * 60 * 60 * 24 * 7;
  const isNew = date && new Date().getTime() - new Date(date).getTime() < sevenDaysInMs;
  const reversedColors = [...colors].reverse();
  const colorWidths = getNormalizedWidths(reversedColors);

  // Format the changing date for display
  const formattedChangingDate = changingDate
    ? parseDateString(changingDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : null;

  const Content = (
    <Card
      className={cn(
        "p-4 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.2)] transition-all duration-300 group",
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="font-black uppercase tracking-tighter text-lg">{wallName}</div>
        <div className="flex items-center gap-2">
          {formattedChangingDate && (
            <div className="text-xs font-mono bg-amber-500 px-2 py-0.5 text-white transform -skew-x-12">
              <span className="transform skew-x-12 block">
                CHANGING {formattedChangingDate.toUpperCase()}
              </span>
            </div>
          )}
          {isNew && (
            <div className="text-xs font-mono bg-lime-500 px-2 py-0.5 text-white transform -skew-x-12 flex items-center gap-1">
              <Flame className="w-3 h-3 transform skew-x-12" />
              <span className="transform skew-x-12 block">FRESH</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm font-mono text-slate-500">
          <span>
            {date
              ? `set on ${parseDateString(date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
              : "No Date"}
          </span>
          <span className="font-bold text-black">{routeCount} Routes</span>
        </div>

        <div className="flex h-4 w-full rounded overflow-hidden border-2 border-black">
          {reversedColors.map((colorName, i) => (
            <div
              key={i}
              style={{ width: `${colorWidths[i]}%` }}
              className={cn("h-full", COLOR_MAP[colorName] || "bg-gray-400")}
            />
          ))}
        </div>
      </div>
    </Card>
  );

  if (wallId) {
    return (
      <Link href={`/sets/${wallId}`} className="block" onClick={onClick}>
        {Content}
      </Link>
    );
  }

  return Content;
}
