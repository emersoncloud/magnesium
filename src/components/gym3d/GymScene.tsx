"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { BrowserRoute } from "@/app/actions";
import { GymModel } from "./GymModel";
import { GymLighting } from "./GymLighting";
import { RouteMarkers } from "./RouteMarkers";
import { CameraControls } from "./CameraControls";
import { WallSelector } from "./WallSelector";
import { Preload } from "@react-three/drei";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useBrowserRoutes } from "@/hooks/useRoutes";

const DEFAULT_CAMERA_POSITION: [number, number, number] = [8, 8, 15];

type GymSceneProps = {
  initialRoutes: BrowserRoute[];
};

export default function GymScene({ initialRoutes }: GymSceneProps) {
  // Use cached routes with server-fetched initial data
  const { data: routes = initialRoutes } = useBrowserRoutes(initialRoutes);
  const [selectedWallId, setSelectedWallId] = useState<string | null>(null);

  const selectedWallRoutes = routes.filter((r) => r.wall_id === selectedWallId);

  function handleWallClick(wallId: string) {
    if (selectedWallId === wallId) {
      setSelectedWallId(null);
    } else {
      setSelectedWallId(wallId);
    }
  }

  function handleDeselectWall() {
    setSelectedWallId(null);
  }

  return (
    <div className="fixed inset-0 bg-slate-900">
      <Canvas
        camera={{ position: DEFAULT_CAMERA_POSITION, fov: 50 }}
        shadows
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <GymLighting />
          <GymModel selectedWallId={selectedWallId} onWallClick={handleWallClick} />
          {selectedWallId && <RouteMarkers routes={selectedWallRoutes} wallId={selectedWallId} />}
          <CameraControls targetWallId={selectedWallId} />
          <Preload all />
        </Suspense>
      </Canvas>

      <Link
        href="/sets"
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <WallSelector
        selectedWallId={selectedWallId}
        onSelectWall={handleWallClick}
        onDeselectWall={handleDeselectWall}
      />

      {!selectedWallId && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg text-white/80 text-sm">
          Click a wall to view routes or use the selector above
        </div>
      )}
    </div>
  );
}
