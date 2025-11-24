"use server";

import { db } from "@/lib/db";
import { routes, activityLogs, personalNotes, users, trainingPlans, trainingPlanRoutes } from "@/lib/db/schema";
import { desc, eq, sql, and, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redis } from "@/lib/kv";
import { getSheetData } from "@/lib/google-sheets";
import { WALLS, GRADES } from "@/lib/constants/walls";
import { auth, isAdmin, signOut } from "@/lib/auth";

export async function logout() {
  await signOut({ redirectTo: "/" });
}

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
  revalidatePath("/sets");
  revalidatePath("/sync");
}

export async function updateRoute(id: string, data: Partial<typeof routes.$inferInsert>) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) throw new Error("Unauthorized");

  const validated = RouteSchema.partial().parse(data);
  await db.update(routes).set(validated).where(eq(routes.id, id));
  revalidatePath(`/route/${id}`);
  revalidatePath("/sets");
  revalidatePath("/sync");
}

export async function deleteRoute(id: string) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) throw new Error("Unauthorized");

  if (!id) throw new Error("ID is required");
  await db.delete(routes).where(eq(routes.id, id));
  revalidatePath("/sets");
  revalidatePath("/sync");
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
  await db.insert(activityLogs).values({
    ...data,
    is_public: data.is_public ?? true,
  });

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
    content: null,
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
    .where(eq(activityLogs.is_public, true))
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
    .where(and(
      eq(activityLogs.user_id, userId),
      eq(activityLogs.is_public, true)
    ))
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

    revalidatePath("/sets");
    revalidatePath("/sync");
    return { success: true, count, archivedCount };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export async function voteGrade(routeId: string, vote: number, reason?: string) {
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
    metadata: reason ? { reason } : {},
  });

  revalidatePath(`/route/${routeId}`);
}

export async function proposeGrade(routeId: string, grade: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Delete existing proposal
  await db.delete(activityLogs).where(
    and(
      eq(activityLogs.user_id, session.user.id),
      eq(activityLogs.route_id, routeId),
      eq(activityLogs.action_type, "PROPOSE_GRADE")
    )
  );

  // Insert new proposal
  await db.insert(activityLogs).values({
    user_id: session.user.id,
    user_name: session.user.name,
    user_image: session.user.image,
    route_id: routeId,
    action_type: "PROPOSE_GRADE",
    content: grade,
    metadata: { proposed_grade: grade }
  });

  revalidatePath(`/route/${routeId}`);
}

export async function removeGradeProposal(routeId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.delete(activityLogs).where(
    and(
      eq(activityLogs.user_id, session.user.id),
      eq(activityLogs.route_id, routeId),
      eq(activityLogs.action_type, "PROPOSE_GRADE")
    )
  );

  revalidatePath(`/route/${routeId}`);
}

