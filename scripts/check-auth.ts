import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function checkServiceAccount() {
  try {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    console.log("\n=== Service Account Check ===");
    console.log("Service Account Email:", email);
    console.log("=============================\n");

    if (!email) {
      console.error("ERROR: GOOGLE_SERVICE_ACCOUNT_EMAIL is not set in .env");
      return;
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: email,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // The ID from src/lib/google-sheets.ts
    const spreadsheetId = "13LROXbpx5mnFop2FWkN131TOGyEi6v9LebT5_pbZdGs";

    console.log(`Attempting to access spreadsheet: ${spreadsheetId}`);

    try {
      const meta = await sheets.spreadsheets.get({ spreadsheetId });
      console.log("SUCCESS: Spreadsheet is accessible.");
      console.log("Title:", meta.data.properties?.title);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("FAILURE: Could not access spreadsheet.");
      console.error("Error Message:", error.message);
      console.log("\nACTION REQUIRED: Share the spreadsheet with the email above.");
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

checkServiceAccount();
