import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function testSheet() {
  try {
    console.log("Testing Google Sheet access with Service Account...");

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({
      version: "v4",
      auth,
    });

    const spreadsheetId = "1e_BFxo83f3_gFB9MNPEmwWjgKzeRez1dUf99ZCTmX24";

    console.log("Fetching spreadsheet metadata...");
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const firstSheetTitle = meta.data.sheets?.[0]?.properties?.title;
    console.log(`Found sheet title: "${firstSheetTitle}"`);

    if (!firstSheetTitle) throw new Error("No sheets found");

    const range = `'${firstSheetTitle}'!A2:H`;
    console.log(`Fetching range: ${range}`);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values || [];
    console.log(`Successfully fetched ${rows.length} rows.`);

    if (rows.length > 0) {
      console.log("First row sample:", rows[0]);
    }
  } catch (error) {
    console.error("Error fetching sheet:", error);
  }
}

testSheet();
