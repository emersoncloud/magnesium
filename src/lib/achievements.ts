import { db } from "@/lib/db";
import { activityLogs, achievements } from "@/lib/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";

export type AchievementDefinition = {
  key: string;
  type: string;
  title: string;
  description: string;
  check: (stats: UserStats) => boolean;
  metadata?: (stats: UserStats) => Record<string, unknown>;
};

export type UserStats = {
  totalSends: number;
  totalFlashes: number;
  highestGrade: string | null;
  gradesClimbed: string[];
  currentStreak: number;
  monthlyCount: number;
};

const GRADE_ORDER = [
  "VB",
  "V0",
  "V1",
  "V2",
  "V3",
  "V4",
  "V5",
  "V6",
  "V7",
  "V8",
  "V9",
  "V10",
  "V11",
  "V12",
];

function gradeToNumber(grade: string): number {
  const index = GRADE_ORDER.indexOf(grade);
  return index >= 0 ? index : -1;
}

function isHigherGrade(newGrade: string, currentGrade: string | null): boolean {
  if (!currentGrade) return true;
  return gradeToNumber(newGrade) > gradeToNumber(currentGrade);
}

const SEND_MILESTONES: AchievementDefinition[] = [
  {
    key: "sends_10",
    type: "MILESTONE_SENDS",
    title: "10 Sends Club",
    description: "Logged your first 10 sends!",
    check: (stats) => stats.totalSends >= 10,
    metadata: (stats) => ({ count: stats.totalSends }),
  },
  {
    key: "sends_25",
    type: "MILESTONE_SENDS",
    title: "Quarter Century",
    description: "25 sends and counting!",
    check: (stats) => stats.totalSends >= 25,
    metadata: (stats) => ({ count: stats.totalSends }),
  },
  {
    key: "sends_50",
    type: "MILESTONE_SENDS",
    title: "Half Century",
    description: "50 sends completed!",
    check: (stats) => stats.totalSends >= 50,
    metadata: (stats) => ({ count: stats.totalSends }),
  },
  {
    key: "sends_100",
    type: "MILESTONE_SENDS",
    title: "Century Club",
    description: "100 sends - you're a crusher!",
    check: (stats) => stats.totalSends >= 100,
    metadata: (stats) => ({ count: stats.totalSends }),
  },
  {
    key: "sends_250",
    type: "MILESTONE_SENDS",
    title: "Crusher",
    description: "250 sends under your belt!",
    check: (stats) => stats.totalSends >= 250,
    metadata: (stats) => ({ count: stats.totalSends }),
  },
  {
    key: "sends_500",
    type: "MILESTONE_SENDS",
    title: "Legend",
    description: "500 sends - absolute legend status!",
    check: (stats) => stats.totalSends >= 500,
    metadata: (stats) => ({ count: stats.totalSends }),
  },
];

const FLASH_MILESTONES: AchievementDefinition[] = [
  {
    key: "flash_10",
    type: "MILESTONE_FLASH",
    title: "Flash Master",
    description: "10 flashes - first try finesse!",
    check: (stats) => stats.totalFlashes >= 10,
    metadata: (stats) => ({ count: stats.totalFlashes }),
  },
  {
    key: "flash_25",
    type: "MILESTONE_FLASH",
    title: "Lightning Fast",
    description: "25 flashes - you make it look easy!",
    check: (stats) => stats.totalFlashes >= 25,
    metadata: (stats) => ({ count: stats.totalFlashes }),
  },
];

const STREAK_ACHIEVEMENTS: AchievementDefinition[] = [
  {
    key: "streak_7",
    type: "STREAK",
    title: "Week Warrior",
    description: "Climbed 7 days in a row!",
    check: (stats) => stats.currentStreak >= 7,
    metadata: (stats) => ({ streakDays: stats.currentStreak }),
  },
  {
    key: "streak_30",
    type: "STREAK",
    title: "Monthly Crusher",
    description: "30 days straight - unstoppable!",
    check: (stats) => stats.currentStreak >= 30,
    metadata: (stats) => ({ streakDays: stats.currentStreak }),
  },
];

function createGradeAchievements(): AchievementDefinition[] {
  return GRADE_ORDER.slice(3).map((grade) => ({
    key: `first_${grade.toLowerCase()}`,
    type: "GRADE_FIRST",
    title: `First ${grade}!`,
    description: `Sent your first ${grade} boulder!`,
    check: (stats) => stats.gradesClimbed.includes(grade),
    metadata: () => ({ grade }),
  }));
}

