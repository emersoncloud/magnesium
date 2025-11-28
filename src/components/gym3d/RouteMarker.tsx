"use client";

import { Html } from "@react-three/drei";
import { BrowserRoute } from "@/app/actions";
import { getRouteColor, cn } from "@/lib/utils";
import { Zap, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

type RouteMarkerProps = {
  route: BrowserRoute;
  position: [number, number, number];
};

class SeededRNG {
  private seed: number;

  constructor(seedString: string) {
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
      hash = (hash << 5) - hash + seedString.charCodeAt(i);
      hash |= 0;
    }
    this.seed = Math.abs(hash);
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  range(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }
}

function generateOrganicStyles(routeId: string, wallId: string, grade: string) {
  const seedKey = `${wallId}-${routeId}-${grade}`;
  const rng = new SeededRNG(seedKey);

  const r = () => Math.floor(rng.range(40, 60));
  const borderRadius = `${r()}% ${r()}% ${r()}% ${r()}% / ${r()}% ${r()}% ${r()}% ${r()}%`;

  const rotate = rng.range(-6, 6);

  return { borderRadius, rotate };
}

export function RouteMarker({ route, position }: RouteMarkerProps) {
  const router = useRouter();
  const styles = generateOrganicStyles(route.id, route.wall_id, route.grade);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/route/${route.id}`);
  }

  return (
    <Html position={position} center distanceFactor={8} zIndexRange={[0, 50]}>
      <button
        onClick={handleClick}
        className="w-10 h-10 flex flex-col items-center justify-center shadow-lg transition-all duration-200 hover:scale-125 relative cursor-pointer"
        style={{
          backgroundColor: getRouteColor(route.color),
          borderRadius: styles.borderRadius,
          transform: `rotate(${styles.rotate}deg)`,
        }}
      >
        <div className="absolute inset-0 opacity-20 bg-[url('/concrete-wall.png')] mix-blend-multiply pointer-events-none rounded-[inherit]" />

        <div className="absolute inset-0 rounded-[inherit] ring-1 ring-black/5 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.1)] pointer-events-none" />

        <div className="relative z-10 bg-white/40 backdrop-blur-[2px] rounded px-1 py-0.5 flex flex-col items-center justify-center shadow-sm">
          <span className="font-black text-black text-xs leading-none">{route.grade}</span>
        </div>

        {route.user_status && (
          <div className="absolute -top-0.5 -right-0.5">
            <div
              className={cn(
                "w-3 h-3 rounded-full flex items-center justify-center shadow-sm ring-1 ring-white",
                route.user_status === "FLASH"
                  ? "bg-yellow-400 text-black"
                  : "bg-green-500 text-white"
              )}
            >
              {route.user_status === "FLASH" ? (
                <Zap className="w-1.5 h-1.5 fill-current" />
              ) : (
                <CheckCircle2 className="w-1.5 h-1.5" />
              )}
            </div>
          </div>
        )}
      </button>
    </Html>
  );
}
