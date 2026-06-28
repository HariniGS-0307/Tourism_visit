/**
 * FloatingMountains — decorative SVG 3D mountain silhouettes.
 * Pure CSS animations, zero JS. Server Component — no "use client" needed.
 */
export default function FloatingMountains({
  className = "",
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light" | "emerald";
}) {
  const colors =
    variant === "light"
      ? { far: "rgba(16,185,129,0.06)", mid: "rgba(16,185,129,0.09)", near: "rgba(16,185,129,0.12)", ridge: "rgba(6,78,59,0.18)" }
      : variant === "emerald"
      ? { far: "rgba(255,255,255,0.04)", mid: "rgba(255,255,255,0.07)", near: "rgba(255,255,255,0.10)", ridge: "rgba(255,255,255,0.15)" }
      : { far: "rgba(5,150,105,0.10)", mid: "rgba(5,150,105,0.15)", near: "rgba(16,185,129,0.18)", ridge: "rgba(6,78,59,0.45)" };

  return (
    <div className={`absolute bottom-0 left-0 right-0 pointer-events-none select-none overflow-hidden ${className}`}>
      {/* Layer 1 — distant mountains (slowest drift) */}
      <div className="absolute bottom-0 left-0 right-0 animate-mountain" style={{ animationDuration: "22s" }}>
        <svg viewBox="0 0 1440 280" className="w-full" preserveAspectRatio="none" style={{ marginBottom: "-2px" }}>
          <path
            d="M0,280 L100,160 L240,210 L380,130 L530,180 L680,90 L840,150 L1000,110 L1160,165 L1300,100 L1440,140 L1440,280 Z"
            fill={colors.far}
          />
        </svg>
      </div>

      {/* Layer 2 — mid mountains */}
      <div className="absolute bottom-0 left-0 right-0 animate-mountain" style={{ animationDuration: "16s", animationDelay: "-4s" }}>
        <svg viewBox="0 0 1440 240" className="w-full" preserveAspectRatio="none" style={{ marginBottom: "-2px" }}>
          <path
            d="M0,240 L80,140 L210,175 L360,100 L510,145 L660,70 L820,120 L980,90 L1140,135 L1290,80 L1440,115 L1440,240 Z"
            fill={colors.mid}
          />
        </svg>
      </div>

      {/* Layer 3 — near mountains (fastest) */}
      <div className="absolute bottom-0 left-0 right-0 animate-mountain" style={{ animationDuration: "12s", animationDelay: "-8s" }}>
        <svg viewBox="0 0 1440 200" className="w-full" preserveAspectRatio="none" style={{ marginBottom: "-2px" }}>
          <path
            d="M0,200 L140,120 L300,155 L460,90 L620,130 L780,65 L940,105 L1100,75 L1260,115 L1440,85 L1440,200 Z"
            fill={colors.near}
          />
        </svg>
      </div>

      {/* Foreground ridge */}
      <svg viewBox="0 0 1440 100" className="w-full relative" preserveAspectRatio="none" style={{ marginBottom: "-2px" }}>
        <path
          d="M0,100 L0,80 L180,60 L360,75 L540,50 L720,70 L900,45 L1080,65 L1260,50 L1440,60 L1440,100 Z"
          fill={colors.ridge}
        />
      </svg>
    </div>
  );
}
