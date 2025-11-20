import { google } from "googleapis";

export async function getSheetData() {
  const sheets = google.sheets({
    version: "v4",
    auth: process.env.GOOGLE_API_KEY,
  });
  
  const spreadsheetId = "18gQW_ybsAElWNUwUXrp-o0Hsy2Jgnnp8dyS7JLBUrxs";

  // 1. Get all sheet names (tabs)
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const tabs = meta.data.sheets?.map((s) => s.properties?.title).filter(Boolean) as string[] || [];

  const data: Record<string, any[]> = {};

  // 2. Fetch data for each tab
  for (const tab of tabs) {
    const range = `${tab}!A2:E`; // Assuming Header is Row 1: ROUTE, COLOR, GRADE, SETTER, SET DATE
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    data[tab] = response.data.values || [];
  }

  return data;
}
