"use server";

import { db } from "@/lib/db";
import { routes, activityLogs, personalNotes } from "@/lib/db/schema";
import { desc, eq, sql, and, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redis } from "@/lib/kv";
import { getSheetData } from "@/lib/google-sheets";
import { WALLS } from "@/lib/constants/walls";
import { auth, isAdmin } from "@/lib/auth";

export async function getRoutes() {
  return await db.select().from(routes).orderBy(desc(routes.created_at));
}

export async function getRoute(id: string) {
  return await db.query.routes.findFirst({
    where: eq(routes.id, id),
  });
}

import { z } from "zod";

const RouteSchema = z.object({
  wall_id: z.string(),
  grade: z.string(),
  color: z.string(),
  setter_name: z.string(),
  set_date: z.string(),
  status: z.string().optional(),
  attributes: z.array(z.string()).optional(),
  setter_notes: z.string().optional(),
  difficulty_label: z.string().optional(),
  style: z.string().optional(),
  hold_type: z.string().optional(),
});

export async function createRoute(data: typeof routes.$inferInsert) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) throw new Error("Unauthorized");

  const validated = RouteSchema.parse(data);
  await db.insert(routes).values(validated);
  revalidatePath("/gym");
  revalidatePath("/admin");
}

export async function updateRoute(id: string, data: Partial<typeof routes.$inferInsert>) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) throw new Error("Unauthorized");

  const validated = RouteSchema.partial().parse(data);
  await db.update(routes).set(validated).where(eq(routes.id, id));
  revalidatePath(`/route/${id}`);
  revalidatePath("/gym");
  revalidatePath("/admin");
}

export async function deleteRoute(id: string) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) throw new Error("Unauthorized");

  if (!id) throw new Error("ID is required");
  await db.delete(routes).where(eq(routes.id, id));
  revalidatePath("/gym");
  revalidatePath("/admin");
}

export async function getGradeDistribution() {
  const distribution = await db
    .select({
      grade: routes.grade,
      count: sql<number>`count(*)`,
    })
    .from(routes)
    .groupBy(routes.grade);

  return distribution;
}

export async function logActivity(data: typeof activityLogs.$inferInsert) {
  await db.insert(activityLogs).values(data);

  // Increment tick count in KV if it's a send or flash
  if (data.action_type === "SEND" || data.action_type === "FLASH") {
    try {
      await redis.incr(`route:${data.route_id}:ticks`);
    } catch (error) {
      console.error("Failed to increment KV tick:", error);
    }
  }

  revalidatePath(`/route/${data.route_id}`);
  revalidatePath("/feed");
}

export async function logAttempt(routeId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await logActivity({
    user_id: session.user.id,
    user_name: session.user.name,
    user_image: session.user.image,
    route_id: routeId,
    action_type: "ATTEMPT",
    content: "Attempted",
  });
}

export async function savePersonalNote(routeId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await db.select().from(personalNotes).where(
    and(
      eq(personalNotes.user_id, session.user.id),
      eq(personalNotes.route_id, routeId)
    )
  );

  if (existing.length > 0) {
    await db.update(personalNotes)
      .set({ content, updated_at: new Date() })
      .where(eq(personalNotes.id, existing[0].id));
  } else {
    await db.insert(personalNotes).values({
      user_id: session.user.id,
      route_id: routeId,
      content,
    });
  }

  revalidatePath(`/route/${routeId}`);
}

export async function getPersonalNote(routeId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const note = await db.select().from(personalNotes).where(
    and(
      eq(personalNotes.user_id, session.user.id),
      eq(personalNotes.route_id, routeId)
    )
  );

  return note[0]?.content || "";
}

export async function getRouteActivity(routeId: string) {
  return await db.select().from(activityLogs).where(eq(activityLogs.route_id, routeId)).orderBy(desc(activityLogs.created_at));
}

export async function getGlobalActivity() {
  return await db.select({
    id: activityLogs.id,
    user_id: activityLogs.user_id,
    user_name: activityLogs.user_name,
    user_image: activityLogs.user_image,
    action_type: activityLogs.action_type,
    content: activityLogs.content,
    created_at: activityLogs.created_at,
    route_grade: routes.grade,
    route_color: routes.color,
    route_label: routes.difficulty_label,
    route_id: routes.id,
    wall_id: routes.wall_id,
    setter_name: routes.setter_name,
    set_date: routes.set_date,
    style: routes.style,
    hold_type: routes.hold_type,
  })
    .from(activityLogs)
    .leftJoin(routes, eq(activityLogs.route_id, routes.id))
    .orderBy(desc(activityLogs.created_at))
    .limit(50);
}

