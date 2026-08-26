const MAX_LABELS = 10;

export default function BarChart({ buckets, unit = "" }) {
  const peak = Math.max(1, ...buckets.map(({ value }) => value));
  const ticks = [peak, Math.round(peak / 2), 0];
  const every = Math.ceil(buckets.length / MAX_LABELS);

  return (
    <div className="sb-chart">
      <div className="sb-chart-axis">
        {ticks.map((tick, index) => (
          <span key={index}>{tick}</span>
        ))}
      </div>

      <div className="sb-chart-plot" data-dense={buckets.length > 20}>
        <div className="sb-chart-lines" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        {buckets.map(({ label, value, hint }, index) => (
          <div
            className="sb-chart-col"
            key={hint ?? label ?? index}
            title={hint ?? `${label}: ${value}${unit ? ` ${unit}` : ""}`}
          >
            <span className="sb-chart-value">{value > 0 ? value : ""}</span>

            <div className="sb-chart-bar">
              {value > 0 && (
                <div
                  className="sb-chart-fill"
                  style={{ height: `${(value / peak) * 100}%` }}
                />
              )}
            </div>

            <span className="sb-chart-label">
              {index % every === 0 ? label : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
