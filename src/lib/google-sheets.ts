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
};

export async function getUpcomingRoutesData(): Promise<UpcomingRoute[]> {
  const sheets = getSheetsClient();

  const drawSheetRowsForFirstFourSets = "'Draw Sheet'!A1:L10";
  const drawSheetRowsForSecondFourSets = "'Draw Sheet'!A12:L21";

  const [firstBatchResponse, secondBatchResponse, notesResponse] = await Promise.all([
    sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: drawSheetRowsForFirstFourSets,
    }),
    sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: drawSheetRowsForSecondFourSets,
    }),
    sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
      ranges: ["'Draw Sheet'!A1:L21"],
      fields: "sheets.data.rowData.values(note,formattedValue)",
    }),
  ]);

  const notesMap = new Map<string, string>();
  const sheetData = notesResponse.data.sheets?.[0];
  const rowData = sheetData?.data?.[0]?.rowData || [];
  for (let rowIndex = 0; rowIndex < rowData.length; rowIndex++) {
    const row = rowData[rowIndex];
    const values = row.values || [];
    for (let colIndex = 0; colIndex < values.length; colIndex++) {
      const cell = values[colIndex];
      if (cell.note) {
        const cellKey = `${rowIndex}:${colIndex}`;
        notesMap.set(cellKey, cell.note);
      }
    }
  }

  const upcomingRoutes: UpcomingRoute[] = [];

  const setsConfigForFirstBatch = [
    { setNumber: 1, startCol: 0 },
    { setNumber: 2, startCol: 3 },
    { setNumber: 3, startCol: 6 },
    { setNumber: 4, startCol: 9 },
  ];

  const setsConfigForSecondBatch = [
    { setNumber: 5, startCol: 0 },
    { setNumber: 6, startCol: 3 },
    { setNumber: 7, startCol: 6 },
    { setNumber: 8, startCol: 9 },
  ];

  function parseSetRoutes(
    rows: string[][] | null | undefined,
    setsConfig: { setNumber: number; startCol: number }[],
    rowOffset: number
  ) {
    if (!rows) return;

    for (const { setNumber, startCol } of setsConfig) {
      const zoneIndex = setNumber - 1;
      if (zoneIndex >= WALLS.length) continue;

      const wall = WALLS[zoneIndex];

      for (let rowIdx = 2; rowIdx < rows.length; rowIdx++) {
        const row = rows[rowIdx];
        if (!row) continue;

        const difficultyLabel = row[startCol] || null;
        const color = row[startCol + 1];
        const grade = row[startCol + 2];

        if (!color || !grade) continue;

        const actualRowInSheet = rowOffset + rowIdx;
        const gradeColIndex = startCol + 2;
        const noteKey = `${actualRowInSheet}:${gradeColIndex}`;
        const setterComment = notesMap.get(noteKey) || null;

        upcomingRoutes.push({
          wall_id: wall.id,
          grade,
          color,
          difficulty_label: difficultyLabel,
          setter_comment: setterComment,
        });
      }
    }
  }

  parseSetRoutes(firstBatchResponse.data.values, setsConfigForFirstBatch, 0);
  parseSetRoutes(secondBatchResponse.data.values, setsConfigForSecondBatch, 11);

  return upcomingRoutes;
}
