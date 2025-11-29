import { ImageResponse } from "next/og";
import { WALLS } from "@/lib/constants/walls";

export const alt = "Set Details";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const logoUrl = "https://8737nj28n9.ufs.sh/f/yeca34jg0kve0HqFHM8imeRqUW1g45YDjCbnlMck9IourLh2";

const wallTypeConfig: Record<string, { color: string; description: string }> = {
  Overhang: { color: "#ef4444", description: "Powerful moves on steep terrain" },
  Vertical: { color: "#3b82f6", description: "Technical face climbing" },
  Slab: { color: "#22c55e", description: "Balance and precision footwork" },
};

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const wall = WALLS.find((w) => w.id === id);

  if (!wall) {
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
        Set not found
      </div>,
      {
        ...size,
      }
    );
  }

  const typeConfig = wallTypeConfig[wall.type] || {
    color: "#94a3b8",
    description: "Climbing wall",
  };

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
          flexDirection: "column",
          width: "100%",
          height: "100%",
          maxWidth: "900px",
          maxHeight: "480px",
          backgroundColor: "white",
          border: "3px solid black",
          boxShadow: "12px 12px 0px 0px rgba(0,0,0,1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 40px",
            borderBottom: "3px solid black",
            backgroundColor: typeConfig.color,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                backgroundColor: "white",
                padding: "8px 20px",
                transform: "skewX(-12deg)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 20,
                  fontWeight: 800,
                  color: typeConfig.color,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  transform: "skewX(12deg)",
                }}
              >
                {wall.type}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              fontWeight: 600,
              color: "white",
              opacity: 0.9,
            }}
          >
            Rock Mill Climbing
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            padding: "48px 40px",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 900,
              color: "#0f172a",
              letterSpacing: "-0.04em",
              lineHeight: 1,
              marginBottom: "16px",
              textTransform: "uppercase",
            }}
          >
            {wall.name}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "#64748b",
              lineHeight: 1.4,
            }}
          >
            {typeConfig.description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "20px 40px",
            borderTop: "2px solid #e2e8f0",
            backgroundColor: "#f8fafc",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 14,
                height: 14,
                backgroundColor: "#a855f7",
                borderRadius: "3px",
                border: "2px solid black",
              }}
            />
            <div
              style={{
                display: "flex",
                width: 14,
                height: 14,
                backgroundColor: "#ec4899",
                borderRadius: "3px",
                border: "2px solid black",
              }}
            />
            <div
              style={{
                display: "flex",
                width: 14,
                height: 14,
                backgroundColor: "#3b82f6",
                borderRadius: "3px",
                border: "2px solid black",
              }}
            />
            <div
              style={{
                display: "flex",
                width: 14,
                height: 14,
                backgroundColor: "#eab308",
                borderRadius: "3px",
                border: "2px solid black",
              }}
            />
            <div
              style={{
                display: "flex",
                width: 14,
                height: 14,
                backgroundColor: "#f97316",
                borderRadius: "3px",
                border: "2px solid black",
              }}
            />
          </div>
          <div style={{ display: "flex", fontSize: 16, color: "#94a3b8", fontWeight: 500 }}>
            Multiple grades available
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
