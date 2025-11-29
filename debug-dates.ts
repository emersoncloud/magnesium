import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { desc } from "drizzle-orm";
import * as schema from "./src/lib/db/schema";

const db = drizzle(sql, { schema });

async function debugDates() {
  console.log("=== Date Debugging ===\n");
  console.log("Current time:", new Date().toISOString());
  console.log("Local date:", new Date().toLocaleDateString());
  console.log("Timezone offset (minutes):", new Date().getTimezoneOffset());
  console.log("");

  const recentRoutes = await db
    .select({
      id: schema.routes.id,
      wall_id: schema.routes.wall_id,
      grade: schema.routes.grade,
      set_date: schema.routes.set_date,
      created_at: schema.routes.created_at,
    })
    .from(schema.routes)
    .orderBy(desc(schema.routes.set_date))
    .limit(10);

  console.log("=== Recent Routes from DB ===\n");

  for (const route of recentRoutes) {
    console.log(`Route: ${route.grade} on ${route.wall_id}`);
    console.log(`  Raw set_date from DB: "${route.set_date}" (type: ${typeof route.set_date})`);

    if (route.set_date) {
      const dateObj = new Date(route.set_date);
      console.log(`  As Date object: ${dateObj.toISOString()}`);
      console.log(`  toLocaleDateString(): ${dateObj.toLocaleDateString()}`);
      console.log(`  toDateString(): ${dateObj.toDateString()}`);

      const dateWithNoon = new Date(route.set_date + "T12:00:00");
      console.log(`  With noon time: ${dateWithNoon.toLocaleDateString()}`);
    }
    console.log(`  created_at: ${route.created_at}`);
    console.log("");
  }

  await sql.end();
}

debugDates().catch(console.error);
