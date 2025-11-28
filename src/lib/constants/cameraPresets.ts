export type CameraPreset = {
  wallId: string;
  position: [number, number, number];
  target: [number, number, number];
};

export const CAMERA_PRESETS: CameraPreset[] = [
  {
    wallId: "entrance-wall",
    position: [15, 8, 20],
    target: [0, 5, 0],
  },
  {
    wallId: "fan-wall",
    position: [-10, 8, 18],
    target: [-5, 5, 0],
  },
  {
    wallId: "left-of-prow",
    position: [-15, 8, 15],
    target: [-10, 5, 0],
  },
  {
    wallId: "prow",
    position: [-20, 8, 12],
    target: [-15, 6, 0],
  },
  {
    wallId: "right-of-prow",
    position: [-18, 8, 8],
    target: [-12, 5, -5],
  },
  {
    wallId: "transition-wall",
    position: [-15, 8, 0],
    target: [-8, 5, -8],
  },
  {
    wallId: "30-degree-wall",
    position: [-10, 8, -10],
    target: [-5, 6, -15],
  },
  {
    wallId: "the-cave",
    position: [0, 8, -15],
    target: [0, 5, -20],
  },
  {
    wallId: "variety-wall",
    position: [10, 8, -12],
    target: [5, 5, -18],
  },
  {
    wallId: "slab-wall",
    position: [15, 8, -8],
    target: [10, 4, -12],
  },
  {
    wallId: "vertical-wall",
    position: [18, 8, 0],
    target: [12, 5, -5],
  },
  {
    wallId: "the-barrel",
    position: [15, 8, 10],
    target: [8, 5, 5],
  },
];

export const DEFAULT_CAMERA_POSITION: [number, number, number] = [25, 20, 35];
export const DEFAULT_CAMERA_TARGET: [number, number, number] = [0, 5, 0];

export function getCameraPresetForWall(wallId: string): CameraPreset | undefined {
  return CAMERA_PRESETS.find((preset) => preset.wallId === wallId);
}
