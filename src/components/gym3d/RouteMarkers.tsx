"use client";

import { Html } from "@react-three/drei";
import { BrowserRoute } from "@/app/actions";
import { RouteMarker } from "./RouteMarker";
import { useMemo } from "react";
import { WALLS } from "@/lib/constants/walls";
import { wallBoundsRegistry, wallMeshRegistry } from "./GymModel";
import * as THREE from "three";
import { parseDateString } from "@/lib/utils";

type RouteMarkersProps = {
  routes: BrowserRoute[];
  wallId: string;
};

function raycastToWallSurface(
  targetPoint: THREE.Vector3,
  wallMesh: THREE.Mesh,
  bounds: THREE.Box3
): THREE.Vector3 | null {
  const raycaster = new THREE.Raycaster();

  const center = new THREE.Vector3();
  bounds.getCenter(center);

  const rayOrigin = targetPoint.clone();
  const boundSize = new THREE.Vector3();
  bounds.getSize(boundSize);
  const maxDimension = Math.max(boundSize.x, boundSize.y, boundSize.z);

  const directionToCenter = new THREE.Vector3().subVectors(center, rayOrigin).normalize();
  rayOrigin.add(directionToCenter.clone().multiplyScalar(-maxDimension));

  raycaster.set(rayOrigin, directionToCenter);

  const intersects = raycaster.intersectObject(wallMesh, true);

  if (intersects.length > 0) {
    const hit = intersects[0];
    const surfacePoint = hit.point.clone();
    if (hit.face) {
      const normal = hit.face.normal.clone();
      normal.transformDirection(wallMesh.matrixWorld);
      surfacePoint.add(normal.multiplyScalar(0.3));
    }
    return surfacePoint;
  }

  return null;
}

function calculateRoutePositions(
  routes: BrowserRoute[],
  wallId: string
): Array<{ route: BrowserRoute; position: [number, number, number] }> {
  const wallData = wallBoundsRegistry.get(wallId);
  const wallMesh = wallMeshRegistry.get(wallId);

  if (!wallData) {
    console.warn(`No bounds found for wall: ${wallId}`);
    return routes.map((route, index) => ({
      route,
      position: [index * 2, 5, 0] as [number, number, number],
    }));
  }

  const bounds = wallData.boundingBox;

  const sortedRoutes = [...routes].sort(
    (a, b) => parseDateString(a.set_date).getTime() - parseDateString(b.set_date).getTime()
  );

  const wallWidth = bounds.max.x - bounds.min.x;
  const wallHeight = bounds.max.y - bounds.min.y;
  const centerX = (bounds.min.x + bounds.max.x) / 2;
  const centerY = (bounds.min.y + bounds.max.y) / 2;
  const centerZ = (bounds.min.z + bounds.max.z) / 2;

  const usableWidth = wallWidth * 0.7;
  const usableHeight = wallHeight * 0.5;

  return sortedRoutes.map((route, index) => {
    const totalRoutes = sortedRoutes.length;
    const xRatio = totalRoutes > 1 ? index / (totalRoutes - 1) : 0.5;
    const xPosition = centerX - usableWidth / 2 + usableWidth * xRatio;

    const heightVariation = Math.sin(index * 0.9) * usableHeight * 0.3;
    const yPosition = centerY + heightVariation;

    const targetPoint = new THREE.Vector3(xPosition, yPosition, centerZ);

    if (wallMesh) {
      const surfacePoint = raycastToWallSurface(targetPoint, wallMesh, bounds);
      if (surfacePoint) {
        return {
          route,
          position: [surfacePoint.x, surfacePoint.y, surfacePoint.z] as [number, number, number],
        };
      }
    }

    return {
      route,
      position: [xPosition, yPosition, bounds.max.z + 0.5] as [number, number, number],
    };
  });
}

export function RouteMarkers({ routes, wallId }: RouteMarkersProps) {
  const positionedRoutes = useMemo(() => calculateRoutePositions(routes, wallId), [routes, wallId]);

  const wall = WALLS.find((w) => w.id === wallId);
  const wallData = wallBoundsRegistry.get(wallId);

  if (routes.length === 0) {
    const fallbackPosition: [number, number, number] = wallData
      ? [
          (wallData.boundingBox.min.x + wallData.boundingBox.max.x) / 2,
          (wallData.boundingBox.min.y + wallData.boundingBox.max.y) / 2,
          wallData.boundingBox.max.z + 1,
        ]
      : [0, 5, 1];

    return (
      <Html position={fallbackPosition} center distanceFactor={15}>
        <div className="px-4 py-2 bg-black/70 backdrop-blur-sm rounded-lg text-white text-sm whitespace-nowrap">
          No routes on {wall?.name || "this wall"}
        </div>
      </Html>
    );
  }

  return (
    <>
      {positionedRoutes.map(({ route, position }) => (
        <RouteMarker key={route.id} route={route} position={position} />
      ))}
    </>
  );
}
