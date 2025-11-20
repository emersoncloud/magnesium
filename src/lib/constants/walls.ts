export const WALLS = [
  { id: "entrance-wall", name: "Entrance Wall", type: "Vertical" },
  { id: "fan-wall", name: "Fan Wall", type: "Overhang" },
  { id: "left-of-prow", name: "Left of Prow", type: "Overhang" },
  { id: "prow", name: "Prow", type: "Overhang" },
  { id: "right-of-prow", name: "Right of Prow", type: "Overhang" },
  { id: "transition-wall", name: "Transition Wall", type: "Vertical" },
  { id: "30-degree-wall", name: "30 Degree Wall", type: "Overhang" },
  { id: "the-cave", name: "The Cave", type: "Overhang" },
  { id: "variety-wall", name: "Variety Wall", type: "Vertical" },
  { id: "slab-wall", name: "Slab Wall", type: "Slab" },
  { id: "vertical-wall", name: "Vertical Wall", type: "Vertical" },
  { id: "the-barrel", name: "The Barrel", type: "Overhang" },
] as const;

export type WallId = typeof WALLS[number]["id"];

export const GRADES = [
  "V0", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "V10", "V11", "V12"
] as const;

export const COLORS = [
  "Red", "Blue", "Green", "Yellow", "Black", "White", "Purple", "Orange", "Pink"
] as const;
