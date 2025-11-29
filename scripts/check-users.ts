import "dotenv/config";
import { db } from "@/lib/db";
import { activityLogs, users } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

async function main() {
  const allUsers = await db.select().from(users);
  console.log("Users in `users` table:");
  allUsers.forEach((u) => console.log(`- ${u.email} -> ${u.id}`));

  const logs = await db
    .select({
      userId: activityLogs.user_id,
      userName: activityLogs.user_name,
      count: sql<number>`count(*)`,
    })
    .from(activityLogs)
    .groupBy(activityLogs.user_id, activityLogs.user_name);

  console.log("\nUser IDs found in `activity_logs`:");
  logs.forEach((u) => {
    console.log(`- ID: ${u.userId}, Name: ${u.userName}, Count: ${u.count}`);
  });
}

main()
  .catch(console.error)
  .then(() => process.exit(0));
