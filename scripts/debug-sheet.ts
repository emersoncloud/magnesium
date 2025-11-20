import { getSheetData } from "../src/lib/google-sheets";
import { WALLS } from "../src/lib/constants/walls";
import * as dotenv from "dotenv";

dotenv.config();

async function debug() {
  try {
    console.log("Fetching sheet data...");
    const data = await getSheetData();
    console.log("Sheet Data Keys (Tabs):", Object.keys(data));
    
    console.log("\n--- WALLS Constants ---");
    WALLS.forEach(w => console.log(`"${w.name}" (ID: ${w.id})`));

    console.log("\n--- Matching Analysis ---");
    for (const tab of Object.keys(data)) {
      const match = WALLS.find(w => w.name.toLowerCase() === tab.toLowerCase());
      if (match) {
        console.log(`✅ Tab "${tab}" matches Wall "${match.name}"`);
      } else {
        console.log(`❌ Tab "${tab}" does NOT match any Wall`);
      }
      
      // Print first row to check headers
      if (data[tab].length > 0) {
        console.log(`   First row of "${tab}":`, data[tab][0]);
      } else {
        console.log(`   "${tab}" is empty.`);
      }
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

debug();
