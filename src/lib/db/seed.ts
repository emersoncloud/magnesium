import { db } from "../db";
import { routes } from "./schema";

const sampleRoutes = [
  { wall_id: "Easy -", color: "Green", grade: "VB", setter_name: "Abby", set_date: "2024-10-28" },
  { wall_id: "Mod -", color: "Orange", grade: "V3", setter_name: "Abby", set_date: "2024-10-28" },
  { wall_id: "Mod +", color: "Blue", grade: "V5", setter_name: "Abby", set_date: "2024-10-28" },
  { wall_id: "Easy +", color: "Yellow", grade: "V2", setter_name: "Jeff", set_date: "2024-10-28" },
  { wall_id: "Mod -", color: "Purple", grade: "V4", setter_name: "Jeff", set_date: "2024-10-28" },
  { wall_id: "Hard -", color: "Grey", grade: "V7", setter_name: "Jeff", set_date: "2024-10-28" },
  { wall_id: "Mod +", color: "Pink", grade: "V6", setter_name: "Zach", set_date: "2024-10-28" },
  { wall_id: "Hard +", color: "Tan", grade: "V10", setter_name: "Zach", set_date: "2024-10-28" },
];

export async function seed() {
  console.log("Seeding routes...");
  await db.insert(routes).values(sampleRoutes);
  console.log("Seeding complete!");
}
