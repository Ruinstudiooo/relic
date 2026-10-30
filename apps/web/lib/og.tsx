// shared chrome for the generated share cards. satori renders a subset of css,
// so this is all flex, inline styles and no classes. change it here and both the
// index card and every profile card move together.

type CardProps = {
  eyebrow: string;
  title: string;
  subtitle?: string | null;
  footer: string;
  accent: string;
};

export function ogCard({ eyebrow, title, subtitle, footer, accent }: CardProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#050505",
        color: "#f2f2f2",
        padding: "76px 84px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -240,
          right: -160,
          width: 720,
          height: 720,
          borderRadius: 720,
          background: `radial-gradient(circle, ${accent}55 0%, ${accent}00 70%)`,
          display: "flex",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: 18,
            background: accent,
            display: "flex",
          }}
        />
        <div
          style={{
            fontSize: 24,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#8a8a8a",
          }}
        >
          {eyebrow}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 940 }}>
        <div
          style={{
            fontSize: title.length > 22 ? 68 : 88,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            fontWeight: 700,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div style={{ fontSize: 28, lineHeight: 1.45, color: "#9a9a9a", maxWidth: 820 }}>
            {subtitle.length > 150 ? `${subtitle.slice(0, 147).trimEnd()}...` : subtitle}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 22,
          color: "#6f6f6f",
        }}
      >
        <div style={{ display: "flex" }}>{footer}</div>
        <div style={{ display: "flex", color: accent }}>relic</div>
      </div>
    </div>
  );
}

export const OG_SIZE = { width: 1200, height: 630 };
