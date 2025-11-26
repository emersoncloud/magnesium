import "server-only";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

export async function sendTelegramMessage(message: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHANNEL_ID) {
    console.error("Telegram credentials not configured");
    return false;
  }

  const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(telegramApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHANNEL_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Telegram API error:", errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
    return false;
  }
}

export async function notifyTooManyRoutesToArchive(
  routesToArchiveCount: number
): Promise<void> {
  const message = `⚠️ <b>Sync Warning: Too Many Routes to Archive</b>\n\nFound ${routesToArchiveCount} routes to archive, which exceeds the safety limit of 10.\n\nNo routes were archived. Please review the Google Sheet manually.`;
  await sendTelegramMessage(message);
}

export async function notifyRouteSync(
  addedRoutes: Array<{ grade: string; color: string }>,
  archivedCount: number
): Promise<void> {
  if (addedRoutes.length === 0 && archivedCount === 0) {
    return;
  }

  const addedRoutesList = addedRoutes
    .map((r) => `${r.grade} ${r.color}`)
    .join(", ");

  const addedSection =
    addedRoutes.length > 0
      ? `➕ Added: ${addedRoutes.length} route${addedRoutes.length > 1 ? "s" : ""} (${addedRoutesList})`
      : "";

  const archivedSection =
    archivedCount > 0
      ? `📦 Archived: ${archivedCount} route${archivedCount > 1 ? "s" : ""}`
      : "";

  const messageParts = ["🔄 <b>Route Sync Complete</b>"];
  if (addedSection) messageParts.push(addedSection);
  if (archivedSection) messageParts.push(archivedSection);

  await sendTelegramMessage(messageParts.join("\n"));
}

export async function notifyFeedback(
  userName: string,
  feedback: string
): Promise<void> {
  const message = `💬 <b>New Feedback from ${userName}</b>\n---\n${feedback}`;
  await sendTelegramMessage(message);
}

export async function notifyRouteSend(
  userName: string,
  actionType: "SEND" | "FLASH",
  grade: string,
  color: string,
  wallName: string
): Promise<void> {
  const actionVerb = actionType === "FLASH" ? "flashed" : "sent";
  const emoji = actionType === "FLASH" ? "⚡" : "🧗";
  const message = `${emoji} <b>${userName}</b> ${actionVerb} ${grade} ${color} on ${wallName}`;
  await sendTelegramMessage(message);
}

export async function notifyNewUser(
  userName: string,
  email: string
): Promise<void> {
  const message = `👋 <b>New user signed up!</b>\nName: ${userName}\nEmail: ${email}`;
  await sendTelegramMessage(message);
}