export async function toggleFlash(routeId: string, isFlash: boolean) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (isFlash) {
    // Check if already flashed to avoid duplicates
    const existing = await db.query.activityLogs.findFirst({
      where: and(
        eq(activityLogs.user_id, session.user.id),
        eq(activityLogs.route_id, routeId),
        eq(activityLogs.action_type, "FLASH")
      )
    });

    if (!existing) {
      await logActivity({
        user_id: session.user.id,
        user_name: session.user.name,
        user_image: session.user.image,
        route_id: routeId,
        action_type: "FLASH",
        content: null,
      });
    }
  } else {
    // Remove flash
    await db.delete(activityLogs).where(
      and(
        eq(activityLogs.user_id, session.user.id),
        eq(activityLogs.route_id, routeId),
        eq(activityLogs.action_type, "FLASH")
      )
    );
    revalidatePath(`/route/${routeId}`);
    revalidatePath("/feed");
  }
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

  // 1. Get all active routes with aggregation
  // We use a left join to get aggregation data efficiently
  const routesData = await db
    .select({
      id: routes.id,
      wall_id: routes.wall_id,
      grade: routes.grade,
      color: routes.color,
      setter_name: routes.setter_name,
      set_date: routes.set_date,
      attributes: routes.attributes,
      difficulty_label: routes.difficulty_label,
      style: routes.style,
      hold_type: routes.hold_type,
      status: routes.status,
      avg_rating: sql<number>`COALESCE(AVG(CASE WHEN ${activityLogs.action_type} = 'RATING' THEN CAST(${activityLogs.content} AS INTEGER) END), 0)`,
      comment_count: sql<number>`COUNT(CASE WHEN ${activityLogs.action_type} = 'COMMENT' THEN 1 END)`,
    })
    .from(routes)
    .leftJoin(activityLogs, eq(routes.id, activityLogs.route_id))
    .where(eq(routes.status, "active"))
    .groupBy(routes.id);

  // 2. Get user status efficiently if logged in
  const userStatusMap = new Map<string, "SEND" | "FLASH">();
  if (userId) {
    const userActivity = await db
      .select({
        route_id: activityLogs.route_id,
        action_type: activityLogs.action_type,
      })
      .from(activityLogs)
      .where(
        and(
          eq(activityLogs.user_id, userId),
          or(eq(activityLogs.action_type, "SEND"), eq(activityLogs.action_type, "FLASH"))
        )
      );

    for (const log of userActivity) {
      const current = userStatusMap.get(log.route_id);
      if (log.action_type === "FLASH") {
        userStatusMap.set(log.route_id, "FLASH");
      } else if (log.action_type === "SEND" && current !== "FLASH") {
        userStatusMap.set(log.route_id, "SEND");
      }
    }
  }

  // 3. Map and sort
  return routesData
    .map((route) => ({
      id: route.id,
      wall_id: route.wall_id,
      grade: route.grade,
      color: route.color,
      setter_name: route.setter_name,
      set_date: route.set_date, // Ensure string
      attributes: route.attributes || [],
      difficulty_label: route.difficulty_label,
      style: route.style,
      hold_type: route.hold_type,
      avg_rating: Number(route.avg_rating),
      comment_count: Number(route.comment_count),
      user_status: userStatusMap.get(route.id) || null,
    }))
    .sort((a, b) => new Date(b.set_date).getTime() - new Date(a.set_date).getTime());
}

export type SyncPreview = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  newRoutes: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  existingRoutes: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  missingRoutes: any[];
};

export async function previewSync(): Promise<SyncPreview> {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    throw new Error("Unauthorized");
  }

  const rows = await getSheetData();
  const activeRoutes = await db.select().from(routes).where(eq(routes.status, "active"));
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newRoutes: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existingRoutes: any[] = [];
  const processedRouteIds = new Set<string>();

  for (const row of rows) {
    // Row format: [ZONE, ROUTE, COLOR, GRADE, STYLE, HOLD TYPE, SETTER, DATE]
    const [zoneStr, label, color, grade, style, holdType, setter, dateStr] = row;

    if (!grade || !color || !zoneStr) continue;

    // Map Zone to Wall ID
    const zoneIndex = parseInt(zoneStr) - 1;
    if (isNaN(zoneIndex) || zoneIndex < 0 || zoneIndex >= WALLS.length) {
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

    const routeData = {
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

  const missingRoutes = activeRoutes.filter(r => !processedRouteIds.has(r.id));

  return { newRoutes, existingRoutes, missingRoutes };
}

export async function confirmSync() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    throw new Error("Unauthorized");
  }

  // Re-run logic to be safe and stateless
  const { newRoutes, existingRoutes, missingRoutes } = await previewSync();
  
  let count = 0;
  let archivedCount = 0;
  let updatedCount = 0;

  // Insert New
  for (const route of newRoutes) {
    await db.insert(routes).values({
      ...route,
      status: "active",
      attributes: [],
    });
    count++;
  }

  // Archive Missing
  for (const route of missingRoutes) {
    await db.update(routes)
      .set({
        status: "archived",
        removed_at: new Date()
      })
      .where(eq(routes.id, route.id));
    archivedCount++;
  }

  // Update Existing (Mutable fields)
  for (const route of existingRoutes) {
     // We could optimize this to only update if changed, but for now just update mutable fields
     await db.update(routes).set({
         style: route.style,
         hold_type: route.hold_type,
         setter_name: route.setter_name // Allow updating setter name too
     }).where(eq(routes.id, route.id));
     updatedCount++;
  }

  revalidatePath("/sets");
  revalidatePath("/sync");
  
  return { success: true, count, archivedCount, updatedCount };
}

