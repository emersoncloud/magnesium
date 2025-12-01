import { google } from "googleapis";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function exploreSpreadsheet() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "13LROXbpx5mnFop2FWkN131TOGyEi6v9LebT5_pbZdGs";

  console.log("=== EXPLORING GOOGLE SPREADSHEET ===\n");

  const spreadsheetMetadata = await sheets.spreadsheets.get({ spreadsheetId });

  console.log("Spreadsheet Title:", spreadsheetMetadata.data.properties?.title);
  console.log("\n=== ALL SHEETS/PAGES ===\n");

  const allSheets = spreadsheetMetadata.data.sheets || [];
  for (const sheet of allSheets) {
    const sheetTitle = sheet.properties?.title;
    const sheetId = sheet.properties?.sheetId;
    const rowCount = sheet.properties?.gridProperties?.rowCount;
    const columnCount = sheet.properties?.gridProperties?.columnCount;

    console.log(`Sheet: "${sheetTitle}"`);
    console.log(`  - ID: ${sheetId}`);
    console.log(`  - Grid: ${rowCount} rows x ${columnCount} columns`);

    const range = `'${sheetTitle}'!A1:H10`;
    try {
      const dataResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      console.log(`  - Sample Data (first 10 rows):`);
      const rows = dataResponse.data.values || [];
      for (let i = 0; i < rows.length; i++) {
        console.log(`    Row ${i + 1}: ${JSON.stringify(rows[i])}`);
      }
    } catch (readError) {
      console.log(`  - Could not read data: ${readError}`);
    }

    console.log("");
  }

  console.log("\n=== CHECKING FOR COMMENTS ===\n");

  try {
    const driveAuth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets.readonly",
        "https://www.googleapis.com/auth/drive.readonly",
      ],
    });

    const drive = google.drive({ version: "v3", auth: driveAuth });

    const commentsResponse = await drive.comments.list({
      fileId: spreadsheetId,
      fields: "*",
    });

    console.log("Drive API Comments:", JSON.stringify(commentsResponse.data, null, 2));
  } catch (driveError) {
    console.log("Drive API comments not accessible:", driveError);
  }

  console.log("\n=== CHECKING CELL NOTES (Alternative to Comments) ===\n");

  for (const sheet of allSheets) {
    const sheetTitle = sheet.properties?.title;

    try {
      const notesResponse = await sheets.spreadsheets.get({
        spreadsheetId,
        ranges: [`'${sheetTitle}'!A1:H50`],
        fields: "sheets.data.rowData.values.note,sheets.properties.title",
      });

      const sheetData = notesResponse.data.sheets?.[0];
      const rowData = sheetData?.data?.[0]?.rowData || [];

      let hasNotes = false;
      for (let rowIndex = 0; rowIndex < rowData.length; rowIndex++) {
        const row = rowData[rowIndex];
        const values = row.values || [];
        for (let colIndex = 0; colIndex < values.length; colIndex++) {
          const cell = values[colIndex];
          if (cell.note) {
            if (!hasNotes) {
              console.log(`Sheet "${sheetTitle}" has notes:`);
              hasNotes = true;
            }
            const colLetter = String.fromCharCode(65 + colIndex);
            console.log(`  Cell ${colLetter}${rowIndex + 1}: "${cell.note}"`);
          }
        }
      }

      if (!hasNotes) {
        console.log(`Sheet "${sheetTitle}": No notes found in A1:H50`);
      }
    } catch (notesError) {
      console.log(`Sheet "${sheetTitle}": Could not check notes -`, notesError);
    }
  }
}

exploreSpreadsheet().catch(console.error);
