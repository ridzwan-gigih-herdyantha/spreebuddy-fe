import StatusPill from "@/components/ui/StatusPill";

export default function StatusBreakdown({ rows }) {
  const peak = Math.max(1, ...rows.map(({ count }) => count));

  return (
    <ul className="sb-breakdown">
      {rows.map(({ status, count }) => (
        <li key={status}>
          <StatusPill status={status} />
          <span className="sb-breakdown-track">
            <span
              className={`sb-breakdown-fill is-${status.toLowerCase()}`}
              style={{ width: `${(count / peak) * 100}%` }}
            />
          </span>
          <span className="sb-breakdown-count">{count}</span>
        </li>
      ))}
    </ul>
  );
}
