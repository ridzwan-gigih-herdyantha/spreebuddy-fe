import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import BarChart from "@/components/admin/BarChart";
import StatCard from "@/components/admin/StatCard";
import StatusBreakdown from "@/components/admin/StatusBreakdown";
import Avatar from "@/components/ui/Avatar";
import Select from "@/components/ui/Select";
import StatusPill from "@/components/ui/StatusPill";
import { getOrderStats } from "@/api/orders";
import { formatPrice, formatRelative } from "@/utils/format";
import { dashboardContent, dashboardRanges } from "@/data/admin";

const decimal = new Intl.NumberFormat("id-ID");
const count = (value) =>
  typeof value === "number" ? decimal.format(value) : "—";

export default function Dashboard() {
  const content = dashboardContent;
  const [range, setRange] = useState("30");

  const stats = useQuery({
    queryKey: ["admin", "order-stats", range],
    queryFn: () => getOrderStats({ days: range }),
    placeholderData: (previous) => previous,
    retry: false,
  });

  const data = stats.data?.data;
  const series = (data?.series ?? []).map(({ label, date, orders }) => ({
    label,
    value: orders,
    hint: `${date}: ${orders} ${content.chartUnit}`,
  }));

  return (
    <>
      <header className="sb-admin-head">
        <div>
          <h1 className="sb-h1 mb-1">{content.title}</h1>
          <p className="sb-lead mb-0">{content.lead}</p>
        </div>

        <div className="d-flex align-items-center gap-3">
          <Select
            label={content.rangeLabel}
            icon="bi-calendar3"
            value={range}
            options={dashboardRanges}
            onChange={setRange}
          />
          <Link
            to={content.addProduct.to}
            className="btn btn-primary rounded-pill px-4 text-nowrap"
          >
            <i className="bi bi-plus-lg" /> {content.addProduct.label}
          </Link>
        </div>
      </header>

      {stats.isError && (
        <p className="sb-form-error" role="alert">
          <i className="bi bi-exclamation-triangle-fill" />{" "}
          {stats.error.message}
        </p>
      )}

      <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3 mb-4">
        <div className="col">
          <StatCard
            icon="bi-cash-stack"
            tone="is-success"
            label="Revenue"
            value={
              data ? formatPrice(data.scoped.revenue) : content.unavailable
            }
            note={content.revenueNote}
          />
        </div>
        <div className="col">
          <StatCard
            icon="bi-receipt"
            tone="is-primary"
            label="Orders"
            value={count(data?.totals?.orders)}
            note={`${count(data?.scoped?.orders)} in range`}
          />
        </div>
        <div className="col">
          <StatCard
            icon="bi-box-seam"
            tone="is-violet"
            label="Products"
            value={count(data?.totals?.products)}
            note={content.productsNote}
          />
        </div>
        <div className="col">
          <StatCard
            icon="bi-people"
            tone="is-warning"
            label="Customers"
            value={count(data?.totals?.customers)}
            note={content.customersNote}
          />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-xl-8">
          <section className="sb-card sb-panel h-100">
            <div className="sb-panel-head">
              <h2 className="sb-h3 mb-0">{content.chartTitle}</h2>
              <span className="sb-meta">
                {data?.range?.spanDays ?? "—"} {content.chartCaption}
              </span>
            </div>
            <div className="sb-panel-body">
              <BarChart
                unit={content.chartUnit}
                buckets={series.length ? series : [{ label: "—", value: 0 }]}
              />
            </div>
          </section>
        </div>

        <div className="col-12 col-xl-4">
          <section className="sb-card sb-panel h-100">
            <div className="sb-panel-head">
              <h2 className="sb-h3 mb-0">{content.breakdownTitle}</h2>
              <span className="sb-meta">{count(data?.scoped?.orders)}</span>
            </div>
            <div className="sb-panel-body">
              <StatusBreakdown rows={data?.byStatus ?? []} />
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

        {data && data.recent.length === 0 ? (
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
                {(data?.recent ?? []).map((order) => (
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
