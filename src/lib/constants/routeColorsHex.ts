export const ROUTE_COLORS_HEX: Record<string, number> = {
  Purple: 0x7e297e,
  Pink: 0xdb518c,
  Blue: 0x468ccb,
  Yellow: 0xf4ec1a,
  Orange: 0xf58120,
  Black: 0x040706,
  White: 0xfcfdff,
  Green: 0x0d8040,
  Tan: 0xcaa46d,
  Wood: 0xf2ebd7,
};

export function getRouteColorHex(colorName: string | null | undefined): number {
  if (!colorName) return 0x040706;

  const normalizedColor = Object.keys(ROUTE_COLORS_HEX).find(
    (key) => key.toLowerCase() === colorName.toLowerCase()
  );

  return normalizedColor ? ROUTE_COLORS_HEX[normalizedColor] : 0x040706;
}
