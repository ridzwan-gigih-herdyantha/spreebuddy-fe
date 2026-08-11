import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import CartRow from "@/components/cart/CartRow";
import { createOrders } from "@/api/orders";
import { formatPrice } from "@/utils/format";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { cartContent, TAX_RATE } from "@/data/cart";

function Notice({ title, lead, children }) {
  return (
    <section className="sb-section text-center">
      <h1 className="sb-h1 mb-2">{title}</h1>
      <p className="sb-lead sb-measure mx-auto mb-4">{lead}</p>
      <div className="d-flex flex-wrap justify-content-center gap-3">
        {children}
      </div>
    </section>
  );
}

export default function Cart() {
  const content = cartContent;
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    items,
    total,
    isLoading,
    isClearing,
    busyOf,
    setQuantity,
    removeItem,
    clear,
  } = useCart();

  const placeOrder = useMutation({
    mutationFn: () =>
      createOrders(
        items
          .filter((item) => item.product?.id)
          .map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
      ),
    onSuccess: () => {
      clear();
      navigate("/orders");
    },
  });

  if (!user) {
    return (
      <Notice title={content.signedOut.title} lead={content.signedOut.lead}>
        <Link to="/login" className="btn btn-primary rounded-pill px-4">
          Sign in
        </Link>
        <Link
          to={content.back.to}
          className="btn sb-btn-outline rounded-pill px-4"
        >
          {content.back.label}
        </Link>
      </Notice>
    );
  }

  if (isLoading) {
    return (
      <section className="sb-section">
        <div className="sb-card sb-shop-skeleton" />
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <Notice title={content.empty.title} lead={content.empty.lead}>
        <Link
          to={content.empty.browse.to}
          className="btn btn-primary rounded-pill px-4"
        >
          {content.empty.browse.label}
        </Link>
        <Link
          to={content.empty.ask.to}
          className="btn sb-btn-outline rounded-pill px-4"
        >
          {content.empty.ask.label}
        </Link>
      </Notice>
    );
  }

  const blocked = items.some((item) => (item.product?.stock ?? 0) <= 0);
  const tax = Math.round(total * TAX_RATE);
  const grandTotal = total + tax;

  return (
    <section className="sb-section">
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
          <h1 className="sb-h1 mb-1">{content.title}</h1>
          <p className="sb-lead mb-0">
            {items.length} {items.length === 1 ? "item" : "items"}.{" "}
            {content.lead}
          </p>
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
          <div className="sb-card">
            {items.map((item) => (
              <CartRow
                key={item.id}
                item={item}
                busy={busyOf(item.product?.id)}
                onQuantity={(quantity) =>
                  setQuantity(item.product.id, quantity)
                }
                onRemove={() => removeItem(item.product.id)}
              />
            ))}
          </div>

          <button
            type="button"
            className="btn btn-link sb-cart-clear"
            disabled={isClearing}
            onClick={clear}
          >
            {isClearing ? "Clearing…" : content.clear}
          </button>
        </div>

        <div className="col-lg-4">
          <div className="sb-card sb-cart-summary">
            <h2 className="sb-h2 mb-4">{content.summaryTitle}</h2>

            <div className="sb-cart-line">
              <span>Subtotal</span>
              <span className="fw-semibold">{formatPrice(total)}</span>
            </div>
            <div className="sb-cart-line">
              <span>Shipping</span>
              <span className="text-success fw-semibold">Free</span>
            </div>
            <div className="sb-cart-line">
              <span>Tax ({Math.round(TAX_RATE * 100)}%)</span>
              <span className="fw-semibold">{formatPrice(tax)}</span>
            </div>

            <div className="sb-cart-total-block">
              <span className="sb-meta">Estimated total</span>
              <span className="sb-cart-grand">{formatPrice(grandTotal)}</span>
            </div>

            <button
              type="button"
              className="btn btn-primary sb-btn-block mt-3"
              disabled={blocked || placeOrder.isPending}
              onClick={() => placeOrder.mutate()}
            >
              {placeOrder.isPending ? "Placing order…" : content.placeOrder}
            </button>

            {blocked && <p className="sb-cart-warn mt-2">{content.blocked}</p>}

            {placeOrder.isError && (
              <p className="sb-form-error mt-3" role="alert">
                <i className="bi bi-exclamation-triangle-fill" />
                <span>
                  {placeOrder.error.fieldErrors?.length
                    ? placeOrder.error.fieldErrors
                        .map(({ message }) => message)
                        .join(". ")
                    : placeOrder.error.message}
                </span>
              </p>
            )}

            <p className="sb-meta mt-3 mb-0">{content.note}</p>

            <ul className="sb-cart-reassurance">
              {content.reassurance.map(({ icon, label }) => (
                <li key={label}>
                  <i className={`bi ${icon}`} />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
