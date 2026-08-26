import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Avatar from "@/components/ui/Avatar";
import FilterBar from "@/components/ui/FilterBar";
import StatusPill from "@/components/ui/StatusPill";
import { listOrders, moveOrderTo } from "@/api/orders";
import { formatPrice, formatRelative } from "@/utils/format";
import { adminRoutes } from "@/config/admin";
import { nextStatuses, orderStatuses } from "@/data/orders";
import { ORDERS_ADMIN_PAGE_SIZE, ordersAdminContent } from "@/data/admin";

const PAGE_SPAN = 3;
const ORDERS_KEY = ["admin", "orders"];

function pageWindow(current, totalPages) {
  const end = Math.min(totalPages, Math.max(current + 1, PAGE_SPAN));
  const start = Math.max(1, end - PAGE_SPAN + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

// The forward step, which is every legal move except cancelling.
const forwardStatus = (status) =>
  nextStatuses(status).find((next) => next !== "cancelled");

export default function AdminOrders() {
  const content = ordersAdminContent;
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState(content.allStatuses);
  const [busy, setBusy] = useState(null);

  const filter =
    status === content.allStatuses ? undefined : status.toLowerCase();

  const orders = useQuery({
    queryKey: [...ORDERS_KEY, page, filter],
    queryFn: () =>
      listOrders({ page, limit: ORDERS_ADMIN_PAGE_SIZE, status: filter }),
    placeholderData: (previous) => previous,
    retry: false,
  });

  // Exact per-status totals, straight from meta rather than counted on a page.
  const counts = useQuery({
    queryKey: [...ORDERS_KEY, "counts"],
    queryFn: async () => {
      const results = await Promise.all(
        orderStatuses.map((name) =>
          listOrders({ page: 1, limit: 1, status: name.toLowerCase() }),
        ),
      );
      return Object.fromEntries(
        orderStatuses.map((name, index) => [
          name,
          results[index]?.meta?.total ?? 0,
        ]),
      );
    },
    retry: false,
  });

  const items = orders.data?.data ?? [];
  const meta = orders.data?.meta;
  const total = meta?.total ?? items.length;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const current = Math.min(page, totalPages);
  const pages = pageWindow(current, totalPages);

  const move = useMutation({
    mutationFn: moveOrderTo,
    onMutate: ({ id }) => setBusy(id),
    onSettled: () => {
      setBusy(null);
      queryClient.invalidateQueries({ queryKey: ORDERS_KEY });
    },
  });

  return (
    <>
      <header className="sb-admin-head">
        <div>
          <h1 className="sb-h1 mb-1">{content.title}</h1>
          <p className="sb-lead mb-0">
            {total} {filter ? content.leadFiltered : `orders ${content.lead}`}
          </p>
        </div>
      </header>

      <div className="row row-cols-2 row-cols-md-5 g-3 mb-4">
        {orderStatuses.map((name) => (
          <div className="col" key={name}>
            <button
              type="button"
              className={`sb-card sb-order-stat sb-order-stat-btn ${status === name ? "is-active" : ""}`}
              onClick={() => {
                setStatus(status === name ? content.allStatuses : name);
                setPage(1);
              }}
            >
              <StatusPill status={name} />
              <span className="sb-order-stat-value">
                {counts.data?.[name] ?? "—"}
              </span>
            </button>
          </div>
        ))}
      </div>

      <FilterBar
        chips={[content.allStatuses, ...orderStatuses]}
        active={status}
        onChip={(value) => {
          setStatus(value);
          setPage(1);
        }}
        trailing={
          <span className="sb-meta">
            {items.length} of {total}
          </span>
        }
      />

      {(orders.isError || move.isError) && (
        <p className="sb-form-error" role="alert">
          <i className="bi bi-exclamation-triangle-fill" />{" "}
          {(orders.error ?? move.error).message}
        </p>
      )}

      <section className="sb-card">
        {orders.isSuccess && items.length === 0 ? (
          <div className="text-center py-5">
            <h2 className="sb-h2 mb-2">{content.empty.title}</h2>
            <p className="sb-lead mb-0">{content.empty.lead}</p>
          </div>
        ) : (
          <div className="sb-table-wrap">
            <table className="sb-table">
              <thead>
                <tr>
                  <th>{content.columns.order}</th>
                  <th>{content.columns.customer}</th>
                  <th>{content.columns.product}</th>
                  <th className="text-center">{content.columns.qty}</th>
                  <th className="text-end">{content.columns.total}</th>
                  <th>{content.columns.status}</th>
                  <th>{content.columns.placed}</th>
                  <th className="text-end">{content.columns.actions}</th>
                </tr>
              </thead>

              <tbody>
                {items.map((order) => {
                  const forward = forwardStatus(order.status);
                  const working = busy === order.id;

                  return (
                    <tr
                      key={order.id}
                      className={
                        order.status?.toLowerCase() === "cancelled"
                          ? "is-muted"
                          : ""
                      }
                    >
                      <td className="sb-mono">
                        {String(order.id ?? "").slice(-8)}
                      </td>

                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Avatar
                            name={order.user?.name ?? "?"}
                            src={order.user?.avatarUrl}
                            className="sb-avatar-sm"
                          />
                          <div className="min-w-0 sb-order-user">
                            <div className="text-truncate">
                              {order.user?.name ?? "—"}
                            </div>
                            <div className="sb-caption text-truncate">
                              {order.user?.email ?? ""}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="min-w-0 sb-prod-cell">
                          <div
                            className="sb-order-name text-truncate"
                            title={order.product?.name}
                          >
                            {order.product?.name ?? "Product removed"}
                          </div>
                          <div className="sb-caption text-truncate">
                            {order.product?.category ?? ""}
                          </div>
                        </div>
                      </td>

                      <td className="text-center">{order.quantity}</td>

                      <td className="sb-order-total text-end">
                        {formatPrice(order.total)}
                      </td>

                      <td>
                        <StatusPill status={order.status} />
                      </td>

                      <td>
                        <div>{order.createdAt}</div>
                        <div className="sb-caption">
                          {formatRelative(order.createdAt)}
                        </div>
                      </td>

                      <td>
                        <div className="sb-row-actions">
                          {forward && (
                            <button
                              type="button"
                              className="sb-pill sb-pill-outline text-nowrap"
                              disabled={working || move.isPending}
                              title={`${content.actions.advance} ${forward}`}
                              onClick={() =>
                                move.mutate({ id: order.id, status: forward })
                              }
                            >
                              {working ? (
                                <i className="bi bi-arrow-repeat sb-spin" />
                              ) : (
                                <i className="bi bi-arrow-right-short" />
                              )}
                              {forward}
                            </button>
                          )}

                          <Link
                            to={`${adminRoutes.orders}/${order.id}`}
                            className="sb-row-action"
                            title={content.actions.detail}
                            aria-label={`${content.actions.detail} order`}
                          >
                            <i className="bi bi-eye" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="sb-table-foot">
          <span className="sb-meta">
            Showing {items.length} of {total} orders
          </span>

          {totalPages > 1 && (
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="sb-page-btn"
                disabled={!meta?.hasPrevPage}
                onClick={() => setPage(current - 1)}
                aria-label="Previous page"
              >
                <i className="bi bi-chevron-left" />
              </button>

              {pages.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`sb-page-btn ${value === current ? "is-active" : ""}`}
                  aria-current={value === current ? "page" : undefined}
                  onClick={() => setPage(value)}
                >
                  {value}
                </button>
              ))}

              {pages.at(-1) < totalPages && <span className="sb-meta">…</span>}

              <button
                type="button"
                className="sb-page-btn"
                disabled={!meta?.hasNextPage}
                onClick={() => setPage(current + 1)}
                aria-label="Next page"
              >
                <i className="bi bi-chevron-right" />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
