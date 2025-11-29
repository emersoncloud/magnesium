import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "./db";
import { routes } from "./db/schema";

type RouteForNameGeneration = {
  grade: string;
  color: string;
  style: string | null;
  holdType: string | null;
  wallName: string;
};

export async function generateRouteNames(
  routesToName: RouteForNameGeneration[]
): Promise<string[]> {
  if (routesToName.length === 0) return [];

  const existingRoutes = await db.select({ name: routes.name }).from(routes);
  const existingNames = existingRoutes
    .map((r) => r.name)
    .filter((name): name is string => name !== null);

  const routesList = routesToName
    .map(
      (r, i) =>
        `${i + 1}. ${r.grade} ${r.color} on ${r.wallName} (style: ${r.style || "unknown"}, holds: ${r.holdType || "unknown"})`
    )
    .join("\n");

  const existingNamesSection =
    existingNames.length > 0
      ? `\nALREADY USED NAMES (do not reuse any of these):\n${existingNames.join(", ")}\n`
      : "";

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
${existingNamesSection}
Routes to name:
${routesList}

Return a JSON array with exactly ${routesToName.length} names in the same order.
Return ONLY the JSON array, nothing else.`,
  });

  const cleanedText = text.trim().replace(/```json\n?|\n?```/g, "");
  const generatedNames: string[] = JSON.parse(cleanedText);

  if (generatedNames.length !== routesToName.length) {
    throw new Error(`Expected ${routesToName.length} names, got ${generatedNames.length}`);
  }

  return generatedNames;
}
