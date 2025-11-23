"use server";

import { db } from "@/lib/db";
import { activityLogs, routes, users } from "@/lib/db/schema";
import { and, desc, eq, gte, lte, sql, inArray } from "drizzle-orm";
import { GRADES } from "@/lib/constants/walls";

export type SeasonEntry = {
  userId: string;
  userName: string | null;
  userImage: string | null;
  score: number;
  sends: number;
  flashes: number;
  topGrade: string | null;
};

export async function getSeasonsLeaderboard(
  startDate?: Date,
  endDate?: Date
): Promise<SeasonEntry[]> {
  // Default to last 30 days if not provided
  const end = endDate || new Date();
  const start = startDate || new Date(new Date().setDate(end.getDate() - 30));

  // Fetch all relevant activities within the window
  // We only care about SEND and FLASH
  const activities = await db
    .select({
      userId: activityLogs.user_id,
      userName: activityLogs.user_name,
      userImage: activityLogs.user_image,
      actionType: activityLogs.action_type,
      routeId: activityLogs.route_id,
      routeGrade: routes.grade,
    })
    .from(activityLogs)
    .innerJoin(routes, eq(activityLogs.route_id, routes.id))
    .where(
      and(
        inArray(activityLogs.action_type, ["SEND", "FLASH"]),
        eq(activityLogs.is_public, true),
        gte(activityLogs.created_at, start),
        lte(activityLogs.created_at, end)
      )
    );

  // Process activities to calculate scores
  // Map<UserId, { score, sends, flashes, bestGradeIndex, ... }>
  const userStats = new Map<
    string,
    {
      userName: string | null;
      userImage: string | null;
      routes: Map<string, number>; // RouteId -> Points
      sends: number;
      flashes: number;
      bestGradeIndex: number;
    }
  >();

  for (const act of activities) {
    if (!act.userId) continue;

    if (!userStats.has(act.userId)) {
      userStats.set(act.userId, {
        userName: act.userName,
        userImage: act.userImage,
        routes: new Map(),
        sends: 0,
        flashes: 0,
        bestGradeIndex: -1,
      });
    }

    const stats = userStats.get(act.userId)!;
    const gradeIndex = GRADES.indexOf(act.routeGrade as any);
    
    // Skip if grade is unknown
    if (gradeIndex === -1) continue;

    // Calculate points for this specific action
    // Base: (Index + 1) * 100
    // Flash Bonus: +50
    const basePoints = (gradeIndex + 1) * 100;
    const points = act.actionType === "FLASH" ? basePoints + 50 : basePoints;

    // Update stats
    if (act.actionType === "FLASH") stats.flashes++;
    else if (act.actionType === "SEND") stats.sends++;

    if (gradeIndex > stats.bestGradeIndex) {
      stats.bestGradeIndex = gradeIndex;
    }

    // Update best score for this route
    const currentRouteScore = stats.routes.get(act.routeId) || 0;
    if (points > currentRouteScore) {
      stats.routes.set(act.routeId, points);
    }
  }

  // Convert to array and sort
  const leaderboard: SeasonEntry[] = Array.from(userStats.entries()).map(
    ([userId, stats]) => {
      let totalScore = 0;
      for (const score of stats.routes.values()) {
        totalScore += score;
      }

      return {
        userId,
        userName: stats.userName,
        userImage: stats.userImage,
        score: totalScore,
        sends: stats.sends,
        flashes: stats.flashes,
        topGrade: stats.bestGradeIndex >= 0 ? GRADES[stats.bestGradeIndex] : null,
      };
    }
  );

  // Sort by score descending
  return leaderboard.sort((a, b) => b.score - a.score);
}
