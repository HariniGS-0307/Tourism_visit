/**
 * WaveSection — decorative animated SVG wave divider between sections.
 * Usage: Place between two sections with matching colors.
 */
export default function WaveSection({
  topColor = "#ffffff",
  bottomColor = "#f9fafb",
  className = "",
}: {
  topColor?: string;
  bottomColor?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: topColor, marginBottom: "-2px" }}
    >
      <svg
        viewBox="0 0 1440 60"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full block"
        style={{ height: 60 }}
      >
        <path
          d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,20 1440,30 L1440,60 L0,60 Z"
          fill={bottomColor}
        />
      </svg>
    </div>
  );
}