export type RoutePlanSection = {
  title: string;
  description: string;
  routes: BrowserRoute[];
};

export type RoutePlan = {
  warmUp: RoutePlanSection;
  mainSet: RoutePlanSection;
  challenge: RoutePlanSection;
};

export async function generateRoutePlan(): Promise<RoutePlan> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  // 1. Determine User's Max Grade
  // Fetch all sends/flashes
  const userSends = await db
    .select({
      grade: routes.grade,
    })
    .from(activityLogs)
    .leftJoin(routes, eq(activityLogs.route_id, routes.id))
    .where(
      and(
        eq(activityLogs.user_id, userId),
        or(eq(activityLogs.action_type, "SEND"), eq(activityLogs.action_type, "FLASH"))
      )
    );

  let maxGradeIndex = 3; // Default to V3 (index 4 in 0-based array? No, V0 is index 1 usually... let's check GRADES)
  // GRADES: ["VB", "V0", "V1", "V2", "V3", ...]
  // Index:    0     1     2     3     4

  if (userSends.length > 0) {
    let maxIndex = -1;
    for (const send of userSends) {
      if (!send.grade) continue;
      const idx = (GRADES as readonly string[]).indexOf(send.grade);
      if (idx > maxIndex) maxIndex = idx;
    }
    if (maxIndex > -1) maxGradeIndex = maxIndex;
  }

  // 2. Fetch all active browser routes (re-using getBrowserRoutes logic effectively, but we need to filter)
  // It's better to just call getBrowserRoutes to get everything with user status populated
  const allRoutes = await getBrowserRoutes();

  // 3. Filter for sections
  // Warm Up: Max - 3 to Max - 1 (approx). 3 routes.
  // Main Set: Max - 1 to Max. 4 routes.
  // Challenge: Max to Max + 1. 3 routes (Unsent).

  // Helper to get grade index
  const getGradeIdx = (r: BrowserRoute) => (GRADES as readonly string[]).indexOf(r.grade);

  const warmUpRoutes = allRoutes.filter(r => {
    const idx = getGradeIdx(r);
    return idx >= Math.max(0, maxGradeIndex - 3) && idx < maxGradeIndex;
  });

  const mainSetRoutes = allRoutes.filter(r => {
    const idx = getGradeIdx(r);
    return idx >= Math.max(0, maxGradeIndex - 1) && idx <= maxGradeIndex;
  });

  const challengeRoutes = allRoutes.filter(r => {
    const idx = getGradeIdx(r);
    // Challenge should be hard (Max to Max+2) and NOT sent/flashed
    return idx >= maxGradeIndex && idx <= maxGradeIndex + 2 && !r.user_status;
  });

  // Randomly select subset
  const shuffle = <T>(array: T[]) => array.sort(() => 0.5 - Math.random());

  return {
    warmUp: {
      title: "Warm Up",
      description: "Get the blood flowing with these easier climbs.",
      routes: shuffle(warmUpRoutes).slice(0, 3),
    },
    mainSet: {
      title: "Main Set",
      description: "Your working grade. Focus on technique and execution.",
      routes: shuffle(mainSetRoutes).slice(0, 4),
    },
    challenge: {
      title: "Challenge",
      description: "Push your limits. Try something hard you haven't sent yet.",
      routes: shuffle(challengeRoutes).slice(0, 3),
    },
  };
}

export async function updateUserBarcode(barcode: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.update(users)
    .set({ barcode })
    .where(eq(users.id, session.user.id));

  revalidatePath(`/profile/${session.user.id}`);
}

export async function resetUserBarcode() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.update(users)
    .set({ barcode: null })
    .where(eq(users.id, session.user.id));

  revalidatePath(`/profile/${session.user.id}`);
}