const ALL_ACHIEVEMENTS: AchievementDefinition[] = [
  ...SEND_MILESTONES,
  ...FLASH_MILESTONES,
  ...STREAK_ACHIEVEMENTS,
  ...createGradeAchievements(),
];

export async function getUserStats(userId: string): Promise<UserStats> {
  const sendsResult = await db
    .select({
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(activityLogs)
    .where(and(eq(activityLogs.user_id, userId), eq(activityLogs.action_type, "SEND")));

  const flashesResult = await db
    .select({
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(activityLogs)
    .where(and(eq(activityLogs.user_id, userId), eq(activityLogs.action_type, "FLASH")));

  const gradesResult = await db
    .select({
      grade: sql<string>`DISTINCT r.grade`,
    })
    .from(activityLogs)
    .innerJoin(sql`routes r`, sql`${activityLogs.route_id} = r.id`)
    .where(
      and(eq(activityLogs.user_id, userId), sql`${activityLogs.action_type} IN ('SEND', 'FLASH')`)
    );

  const highestGradeResult = await db
    .select({
      grade: sql<string>`r.grade`,
    })
    .from(activityLogs)
    .innerJoin(sql`routes r`, sql`${activityLogs.route_id} = r.id`)
    .where(
      and(eq(activityLogs.user_id, userId), sql`${activityLogs.action_type} IN ('SEND', 'FLASH')`)
    )
    .orderBy(
      desc(sql`CASE r.grade
      WHEN 'V12' THEN 12 WHEN 'V11' THEN 11 WHEN 'V10' THEN 10
      WHEN 'V9' THEN 9 WHEN 'V8' THEN 8 WHEN 'V7' THEN 7
      WHEN 'V6' THEN 6 WHEN 'V5' THEN 5 WHEN 'V4' THEN 4
      WHEN 'V3' THEN 3 WHEN 'V2' THEN 2 WHEN 'V1' THEN 1
      WHEN 'V0' THEN 0 WHEN 'VB' THEN -1 ELSE -2 END`)
    )
    .limit(1);

  const streakResult = await calculateStreak(userId);

  const monthlyResult = await db
    .select({
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(activityLogs)
    .where(
      and(
        eq(activityLogs.user_id, userId),
        sql`${activityLogs.action_type} IN ('SEND', 'FLASH')`,
        sql`${activityLogs.created_at} >= date_trunc('month', CURRENT_DATE)`
      )
    );

  return {
    totalSends: (sendsResult[0]?.count || 0) + (flashesResult[0]?.count || 0),
    totalFlashes: flashesResult[0]?.count || 0,
    highestGrade: highestGradeResult[0]?.grade || null,
    gradesClimbed: gradesResult.map((r) => r.grade).filter(Boolean),
    currentStreak: streakResult,
    monthlyCount: monthlyResult[0]?.count || 0,
  };
}

async function calculateStreak(userId: string): Promise<number> {
  const daysResult = await db
    .select({
      day: sql<string>`DATE(${activityLogs.created_at})`,
    })
    .from(activityLogs)
    .where(
      and(eq(activityLogs.user_id, userId), sql`${activityLogs.action_type} IN ('SEND', 'FLASH')`)
    )
    .groupBy(sql`DATE(${activityLogs.created_at})`)
    .orderBy(desc(sql`DATE(${activityLogs.created_at})`));

  if (daysResult.length === 0) return 0;

  const days = daysResult.map((r) => new Date(r.day));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const mostRecentDay = days[0];
  mostRecentDay.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((today.getTime() - mostRecentDay.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff > 1) return 0;

  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const currentDay = days[i - 1];
    const prevDay = days[i];
    currentDay.setHours(0, 0, 0, 0);
    prevDay.setHours(0, 0, 0, 0);

    const diff = Math.floor((currentDay.getTime() - prevDay.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export async function getUserAchievementKeys(userId: string): Promise<string[]> {
  const existingAchievements = await db
    .select({
      achievement_key: achievements.achievement_key,
    })
    .from(achievements)
    .where(eq(achievements.user_id, userId));

  return existingAchievements.map((a) => a.achievement_key);
}

export async function checkAndAwardAchievements(
  userId: string,
  userName: string | null,
  userImage: string | null
): Promise<{ newAchievements: (typeof achievements.$inferSelect)[] }> {
  const stats = await getUserStats(userId);
  const existingKeys = await getUserAchievementKeys(userId);

  const newAchievements: (typeof achievements.$inferSelect)[] = [];

  for (const definition of ALL_ACHIEVEMENTS) {
    if (existingKeys.includes(definition.key)) continue;

    if (definition.check(stats)) {
      const metadata = definition.metadata ? definition.metadata(stats) : {};

      const [inserted] = await db
        .insert(achievements)
        .values({
          user_id: userId,
          user_name: userName,
          user_image: userImage,
          achievement_type: definition.type,
          achievement_key: definition.key,
          title: definition.title,
          description: definition.description,
          metadata,
        })
        .returning();

      if (inserted) {
        newAchievements.push(inserted);
      }
    }
  }

  return { newAchievements };
}

export async function getAchievementById(achievementId: string) {
  const result = await db
    .select()
    .from(achievements)
    .where(eq(achievements.id, achievementId))
    .limit(1);
  return result[0] || null;
}

export type AchievementFeedItem = {
  id: string;
  user_id: string;
  user_name: string | null;
  user_image: string | null;
  action_type: "ACHIEVEMENT";
  content: string | null;
  created_at: Date | null;
  route_grade: null;
  route_color: null;
  route_label: null;
  route_id: null;
  wall_id: null;
  setter_name: null;
  set_date: null;
  achievement_title: string;
  achievement_description: string | null;
  achievement_type: string;
  achievement_key: string;
  achievement_metadata: Record<string, unknown> | null;
};

export async function backfillAllAchievements(): Promise<{
  processedUsers: number;
  totalAchievements: number;
}> {
  const uniqueUsers = await db
    .selectDistinct({
      user_id: activityLogs.user_id,
      user_name: activityLogs.user_name,
      user_image: activityLogs.user_image,
    })
    .from(activityLogs)
    .where(sql`${activityLogs.user_id} IS NOT NULL`);

  let totalAchievements = 0;
  let processedUsers = 0;

  for (const user of uniqueUsers) {
    if (!user.user_id) continue;

    const result = await checkAndAwardAchievements(user.user_id, user.user_name, user.user_image);

    totalAchievements += result.newAchievements.length;
    processedUsers++;
  }

  return {
    processedUsers,
    totalAchievements,
  };
}

export async function getPaginatedAchievements({
  cursor,
  limit = 20,
}: {
  cursor?: string;
  limit?: number;
} = {}): Promise<{
  items: AchievementFeedItem[];
  nextCursor: string | null;
  hasMore: boolean;
}> {
  const conditions = [];

  if (cursor) {
    const [cursorTimestamp, cursorId] = cursor.split("_");
    const cursorDate = new Date(cursorTimestamp);
    conditions.push(
      sql`(${achievements.created_at} < ${cursorDate} OR (${achievements.created_at} = ${cursorDate} AND ${achievements.id} < ${cursorId}))`
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const items = await db
    .select({
      id: achievements.id,
      user_id: achievements.user_id,
      user_name: achievements.user_name,
      user_image: achievements.user_image,
      created_at: achievements.created_at,
      achievement_title: achievements.title,
      achievement_description: achievements.description,
      achievement_type: achievements.achievement_type,
      achievement_key: achievements.achievement_key,
      achievement_metadata: achievements.metadata,
    })
    .from(achievements)
    .where(whereClause)
    .orderBy(desc(achievements.created_at), desc(achievements.id))
    .limit(limit + 1);

  const hasMore = items.length > limit;
  const resultItems = hasMore ? items.slice(0, limit) : items;

  const lastItem = resultItems[resultItems.length - 1];
  const nextCursor =
    hasMore && lastItem?.created_at ? `${lastItem.created_at.toISOString()}_${lastItem.id}` : null;

  const feedItems: AchievementFeedItem[] = resultItems.map((item) => ({
    id: item.id,
    user_id: item.user_id,
    user_name: item.user_name,
    user_image: item.user_image,
    action_type: "ACHIEVEMENT" as const,
    content: item.achievement_title,
    created_at: item.created_at,
    route_grade: null,
    route_color: null,
    route_label: null,
    route_id: null,
    wall_id: null,
    setter_name: null,
    set_date: null,
    achievement_title: item.achievement_title,
    achievement_description: item.achievement_description,
    achievement_type: item.achievement_type,
    achievement_key: item.achievement_key,
    achievement_metadata: item.achievement_metadata,
  }));

  return {
    items: feedItems,
    nextCursor,
    hasMore,
  };
}
