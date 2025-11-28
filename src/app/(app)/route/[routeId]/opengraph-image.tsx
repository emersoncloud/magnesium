import { ImageResponse } from "next/og";
import { db } from "@/lib/db";
import { routes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { WALLS } from "@/lib/constants/walls";
import { parseDateString } from "@/lib/utils";

export const alt = "Route Details";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const logoUrl = "https://8737nj28n9.ufs.sh/f/yeca34jg0kve0HqFHM8imeRqUW1g45YDjCbnlMck9IourLh2";

const colorMap: Record<string, string> = {
  Red: "#ef4444",
  Blue: "#3b82f6",
  Green: "#22c55e",
  Yellow: "#eab308",
  Orange: "#f97316",
  Purple: "#a855f7",
  Black: "#171717",
  White: "#e5e5e5",
  Pink: "#ec4899",
  Tan: "#d4a574",
  Wood: "#8b6914",
};

const lightColorMap: Record<string, string> = {
  Red: "#fef2f2",
  Blue: "#eff6ff",
  Green: "#f0fdf4",
  Yellow: "#fefce8",
  Orange: "#fff7ed",
  Purple: "#faf5ff",
  Black: "#f8fafc",
  White: "#f8fafc",
  Pink: "#fdf2f8",
  Tan: "#faf8f5",
  Wood: "#faf8f5",
};

export default async function Image({ params }: { params: Promise<{ routeId: string }> }) {
  const { routeId } = await params;
  const route = await db.query.routes.findFirst({
    where: eq(routes.id, routeId),
  });

  if (!route) {
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
        Route not found
      </div>,
      {
        ...size,
      }
    );
  }

  const routeColor = colorMap[route.color] || "#94a3b8";
  const wall = WALLS.find((w) => w.id === route.wall_id);
  const wallName = wall?.name || "Unknown Wall";
  const backgroundColor = lightColorMap[route.color] || "#f8fafc";

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        padding: "40px",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          maxWidth: "900px",
          backgroundColor: "white",
          border: "3px solid black",
          boxShadow: "12px 12px 0px 0px rgba(0,0,0,1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "14px",
            backgroundColor: routeColor,
            display: "flex",
            flexShrink: 0,
          }}
        />

        <div
          style={{
            flex: 1,
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: backgroundColor,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                height: "14px",
                width: "70px",
                backgroundColor: routeColor,
                transform: "skewX(-12deg)",
                display: "flex",
              }}
            />
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#475569",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "flex",
              }}
            >
              {wallName}
            </div>
          </div>

          <div
            style={{
              fontSize: 120,
              fontWeight: 900,
              color: "#0f172a",
              letterSpacing: "-0.05em",
              lineHeight: 1,
              marginBottom: "20px",
              display: "flex",
            }}
          >
            {route.grade}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            {route.style && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#eff6ff",
                  color: "#1d4ed8",
                  padding: "6px 14px",
                  borderRadius: "5px",
                  fontSize: 18,
                  fontWeight: 600,
                  border: "2px solid #bfdbfe",
                }}
              >
                {route.style}
              </div>
            )}
            {route.hold_type && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#fff7ed",
                  color: "#c2410c",
                  padding: "6px 14px",
                  borderRadius: "5px",
                  fontSize: 18,
                  fontWeight: 600,
                  border: "2px solid #fed7aa",
                }}
              >
                {route.hold_type}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginTop: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: 20,
                color: "#64748b",
              }}
            >
              <div style={{ fontWeight: 600, display: "flex" }}>Set by</div>
              <div style={{ fontWeight: 800, color: "#334155", display: "flex" }}>
                {route.setter_name}
              </div>
            </div>
            <div style={{ color: "#cbd5e1", fontSize: 22, display: "flex" }}>•</div>
            <div style={{ fontSize: 20, color: "#64748b", display: "flex" }}>
              {parseDateString(route.set_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
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
