import { pgTable, uuid, text, date, jsonb, timestamp } from "drizzle-orm/pg-core";

export const routes = pgTable("routes", {
  id: uuid("id").primaryKey().defaultRandom(),
  wall_id: text("wall_id").notNull(),
  grade: text("grade").notNull(),
  color: text("color").notNull(),
  setter_name: text("setter_name").notNull(),
  set_date: date("set_date").notNull(),
  status: text("status").notNull().default("active"),
  attributes: jsonb("attributes").$type<string[]>().default([]),
  created_at: timestamp("created_at").defaultNow(),
});

export const activityLogs = pgTable("activity_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: text("user_id").notNull(),
  user_name: text("user_name"),
  user_image: text("user_image"),
  route_id: uuid("route_id").references(() => routes.id).notNull(),
  action_type: text("action_type").notNull(), // "SEND" | "FLASH" | "COMMENT" | "VOTE"
  content: text("content"),
  created_at: timestamp("created_at").defaultNow(),
});
