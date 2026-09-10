import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import Skeleton from "@/components/ui/Skeleton";
import Spinner from "@/components/ui/Spinner";
import TextField from "@/components/ui/TextField";
import { createOrders } from "@/api/orders";
import { createCheckout, getPaymentConfig } from "@/api/payments";
import { formatPrice } from "@/utils/format";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import {
  ADDRESS_PARTS,
  checkoutContent,
  checkoutMessages,
} from "@/data/checkout";

const toAddressForm = (user) =>
  Object.fromEntries(
    ADDRESS_PARTS.map((part) => [part, user?.address?.[part] ?? ""]),
  );

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

export default function Checkout() {
  const content = checkoutContent;
  const toast = useToast();
  const { user } = useAuth();
  const { items, total, isLoading, clear } = useCart();

  const config = useQuery({
    queryKey: ["payment-config"],
    queryFn: getPaymentConfig,
    retry: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onTouched", values: toAddressForm(user) });

  // Placing the orders empties the cart, which would otherwise blank out the
  // summary while the page is still on screen waiting for the redirect. The
  // basket is frozen at submit time and rendered from that snapshot instead.
  const [frozen, setFrozen] = useState(null);

  const pay = useMutation({
    onMutate: () => setFrozen({ items, total }),
    mutationFn: async (shippingAddress) => {
      const placed = await createOrders(
        items
          .filter((item) => item.product?.id)
          .map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
      );

      const orderIds = placed.data.map((order) => order.id);
      clear();

      const checkout = await createCheckout({ orderIds, shippingAddress });
      return checkout.data;
    },
    onSuccess: (payment) => {
      if (payment.checkoutUrl) {
        window.location.assign(payment.checkoutUrl);
        return;
      }
      toast.error(checkoutMessages.orphaned, {
        action: { label: "My orders", to: "/orders" },
      });
    },
    onError: (error) => {
      const detail = error.fieldErrors?.length
        ? error.fieldErrors.map(({ message }) => message).join(". ")
        : error.message;
      toast.error(detail || checkoutMessages.checkoutFailed);
    },
  });

  if (!user) {
    return (
      <Notice title={content.signedOut.title} lead={content.signedOut.lead}>
        <Link to="/login" className="btn btn-primary rounded-pill px-4">
          Sign in
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

  const basket = frozen ?? { items, total };

  if (basket.items.length === 0) {
    return (
      <Notice title={content.empty.title} lead={content.empty.lead}>
        <Link
          to={content.empty.action.to}
          className="btn btn-primary rounded-pill px-4"
        >
          {content.empty.action.label}
        </Link>
      </Notice>
    );
  }

  const rules = config.data?.data;
  const enabled = rules?.enabled !== false;

  const priced = Boolean(rules);
  const taxRate = rules?.taxRate ?? 0;
  const freeFrom = rules?.freeShippingFrom ?? 0;
  const shipping = basket.total >= freeFrom ? 0 : (rules?.shippingFlat ?? 0);
  const tax = Math.round(basket.total * taxRate * 100) / 100;
  const grandTotal = basket.total + shipping + tax;

  const blocked = basket.items.some((item) => (item.product?.stock ?? 0) <= 0);
  const busy = pay.isPending || pay.isSuccess;

  return (
    <section className="sb-section">
      <Link to={content.back.to} className="sb-admin-back">
        <i className="bi bi-arrow-left" /> {content.back.label}
      </Link>

      <h1 className="sb-h1 mt-2 mb-1">{content.title}</h1>
      <p className="sb-lead mb-4">{content.lead}</p>

      <form onSubmit={handleSubmit((values) => pay.mutate(values))} noValidate>
        <div className="row g-4">
          <div className="col-lg-7">
            <section className="sb-card sb-panel">
              <div className="sb-panel-head">
                <h2 className="sb-h3 mb-0">{content.addressTitle}</h2>
              </div>

              <div className="sb-panel-body">
                <p className="sb-meta">{content.addressLead}</p>

                <div className="row g-3">
                  {ADDRESS_PARTS.map((part) => (
                    <div
                      className={
                        part === "fullAddress" ? "col-12" : "col-12 col-sm-6"
                      }
                      key={part}
                    >
                      <TextField
                        id={`checkout-${part}`}
                        label={content.fields[part]}
                        placeholder={content.placeholders[part]}
                        error={errors[part]?.message}
                        {...register(part, { required: content.required })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className="col-lg-5">
            <div className="sb-card sb-cart-summary">
              <h2 className="sb-h2 mb-4">{content.summaryTitle}</h2>

              <div className="sb-checkout-lines">
                {basket.items.map((item) => (
                  <div className="sb-checkout-line" key={item.id}>
                    <span className="text-truncate">
                      {item.product?.name}
                      {item.quantity > 1 && (
                        <span className="sb-meta"> × {item.quantity}</span>
                      )}
                    </span>
                    <span className="fw-semibold text-nowrap">
                      {formatPrice(item.total ?? 0)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="sb-cart-line">
                <span>{content.subtotal}</span>
                <span className="fw-semibold">{formatPrice(basket.total)}</span>
              </div>
              <div className="sb-cart-line">
                <span>{content.shipping}</span>
                {!priced ? (
                  <Skeleton width={64} height={12} />
                ) : shipping === 0 ? (
                  <span className="text-success fw-semibold">
                    {content.free}
                  </span>
                ) : (
                  <span className="fw-semibold">{formatPrice(shipping)}</span>
                )}
              </div>
              <div className="sb-cart-line">
                <span>
                  {content.tax}
                  {priced && ` (${Math.round(taxRate * 100)}%)`}
                </span>
                {priced ? (
                  <span className="fw-semibold">{formatPrice(tax)}</span>
                ) : (
                  <Skeleton width={64} height={12} />
                )}
              </div>

              <div className="sb-cart-total-block">
                <span className="sb-meta">{content.total}</span>
                {priced ? (
                  <span className="sb-cart-grand">
                    {formatPrice(grandTotal)}
                  </span>
                ) : (
                  <Skeleton width={140} height={32} />
                )}
              </div>

              {enabled ? (
                <>
                  <button
                    type="submit"
                    className="btn btn-primary sb-btn-block mt-3"
                    disabled={blocked || busy || !priced}
                  >
                    {busy && <Spinner size={14} className="me-2" />}
                    {busy ? content.paying : content.pay}
                  </button>

                  {blocked && (
                    <p className="sb-cart-warn mt-2">{content.blocked}</p>
                  )}

                  <p className="sb-meta mt-3 mb-0">{content.leaving}</p>
                </>
              ) : (
                <div className="sb-checkout-off mt-3">
                  <h3 className="sb-h3 mb-1">{content.disabled.title}</h3>
                  <p className="sb-meta mb-0">{content.disabled.lead}</p>
                </div>
              )}

              {shipping > 0 && (
                <p className="sb-caption mt-3 mb-0">
                  {content.freeShippingNote.replace(
                    "{amount}",
                    formatPrice(freeFrom),
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
