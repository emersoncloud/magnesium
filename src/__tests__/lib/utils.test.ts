import { describe, it, expect } from "vitest";
import { cn, parseDateString, getRouteColor, ROUTE_COLORS } from "@/lib/utils";

describe("cn (className utility)", () => {
  it("should merge class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional classes", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
  });

  it("should handle arrays", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });

  it("should merge tailwind classes correctly", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("should handle objects", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
  });
});

describe("parseDateString", () => {
  it("should parse valid date string", () => {
    const result = parseDateString("2024-01-15");
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(15);
  });

  it("should return current date for null input", () => {
    const before = Date.now();
    const result = parseDateString(null);
    const after = Date.now();
    expect(result.getTime()).toBeGreaterThanOrEqual(before);
    expect(result.getTime()).toBeLessThanOrEqual(after);
  });

  it("should return current date for undefined input", () => {
    const before = Date.now();
    const result = parseDateString(undefined);
    const after = Date.now();
    expect(result.getTime()).toBeGreaterThanOrEqual(before);
    expect(result.getTime()).toBeLessThanOrEqual(after);
  });

  it("should return current date for empty string", () => {
    const before = Date.now();
    const result = parseDateString("");
    const after = Date.now();
    expect(result.getTime()).toBeGreaterThanOrEqual(before);
    expect(result.getTime()).toBeLessThanOrEqual(after);
  });

  it("should set time to noon to avoid timezone issues", () => {
    const result = parseDateString("2024-01-15");
    expect(result.getHours()).toBe(12);
  });
});

describe("getRouteColor", () => {
  it("should return CSS variable for known colors", () => {
    expect(getRouteColor("Purple")).toBe("var(--color-route-purple)");
    expect(getRouteColor("Blue")).toBe("var(--color-route-blue)");
    expect(getRouteColor("Yellow")).toBe("var(--color-route-yellow)");
  });

  it("should be case-insensitive", () => {
    expect(getRouteColor("purple")).toBe("var(--color-route-purple)");
    expect(getRouteColor("PURPLE")).toBe("var(--color-route-purple)");
    expect(getRouteColor("PuRpLe")).toBe("var(--color-route-purple)");
  });

  it("should return default for null input", () => {
    expect(getRouteColor(null)).toBe("var(--color-route-black)");
  });

  it("should return default for undefined input", () => {
    expect(getRouteColor(undefined)).toBe("var(--color-route-black)");
  });

  it("should return the color name for unknown colors", () => {
    expect(getRouteColor("Magenta")).toBe("Magenta");
    expect(getRouteColor("custom-color")).toBe("custom-color");
  });
});

describe("ROUTE_COLORS", () => {
  it("should have expected color mappings", () => {
    expect(ROUTE_COLORS.Purple).toBe("var(--color-route-purple)");
    expect(ROUTE_COLORS.Pink).toBe("var(--color-route-pink)");
    expect(ROUTE_COLORS.Blue).toBe("var(--color-route-blue)");
    expect(ROUTE_COLORS.Yellow).toBe("var(--color-route-yellow)");
    expect(ROUTE_COLORS.Orange).toBe("var(--color-route-orange)");
    expect(ROUTE_COLORS.Black).toBe("var(--color-route-black)");
    expect(ROUTE_COLORS.White).toBe("var(--color-route-white)");
    expect(ROUTE_COLORS.Green).toBe("var(--color-route-green)");
    expect(ROUTE_COLORS.Tan).toBe("var(--color-route-tan)");
    expect(ROUTE_COLORS.Wood).toBe("var(--color-route-wood)");
  });
});
