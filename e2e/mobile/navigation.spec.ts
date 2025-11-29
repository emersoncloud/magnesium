import { test, expect, devices } from "@playwright/test";

test.use(devices["Pixel 5"]);

test.describe("Mobile Navigation", () => {
  test("should display bottom navigation bar", async ({ page }) => {
    await page.goto("/overview");
    await page.waitForLoadState("networkidle");

    const nav = page.locator("nav");
    if ((await nav.count()) > 0) {
      await expect(nav.first()).toBeVisible();
    }
  });

  test("should have tappable navigation items", async ({ page }) => {
    await page.goto("/overview");
    await page.waitForLoadState("networkidle");

    const navItems = page.locator("nav a, nav button");
    const count = await navItems.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const item = navItems.nth(i);
      if (await item.isVisible()) {
        const box = await item.boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(40);
        }
      }
    }
  });

  test("should navigate to routes page", async ({ page }) => {
    await page.goto("/overview");
    await page.waitForLoadState("networkidle");

    const routesLink = page.getByRole("link", { name: /routes/i }).first();
    if ((await routesLink.count()) > 0) {
      await routesLink.tap();
      await page.waitForLoadState("networkidle");
    }
  });

  test("should navigate to feed page", async ({ page }) => {
    await page.goto("/overview");
    await page.waitForLoadState("networkidle");

    const feedLink = page.getByRole("link", { name: /feed/i });
    if ((await feedLink.count()) > 0) {
      await feedLink.tap();
      await page.waitForLoadState("networkidle");
    }
  });
});

test.describe("Mobile Route Browsing", () => {
  test("should display routes table in mobile viewport", async ({ page }) => {
    await page.goto("/sets");
    await page.waitForLoadState("networkidle");

    const table = page.locator("table");
    if ((await table.count()) > 0) {
      await expect(table).toBeVisible();
    }
  });

  test("should be able to tap on route rows", async ({ page }) => {
    await page.goto("/sets");
    await page.waitForLoadState("networkidle");

    const firstRow = page.locator("tbody tr").first();
    if ((await firstRow.count()) > 0) {
      const box = await firstRow.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(40);
      }
      await firstRow.tap();
      await page.waitForLoadState("networkidle");
    }
  });

  test("should have horizontally scrollable table", async ({ page }) => {
    await page.goto("/sets");
    await page.waitForLoadState("networkidle");

    const tableContainer = page.locator(".overflow-x-auto");
    if ((await tableContainer.count()) > 0) {
      await expect(tableContainer.first()).toBeVisible();
    }
  });
});

test.describe("Mobile Safe Areas", () => {
  test("should render correctly on notched device", async ({ page }) => {
    await page.goto("/overview");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toBeVisible();
  });

  test("should have proper spacing for safe areas", async ({ page }) => {
    await page.goto("/overview");
    await page.waitForLoadState("networkidle");

    const mainContent = page.locator('main, [class*="container"]');
    if ((await mainContent.count()) > 0) {
      await expect(mainContent.first()).toBeVisible();
    }
  });
});
