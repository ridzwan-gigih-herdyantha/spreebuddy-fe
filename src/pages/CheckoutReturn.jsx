import { useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/ui/Spinner";
import { getPaymentBySession } from "@/api/payments";
import { formatPrice } from "@/utils/format";
import { checkoutReturnContent } from "@/data/checkout";

const POLL_MS = 2000;
const MAX_POLLS = 15;

const ICONS = {
  confirming: "bi-hourglass-split",
  paid: "bi-check-circle",
  slow: "bi-hourglass-split",
  failed: "bi-x-circle",
  expired: "bi-clock-history",
  cancelled: "bi-arrow-counterclockwise",
  missing: "bi-question-circle",
};

// Which panel to show, given where the customer came back from and what the
// webhook has settled so far.
function resolveState({ cancelled, session, error, status, exhausted }) {
  if (!session || error) return "missing";
  if (status === "paid") return "paid";
  if (status === "failed") return "failed";
  if (status === "expired") return "expired";
  if (cancelled) return "cancelled";
  return exhausted ? "slow" : "confirming";
}

export default function CheckoutReturn({ cancelled = false }) {
  const content = checkoutReturnContent;
  const [params] = useSearchParams();
  const session = params.get("session");

  const polls = useRef(0);
  const [exhausted, setExhausted] = useState(false);

  const payment = useQuery({
    queryKey: ["payment", "session", session],
    queryFn: () => getPaymentBySession(session),
    enabled: Boolean(session),
    retry: false,
    // Settlement arrives on the webhook, not on this redirect, so the page waits
    // for it rather than claiming success the client cannot verify.
    refetchInterval: (query) => {
      const current = query.state.data?.data?.status;
      if (current && current !== "created") return false;
      polls.current += 1;
      if (polls.current >= MAX_POLLS) {
        setExhausted(true);
        return false;
      }
      return POLL_MS;
    },
  });

  const data = payment.data?.data;
  const state = resolveState({
    cancelled,
    session,
    error: payment.isError,
    status: data?.status,
    exhausted,
  });
  const panel = content[state];
  const waiting = state === "confirming";

  return (
    <section className="sb-section">
      <div className="sb-card sb-return">
        <span className={`sb-return-icon is-${state}`}>
          {waiting ? <Spinner size={22} /> : <i className={`bi ${ICONS[state]}`} />}
        </span>

        <h1 className="sb-h1 mb-2">{panel.title}</h1>
        <p className="sb-lead mb-0">{panel.lead}</p>

        {data && (
          <dl className="sb-return-meta">
            <div>
              <dt>{content.amount}</dt>
              <dd>{formatPrice(data.total)}</dd>
            </div>
            <div>
              <dt>{content.reference}</dt>
              <dd className="text-truncate">{data.id}</dd>
            </div>
          </dl>
        )}

        {panel.action && (
          <Link
            to={panel.action.to}
            className="btn btn-primary rounded-pill px-4 mt-4"
          >
            {panel.action.label}
          </Link>
        )}
      </div>
    </section>
  );
}
