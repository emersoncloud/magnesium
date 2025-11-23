import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const ROUTE_COLORS: Record<string, string> = {
  "Purple": "var(--color-route-purple)",
  "Pink": "var(--color-route-pink)",
  "Blue": "var(--color-route-blue)",
  "Yellow": "var(--color-route-yellow)",
  "Orange": "var(--color-route-orange)",
  "Black": "var(--color-route-black)",
  "White": "var(--color-route-white)",
  "Green": "var(--color-route-green)",
  "Tan": "var(--color-route-tan)",
  "Wood": "var(--color-route-wood)",
};

export function getRouteColor(colorName: string | null | undefined): string {
  if (!colorName) return "var(--color-route-black)"; // Default
  
  // Handle case-insensitive matching
  const normalizedColor = Object.keys(ROUTE_COLORS).find(
    key => key.toLowerCase() === colorName.toLowerCase()
  );
  
  return normalizedColor ? ROUTE_COLORS[normalizedColor] : colorName;
}
