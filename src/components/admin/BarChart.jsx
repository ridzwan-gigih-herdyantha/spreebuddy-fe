export default function BarChart({ buckets }) {
  const peak = Math.max(1, ...buckets.map(({ value }) => value));

  return (
    <div className="sb-chart">
      <div className="sb-chart-axis">
        <span>{peak}</span>
        <span>{Math.round(peak / 2)}</span>
        <span>0</span>
      </div>

      <div className="sb-chart-plot">
        {buckets.map(({ label, value }) => (
          <div className="sb-chart-col" key={label}>
            <div className="sb-chart-bar" title={`${value} orders`}>
              <div
                className="sb-chart-fill"
                style={{ height: `${(value / peak) * 100}%` }}
              />
            </div>
            <span className="sb-chart-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
