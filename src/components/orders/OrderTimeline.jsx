import { orderSteps } from "@/data/orders";

export default function OrderTimeline({ status, placed, updated }) {
  const current = String(status ?? "").toLowerCase();

  if (current === "cancelled") {
    return (
      <ol className="sb-timeline">
        <li className="is-done is-pending">
          <span className="sb-timeline-dot" />
          <div>
            <div className="sb-timeline-label">Pending</div>
            <p className="sb-meta mb-0">Order created and stock reserved</p>
          </div>
          <span className="sb-caption">{placed}</span>
        </li>
        <li className="is-current is-cancelled">
          <span className="sb-timeline-dot" />
          <div>
            <div className="sb-timeline-label">Cancelled</div>
            <p className="sb-meta mb-0">Reserved stock returned to the shop</p>
          </div>
          <span className="sb-caption">{updated}</span>
        </li>
      </ol>
    );
  }

  const index = orderSteps.findIndex((step) => step.key === current);

  return (
    <ol className="sb-timeline">
      {orderSteps.map((step, position) => {
        const state =
          position < index ? "is-done" : position === index ? "is-current" : "";
        const stamp =
          position === 0 ? placed : position === index ? updated : null;

        return (
          <li key={step.key} className={`${state} is-${step.key}`}>
            <span className="sb-timeline-dot" />
            <div>
              <div className="sb-timeline-label">{step.label}</div>
              <p className="sb-meta mb-0">
                {position > index
                  ? `Not yet ${step.label.toLowerCase()}`
                  : step.note}
              </p>
            </div>
            {stamp && <span className="sb-caption">{stamp}</span>}
          </li>
        );
      })}
    </ol>
  );
}
