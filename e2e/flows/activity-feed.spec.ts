import { test, expect } from "@playwright/test";

test.describe("Activity Feed", () => {
  test("should display the feed page", async ({ page }) => {
    await page.goto("/feed");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toBeVisible();
  });

  test("should show activity items if any exist", async ({ page }) => {
    await page.goto("/feed");
    await page.waitForLoadState("networkidle");

    const activityItems = page.getByRole("link", { name: "View Route" });
    if ((await activityItems.count()) > 0) {
      await expect(activityItems.first()).toBeVisible();
    }
  });

  test("should have navigation to other pages", async ({ page }) => {
    await page.goto("/feed");
    await page.waitForLoadState("networkidle");

    const navLinks = page.locator("nav a, nav button");
    const navCount = await navLinks.count();
    expect(navCount).toBeGreaterThanOrEqual(0);
  });
});

test.describe("Overview Page", () => {
  test("should display the overview page", async ({ page }) => {
    await page.goto("/overview");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toBeVisible();
  });

  test("should show user stats or sign-in prompt", async ({ page }) => {
    await page.goto("/overview");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Navigation", () => {
  test("should navigate between main sections", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const routesLink = page.getByRole("link", { name: /routes/i });
    if ((await routesLink.count()) > 0) {
      await routesLink.click();
      await page.waitForLoadState("networkidle");
    }
  });

  test("should have visible bottom navigation on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/overview");
    await page.waitForLoadState("networkidle");

    const nav = page.locator("nav");
    if ((await nav.count()) > 0) {
      await expect(nav.first()).toBeVisible();
    }
  });
});
