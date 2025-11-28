"use client";

import { useGLTF } from "@react-three/drei";
import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { useFrame, ThreeEvent } from "@react-three/fiber";

type GymModelProps = {
  selectedWallId: string | null;
  onWallClick: (wallId: string) => void;
};

export type WallBoundsData = {
  wallId: string;
  worldPosition: THREE.Vector3;
  boundingBox: THREE.Box3;
  normal: THREE.Vector3;
};

export const wallBoundsRegistry = new Map<string, WallBoundsData>();
export const wallMeshRegistry = new Map<string, THREE.Mesh>();

const MODEL_PATH = "/models/gym.glb";
const MODEL_SCALE = 0.5;

function matchWallId(meshName: string): string | null {
  const lowerName = meshName.toLowerCase();

  const exactMatchOrder = [
    "right-of-prow",
    "left-of-prow",
    "30-degree-wall",
    "entrance-wall",
    "fan-wall",
    "the-cave",
    "variety-wall",
    "prow",
    "vertical-wall",
    "transition-wall",
    "slab-wall",
    "the-barrel",
  ];

  for (const wallId of exactMatchOrder) {
    if (lowerName.includes(wallId)) {
      return wallId;
    }
    const withoutDashes = wallId.replace(/-/g, "");
    if (lowerName.includes(withoutDashes)) {
      return wallId;
    }
  }

  if (lowerName.includes("30-degree-wal") || lowerName.includes("30degree")) {
    return "30-degree-wall";
  }

  return null;
}

export function GymModel({ selectedWallId, onWallClick }: GymModelProps) {
  const { scene } = useGLTF(MODEL_PATH);
  const modelLoadedRef = useRef(false);
  const wallMeshes = useRef<Map<string, THREE.Mesh>>(new Map());
  const meshToWallId = useRef<Map<THREE.Mesh, string>>(new Map());
  const originalMaterials = useRef<Map<string, THREE.Material | THREE.Material[]>>(new Map());

  useEffect(() => {
    if (!scene) return;

    scene.scale.set(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE);
    scene.updateMatrixWorld(true);

    console.log("=== MODEL DEBUG INFO ===");
    console.log(`Model scale: ${MODEL_SCALE}`);
    wallBoundsRegistry.clear();
    wallMeshRegistry.clear();
    wallMeshes.current.clear();
    meshToWallId.current.clear();

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry) {
        const matchingWallId = matchWallId(child.name);

        if (matchingWallId && !wallMeshes.current.has(matchingWallId)) {
          console.log(`✓ MATCHED: "${child.name}" → ${matchingWallId}`);

          child.geometry.computeBoundingBox();
          const worldPos = new THREE.Vector3();
          child.getWorldPosition(worldPos);

          const worldBoundingBox = new THREE.Box3();
          worldBoundingBox.setFromObject(child);

          const wallNormal = new THREE.Vector3(0, 0, 1);
          const geometry = child.geometry;
          if (geometry.attributes.normal) {
            const normalAttr = geometry.attributes.normal;
            const avgNormal = new THREE.Vector3();
            for (let i = 0; i < Math.min(normalAttr.count, 100); i++) {
              avgNormal.x += normalAttr.getX(i);
              avgNormal.y += normalAttr.getY(i);
              avgNormal.z += normalAttr.getZ(i);
            }
            avgNormal.normalize();
            avgNormal.transformDirection(child.matrixWorld);
            if (avgNormal.length() > 0) {
              wallNormal.copy(avgNormal);
            }
          }

          wallBoundsRegistry.set(matchingWallId, {
            wallId: matchingWallId,
            worldPosition: worldPos.clone(),
            boundingBox: worldBoundingBox,
            normal: wallNormal,
          });

          console.log(
            `  World bounds: min=(${worldBoundingBox.min.x.toFixed(2)}, ${worldBoundingBox.min.y.toFixed(2)}, ${worldBoundingBox.min.z.toFixed(2)}) max=(${worldBoundingBox.max.x.toFixed(2)}, ${worldBoundingBox.max.y.toFixed(2)}, ${worldBoundingBox.max.z.toFixed(2)})`
          );

          wallMeshes.current.set(matchingWallId, child);
          wallMeshRegistry.set(matchingWallId, child);
          meshToWallId.current.set(child, matchingWallId);

          originalMaterials.current.set(matchingWallId, child.material);

          const originalMaterial = Array.isArray(child.material)
            ? child.material[0]
            : child.material;

          const newMaterial = new THREE.MeshStandardMaterial({
            color:
              originalMaterial instanceof THREE.MeshStandardMaterial
                ? originalMaterial.color
                : 0x808080,
            map:
              originalMaterial instanceof THREE.MeshStandardMaterial ? originalMaterial.map : null,
            emissive: new THREE.Color(0xe1261d),
            emissiveIntensity: 0,
            roughness: 0.8,
            metalness: 0.1,
          });

          child.material = newMaterial;
        }

        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    console.log("Matched walls:", Array.from(wallMeshes.current.keys()));
    console.log("=== END DEBUG ===");

    modelLoadedRef.current = true;
  }, [scene]);

  useFrame(() => {
    if (!modelLoadedRef.current) return;

    wallMeshes.current.forEach((mesh, wallId) => {
      const material = mesh.material as THREE.MeshStandardMaterial;
      if (material && material.emissiveIntensity !== undefined) {
        const isSelected = wallId === selectedWallId;
        const targetIntensity = isSelected ? 0.5 : 0;
        material.emissiveIntensity = THREE.MathUtils.lerp(
          material.emissiveIntensity,
          targetIntensity,
          0.1
        );
      }
    });
  });

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      const mesh = event.object as THREE.Mesh;
      const wallId = meshToWallId.current.get(mesh);
      if (wallId) {
        onWallClick(wallId);
      }
    },
    [onWallClick]
  );

  const handlePointerOver = useCallback((event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const mesh = event.object as THREE.Mesh;
    if (meshToWallId.current.has(mesh)) {
      document.body.style.cursor = "pointer";
    }
  }, []);

  const handlePointerOut = useCallback(() => {
    document.body.style.cursor = "default";
  }, []);

  return (
    <primitive
      object={scene}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    />
  );
}

useGLTF.preload(MODEL_PATH);
