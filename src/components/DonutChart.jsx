export default function DonutChart({ segments, center, caption = "Total", startFraction = 0 }) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const shown = center ?? String(total);
  const size = 120;
  const stroke = 16;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const label = segments.map((segment) => `${segment.label} (${segment.value})`).join(", ");

  let offset = startFraction * circumference;
  const arcs =
    total > 0
      ? segments
          .filter((segment) => segment.value > 0)
          .map((segment) => {
            const length = (segment.value / total) * circumference;
            const arc = { ...segment, length, offset };
            offset += length;
            return arc;
          })
      : [];

  return (
    <div className="donut-layout">
      <svg
        className="donut-chart"
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${shown} ${caption}. ${label}`}
      >
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#eef1f6" strokeWidth={stroke} />
        <g transform="rotate(-90 60 60)">
          {arcs.map((arc) => (
            <circle
              key={arc.label}
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={arc.color}
              strokeWidth={stroke}
              strokeDasharray={`${arc.length} ${circumference - arc.length}`}
              strokeDashoffset={-arc.offset}
            />
          ))}
        </g>
        <text x="60" y="56" textAnchor="middle" className="donut-value">
          {shown}
        </text>
        <text x="60" y="72" textAnchor="middle" className="donut-caption">
          {caption}
        </text>
      </svg>
      <ul className="legend legend-vertical">
        {segments.map((segment) => (
          <li key={segment.label}>
            <span className="swatch" style={{ background: segment.color }} />
            <span>
              {segment.label} ({segment.value})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
