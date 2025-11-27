import {
  pgTable,
  uuid,
  text,
  date,
  jsonb,
  timestamp,
  index,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const routes = pgTable("routes", {
  id: uuid("id").primaryKey().defaultRandom(),
  wall_id: text("wall_id").notNull(),
  grade: text("grade").notNull(),
  color: text("color").notNull(),
  setter_name: text("setter_name").notNull(),
  difficulty_label: text("difficulty_label"),
  set_date: date("set_date").notNull(),
  status: text("status").notNull().default("active"),
  attributes: jsonb("attributes").$type<string[]>().default([]),
  setter_notes: text("setter_notes"),
  setter_beta: text("setter_beta"),
  style: text("style"),
  hold_type: text("hold_type"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  removed_at: timestamp("removed_at", { withTimezone: true }),
});

export const activityLogs = pgTable(
  "activity_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: text("user_id").notNull(),
    user_name: text("user_name"),
    user_image: text("user_image"),
    route_id: uuid("route_id")
      .references(() => routes.id)
      .notNull(),
    action_type: text("action_type").notNull(), // "SEND" | "FLASH" | "COMMENT" | "VOTE" | "ATTEMPT"
    content: text("content"),
    metadata: jsonb("metadata")
      .$type<{ is_beta?: boolean; proposed_grade?: string; reason?: string }>()
      .default({}),
    is_public: boolean("is_public").default(true).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      routeIdx: index("activity_logs_route_idx").on(table.route_id),
      userIdx: index("activity_logs_user_idx").on(table.user_id),
      actionTypeIdx: index("activity_logs_action_type_idx").on(table.action_type),
    };
  }
);

export const personalNotes = pgTable("personal_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: text("user_id").notNull(),
  route_id: uuid("route_id")
    .references(() => routes.id)
    .notNull(),
  content: text("content").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  barcode: text("barcode"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const trainingPlans = pgTable(
  "training_plans",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: text("user_id").notNull(),
    name: text("name").notNull(),
    type: text("type").notNull(),
    base_grade: text("base_grade").notNull(),
    length: text("length").notNull(),
    is_public: boolean("is_public").default(false).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      userIdx: index("training_plans_user_idx").on(table.user_id),
      publicIdx: index("training_plans_public_idx").on(table.is_public),
    };
  }
);

export const trainingPlanRoutes = pgTable(
  "training_plan_routes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    plan_id: uuid("plan_id")
      .references(() => trainingPlans.id, { onDelete: "cascade" })
      .notNull(),
    route_id: uuid("route_id")
      .references(() => routes.id)
      .notNull(),
    section_name: text("section_name"),
    order_index: integer("order_index").notNull(),
  },
  (table) => {
    return {
      planIdx: index("training_plan_routes_plan_idx").on(table.plan_id),
    };
  }
);

export const achievements = pgTable(
  "achievements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: text("user_id").notNull(),
    user_name: text("user_name"),
    user_image: text("user_image"),
    achievement_type: text("achievement_type").notNull(),
    achievement_key: text("achievement_key").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    metadata: jsonb("metadata")
      .$type<{ grade?: string; count?: number; streakDays?: number }>()
      .default({}),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      userIdx: index("achievements_user_idx").on(table.user_id),
      keyIdx: index("achievements_key_idx").on(table.achievement_key),
      userKeyIdx: index("achievements_user_key_idx").on(table.user_id, table.achievement_key),
    };
  }
);

export const achievementReactions = pgTable(
  "achievement_reactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    achievement_id: uuid("achievement_id")
      .references(() => achievements.id, { onDelete: "cascade" })
      .notNull(),
    user_id: text("user_id").notNull(),
    user_name: text("user_name"),
    user_image: text("user_image"),
    reaction_type: text("reaction_type").notNull(),
    content: text("content"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      achievementIdx: index("achievement_reactions_achievement_idx").on(table.achievement_id),
      userIdx: index("achievement_reactions_user_idx").on(table.user_id),
    };
  }
);

export const activityReactions = pgTable(
  "activity_reactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    activity_id: uuid("activity_id")
      .references(() => activityLogs.id, { onDelete: "cascade" })
      .notNull(),
    user_id: text("user_id").notNull(),
    user_name: text("user_name"),
    user_image: text("user_image"),
    reaction_type: text("reaction_type").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      activityIdx: index("activity_reactions_activity_idx").on(table.activity_id),
      userIdx: index("activity_reactions_user_idx").on(table.user_id),
    };
  }
);