export type TrainingPlanType = "progression" | "volume" | "project" | "custom";
export type TrainingPlanLength = "short" | "medium" | "long";

export type TrainingPlanRouteWithDetails = {
  id: string;
  route_id: string;
  section_name: string | null;
  order_index: number;
  route: BrowserRoute;
};

export type SavedTrainingPlan = {
  id: string;
  user_id: string;
  name: string;
  type: TrainingPlanType;
  base_grade: string;
  length: TrainingPlanLength;
  is_public: boolean;
  created_at: Date | null;
  updated_at: Date | null;
  routes: TrainingPlanRouteWithDetails[];
  user_name?: string | null;
};

export type GeneratedPlanSection = {
  title: string;
  description: string;
  routes: BrowserRoute[];
};

export type GeneratedPlan = {
  sections: GeneratedPlanSection[];
};

const PLAN_ROUTE_COUNTS: Record<TrainingPlanLength, { progression: number[]; volume: number; project: number }> = {
  short: { progression: [2, 2, 1], volume: 5, project: 1 },
  medium: { progression: [3, 4, 3], volume: 10, project: 2 },
  long: { progression: [4, 6, 5], volume: 15, project: 3 },
};

export async function generateNewTrainingPlan(
  type: TrainingPlanType,
  baseGrade: string,
  length: TrainingPlanLength
): Promise<GeneratedPlan> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const allRoutes = await getBrowserRoutes();
  const baseGradeIndex = (GRADES as readonly string[]).indexOf(baseGrade);

  if (baseGradeIndex === -1) throw new Error("Invalid grade");

  const getGradeIdx = (r: BrowserRoute) => (GRADES as readonly string[]).indexOf(r.grade);
  const shuffle = <T>(array: T[]) => [...array].sort(() => 0.5 - Math.random());

  if (type === "progression") {
    const counts = PLAN_ROUTE_COUNTS[length].progression;

    const warmUpRoutes = allRoutes.filter(r => {
      const idx = getGradeIdx(r);
      return idx >= Math.max(0, baseGradeIndex - 2) && idx < baseGradeIndex;
    });

    const mainSetRoutes = allRoutes.filter(r => {
      const idx = getGradeIdx(r);
      return idx >= Math.max(0, baseGradeIndex - 1) && idx <= baseGradeIndex;
    });

    const challengeRoutes = allRoutes.filter(r => {
      const idx = getGradeIdx(r);
      return idx >= baseGradeIndex && idx <= baseGradeIndex + 2 && !r.user_status;
    });

    return {
      sections: [
        {
          title: "Warm Up",
          description: "Get the blood flowing with these easier climbs.",
          routes: shuffle(warmUpRoutes).slice(0, counts[0]),
        },
        {
          title: "Main Set",
          description: "Your working grade. Focus on technique and execution.",
          routes: shuffle(mainSetRoutes).slice(0, counts[1]),
        },
        {
          title: "Challenge",
          description: "Push your limits. Try something hard you haven't sent yet.",
          routes: shuffle(challengeRoutes).slice(0, counts[2]),
        },
      ],
    };
  }

  if (type === "volume") {
    const count = PLAN_ROUTE_COUNTS[length].volume;
    const volumeRoutes = allRoutes.filter(r => getGradeIdx(r) === baseGradeIndex);

    return {
      sections: [
        {
          title: "Volume Session",
          description: `High volume at ${baseGrade}. Focus on movement quality and endurance.`,
          routes: shuffle(volumeRoutes).slice(0, count),
        },
      ],
    };
  }

  if (type === "project") {
    const count = PLAN_ROUTE_COUNTS[length].project;
    const projectRoutes = allRoutes.filter(r => {
      const idx = getGradeIdx(r);
      return idx >= baseGradeIndex + 1 && idx <= baseGradeIndex + 2 && !r.user_status;
    });

    return {
      sections: [
        {
          title: "Project Session",
          description: "Focus on these hard routes. Work the moves and try to send.",
          routes: shuffle(projectRoutes).slice(0, count),
        },
      ],
    };
  }

  return { sections: [] };
}

