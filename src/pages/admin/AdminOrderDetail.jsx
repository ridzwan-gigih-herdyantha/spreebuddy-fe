import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import OrderTimeline from "@/components/orders/OrderTimeline";
import Avatar from "@/components/ui/Avatar";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import StatusPill from "@/components/ui/StatusPill";
import { deleteOrder, getOrder, moveOrderTo } from "@/api/orders";
import { formatPrice } from "@/utils/format";
import { adminRoutes } from "@/config/admin";
import { nextStatuses } from "@/data/orders";
import { orderDeleteContent, orderDetailAdminContent } from "@/data/admin";

function Row({ label, children }) {
  return (
    <div className="sb-spec-row">
      <span className="sb-spec-label">{label}</span>
      <span className="sb-spec-value">{children}</span>
    </div>
  );
}

export default function AdminOrderDetail() {
  const { id } = useParams();
  const content = orderDetailAdminContent;
  const removeCopy = orderDeleteContent;

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [confirming, setConfirming] = useState(false);

  const query = useQuery({
    queryKey: ["admin", "order", id],
    queryFn: () => getOrder(id),
    retry: false,
  });

  const order = query.data?.data;

  const settle = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "order", id] });
    queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
  };

  const move = useMutation({ mutationFn: moveOrderTo, onSettled: settle });

  const remove = useMutation({
    mutationFn: () => deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      navigate(adminRoutes.orders, { replace: true });
    },
  });

  if (query.isError) {
    return (
      <div className="sb-admin-soon">
        <h1 className="sb-h1 mb-2">Order not found</h1>
        <p className="sb-lead mb-4">{query.error.message}</p>
        <Link to={content.back.to} className="sb-pill sb-pill-outline">
          <i className="bi bi-arrow-left" /> {content.back.label}
        </Link>
      </div>
    );
  }

  if (!order) return <div className="sb-admin-boot">Loading…</div>;

  const moves = nextStatuses(order.status);
  const cancelled = order.status?.toLowerCase() === "cancelled";

  return (
    <>
      <header className="sb-admin-head">
        <div className="min-w-0">
          <Link to={content.back.to} className="sb-admin-back">
            <i className="bi bi-arrow-left" /> {content.back.label}
          </Link>
          <h1 className="sb-h1 mt-2 mb-2 sb-mono-title">
            {String(order.id).slice(-8)}
          </h1>
          <div className="d-flex flex-wrap align-items-center gap-2">
            <StatusPill status={order.status} />
            <span className="sb-meta">
              {content.fields.placed} {order.createdAt}
            </span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          {cancelled && (
            <button
              type="button"
              className="sb-pill sb-pill-danger text-nowrap"
              onClick={() => {
                remove.reset();
                setConfirming(true);
              }}
            >
              <i className="bi bi-trash3" /> {content.remove}
            </button>
          )}
        </div>
      </header>

      {(move.isError || remove.isError) && (
        <p className="sb-form-error" role="alert">
          <i className="bi bi-exclamation-triangle-fill" />{" "}
          {(move.error ?? remove.error).message}
        </p>
      )}

      <div className="row g-3">
        <div className="col-12 col-xl-8">
          <div className="d-flex flex-column gap-3">
            <section className="sb-card sb-panel">
              <div className="sb-panel-head">
                <h2 className="sb-h3 mb-0">{content.actionsTitle}</h2>
                <span className="sb-meta">{order.status}</span>
              </div>
              <div className="sb-panel-body">
                {moves.length === 0 ? (
                  <p className="sb-lead mb-0">
                    {cancelled ? removeCopy.body : content.deleteHint}
                  </p>
                ) : (
                  <div className="d-flex flex-wrap gap-2">
                    {moves.map((status) => (
                      <button
                        key={status}
                        type="button"
                        className={`sb-pill ${status === "cancelled" ? "sb-pill-danger" : "sb-pill-gradient"}`}
                        disabled={move.isPending}
                        onClick={() => move.mutate({ id, status })}
                      >
                        {status === "cancelled" ? (
                          <i className="bi bi-x-circle" />
                        ) : (
                          <i className="bi bi-arrow-right-short" />
                        )}
                        {move.isPending ? "Working…" : status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="sb-card sb-panel">
              <div className="sb-panel-head">
                <h2 className="sb-h3 mb-0">{content.timelineTitle}</h2>
              </div>
              <div className="sb-panel-body">
                <OrderTimeline
                  status={order.status}
                  placed={order.createdAt}
                  updated={order.updatedAt}
                />
              </div>
            </section>

            <section className="sb-card sb-panel">
              <div className="sb-panel-head">
                <h2 className="sb-h3 mb-0">{content.itemTitle}</h2>
                {order.product && (
                  <Link
                    to={`${adminRoutes.products}/${order.product.slug}`}
                    className="sb-small fw-semibold"
                  >
                    {content.viewProduct}
                  </Link>
                )}
              </div>

              <div className="sb-panel-body">
                {order.product ? (
                  <div className="d-flex align-items-center gap-3">
                    <span className="sb-order-thumb">
                      <i className="bi bi-box-seam" />
                    </span>
                    <div className="min-w-0">
                      <div className="sb-order-name text-truncate">
                        {order.product.name}
                      </div>
                      <div className="sb-caption">{order.product.category}</div>
                    </div>
                  </div>
                ) : (
                  <p className="sb-lead mb-0">{content.missingProduct}</p>
                )}
              </div>
            </section>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="d-flex flex-column gap-3">
            <section className="sb-card sb-panel">
              <div className="sb-panel-head">
                <h2 className="sb-h3 mb-0">{content.summaryTitle}</h2>
              </div>
              <div className="sb-panel-body sb-spec-list">
                <Row label={content.fields.order}>
                  <span className="sb-mono">{order.id}</span>
                </Row>
                <Row label={content.fields.unitPrice}>
                  {formatPrice(order.price)}
                </Row>
                <Row label={content.fields.quantity}>{order.quantity}</Row>
                <Row label={content.fields.total}>
                  <span className="sb-order-total">
                    {formatPrice(order.total)}
                  </span>
                </Row>
                <Row label={content.fields.placed}>{order.createdAt}</Row>
                <Row label={content.fields.updated}>{order.updatedAt}</Row>
              </div>
            </section>

            <section className="sb-card sb-panel">
              <div className="sb-panel-head">
                <h2 className="sb-h3 mb-0">{content.customerTitle}</h2>
              </div>

              <div className="sb-panel-body">
                {order.user ? (
                  <>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <Avatar
                        name={order.user.name ?? "?"}
                        src={order.user.avatarUrl}
                      />
                      <div className="min-w-0">
                        <div className="sb-order-name text-truncate">
                          {order.user.name}
                        </div>
                        <div className="sb-caption text-truncate">
                          {order.user.email}
                        </div>
                      </div>
                    </div>

                    <div className="sb-spec-list">
                      <Row label={content.fields.username}>
                        {order.user.username ?? "—"}
                      </Row>
                      <Row label={content.fields.phone}>
                        {order.user.phone ?? "—"}
                      </Row>
                    </div>
                  </>
                ) : (
                  <p className="sb-lead mb-0">{content.missingCustomer}</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirming}
        title={removeCopy.title}
        body={
          <>
            {removeCopy.body} {removeCopy.irreversible}
          </>
        }
        confirmLabel={removeCopy.confirm}
        cancelLabel={removeCopy.cancel}
        pending={remove.isPending}
        error={remove.error?.message}
        onConfirm={() => remove.mutate()}
        onCancel={() => (remove.isPending ? null : setConfirming(false))}
      />
    </>
  );
}
