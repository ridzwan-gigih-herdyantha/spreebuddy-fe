const TONES = {
  pending: "is-pending",
  processing: "is-processing",
  shipped: "is-shipped",
  delivered: "is-delivered",
  cancelled: "is-cancelled",
  "in stock": "is-instock",
  "low stock": "is-lowstock",
  "out of stock": "is-outofstock",
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
