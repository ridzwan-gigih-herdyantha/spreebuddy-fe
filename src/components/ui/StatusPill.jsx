const TONES = {
  pending: "is-pending",
  processing: "is-processing",
  shipped: "is-shipped",
  delivered: "is-delivered",
  cancelled: "is-cancelled",
};

export default function StatusPill({ status }) {
  const key = String(status ?? "").toLowerCase();

  return (
    <span className={`sb-status-pill ${TONES[key] ?? ""}`}>
      <i className="sb-status-pill-dot" />
      {key ? key[0].toUpperCase() + key.slice(1) : "Unknown"}
    </span>
  );
}
