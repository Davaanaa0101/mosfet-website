export default function CircuitGraphic() {
  return (
    <div className="relative h-[520px] w-[520px]">

      {/* Glow */}
      <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl" />

      {/* Center */}
      <div className="absolute left-1/2 top-1/2 z-20 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-3xl border border-primary bg-card shadow-[0_0_40px_rgba(194,24,91,.35)]">

        <div className="text-center">
          <div className="text-xl font-bold text-primary">
            MOSFET
          </div>

          <div className="text-xs text-muted-foreground">
            Engineering
          </div>
        </div>

      </div>

      {/* SVG Connections */}

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 520 520"
      >

        <line x1="260" y1="260" x2="260" y2="80" stroke="rgba(194,24,91,.45)" strokeWidth="2"/>

        <line x1="260" y1="260" x2="260" y2="440" stroke="rgba(194,24,91,.45)" strokeWidth="2"/>

        <line x1="260" y1="260" x2="80" y2="260" stroke="rgba(194,24,91,.45)" strokeWidth="2"/>

        <line x1="260" y1="260" x2="440" y2="260" stroke="rgba(194,24,91,.45)" strokeWidth="2"/>

      </svg>

      {[
        { x: 260, y: 60, label: "Cloud" },
        { x: 260, y: 460, label: "PLC" },
        { x: 60, y: 260, label: "CCTV" },
        { x: 460, y: 260, label: "Odoo" },
      ].map((node) => (
        <div
          key={node.label}
          className="absolute flex flex-col items-center"
          style={{
            left: node.x,
            top: node.y,
            transform: "translate(-50%,-50%)",
          }}
        >
          <div className="h-5 w-5 rounded-full bg-primary shadow-[0_0_20px_rgba(194,24,91,.7)]" />

          <span className="mt-2 text-sm text-muted-foreground">
            {node.label}
          </span>
        </div>
      ))}
    </div>
  );
}