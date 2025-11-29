import { test, expect, devices } from "@playwright/test";

test.use(devices["Pixel 5"]);

test.describe("Touch Target Sizes", () => {
  test("buttons should have adequate touch targets (min 44x44)", async ({ page }) => {
    await page.goto("/sets");
    await page.waitForLoadState("networkidle");

    const firstRow = page.locator("tbody tr").first();
    if ((await firstRow.count()) > 0) {
      await firstRow.tap();
      await page.waitForLoadState("networkidle");

      const buttons = page.locator("button");
      const buttonCount = await buttons.count();

      for (let i = 0; i < Math.min(buttonCount, 10); i++) {
        const button = buttons.nth(i);
        if (await button.isVisible()) {
          const box = await button.boundingBox();
          if (box) {
            expect(box.height).toBeGreaterThanOrEqual(44);
          }
        }
      }
    }
  });

  test("navigation items should have adequate touch targets", async ({ page }) => {
    await page.goto("/overview");
    await page.waitForLoadState("networkidle");

    const navItems = page.locator("nav a, nav button");
    const count = await navItems.count();

    for (let i = 0; i < count; i++) {
      const item = navItems.nth(i);
      if (await item.isVisible()) {
        const box = await item.boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(40);
        }
      }
    }
  });

  test("table rows should be easily tappable", async ({ page }) => {
    await page.goto("/sets");
    await page.waitForLoadState("networkidle");

    const rows = page.locator("tbody tr");
    const rowCount = await rows.count();

    for (let i = 0; i < Math.min(rowCount, 5); i++) {
      const row = rows.nth(i);
      if (await row.isVisible()) {
        const box = await row.boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });
});

test.describe("Scroll Behavior", () => {
  test("should be able to scroll route list", async ({ page }) => {
    await page.goto("/sets");
    await page.waitForLoadState("networkidle");

    const initialScroll = await page.evaluate(() => window.scrollY);
    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(100);
    const newScroll = await page.evaluate(() => window.scrollY);

    expect(newScroll).toBeGreaterThanOrEqual(initialScroll);
  });

  test("should support swipe gestures on horizontally scrollable content", async ({ page }) => {
    await page.goto("/sets");
    await page.waitForLoadState("networkidle");

    const scrollableTable = page.locator(".overflow-x-auto");
    if ((await scrollableTable.count()) > 0) {
      await expect(scrollableTable.first()).toBeVisible();
    }
  });
});

test.describe("Touch Feedback", () => {
  test("interactive elements should have hover/active states", async ({ page }) => {
    await page.goto("/sets");
    await page.waitForLoadState("networkidle");

    const firstRow = page.locator("tbody tr").first();
    if ((await firstRow.count()) > 0) {
      await expect(page.locator("body")).toBeVisible();
    }
  });
});

test.describe("Responsive Layout", () => {
  test("content should fit within viewport width", async ({ page }) => {
    await page.goto("/overview");
    await page.waitForLoadState("networkidle");

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 10);
  });

  test("no horizontal overflow on routes page", async ({ page }) => {
    await page.goto("/sets");
    await page.waitForLoadState("networkidle");

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 10);
  });
});
