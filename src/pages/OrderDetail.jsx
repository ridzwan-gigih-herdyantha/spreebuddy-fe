import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Breadcrumb from "@/components/ui/Breadcrumb";
import StatusPill from "@/components/ui/StatusPill";
import { getOrder } from "@/api/orders";
import { formatPrice } from "@/utils/format";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { orderDetailContent, orderSteps } from "@/data/orders";

function Timeline({ status, placed, updated }) {
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

export default function OrderDetail() {
  const { id } = useParams();
  const content = orderDetailContent;
  const { user } = useAuth();
  const { addItem } = useCart();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrder(id),
    enabled: Boolean(user),
    retry: false,
  });

  if (!user) {
    return (
      <section className="sb-section text-center">
        <h1 className="sb-h1 mb-2">Sign in to see this order</h1>
        <Link to="/login" className="btn btn-primary rounded-pill px-4 mt-3">
          Sign in
        </Link>
      </section>
    );
  }

  if (isPending) {
    return (
      <section className="sb-section">
        <div className="sb-card sb-shop-skeleton" />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="sb-section">
        <p className="sb-form-error" role="alert">
          <i className="bi bi-exclamation-triangle-fill" /> {error.message}
        </p>
        <Link to={content.back.to} className="sb-pill sb-pill-outline mt-3">
          {content.back.label}
        </Link>
      </section>
    );
  }

  const order = data.data;
  const product = order.product;
  const short = order.id;

  return (
    <section className="sb-section">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "My orders", to: "/orders" },
          { label: short },
        ]}
      />

      <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-3 mb-1">
            <h1 className="sb-h1 mb-0">Order {short}</h1>
            <StatusPill status={order.status} />
          </div>
          <p className="sb-lead mb-0">Placed {order.createdAt}</p>
        </div>

        <Link
          to={content.back.to}
          className="sb-pill sb-pill-outline text-nowrap"
        >
          <i className="bi bi-arrow-left" /> {content.back.label}
        </Link>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="sb-card p-4 mb-4">
            <h2 className="sb-h2 mb-3">{content.itemsTitle}</h2>

            <div className="d-flex align-items-start gap-3">
              <span className="sb-order-thumb">
                <i className="bi bi-box-seam" />
              </span>

              <div className="min-w-0 flex-grow-1">
                <div className="sb-h3 text-truncate">
                  {product?.name ?? "Product unavailable"}
                </div>
                <div className="d-flex align-items-center gap-2 mt-1">
                  <span className="sb-meta">{formatPrice(order.price)}</span>
                  <span className="sb-pill sb-shop-badge mb-0">
                    Qty {order.quantity}
                  </span>
                </div>

                {product && (
                  <div className="d-flex gap-3 mt-2">
                    <Link to={`/product/${product.id}`} className="sb-small">
                      {content.viewProduct}
                    </Link>
                    <button
                      type="button"
                      className="btn btn-link sb-small p-0"
                      onClick={() => addItem(product, order.quantity)}
                    >
                      {content.buyAgain}
                    </button>
                  </div>
                )}
              </div>

              <span className="sb-order-total">{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="sb-card p-4">
            <h2 className="sb-h2 mb-4">{content.progressTitle}</h2>
            <Timeline
              status={order.status}
              placed={order.createdAt}
              updated={order.updatedAt}
            />
          </div>
        </div>

        <div className="col-lg-4">
          <div className="sb-card p-4 mb-4">
            <h2 className="sb-h2 mb-3">{content.summaryTitle}</h2>

            <div className="sb-cart-line">
              <span>Subtotal</span>
              <span className="fw-semibold">{formatPrice(order.total)}</span>
            </div>
            <div className="sb-cart-line">
              <span>Shipping</span>
              <span className="text-success fw-semibold">Free</span>
            </div>

            <div className="sb-cart-total-block">
              <span className="sb-meta">Total amount</span>
              <span className="sb-cart-grand">{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="sb-card p-4 mb-4">
            <h2 className="sb-h2 mb-3">{content.infoTitle}</h2>
            <dl className="sb-spec-list">
              <div>
                <dt>Order ID</dt>
                <dd>{short}</dd>
              </div>
              <div>
                <dt>Placed</dt>
                <dd>{order.createdAt}</dd>
              </div>
              <div>
                <dt>Payment</dt>
                <dd>{content.paymentNote}</dd>
              </div>
              <div>
                <dt>Items</dt>
                <dd>{order.quantity}</dd>
              </div>
            </dl>
          </div>

          <div className="sb-card p-4 text-center">
            <span className="sb-help-icon">
              <i className="bi bi-headset" />
            </span>
            <h2 className="sb-h3 mt-3 mb-2">{content.helpTitle}</h2>
            <p className="sb-meta mb-3">{content.helpLead}</p>

            <Link
              to={`/chat?compare=${encodeURIComponent(product?.name ?? "")}`}
              className="btn sb-btn-outline rounded-pill w-100 mb-2"
            >
              {content.askAssistant}
            </Link>
            <Link to="/help" className="btn sb-btn-outline rounded-pill w-100">
              {content.contact}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
