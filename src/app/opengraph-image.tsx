import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { MARK_BOOK_PATH, MARK_CHISEL_PATHS } from "@/components/brand/mark-paths";

export const alt = `${siteConfig.name} · ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const Mark = ({ size: markSize, opacity = 1 }: { size: number; opacity?: number }) => (
  <svg width={markSize} height={markSize} viewBox="0 0 48 48" fill={siteConfig.colors.ivory} style={{ opacity }}>
    {[...MARK_CHISEL_PATHS, MARK_BOOK_PATH].map((path) => (
      <path key={path} d={path} />
    ))}
  </svg>
);

// Share card for every route that doesn't define its own: ink background, ivory type, the mark as watermark.
export default function OpengraphImage() {
  const { colors } = siteConfig;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "72px 80px",
          backgroundColor: colors.ink,
          color: colors.ivory,
        }}
      >
        <div style={{ position: "absolute", right: -60, bottom: -90, display: "flex" }}>
          <Mark size={560} opacity={0.08} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Mark size={72} />
          <span style={{ fontSize: 44, fontWeight: 600, letterSpacing: -1 }}>{siteConfig.name}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 860 }}>
          <span style={{ fontSize: 68, fontWeight: 600, lineHeight: 1.05, letterSpacing: -2 }}>{siteConfig.tagline}</span>
          <span style={{ fontSize: 30, lineHeight: 1.35, opacity: 0.72 }}>{siteConfig.shareDescription}</span>
        </div>
      </div>
    ),
    size
  );
}
