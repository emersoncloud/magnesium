import "server-only";
import { google, sheets_v4 } from "googleapis";
import { WALLS } from "@/lib/constants/walls";

const SPREADSHEET_ID = "13LROXbpx5mnFop2FWkN131TOGyEi6v9LebT5_pbZdGs";

function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  return google.sheets({ version: "v4", auth });
}

export async function getSheetData() {
  const sheets = getSheetsClient();

  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const firstSheetTitle = meta.data.sheets?.[0]?.properties?.title;

  if (!firstSheetTitle) {
    throw new Error("No sheets found in spreadsheet");
  }

  const range = `'${firstSheetTitle}'!A2:H`;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range,
  });

  return response.data.values || [];
}

export type UpcomingRoute = {
  wall_id: string;
  grade: string;
  color: string;
  difficulty_label: string | null;
  setter_comment: string | null;
  set_date: string; // YYYY-MM-DD format
};

export async function getUpcomingRoutesData(): Promise<UpcomingRoute[]> {
  const sheets = getSheetsClient();

  const zoneSheetRanges = WALLS.map((_, index) => `'Zone ${index + 1}'!A2:I50`);

  const zoneDataResponses = await Promise.all(
    zoneSheetRanges.map((range) =>
      sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range,
      })
    )
  );

  const upcomingRoutes: UpcomingRoute[] = [];

  const todayInEST = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
  todayInEST.setHours(0, 0, 0, 0);

  for (let zoneIndex = 0; zoneIndex < zoneDataResponses.length; zoneIndex++) {
    const response = zoneDataResponses[zoneIndex];
    const rows = response.data.values || [];
    const wall = WALLS[zoneIndex];

    for (const row of rows) {
      const difficultyLabel = row[0] || null;
      const color = row[1];
      const grade = row[2];
      const dateStr = row[7];
      const notes = row[8] || null;

      if (!color || !grade) continue;

      if (!dateStr) continue;

      const parsedDate = new Date(dateStr);
      if (isNaN(parsedDate.getTime())) continue;

      const currentYear = new Date().getFullYear();
      parsedDate.setFullYear(currentYear);

      const routeDateIsInFuture = parsedDate.getTime() > todayInEST.getTime();
      if (!routeDateIsInFuture) continue;

      upcomingRoutes.push({
        wall_id: wall.id,
        grade,
        color,
        difficulty_label: difficultyLabel,
        setter_comment: notes,
        set_date: parsedDate.toISOString().split("T")[0], // YYYY-MM-DD
      });
    }
  }

  return upcomingRoutes;
}