export async function saveTrainingPlan(data: {
  name: string;
  type: TrainingPlanType;
  base_grade: string;
  length: TrainingPlanLength;
  routes: { route_id: string; section_name: string | null; order_index: number }[];
}): Promise<{ id: string }> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [plan] = await db.insert(trainingPlans).values({
    user_id: session.user.id,
    name: data.name,
    type: data.type,
    base_grade: data.base_grade,
    length: data.length,
    is_public: false,
  }).returning({ id: trainingPlans.id });

  if (data.routes.length > 0) {
    await db.insert(trainingPlanRoutes).values(
      data.routes.map(r => ({
        plan_id: plan.id,
        route_id: r.route_id,
        section_name: r.section_name,
        order_index: r.order_index,
      }))
    );
  }

  revalidatePath("/train");
  return { id: plan.id };
}

export async function updateTrainingPlan(
  planId: string,
  data: {
    name?: string;
    routes?: { route_id: string; section_name: string | null; order_index: number }[];
  }
): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const plan = await db.query.trainingPlans.findFirst({
    where: eq(trainingPlans.id, planId),
  });

  if (!plan || plan.user_id !== session.user.id) throw new Error("Unauthorized");

  if (data.name) {
    await db.update(trainingPlans)
      .set({ name: data.name, updated_at: new Date() })
      .where(eq(trainingPlans.id, planId));
  }

  if (data.routes) {
    await db.delete(trainingPlanRoutes).where(eq(trainingPlanRoutes.plan_id, planId));

    if (data.routes.length > 0) {
      await db.insert(trainingPlanRoutes).values(
        data.routes.map(r => ({
          plan_id: planId,
          route_id: r.route_id,
          section_name: r.section_name,
          order_index: r.order_index,
        }))
      );
    }
  }

  revalidatePath("/train");
  revalidatePath(`/train/${planId}`);
}

export async function deleteTrainingPlan(planId: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const plan = await db.query.trainingPlans.findFirst({
    where: eq(trainingPlans.id, planId),
  });

  if (!plan || plan.user_id !== session.user.id) throw new Error("Unauthorized");

  await db.delete(trainingPlans).where(eq(trainingPlans.id, planId));
  revalidatePath("/train");
}

export async function getUserTrainingPlans(): Promise<SavedTrainingPlan[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const plans = await db.select().from(trainingPlans)
    .where(eq(trainingPlans.user_id, session.user.id))
    .orderBy(desc(trainingPlans.updated_at));

  const allRoutes = await getBrowserRoutes();
  const routesMap = new Map(allRoutes.map(r => [r.id, r]));

  const plansWithRoutes: SavedTrainingPlan[] = [];

  for (const plan of plans) {
    const planRoutes = await db.select().from(trainingPlanRoutes)
      .where(eq(trainingPlanRoutes.plan_id, plan.id))
      .orderBy(trainingPlanRoutes.order_index);

    plansWithRoutes.push({
      id: plan.id,
      user_id: plan.user_id,
      name: plan.name,
      type: plan.type as TrainingPlanType,
      base_grade: plan.base_grade,
      length: plan.length as TrainingPlanLength,
      is_public: plan.is_public,
      created_at: plan.created_at,
      updated_at: plan.updated_at,
      routes: planRoutes.map(pr => ({
        id: pr.id,
        route_id: pr.route_id,
        section_name: pr.section_name,
        order_index: pr.order_index,
        route: routesMap.get(pr.route_id)!,
      })).filter(pr => pr.route),
    });
  }

  return plansWithRoutes;
}

