"use client";

import { OrbitControls } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { wallBoundsRegistry } from "./GymModel";

type CameraControlsProps = {
  targetWallId: string | null;
};

const DEFAULT_CAMERA_POSITION: [number, number, number] = [8, 8, 15];
const DEFAULT_CAMERA_TARGET: [number, number, number] = [5, 2, -5];

export function CameraControls({ targetWallId }: CameraControlsProps) {
  const { camera } = useThree();
  const controlsRef = useRef<React.ComponentRef<typeof OrbitControls>>(null);

  const targetPosition = useRef(new THREE.Vector3(...DEFAULT_CAMERA_POSITION));
  const targetLookAt = useRef(new THREE.Vector3(...DEFAULT_CAMERA_TARGET));
  const isAnimating = useRef(false);
  const animationProgress = useRef(0);

  useEffect(() => {
    if (targetWallId) {
      const wallData = wallBoundsRegistry.get(targetWallId);
      if (wallData) {
        const bounds = wallData.boundingBox;
        const centerX = (bounds.min.x + bounds.max.x) / 2;
        const centerY = (bounds.min.y + bounds.max.y) / 2;
        const centerZ = (bounds.min.z + bounds.max.z) / 2;
        const wallCenter = new THREE.Vector3(centerX, centerY, centerZ);

        const wallWidth = bounds.max.x - bounds.min.x;
        const wallHeight = bounds.max.y - bounds.min.y;
        const cameraDistance = Math.max(wallWidth, wallHeight) * 0.6 + 8;

        const normal = wallData.normal.clone();

        const cameraPos = wallCenter.clone().add(normal.multiplyScalar(cameraDistance));
        cameraPos.y = centerY + 1;

        targetLookAt.current.copy(wallCenter);
        targetPosition.current.copy(cameraPos);
        isAnimating.current = true;
        animationProgress.current = 0;
      }
    } else {
      targetPosition.current.set(...DEFAULT_CAMERA_POSITION);
      targetLookAt.current.set(...DEFAULT_CAMERA_TARGET);
      isAnimating.current = true;
      animationProgress.current = 0;
    }
  }, [targetWallId]);

  useFrame(() => {
    if (!isAnimating.current || !controlsRef.current) return;

    animationProgress.current += 0.02;
    const t = Math.min(animationProgress.current, 1);
    const easeT = 1 - Math.pow(1 - t, 3);

    camera.position.lerp(targetPosition.current, easeT * 0.1);
    controlsRef.current.target.lerp(targetLookAt.current, easeT * 0.1);

    const positionDistance = camera.position.distanceTo(targetPosition.current);
    const targetDistance = controlsRef.current.target.distanceTo(targetLookAt.current);

    if ((positionDistance < 0.5 && targetDistance < 0.5) || t >= 1) {
      isAnimating.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={2}
      maxDistance={150}
      panSpeed={1}
      rotateSpeed={0.8}
      zoomSpeed={1.2}
      target={DEFAULT_CAMERA_TARGET}
      makeDefault
    />
  );
}
