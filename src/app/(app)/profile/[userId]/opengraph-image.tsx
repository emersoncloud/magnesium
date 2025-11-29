import { ImageResponse } from "next/og";
import { db } from "@/lib/db";
import { users, activityLogs, routes } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export const alt = "Climber Profile";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const logoUrl = "https://8737nj28n9.ufs.sh/f/yeca34jg0kve0HqFHM8imeRqUW1g45YDjCbnlMck9IourLh2";

const gradeOrder = [
  "VB",
  "V0",
  "V1",
  "V2",
  "V3",
  "V4",
  "V5",
  "V6",
  "V7",
  "V8",
  "V9",
  "V10",
  "V11",
  "V12",
];

function getGradeIndex(grade: string): number {
  const index = gradeOrder.indexOf(grade);
  return index === -1 ? -1 : index;
}

export default async function Image({ params }: { params: Promise<{ userId: string }> }) {
  const { userId: encodedUserId } = await params;
  const userId = decodeURIComponent(encodedUserId);

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  const sends = await db.query.activityLogs.findMany({
    where: and(eq(activityLogs.user_id, userId), eq(activityLogs.action_type, "SEND")),
  });

  const flashes = await db.query.activityLogs.findMany({
    where: and(eq(activityLogs.user_id, userId), eq(activityLogs.action_type, "FLASH")),
  });

  const allSendRouteIds = [...sends, ...flashes].map((s) => s.route_id);
  const uniqueRouteIds = [...new Set(allSendRouteIds)];

  let bestSendGrade = "";
  let bestFlashGrade = "";

  if (uniqueRouteIds.length > 0) {
    const sentRoutes = await db.query.routes.findMany({
      where: eq(routes.status, "active"),
    });

    const sentRouteMap = new Map(sentRoutes.map((r) => [r.id, r]));

    let bestSendIndex = -1;
    let bestFlashIndex = -1;

    for (const send of sends) {
      const route = sentRouteMap.get(send.route_id);
      if (route) {
        const gradeIndex = getGradeIndex(route.grade);
        if (gradeIndex > bestSendIndex) {
          bestSendIndex = gradeIndex;
          bestSendGrade = route.grade;
        }
      }
    }

    for (const flash of flashes) {
      const route = sentRouteMap.get(flash.route_id);
      if (route) {
        const gradeIndex = getGradeIndex(route.grade);
        if (gradeIndex > bestFlashIndex) {
          bestFlashIndex = gradeIndex;
          bestFlashGrade = route.grade;
        }
        if (gradeIndex > bestSendIndex) {
          bestSendIndex = gradeIndex;
          bestSendGrade = route.grade;
        }
      }
    }
  }

  if (!user) {
    return new ImageResponse(
      <div
        style={{
          fontSize: 48,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Climber not found
      </div>,
      {
        ...size,
      }
    );
  }

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 32,
        }}
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "User"}
            width="160"
            height="160"
            style={{
              borderRadius: "100%",
              border: "6px solid black",
              boxShadow: "12px 12px 0px 0px rgba(0,0,0,1)",
            }}
          />
        ) : (
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: "100%",
              backgroundColor: "#e2e8f0",
              border: "6px solid black",
              boxShadow: "12px 12px 0px 0px rgba(0,0,0,1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 64,
              fontWeight: 900,
              color: "#64748b",
            }}
          >
            {user.name?.[0] || "?"}
          </div>
        )}
      </div>

      <div
        style={{
          fontSize: 64,
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "-0.05em",
          color: "black",
          marginBottom: 24,
          display: "flex",
          textAlign: "center",
        }}
      >
        {user.name}
      </div>

      <div
        style={{
          display: "flex",
          gap: "24px",
        }}
      >
        {bestSendGrade && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "black",
              color: "white",
              padding: "16px 32px",
              transform: "skew(-6deg)",
            }}
          >
            <div style={{ display: "flex", fontSize: 42, fontWeight: 900, lineHeight: 1 }}>
              {bestSendGrade}
            </div>
            <div style={{ display: "flex", fontSize: 14, letterSpacing: "0.1em", marginTop: 4 }}>
              BEST SEND
            </div>
          </div>
        )}
        {bestFlashGrade && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#eab308",
              color: "black",
              padding: "16px 32px",
              transform: "skew(-6deg)",
            }}
          >
            <div style={{ display: "flex", fontSize: 42, fontWeight: 900, lineHeight: 1 }}>
              {bestFlashGrade}
            </div>
            <div style={{ display: "flex", fontSize: 14, letterSpacing: "0.1em", marginTop: 4 }}>
              BEST FLASH
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src={logoUrl}
          alt="Rock Mill Magnesium"
          width="128"
          height="128"
          style={{
            objectFit: "contain",
          }}
        />
      </div>
    </div>,
    {
      ...size,
    }
  );
}
