import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { upcomingRoutes } from "@/lib/db/schema";
import { getUpcomingRoutesData } from "@/lib/google-sheets";
import { revalidatePath } from "next/cache";
import { sql } from "drizzle-orm";

async function performUpcomingSync() {
  const upcomingRoutesFromSheet = await getUpcomingRoutesData();

  await db.execute(sql`TRUNCATE TABLE upcoming_routes`);

  let addedCount = 0;
  for (const route of upcomingRoutesFromSheet) {
    await db.insert(upcomingRoutes).values({
      wall_id: route.wall_id,
      grade: route.grade,
      color: route.color,
      difficulty_label: route.difficulty_label,
      setter_comment: route.setter_comment,
    });
    addedCount++;
  }

  return { addedCount };
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { addedCount } = await performUpcomingSync();

    revalidatePath("/sets");

    return NextResponse.json({
      success: true,
      added: addedCount,
      message: `Synced ${addedCount} upcoming routes`,
    });
  } catch (error) {
    console.error("Upcoming routes sync failed:", error);
    return NextResponse.json(
      {
        error: "Sync failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
