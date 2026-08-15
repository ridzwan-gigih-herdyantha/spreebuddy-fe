import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import BarChart from "@/components/admin/BarChart";
import StatCard from "@/components/admin/StatCard";
import StatusBreakdown from "@/components/admin/StatusBreakdown";
import Avatar from "@/components/ui/Avatar";
import Select from "@/components/ui/Select";
import StatusPill from "@/components/ui/StatusPill";
import { listUsers } from "@/api/admin";
import { listOrders } from "@/api/orders";
import { listProducts } from "@/api/products";
import { formatPrice, formatRelative, parseApiDate } from "@/utils/format";
import { orderStatuses } from "@/data/orders";
import {
  ADMIN_ORDERS_SAMPLE,
  CHART_BUCKETS,
  RECENT_ORDERS,
  dashboardContent,
  dashboardRanges,
} from "@/data/admin";

const DAY = 86_400_000;
const decimal = new Intl.NumberFormat("id-ID");

const isCancelled = (order) => order.status?.toLowerCase() === "cancelled";

const withinRange = (orders, range) => {
  if (range === "all") return orders;
  const since = Date.now() - Number(range) * DAY;
  return orders.filter(
    ({ placedAt }) => placedAt !== null && placedAt >= since,
  );
};

// Splits the selected window into equal buckets so the chart keeps a fixed
// column count whatever the range.
function buildChart(sample, scoped, range) {
  const now = Date.now();
  const oldest = sample.reduce(
    (min, { placedAt }) =>
      placedAt !== null && placedAt < min ? placedAt : min,
    now,
  );
  const spanDays =
    range === "all"
      ? Math.max(CHART_BUCKETS, Math.ceil((now - oldest) / DAY))
      : Number(range);
  const bucketDays = Math.max(1, Math.ceil(spanDays / CHART_BUCKETS));

  const buckets = Array.from({ length: CHART_BUCKETS }, (_, index) => {
    const end = now - (CHART_BUCKETS - 1 - index) * bucketDays * DAY;
    const start = end - bucketDays * DAY;
    const from = new Date(start);
    return {
      label: `${from.getDate()}/${from.getMonth() + 1}`,
      value: scoped.filter(
        ({ placedAt }) =>
          placedAt !== null && placedAt > start && placedAt <= end,
      ).length,
    };
  });

  return { buckets, bucketDays };
}

export default function Dashboard() {
  const content = dashboardContent;
  const [range, setRange] = useState("30");

  const products = useQuery({
    queryKey: ["admin", "products"],
    queryFn: () => listProducts({ page: 1, limit: 1 }),
    retry: false,
  });

  const users = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => listUsers({ page: 1, limit: 1 }),
    retry: false,
  });

  const orders = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: () => listOrders({ page: 1, limit: ADMIN_ORDERS_SAMPLE }),
    retry: false,
  });

  const sample = useMemo(
    () =>
      (orders.data?.data ?? []).map((order) => ({
        ...order,
        placedAt: parseApiDate(order.createdAt)?.getTime() ?? null,
      })),
    [orders.data],
  );

  const scoped = useMemo(() => withinRange(sample, range), [sample, range]);

  const revenue = useMemo(
    () =>
      scoped
        .filter((order) => !isCancelled(order))
        .reduce((total, order) => total + (order.total ?? 0), 0),
    [scoped],
  );

  const breakdown = useMemo(
    () =>
      orderStatuses.map((status) => ({
        status,
        count: scoped.filter(
          (order) => order.status?.toLowerCase() === status.toLowerCase(),
        ).length,
      })),
    [scoped],
  );

  const { buckets, bucketDays } = useMemo(
    () => buildChart(sample, scoped, range),
    [sample, scoped, range],
  );

  const recent = useMemo(
    () =>
      [...scoped]
        .sort((a, b) => (b.placedAt ?? 0) - (a.placedAt ?? 0))
        .slice(0, RECENT_ORDERS),
    [scoped],
  );

  const pending = breakdown.find(({ status }) => status === "Pending")?.count;
  const total = (query) => query.data?.meta?.total;
  const asCount = (value) =>
    typeof value === "number" ? decimal.format(value) : content.unavailable;

  return (
    <>
      <header className="sb-admin-head">
        <div>
          <h1 className="sb-h1 mb-1">{content.title}</h1>
          <p className="sb-lead mb-0">{content.lead}</p>
        </div>

        <div className="d-flex align-items-center gap-3">
          <Select value={range} options={dashboardRanges} onChange={setRange} />
          <Link
            to={content.addProduct.to}
            className="btn btn-primary rounded-pill px-4 text-nowrap"
          >
            <i className="bi bi-plus-lg" /> {content.addProduct.label}
          </Link>
        </div>
      </header>

      {orders.isError && (
        <p className="sb-form-error" role="alert">
          <i className="bi bi-exclamation-triangle-fill" />{" "}
          {orders.error.message}
        </p>
      )}

      <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3 mb-4">
        <div className="col">
          <StatCard
            icon="bi-cash-stack"
            tone="is-success"
            label="Revenue"
            value={scoped.length ? formatPrice(revenue) : content.unavailable}
            note={`From ${scoped.length} orders in range`}
          />
        </div>
        <div className="col">
          <StatCard
            icon="bi-receipt"
            tone="is-primary"
            label="Orders"
            value={asCount(total(orders) ?? sample.length)}
            note={
              typeof pending === "number"
                ? `${pending} pending in range`
                : undefined
            }
          />
        </div>
        <div className="col">
          <StatCard
            icon="bi-box-seam"
            tone="is-violet"
            label="Products"
            value={asCount(total(products))}
            note={
              products.isError ? products.error.message : "In the catalogue"
            }
          />
        </div>
        <div className="col">
          <StatCard
            icon="bi-people"
            tone="is-warning"
            label="Customers"
            value={asCount(total(users))}
            note={users.isError ? users.error.message : "Registered accounts"}
          />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-xl-8">
          <section className="sb-card sb-panel h-100">
            <div className="sb-panel-head">
              <h2 className="sb-h3 mb-0">{content.chartTitle}</h2>
              <span className="sb-meta">{bucketDays}-day buckets</span>
            </div>
            <div className="sb-panel-body">
              <BarChart buckets={buckets} />
            </div>
          </section>
        </div>

        <div className="col-12 col-xl-4">
          <section className="sb-card sb-panel h-100">
            <div className="sb-panel-head">
              <h2 className="sb-h3 mb-0">{content.breakdownTitle}</h2>
              <span className="sb-meta">{scoped.length}</span>
            </div>
            <div className="sb-panel-body">
              <StatusBreakdown rows={breakdown} />
            </div>
          </section>
        </div>
      </div>

      <section className="sb-card sb-panel">
        <div className="sb-panel-head">
          <h2 className="sb-h3 mb-0">{content.recentTitle}</h2>
          <Link to={content.viewAll.to} className="sb-small fw-semibold">
            {content.viewAll.label}
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="sb-lead text-center py-5 mb-0">{content.empty}</p>
        ) : (
          <div className="sb-table-wrap">
            <table className="sb-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th className="text-end">Total</th>
                  <th>Status</th>
                  <th>Placed</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((order) => (
                  <tr
                    key={order.id}
                    className={isCancelled(order) ? "is-muted" : ""}
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
                        <span className="text-truncate">
                          {order.user?.name ?? content.unavailable}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="sb-order-name text-truncate">
                        {order.product?.name ?? "Product unavailable"}
                      </div>
                      <div className="sb-caption">{order.quantity} pcs</div>
                    </td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
