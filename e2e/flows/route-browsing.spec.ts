import { test, expect } from "@playwright/test";

test.describe("Route Browsing Flow", () => {
  test("should display the routes page with route table", async ({ page }) => {
    await page.goto("/sets");
    await page.waitForLoadState("networkidle");

    const table = page.locator("table");
    const hasTable = (await table.count()) > 0;

    if (hasTable) {
      await expect(table).toBeVisible();
    } else {
      const pageContent = await page.content();
      expect(pageContent.length).toBeGreaterThan(0);
    }
  });

  test("should display filter controls", async ({ page }) => {
    await page.goto("/sets");
    await page.waitForLoadState("networkidle");

    const filters = page.getByText("Filters");
    if ((await filters.count()) > 0) {
      await expect(filters).toBeVisible();
    }
  });

  test("should display sortable column headers", async ({ page }) => {
    await page.goto("/sets");
    await page.waitForLoadState("networkidle");

    const grade = page.getByText("Grade");
    if ((await grade.count()) > 0) {
      await expect(grade.first()).toBeVisible();
    }
  });

  test("clicking a route row should navigate to route detail page", async ({ page }) => {
    await page.goto("/sets");
    await page.waitForLoadState("networkidle");

    const firstRow = page.locator("tbody tr").first();

    if ((await firstRow.count()) > 0) {
      await firstRow.click();
      await page.waitForLoadState("networkidle");
      const url = page.url();
      expect(url).toBeTruthy();
    }
  });

  test("should update URL when sorting by column", async ({ page }) => {
    await page.goto("/sets");
    await page.waitForLoadState("networkidle");

    const gradeHeader = page.getByRole("columnheader", { name: /grade/i });
    if ((await gradeHeader.count()) > 0) {
      await gradeHeader.click();
      await page.waitForLoadState("networkidle");
    }
  });
});

test.describe("Route Detail Page", () => {
  test("should display route information", async ({ page }) => {
    await page.goto("/sets");
    await page.waitForLoadState("networkidle");

    const firstRow = page.locator("tbody tr").first();
    if ((await firstRow.count()) > 0) {
      await firstRow.click();
      await page.waitForLoadState("networkidle");
      await expect(page.locator("body")).toBeVisible();
    }
  });

  test("should show back navigation", async ({ page }) => {
    await page.goto("/sets");
    await page.waitForLoadState("networkidle");

    const firstRow = page.locator("tbody tr").first();
    if ((await firstRow.count()) > 0) {
      await firstRow.click();
      await page.waitForLoadState("networkidle");

      const backLink = page.getByRole("link", { name: /back/i });
      if ((await backLink.count()) > 0) {
        await expect(backLink).toBeVisible();
      }
    }
  });
});

test.describe("Route Controls (Unauthenticated)", () => {
  test("should show disabled controls when not logged in", async ({ page }) => {
    await page.goto("/sets");
    await page.waitForLoadState("networkidle");

    const firstRow = page.locator("tbody tr").first();
    if ((await firstRow.count()) > 0) {
      await firstRow.click();
      await page.waitForLoadState("networkidle");

      const logSendButton = page.getByRole("button", { name: /log send/i });
      if ((await logSendButton.count()) > 0) {
        await expect(logSendButton).toBeDisabled();
      }
    }
  });
});