export async function getUserActivity(userId: string) {
  return await db.select({
    id: activityLogs.id,
    user_id: activityLogs.user_id,
    user_name: activityLogs.user_name,
    user_image: activityLogs.user_image,
    action_type: activityLogs.action_type,
    content: activityLogs.content,
    created_at: activityLogs.created_at,
    route_grade: routes.grade,
    route_color: routes.color,
    route_label: routes.difficulty_label,
    route_id: routes.id,
    wall_id: routes.wall_id,
    setter_name: routes.setter_name,
    set_date: routes.set_date,
    style: routes.style,
    hold_type: routes.hold_type,
  })
    .from(activityLogs)
    .leftJoin(routes, eq(activityLogs.route_id, routes.id))
    .where(eq(activityLogs.user_id, userId))
    .orderBy(desc(activityLogs.created_at));
}

export async function ingestRoutes() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    throw new Error("Unauthorized");
  }

  try {
    const rows = await getSheetData();
    let count = 0;
    let archivedCount = 0;

    // Get all currently active routes
    const activeRoutes = await db.select().from(routes).where(eq(routes.status, "active"));
    const processedRouteIds = new Set<string>();

    for (const row of rows) {
      // Row format: [ZONE, ROUTE, COLOR, GRADE, STYLE, HOLD TYPE, SETTER, DATE]
      const [zoneStr, label, color, grade, style, holdType, setter, dateStr] = row;

      if (!grade || !color || !zoneStr) continue;

      // Map Zone to Wall ID
      const zoneIndex = parseInt(zoneStr) - 1;
      if (isNaN(zoneIndex) || zoneIndex < 0 || zoneIndex >= WALLS.length) {
        console.warn(`Invalid zone: ${zoneStr}`);
        continue;
      }
      const wall = WALLS[zoneIndex];

      // Parse date
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        date.setTime(Date.now());
      } else {
        const currentYear = new Date().getFullYear();
        date.setFullYear(currentYear);
      }
      const dateIso = date.toISOString().split('T')[0]; // YYYY-MM-DD

      // Check for existing route with EXACT match on key properties
      const existingRoute = activeRoutes.find(r =>
        r.wall_id === wall.id &&
        r.grade === grade &&
        r.color === color &&
        r.difficulty_label === (label || null) &&
        r.set_date === dateIso // Strict date match
      );

      if (existingRoute) {
        // Route exists - update mutable fields if changed
        if (existingRoute.style !== (style || null) || existingRoute.hold_type !== (holdType || null)) {
             await db.update(routes).set({
                 style: style || null,
                 hold_type: holdType || null
             }).where(eq(routes.id, existingRoute.id));
        }
        processedRouteIds.add(existingRoute.id);
      } else {
        // New route detected
        const newRoute = await db.insert(routes).values({
          wall_id: wall.id,
          grade: grade,
          color: color,
          setter_name: setter || "Unknown",
          set_date: dateIso,
          status: "active",
          attributes: [],
          difficulty_label: label || null,
          style: style || null,
          hold_type: holdType || null,
        }).returning({ id: routes.id });

        count++;
        processedRouteIds.add(newRoute[0].id);
      }
    }

    // Archive routes that were not in the sheet
    for (const route of activeRoutes) {
      if (!processedRouteIds.has(route.id)) {
        await db.update(routes)
          .set({
            status: "archived",
            removed_at: new Date()
          })
          .where(eq(routes.id, route.id));
        archivedCount++;
      }
    }

    revalidatePath("/gym");
    revalidatePath("/admin");
    return { success: true, count, archivedCount };
  } catch (error: any) {
    console.error("Ingestion failed:", error);

    if (error.code === 403 || error.status === 403 || (error.message && error.message.includes("permission"))) {
      return {
        success: false,
        error: "Permission denied. Please ensure the Google Sheet is 'Public' (Anyone with the link can view) since we are using an API Key."
      };
    }

    return { success: false, error: "Failed to ingest routes. Check server logs for details." };
  }
}

export async function rateRoute(routeId: string, rating: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (rating < 1 || rating > 5) throw new Error("Invalid rating");

  // Delete existing rating
  await db.delete(activityLogs).where(
    and(
      eq(activityLogs.user_id, session.user.id),
      eq(activityLogs.route_id, routeId),
      eq(activityLogs.action_type, "RATING")
    )
  );

  // Insert new rating
  await db.insert(activityLogs).values({
    user_id: session.user.id,
    user_name: session.user.name,
    user_image: session.user.image,
    route_id: routeId,
    action_type: "RATING",
    content: rating.toString(),
  });

  revalidatePath(`/route/${routeId}`);
  revalidatePath("/routes");
}

