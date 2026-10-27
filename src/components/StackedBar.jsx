export default function StackedBar({ summaryValue, summaryLabel, segments }) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;

  return (
    <div className="bar-block">
      <p className="bar-summary">
        <strong>{summaryValue}</strong>
        <span>{summaryLabel}</span>
      </p>
      <div
        className="stack"
        role="img"
        aria-label={segments.map((segment) => `${segment.label} (${segment.value})`).join(", ")}
      >
        {segments.map((segment) => (
          <span
            key={segment.label}
            style={{ width: `${(segment.value / total) * 100}%`, background: segment.color }}
            title={`${segment.label} (${segment.value})`}
          />
        ))}
      </div>
      <ul className="legend legend-grid">
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
