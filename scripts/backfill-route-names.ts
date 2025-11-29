import "dotenv/config";
import { db } from "../src/lib/db";
import { routes } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";
import { WALLS } from "../src/lib/constants/walls";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

const DRY_RUN = process.argv.includes("--dry-run");

async function main() {
  console.log(`Mode: ${DRY_RUN ? "DRY RUN (no changes)" : "LIVE (will update DB)"}\n`);

  const activeRoutes = await db.select().from(routes).where(eq(routes.status, "active"));

  const routesMissingNames = activeRoutes.filter((r) => !r.name);

  console.log(`Total active routes: ${activeRoutes.length}`);
  console.log(`Routes missing names: ${routesMissingNames.length}\n`);

  if (routesMissingNames.length === 0) {
    console.log("All routes already have names!");
    return;
  }

  const routesForPrompt = routesMissingNames.map((route) => {
    const wall = WALLS.find((w) => w.id === route.wall_id);
    return {
      id: route.id,
      grade: route.grade,
      color: route.color,
      style: route.style || "unknown",
      holdType: route.hold_type || "unknown",
      wall: wall?.name || route.wall_id,
    };
  });

  const routesList = routesForPrompt
    .map(
      (r, i) =>
        `${i + 1}. ${r.grade} ${r.color} on ${r.wall} (style: ${r.style}, holds: ${r.holdType})`
    )
    .join("\n");

  console.log("Generating names for all routes in a single request...\n");

  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: `Generate creative climbing route names (1-3 words each) for these boulder problems.

Real boulder problem names have variety - they can be:
- Pop culture references ("Midnight Lightning", "Return of the Jedi")
- Movement descriptions ("The Slap", "Deadpoint")
- Absurd/funny ("Toilet Bowl", "Honey Badger")
- Evocative imagery ("Dreamcatcher", "Sleepwalker")
- Puns or wordplay
- Named after feelings or experiences

IMPORTANT: Avoid alliteration. Don't make every name follow a pattern. Make each name unique and interesting. The color can subtly inspire the name but shouldn't be obvious.

Routes:
${routesList}

Return a JSON array with exactly ${routesMissingNames.length} names in the same order.
Return ONLY the JSON array, nothing else.`,
  });

  let generatedNames: string[];
  try {
    const cleanedText = text.trim().replace(/```json\n?|\n?```/g, "");
    generatedNames = JSON.parse(cleanedText);
  } catch (parseError) {
    console.error("Failed to parse LLM response:", text);
    throw new Error("Invalid JSON response from LLM");
  }

  if (generatedNames.length !== routesMissingNames.length) {
    throw new Error(`Expected ${routesMissingNames.length} names, got ${generatedNames.length}`);
  }

  console.log("Generated names:");
  console.log("=".repeat(80));

  for (let i = 0; i < routesMissingNames.length; i++) {
    const route = routesMissingNames[i];
    const name = generatedNames[i];
    const wall = WALLS.find((w) => w.id === route.wall_id)?.name || route.wall_id;

    console.log(`${route.grade} ${route.color} on ${wall} → "${name}"`);

    if (!DRY_RUN) {
      await db.update(routes).set({ name }).where(eq(routes.id, route.id));
    }
  }

  console.log("=".repeat(80));
  console.log(`\n${DRY_RUN ? "Dry run complete!" : "All names saved to database!"}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
