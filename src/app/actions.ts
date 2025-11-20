"use server";

import { db } from "@/lib/db";
import { routes } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function getRoutes() {
  return await db.select().from(routes).orderBy(desc(routes.created_at));
}

export async function createRoute(data: typeof routes.$inferInsert) {
  await db.insert(routes).values(data);
}
