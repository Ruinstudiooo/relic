export default function Loading() {
  const block = (width: string, height: string, radius = "8px"): React.CSSProperties => ({
    width,
    height,
    borderRadius: radius,
    background: "rgba(255, 255, 255, 0.06)",
  });

  return (
    <main className="page">
      <div className="card" aria-busy="true" aria-live="polite" aria-label="loading profile">
        <div style={{ ...block("96px", "96px", "999px"), marginBottom: 4 }} />
        <div style={block("160px", "26px")} />
        <div style={block("110px", "14px")} />
        <div style={{ display: "grid", gap: 10, width: "100%", marginTop: 8 }}>
          <div style={block("100%", "62px", "14px")} />
          <div style={block("100%", "62px", "14px")} />
          <div style={block("100%", "62px", "14px")} />
        </div>
      </div>
    </main>
  );
}
