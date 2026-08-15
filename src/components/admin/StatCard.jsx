export default function StatCard({ icon, tone = "", label, value, note }) {
  return (
    <div className="sb-card sb-stat h-100">
      <span className={`sb-stat-icon ${tone}`}>
        <i className={`bi ${icon}`} />
      </span>
      <span className="sb-stat-label">{label}</span>
      <span className="sb-stat-value">{value}</span>
      {note && <span className="sb-stat-note">{note}</span>}
    </div>
  );
}