export async function getCommunityTrainingPlans(): Promise<SavedTrainingPlan[]> {
  const plans = await db.select().from(trainingPlans)
    .where(eq(trainingPlans.is_public, true))
    .orderBy(desc(trainingPlans.created_at));

  const allRoutes = await getBrowserRoutes();
  const routesMap = new Map(allRoutes.map(r => [r.id, r]));

  const userIds = [...new Set(plans.map(p => p.user_id))];
  const usersData = userIds.length > 0
    ? await db.select({ id: users.id, name: users.name }).from(users)
    : [];
  const usersMap = new Map(usersData.map(u => [u.id, u.name]));

  const plansWithRoutes: SavedTrainingPlan[] = [];

  for (const plan of plans) {
    const planRoutes = await db.select().from(trainingPlanRoutes)
      .where(eq(trainingPlanRoutes.plan_id, plan.id))
      .orderBy(trainingPlanRoutes.order_index);

    plansWithRoutes.push({
      id: plan.id,
      user_id: plan.user_id,
      name: plan.name,
      type: plan.type as TrainingPlanType,
      base_grade: plan.base_grade,
      length: plan.length as TrainingPlanLength,
      is_public: plan.is_public,
      created_at: plan.created_at,
      updated_at: plan.updated_at,
      user_name: usersMap.get(plan.user_id) || null,
      routes: planRoutes.map(pr => ({
        id: pr.id,
        route_id: pr.route_id,
        section_name: pr.section_name,
        order_index: pr.order_index,
        route: routesMap.get(pr.route_id)!,
      })).filter(pr => pr.route),
    });
  }

  return plansWithRoutes;
}

export async function togglePlanPublic(planId: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const plan = await db.query.trainingPlans.findFirst({
    where: eq(trainingPlans.id, planId),
  });

  if (!plan || plan.user_id !== session.user.id) throw new Error("Unauthorized");

  await db.update(trainingPlans)
    .set({ is_public: !plan.is_public, updated_at: new Date() })
    .where(eq(trainingPlans.id, planId));

  revalidatePath("/train");
  revalidatePath(`/train/${planId}`);
}

export async function getTrainingPlan(planId: string): Promise<SavedTrainingPlan | null> {
  const session = await auth();

  const plan = await db.query.trainingPlans.findFirst({
    where: eq(trainingPlans.id, planId),
  });

  if (!plan) return null;

  const isOwner = session?.user?.id === plan.user_id;
  if (!plan.is_public && !isOwner) return null;

  const allRoutes = await getBrowserRoutes();
  const routesMap = new Map(allRoutes.map(r => [r.id, r]));

  const planRoutes = await db.select().from(trainingPlanRoutes)
    .where(eq(trainingPlanRoutes.plan_id, plan.id))
    .orderBy(trainingPlanRoutes.order_index);

  const allUsers = await db.select({ id: users.id, name: users.name }).from(users);
  const usersMap = new Map(allUsers.map(u => [u.id, u.name]));

  return {
    id: plan.id,
    user_id: plan.user_id,
    name: plan.name,
    type: plan.type as TrainingPlanType,
    base_grade: plan.base_grade,
    length: plan.length as TrainingPlanLength,
    is_public: plan.is_public,
    created_at: plan.created_at,
    updated_at: plan.updated_at,
    user_name: usersMap.get(plan.user_id) || null,
    routes: planRoutes.map(pr => ({
      id: pr.id,
      route_id: pr.route_id,
      section_name: pr.section_name,
      order_index: pr.order_index,
      route: routesMap.get(pr.route_id)!,
    })).filter(pr => pr.route),
  };
}

export async function copyTrainingPlan(planId: string): Promise<{ id: string }> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const originalPlan = await getTrainingPlan(planId);
  if (!originalPlan) throw new Error("Plan not found");

  const [newPlan] = await db.insert(trainingPlans).values({
    user_id: session.user.id,
    name: `${originalPlan.name} (Copy)`,
    type: originalPlan.type,
    base_grade: originalPlan.base_grade,
    length: originalPlan.length,
    is_public: false,
  }).returning({ id: trainingPlans.id });

  if (originalPlan.routes.length > 0) {
    await db.insert(trainingPlanRoutes).values(
      originalPlan.routes.map(r => ({
        plan_id: newPlan.id,
        route_id: r.route_id,
        section_name: r.section_name,
        order_index: r.order_index,
      }))
    );
  }

  revalidatePath("/train");
  return { id: newPlan.id };
}
