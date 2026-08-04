import { ImageResponse } from "next/og";

export const alt =
  "Lumyn Academy personalized learning paths across technology, business, design, and creative skills";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const learningAreas = ["Technology", "Business", "Design", "Creative skills"];

export default function AcademyOpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          background: "#09090f",
          color: "#f7f5ff",
          fontFamily: "Arial, sans-serif",
          padding: "64px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            width: 520,
            height: 520,
            borderRadius: 999,
            right: -110,
            top: -180,
            background:
              "radial-gradient(circle, rgba(128, 97, 255, 0.54) 0%, rgba(128, 97, 255, 0) 70%)",
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            width: 460,
            height: 460,
            borderRadius: 999,
            right: 120,
            bottom: -300,
            background:
              "radial-gradient(circle, rgba(65, 173, 229, 0.3) 0%, rgba(65, 173, 229, 0) 72%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#c5bdff",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 40,
                height: 40,
                alignItems: "flex-end",
                padding: 7,
                borderRadius: 11,
                background: "linear-gradient(145deg, #ddd8ff, #755cff)",
                color: "#17121f",
                fontSize: 24,
                letterSpacing: 0,
              }}
            >
              L
            </div>
            Lumyn Academy
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div
              style={{
                display: "flex",
                maxWidth: 900,
                fontSize: 70,
                lineHeight: 1.02,
                fontWeight: 700,
                letterSpacing: "-0.045em",
              }}
            >
              Learn what matters to you.
            </div>
            <div
              style={{
                display: "flex",
                maxWidth: 850,
                fontSize: 27,
                lineHeight: 1.35,
                color: "#b8b5c5",
              }}
            >
              Personalized AI learning paths with guided lessons, active practice,
              and proof of progress.
            </div>
          </div>

          <div style={{ display: "flex", gap: 13, alignItems: "center" }}>
            {learningAreas.map((area) => (
              <div
                key={area}
                style={{
                  display: "flex",
                  padding: "12px 18px",
                  border: "1px solid rgba(197, 189, 255, 0.25)",
                  borderRadius: 999,
                  background: "rgba(124, 108, 246, 0.1)",
                  color: "#d8d3ff",
                  fontSize: 18,
                }}
              >
                {area}
              </div>
            ))}
            <div style={{ display: "flex", color: "#8b8799", fontSize: 18 }}>
              + more
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
