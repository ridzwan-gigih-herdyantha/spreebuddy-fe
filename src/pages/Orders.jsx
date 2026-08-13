import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import FilterBar from "@/components/ui/FilterBar";
import StatusPill from "@/components/ui/StatusPill";
import { listOrders } from "@/api/orders";
import { formatPrice, formatRelative } from "@/utils/format";
import { useAuth } from "@/hooks/useAuth";
import {
  ORDERS_PAGE_SIZE,
  orderSortOptions,
  orderStatuses,
  ordersContent,
} from "@/data/orders";

const sorters = {
  oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  "total-desc": (a, b) => b.total - a.total,
  "total-asc": (a, b) => a.total - b.total,
};

export default function Orders() {
  const content = ordersContent;
  const { user } = useAuth();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(content.allStatuses);
  const [sort, setSort] = useState("newest");

  const orders = useQuery({
    queryKey: ["orders", page],
    queryFn: () => listOrders({ page, limit: ORDERS_PAGE_SIZE }),
    enabled: Boolean(user),
    placeholderData: (previous) => previous,
    retry: false,
  });

  const items = useMemo(() => orders.data?.data ?? [], [orders.data]);
  const meta = orders.data?.meta;

  const counts = useMemo(
    () =>
      orderStatuses.reduce((acc, name) => {
        acc[name] = items.filter(
          (order) => order.status?.toLowerCase() === name.toLowerCase(),
        ).length;
        return acc;
      }, {}),
    [items],
  );

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = items.filter((order) => {
      const matchesStatus =
        status === content.allStatuses ||
        order.status?.toLowerCase() === status.toLowerCase();
      const matchesTerm =
        !term ||
        order.id.toLowerCase().includes(term) ||
        order.product?.name?.toLowerCase().includes(term);
      return matchesStatus && matchesTerm;
    });
    return sorters[sort] ? [...filtered].sort(sorters[sort]) : filtered;
  }, [items, search, status, sort, content.allStatuses]);

  if (!user) {
    return (
      <section className="sb-section text-center">
        <h1 className="sb-h1 mb-2">{content.signedOut.title}</h1>
        <p className="sb-lead sb-measure mx-auto mb-4">
          {content.signedOut.lead}
        </p>
        <Link to="/login" className="btn btn-primary rounded-pill px-4">
          Sign in
        </Link>
      </section>
    );
  }

  return (
    <section className="sb-section">
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
          <h1 className="sb-h1 mb-1">{content.title}</h1>
          <p className="sb-lead mb-0">{content.lead}</p>
        </div>
        <Link
          to={content.back.to}
          className="sb-pill sb-pill-outline text-nowrap"
        >
          {content.back.label}
        </Link>
      </div>

      <div className="row row-cols-2 row-cols-md-5 g-3 mb-4">
        {orderStatuses.map((name) => (
          <div className="col" key={name}>
            <div className="sb-card sb-order-stat">
              <StatusPill status={name} />
              <span className="sb-order-stat-value">{counts[name] ?? 0}</span>
            </div>
          </div>
        ))}
      </div>

      <FilterBar
        search={search}
        onSearch={setSearch}
        searchPlaceholder={content.searchPlaceholder}
        chips={[content.allStatuses, ...orderStatuses]}
        active={status}
        onChip={setStatus}
        sort={sort}
        sortOptions={orderSortOptions}
        onSort={setSort}
      />

      {orders.isError && (
        <p className="sb-form-error" role="alert">
          <i className="bi bi-exclamation-triangle-fill" />{" "}
          {orders.error.message}
        </p>
      )}

      {orders.isSuccess && items.length === 0 && (
        <div className="text-center py-5">
          <h2 className="sb-h2 mb-2">{content.empty.title}</h2>
          <p className="sb-lead mb-4">{content.empty.lead}</p>
          <Link
            to={content.empty.action.to}
            className="btn btn-primary rounded-pill px-4"
          >
            {content.empty.action.label}
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <div className="sb-card">
          <div className="sb-table-wrap">
            <table className="sb-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Product</th>
                  <th className="text-center">Qty</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Placed</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {visible.map((order) => {
                  const cancelled = order.status?.toLowerCase() === "cancelled";
                  return (
                    <tr key={order.id} className={cancelled ? "is-muted" : ""}>
                      <td className="sb-order-id">{order.id}</td>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <span className="sb-order-thumb">
                            <i className="bi bi-box-seam" />
                          </span>
                          <div className="min-w-0">
                            <div className="sb-order-name text-truncate">
                              {order.product?.name ?? "Product unavailable"}
                            </div>
                            <div className="sb-caption">
                              {order.product?.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">{order.quantity}</td>
                      <td className="sb-order-total">
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
                      <td className="text-end">
                        <Link
                          to={`/orders/${order.id}`}
                          className="sb-order-link"
                          aria-label={`View order ${order.id}`}
                        >
                          <i className="bi bi-chevron-right" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="sb-table-foot">
            <span className="sb-meta">
              Showing {visible.length} of {meta?.total ?? items.length} orders
            </span>

            {meta?.totalPages > 1 && (
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="sb-page-btn"
                  disabled={!meta.hasPrevPage}
                  onClick={() => setPage((value) => value - 1)}
                  aria-label="Previous page"
                >
                  <i className="bi bi-chevron-left" />
                </button>
                <span className="sb-meta">
                  {meta.page} / {meta.totalPages}
                </span>
                <button
                  type="button"
                  className="sb-page-btn"
                  disabled={!meta.hasNextPage}
                  onClick={() => setPage((value) => value + 1)}
                  aria-label="Next page"
                >
                  <i className="bi bi-chevron-right" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