export async function updateActivity(activityId: string, content: string, metadata?: any) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const activity = await db.query.activityLogs.findFirst({
    where: eq(activityLogs.id, activityId),
  });

  if (!activity) throw new Error("Activity not found");
  if (activity.user_id !== session.user.id) throw new Error("Unauthorized");

  await db.update(activityLogs)
    .set({ content, metadata: metadata || activity.metadata })
    .where(eq(activityLogs.id, activityId));

  revalidatePath(`/route/${activity.route_id}`);
}

export async function deleteActivity(activityId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const activity = await db.query.activityLogs.findFirst({
    where: eq(activityLogs.id, activityId),
  });

  if (!activity) throw new Error("Activity not found");
  if (activity.user_id !== session.user.id && !isAdmin(session.user.email)) throw new Error("Unauthorized");

  await db.delete(activityLogs).where(eq(activityLogs.id, activityId));

  revalidatePath(`/route/${activity.route_id}`);
}

export async function voteGrade(routeId: string, vote: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (![-1, 0, 1].includes(vote)) throw new Error("Invalid vote");

  // Delete existing vote
  await db.delete(activityLogs).where(
    and(
      eq(activityLogs.user_id, session.user.id),
      eq(activityLogs.route_id, routeId),
      eq(activityLogs.action_type, "VOTE")
    )
  );

  // Insert new vote
  await db.insert(activityLogs).values({
    user_id: session.user.id,
    user_name: session.user.name,
    user_image: session.user.image,
    route_id: routeId,
    action_type: "VOTE",
    content: vote.toString(),
  });

  revalidatePath(`/route/${routeId}`);
}

export type BrowserRoute = {
  id: string;
  wall_id: string;
  grade: string;
  color: string;
  setter_name: string;
  set_date: string;
  attributes: string[];
  difficulty_label: string | null;
  style: string | null;
  hold_type: string | null;
  avg_rating: number;
  comment_count: number;
  user_status: "SEND" | "FLASH" | null;
};

export async function getBrowserRoutes(): Promise<BrowserRoute[]> {
  const session = await auth();
  const userId = session?.user?.id;

  // 1. Get all active routes
  const activeRoutes = await db.select().from(routes).where(eq(routes.status, "active"));

  // 2. Get aggregates (Rating & Comments)
  // Doing this in JS for simplicity as Drizzle aggregation with multiple counts can be tricky without subqueries
  // and we assume < 1000 routes. For scale, use SQL `GROUP BY`.
  const allActivity = await db.select({
    route_id: activityLogs.route_id,
    action_type: activityLogs.action_type,
    content: activityLogs.content,
  }).from(activityLogs);

  // 3. Get user status
  const userActivity = userId ? await db.select({
    route_id: activityLogs.route_id,
    action_type: activityLogs.action_type,
  }).from(activityLogs).where(
    and(
      eq(activityLogs.user_id, userId),
      or(eq(activityLogs.action_type, "SEND"), eq(activityLogs.action_type, "FLASH"))
    )
  ) : [];

  // Map data
  const routeMap = new Map<string, BrowserRoute>();

  for (const route of activeRoutes) {
    routeMap.set(route.id, {
      ...route,
      set_date: route.set_date, // Ensure string
      attributes: route.attributes || [],
      difficulty_label: route.difficulty_label,
      style: route.style,
      hold_type: route.hold_type,
      avg_rating: 0,
      comment_count: 0,
      user_status: null,
    });
  }

  // Aggregates
  const ratings: Record<string, number[]> = {};

  for (const log of allActivity) {
    const route = routeMap.get(log.route_id);
    if (!route) continue;

    if (log.action_type === "COMMENT") {
      route.comment_count++;
    } else if (log.action_type === "RATING" && log.content) {
      if (!ratings[log.route_id]) ratings[log.route_id] = [];
      ratings[log.route_id].push(parseInt(log.content));
    }
  }

  // Calculate Avg Rating
  for (const [routeId, scores] of Object.entries(ratings)) {
    const route = routeMap.get(routeId);
    if (route && scores.length > 0) {
      const sum = scores.reduce((a, b) => a + b, 0);
      route.avg_rating = sum / scores.length;
    }
  }

  // User Status
  for (const log of userActivity) {
    const route = routeMap.get(log.route_id);
    if (route) {
      // FLASH overrides SEND if both exist (though unlikely to have both validly)
      if (log.action_type === "FLASH") route.user_status = "FLASH";
      else if (log.action_type === "SEND" && route.user_status !== "FLASH") route.user_status = "SEND";
    }
  }

  return Array.from(routeMap.values()).sort((a, b) => new Date(b.set_date).getTime() - new Date(a.set_date).getTime());
}
