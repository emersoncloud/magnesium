import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import BarcodeDrawer from "./BarcodeDrawer";

export default async function AppHeader() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const userDetails = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { barcode: true },
  });

  return (
    <header className="fixed top-0 right-0 z-40 p-4">
      <BarcodeDrawer barcode={userDetails?.barcode ?? null} />
    </header>
  );
}
