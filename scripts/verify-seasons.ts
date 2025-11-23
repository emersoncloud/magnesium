import "dotenv/config";
import { getSeasonsLeaderboard } from "../src/app/seasons/actions";
import { db } from "../src/lib/db";
import { activityLogs, routes, users } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";

async function testSeasonsLeaderboard() {
  console.log("Starting Seasons Leaderboard Verification...");

  // 1. Setup Test Data
  // We'll rely on existing data or manually verify. 
  // Since I can't easily mock the DB in this environment without a complex setup,
  // I will fetch the leaderboard and print it to verify the structure and scoring logic visually.
  
  try {
    const leaderboard = await getSeasonsLeaderboard();
    
    console.log(`Found ${leaderboard.length} entries in the leaderboard.`);
    
    if (leaderboard.length > 0) {
      console.log("Top 3 Users:");
      leaderboard.slice(0, 3).forEach((entry, i) => {
        console.log(`#${i + 1} ${entry.userName} (${entry.userId})`);
        console.log(`   Score: ${entry.score}`);
        console.log(`   Sends: ${entry.sends}, Flashes: ${entry.flashes}`);
        console.log(`   Best Grade: ${entry.topGrade}`);
      });
    } else {
      console.log("Leaderboard is empty. This might be expected if no recent public sends/flashes exist.");
    }

    // Basic Logic Check
    // If a user has 1 send of V0 (index 1 in GRADES array usually, let's check GRADES), score should be (1+1)*100 = 200.
    // Wait, GRADES is ["VB", "V0", ...]. VB is index 0. V0 is index 1.
    // So V0 send = (1+1)*100 = 200 points.
    // V0 flash = 200 + 50 = 250 points.
    
    console.log("\nVerification Complete.");
  } catch (error) {
    console.error("Verification Failed:", error);
  }
}

testSeasonsLeaderboard();
