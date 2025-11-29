import "dotenv/config";
import { db } from "@/lib/db";
import { activityLogs, personalNotes, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Migration map: Target Email -> List of Old IDs (Email or UUID) to merge FROM
const MIGRATION_MAP: Record<string, string[]> = {
  "kyletrusler@gmail.com": [
    "24479482-43b5-44f9-b8bd-b7bfdf78aa97", // Old UUID
    "kyletrusler@gmail.com", // Current Email ID
    "kyle@rowship.com", // Another email alias? If we want to merge this too.
  ],
  // Add others if needed
};

async function main() {
  console.log("Starting migration to Users table...");

  for (const [targetEmail, oldIds] of Object.entries(MIGRATION_MAP)) {
    console.log(`Processing target: ${targetEmail}`);

    // 1. Ensure User exists in `users` table
    let user = await db.query.users.findFirst({
      where: eq(users.email, targetEmail),
    });

    if (!user) {
      console.log(`- Creating user for ${targetEmail}`);
      const result = await db
        .insert(users)
        .values({
          email: targetEmail,
          name: "Kyle Trusler", // Hardcoded for migration, or fetch from logs?
          image:
            "https://lh3.googleusercontent.com/a/ACg8ocIRTFkK1lyctOZ50Y78iJbRtkcckUo8t-m6i9PyBcHfndnEBlzQog=s96-c",
        })
        .returning();
      user = result[0];
    }

    console.log(`- Target User UUID: ${user.id}`);

    // 2. Migrate Activity Logs
    for (const oldId of oldIds) {
      if (oldId === user.id) continue; // Skip if already same (unlikely)

      console.log(`  - Migrating logs from ${oldId}...`);
      const logs = await db
        .update(activityLogs)
        .set({ user_id: user.id })
        .where(eq(activityLogs.user_id, oldId))
        .returning({ id: activityLogs.id });
      console.log(`    > Updated ${logs.length} logs.`);

      // 3. Migrate Personal Notes
      console.log(`  - Migrating notes from ${oldId}...`);
      const notes = await db
        .update(personalNotes)
        .set({ user_id: user.id })
        .where(eq(personalNotes.user_id, oldId))
        .returning({ id: personalNotes.id });
      console.log(`    > Updated ${notes.length} notes.`);
    }
  }

  console.log("Migration complete.");
}

main()
  .catch(console.error)
  .then(() => process.exit(0));
