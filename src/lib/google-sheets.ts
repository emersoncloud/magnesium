import { google } from "googleapis";

export async function getSheetData() {
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
  
  const spreadsheetId = "13LROXbpx5mnFop2FWkN131TOGyEi6v9LebT5_pbZdGs";

  // 1. Get the first sheet's name dynamically
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const firstSheetTitle = meta.data.sheets?.[0]?.properties?.title;

  if (!firstSheetTitle) {
    throw new Error("No sheets found in spreadsheet");
  }

  // 2. Fetch data from the first tab
  // Range: A2:H (ZONE, ROUTE, COLOR, GRADE, STYLE, HOLD TYPE, SETTER, DATE)
  // We use single quotes around the title in case it has spaces
  const range = `'${firstSheetTitle}'!A2:H`; 
  
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  return response.data.values || [];
}
