import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { routes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSheetData } from "@/lib/google-sheets";
import { WALLS } from "@/lib/constants/walls";
import { notifyRouteSync, notifyTooManyRoutesToArchive } from "@/lib/telegram";
import { revalidatePath } from "next/cache";

type SyncRoute = {
  id?: string;
  wall_id: string;
  grade: string;
  color: string;
  setter_name: string;
  set_date: string;
  difficulty_label: string | null;
  style: string | null;
  hold_type: string | null;
};

async function performSync() {
  const rows = await getSheetData();
  const activeRoutes = await db.select().from(routes).where(eq(routes.status, "active"));

  const newRoutes: SyncRoute[] = [];
  const existingRoutes: SyncRoute[] = [];
  const processedRouteIds = new Set<string>();

  for (const row of rows) {
    const [zoneStr, label, color, grade, style, holdType, setter, dateStr] = row;

    if (!grade || !color || !zoneStr) continue;

    const zoneIndex = parseInt(zoneStr) - 1;
    if (isNaN(zoneIndex) || zoneIndex < 0 || zoneIndex >= WALLS.length) {
      continue;
    }
    const wall = WALLS[zoneIndex];

    const parsedDate = new Date(dateStr);
    const currentYear = new Date().getFullYear();

    let dateIso: string;
    if (isNaN(parsedDate.getTime())) {
      const now = new Date();
      dateIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    } else {
      const monthFromSpreadsheet = parsedDate.getMonth() + 1;
      const dayFromSpreadsheet = parsedDate.getDate();
      dateIso = `${currentYear}-${String(monthFromSpreadsheet).padStart(2, '0')}-${String(dayFromSpreadsheet).padStart(2, '0')}`;
    }

    const existingRoute = activeRoutes.find(
      (r) =>
        r.wall_id === wall.id &&
        r.grade === grade &&
        r.color === color &&
        r.difficulty_label === (label || null) &&
        r.set_date === dateIso
    );

    const routeData: SyncRoute = {
      wall_id: wall.id,
      grade,
      color,
      setter_name: setter || "Unknown",
      set_date: dateIso,
      difficulty_label: label || null,
      style: style || null,
      hold_type: holdType || null,
    };

    if (existingRoute) {
      existingRoutes.push({ ...existingRoute, ...routeData, id: existingRoute.id });
      processedRouteIds.add(existingRoute.id);
    } else {
      newRoutes.push(routeData);
    }
  }

  const routesThatWouldBeArchived = activeRoutes.filter((r) => !processedRouteIds.has(r.id));

  const tooManyRoutesToArchiveSafetyLimit = 10;
  if (routesThatWouldBeArchived.length > tooManyRoutesToArchiveSafetyLimit) {
    return {
      addedCount: 0,
      archivedCount: 0,
      addedRoutesSummary: [],
      skippedDueToTooManyArchives: true,
      routesThatWouldBeArchivedCount: routesThatWouldBeArchived.length,
    };
  }

  let addedCount = 0;
  let archivedCount = 0;
  const addedRoutesSummary: Array<{ grade: string; color: string }> = [];

  for (const route of newRoutes) {
    await db.insert(routes).values({
      ...route,
      status: "active",
      attributes: [],
    });
    addedCount++;
    addedRoutesSummary.push({ grade: route.grade, color: route.color });
  }

  for (const route of routesThatWouldBeArchived) {
    await db
      .update(routes)
      .set({
        status: "archived",
        removed_at: new Date(),
      })
      .where(eq(routes.id, route.id));
    archivedCount++;
  }

  for (const route of existingRoutes) {
    if (!route.id) continue;
    await db
      .update(routes)
      .set({
        style: route.style,
        hold_type: route.hold_type,
        setter_name: route.setter_name,
      })
      .where(eq(routes.id, route.id));
  }

  return {
    addedCount,
    archivedCount,
    addedRoutesSummary,
    skippedDueToTooManyArchives: false,
    routesThatWouldBeArchivedCount: 0,
  };
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      addedCount,
      archivedCount,
      addedRoutesSummary,
      skippedDueToTooManyArchives,
      routesThatWouldBeArchivedCount,
    } = await performSync();

    if (skippedDueToTooManyArchives) {
      await notifyTooManyRoutesToArchive(routesThatWouldBeArchivedCount);
      return NextResponse.json({
        success: false,
        added: 0,
        archived: 0,
        skipped: true,
        message: `Sync skipped: ${routesThatWouldBeArchivedCount} routes would be archived, which exceeds the safety limit of 10. A warning was sent to Telegram.`,
      });
    }

    if (addedCount > 0 || archivedCount > 0) {
      await notifyRouteSync(addedRoutesSummary, archivedCount);
      revalidatePath("/sets");
      revalidatePath("/sync");
    }

    return NextResponse.json({
      success: true,
      added: addedCount,
      archived: archivedCount,
      message:
        addedCount === 0 && archivedCount === 0
          ? "No changes detected"
          : `Synced: ${addedCount} added, ${archivedCount} archived`,
    });
  } catch (error) {
    console.error("Cron sync failed:", error);
    return NextResponse.json(
      { error: "Sync failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
