import { google } from "googleapis";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function exploreUpcomingRoutes() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "13LROXbpx5mnFop2FWkN131TOGyEi6v9LebT5_pbZdGs";

  console.log("=== EXPLORING DRAW SHEET (UPCOMING ROUTES) ===\n");

  const drawSheetFullRange = "'Draw Sheet'!A1:Z20";
  const drawSheetData = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: drawSheetFullRange,
  });

  console.log("Draw Sheet Full Data (A1:Z20):");
  const drawRows = drawSheetData.data.values || [];
  for (let i = 0; i < drawRows.length; i++) {
    console.log(`Row ${i + 1}: ${JSON.stringify(drawRows[i])}`);
  }

  console.log("\n=== EXPLORING NEW ZONE LAYOUTS ===\n");

  const newZoneLayoutsRange = "'New Zone Layouts'!A1:Z20";
  const newZoneLayoutsData = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: newZoneLayoutsRange,
  });

  console.log("New Zone Layouts Full Data (A1:Z20):");
  const newZoneRows = newZoneLayoutsData.data.values || [];
  for (let i = 0; i < newZoneRows.length; i++) {
    console.log(`Row ${i + 1}: ${JSON.stringify(newZoneRows[i])}`);
  }

  console.log("\n=== CHECKING FOR NOTES ON DRAW SHEET ===\n");

  const notesResponse = await sheets.spreadsheets.get({
    spreadsheetId,
    ranges: ["'Draw Sheet'!A1:Z20"],
    fields: "sheets.data.rowData.values(note,formattedValue)",
  });

  const sheetData = notesResponse.data.sheets?.[0];
  const rowData = sheetData?.data?.[0]?.rowData || [];

  for (let rowIndex = 0; rowIndex < rowData.length; rowIndex++) {
    const row = rowData[rowIndex];
    const values = row.values || [];
    for (let colIndex = 0; colIndex < values.length; colIndex++) {
      const cell = values[colIndex];
      if (cell.note) {
        const colLetter = String.fromCharCode(65 + colIndex);
        console.log(
          `Cell ${colLetter}${rowIndex + 1} (value: "${cell.formattedValue}"): Note = "${cell.note}"`
        );
      }
    }
  }
  console.log("(Finished checking notes)");

  console.log("\n=== CHECKING FOR NOTES ON NEW ZONE LAYOUTS ===\n");

  const newZoneNotesResponse = await sheets.spreadsheets.get({
    spreadsheetId,
    ranges: ["'New Zone Layouts'!A1:Z20"],
    fields: "sheets.data.rowData.values(note,formattedValue)",
  });

  const newZoneSheetData = newZoneNotesResponse.data.sheets?.[0];
  const newZoneRowData = newZoneSheetData?.data?.[0]?.rowData || [];

  for (let rowIndex = 0; rowIndex < newZoneRowData.length; rowIndex++) {
    const row = newZoneRowData[rowIndex];
    const values = row.values || [];
    for (let colIndex = 0; colIndex < values.length; colIndex++) {
      const cell = values[colIndex];
      if (cell.note) {
        const colLetter = String.fromCharCode(65 + colIndex);
        console.log(
          `Cell ${colLetter}${rowIndex + 1} (value: "${cell.formattedValue}"): Note = "${cell.note}"`
        );
      }
    }
  }
  console.log("(Finished checking notes)");

  console.log("\n=== SUMMARY ===\n");
  console.log("Draw Sheet structure:");
  console.log("- Row 1: Set headers (Set 1, Set 2, Set 3, ...)");
  console.log("- Row 2: Column headers (ROUTE, COLOR, GRADE for each set)");
  console.log("- Rows 3+: Route data");
  console.log("- Each set occupies 3 columns (could have more like STYLE, HOLD TYPE, SETTER)");
}

exploreUpcomingRoutes().catch(console.error);
