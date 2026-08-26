import { useQuery } from "@tanstack/react-query";
import BarChart from "@/components/admin/BarChart";
import StatCard from "@/components/admin/StatCard";
import Avatar from "@/components/ui/Avatar";
import { getAiUsage, getChatStats } from "@/api/admin";
import { FREE_DAILY_CAP, chatAdminContent } from "@/data/admin";

const decimal = new Intl.NumberFormat("id-ID");
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 4,
});

const count = (value) =>
  typeof value === "number" ? decimal.format(value) : "—";

const dollars = (value) =>
  typeof value === "number" ? money.format(value) : "—";

function Row({ label, children }) {
  return (
    <div className="sb-spec-row">
      <span className="sb-spec-label">{label}</span>
      <span className="sb-spec-value">{children}</span>
    </div>
  );
}

export default function AdminChatSessions() {
  const content = chatAdminContent;

  const stats = useQuery({
    queryKey: ["admin", "chat", "stats"],
    queryFn: getChatStats,
    retry: false,
  });

  const usage = useQuery({
    queryKey: ["admin", "chat", "usage"],
    queryFn: getAiUsage,
    retry: false,
  });

  const data = stats.data?.data;
  const ai = usage.data?.data?.account;
  const meter = usage.data?.data?.meter;
  const model = usage.data?.data?.model;

  const buckets = (data?.daily ?? []).map(({ date, messages }) => {
    const [, month, day] = date.split("-");
    return { label: `${Number(day)}/${Number(month)}`, value: messages };
  });

  const replies = data?.messages?.fromAssistant ?? 0;
  const failed = data?.messages?.failed ?? 0;
  const failureRate =
    replies > 0 ? ((failed / replies) * 100).toFixed(1) : null;

  const callsToday = meter?.today?.calls ?? 0;
  const capUsed = Math.min(100, (callsToday / FREE_DAILY_CAP) * 100);
  const perRequest =
    meter?.allTime?.calls > 0
      ? Math.round(meter.allTime.total / meter.allTime.calls)
      : null;

  return (
    <>
      <header className="sb-admin-head">
        <div>
          <h1 className="sb-h1 mb-1">{content.title}</h1>
          <p className="sb-lead mb-0">{content.lead}</p>
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
            icon="bi-chat-dots"
            tone="is-primary"
            label={content.stats.sessions}
            value={count(data?.sessions?.total)}
            note={content.stats.sessionsNote}
          />
        </div>
        <div className="col">
          <StatCard
            icon="bi-lightning-charge"
            tone="is-violet"
            label={content.stats.today}
            value={count(data?.messages?.today)}
            note={content.stats.todayNote}
          />
        </div>
        <div className="col">
          <StatCard
            icon="bi-people"
            tone="is-success"
            label={content.stats.people}
            value={count(data?.sessions?.users)}
            note={content.stats.peopleNote}
          />
        </div>
        <div className="col">
          <StatCard
            icon="bi-chat-square-text"
            tone="is-warning"
            label={content.stats.messages}
            value={count(data?.messages?.total)}
            note={content.stats.messagesNote}
          />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-xl-8">
          <section className="sb-card sb-panel h-100">
            <div className="sb-panel-head">
              <h2 className="sb-h3 mb-0">{content.chartTitle}</h2>
              <span className="sb-meta">
                {data?.seriesDays ?? 14} days, {content.chartCaption}
              </span>
            </div>
            <div className="sb-panel-body">
              <BarChart
                buckets={buckets.length ? buckets : [{ label: "—", value: 0 }]}
              />
            </div>
          </section>
        </div>

        <div className="col-12 col-xl-4">
          <section className="sb-card sb-panel h-100">
            <div className="sb-panel-head">
              <h2 className="sb-h3 mb-0">{content.healthTitle}</h2>
              {failureRate !== null && (
                <span
                  className={`sb-pill ${Number(failureRate) > 5 ? "sb-pill-warning" : "sb-pill-success"}`}
                >
                  {failureRate}%
                </span>
              )}
            </div>
            <div className="sb-panel-body">
              <div className="sb-spec-list">
                <Row label={content.health.replies}>{count(replies)}</Row>
                <Row label={content.health.failed}>{count(failed)}</Row>
                <Row label={content.health.rate}>
                  {failureRate === null ? "—" : `${failureRate}%`}
                </Row>
              </div>
              <p className="sb-caption mt-3 mb-0">{content.health.note}</p>
            </div>
          </section>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-xl-8">
          <section className="sb-card sb-panel h-100">
            <div className="sb-panel-head">
              <h2 className="sb-h3 mb-0">{content.usersTitle}</h2>
            </div>

            {data?.topUsers?.length ? (
              <div className="sb-table-wrap">
                <table className="sb-table">
                  <thead>
                    <tr>
                      <th>{content.columns.user}</th>
                      <th className="text-center">
                        {content.columns.sessions}
                      </th>
                      <th className="text-center">
                        {content.columns.messages}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topUsers.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <Avatar
                              name={row.name ?? "?"}
                              className="sb-avatar-sm"
                            />
                            <div className="min-w-0 sb-prod-cell">
                              <div className="sb-order-name text-truncate">
                                {row.name ?? "Account removed"}
                              </div>
                              <div className="sb-caption text-truncate">
                                {row.email ?? ""}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">{row.sessions}</td>
                        <td className="text-center">{row.messages}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="sb-panel-body">
                <p className="sb-lead mb-0">{content.emptyUsers}</p>
              </div>
            )}
          </section>
        </div>

        <div className="col-12 col-xl-4">
          <section className="sb-card sb-panel h-100">
            <div className="sb-panel-head">
              <h2 className="sb-h3 mb-0">{content.usageTitle}</h2>
            </div>

            <div className="sb-panel-body">
              {!ai?.configured && (
                <p className="sb-lead mb-0">{content.usage.unconfigured}</p>
              )}

              {ai?.configured && !ai?.reachable && (
                <p className="sb-form-error mb-0" role="alert">
                  <i className="bi bi-exclamation-triangle-fill" />{" "}
                  {content.usage.unreachable}
                </p>
              )}

              {ai?.reachable && (
                <>
                  <div className="sb-spec-list">
                    <Row label={content.usage.model}>
                      <span className="sb-mono">{ai.model}</span>
                    </Row>
                    <Row label={content.usage.plan}>
                      {ai.freeTier ? content.usage.free : content.usage.paid}
                    </Row>
                    <Row label={content.usage.limit}>
                      {/* null is uncapped; 0 is a real limit of nothing. */}
                      {ai.limit === null || ai.limit === undefined
                        ? content.usage.uncapped
                        : dollars(ai.limit)}
                    </Row>
                    <Row label={content.usage.remaining}>
                      {ai.limit === null || ai.limit === undefined
                        ? content.usage.uncapped
                        : dollars(ai.limitRemaining)}
                    </Row>
                    {ai.limitReset && (
                      <Row label={content.usage.reset}>{ai.limitReset}</Row>
                    )}
                    <Row label={content.usage.expires}>
                      {ai.expiresAt ?? content.usage.never}
                    </Row>
                    <Row label={content.usage.spentTotal}>
                      {dollars(ai.usage)}
                    </Row>
                    <Row label={content.usage.spentToday}>
                      {dollars(ai.usageDaily)}
                    </Row>
                    <Row label={content.usage.spentWeek}>
                      {dollars(ai.usageWeekly)}
                    </Row>
                    <Row label={content.usage.spentMonth}>
                      {dollars(ai.usageMonthly)}
                    </Row>
                  </div>

                  {ai.limit === 0 && (
                    <p className="sb-admin-hint mt-3 mb-0">
                      <i className="bi bi-info-circle" />{" "}
                      {content.usage.noCredit}
                    </p>
                  )}

                  <p className="sb-caption mt-3 mb-0">{content.usage.note}</p>
                </>
              )}
            </div>
          </section>
        </div>
      </div>

      <div className="row g-3 mt-3">
        <div className="col-12 col-xl-8">
          <section className="sb-card sb-panel h-100">
            <div className="sb-panel-head">
              <h2 className="sb-h3 mb-0">{content.meter.title}</h2>
              <span className="sb-meta">{content.meter.fanoutNote}</span>
            </div>

            <div className="sb-panel-body">
              <div className="d-flex align-items-baseline justify-content-between mb-2">
                <span className="sb-field-label mb-0">
                  {content.meter.requestsToday}
                </span>
                <span className="sb-meta">
                  {count(callsToday)} / {FREE_DAILY_CAP}{" "}
                  {content.meter.capLabel}
                </span>
              </div>
              <span className="sb-breakdown-track d-block">
                <span
                  className={`sb-breakdown-fill ${capUsed >= 80 ? "is-pending" : ""}`}
                  style={{ width: `${capUsed}%` }}
                />
              </span>
              <p className="sb-caption mt-2 mb-4">{content.meter.capNote}</p>

              <div className="sb-spec-list">
                <Row label={content.meter.requestsTotal}>
                  {count(meter?.allTime?.calls)}
                </Row>
                <Row label={content.meter.failedToday}>
                  {count(meter?.failedToday)}
                </Row>
                <Row label={content.meter.tokensToday}>
                  {count(meter?.today?.total)}
                  <span className="sb-caption d-block">
                    {content.meter.prompt} {count(meter?.today?.prompt)} ·{" "}
                    {content.meter.completion} {count(meter?.today?.completion)}
                  </span>
                </Row>
                <Row label={content.meter.tokensTotal}>
                  {count(meter?.allTime?.total)}
                </Row>
                <Row label={content.meter.perRequest}>
                  {perRequest === null ? "—" : `${count(perRequest)} tokens`}
                </Row>
                <Row label={content.meter.context}>
                  {count(model?.contextLength)}
                </Row>
                {model?.maxCompletionTokens && (
                  <Row label={content.meter.maxCompletion}>
                    {count(model.maxCompletionTokens)}
                  </Row>
                )}
                {meter?.lastRejection && (
                  <Row label={content.meter.observed}>
                    {meter.lastRejection.rateLimit?.limit ?? "—"} / day
                    <span className="sb-caption d-block">
                      {String(meter.lastRejection.at).slice(0, 10)}
                    </span>
                  </Row>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="col-12 col-xl-4">
          <section className="sb-card sb-panel h-100">
            <div className="sb-panel-head">
              <h2 className="sb-h3 mb-0">{content.meter.modelsTitle}</h2>
            </div>

            {meter?.models?.length ? (
              <div className="sb-table-wrap">
                <table className="sb-table">
                  <thead>
                    <tr>
                      <th>{content.meter.columns.model}</th>
                      <th className="text-center">
                        {content.meter.columns.calls}
                      </th>
                      <th className="text-end">
                        {content.meter.columns.tokens}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {meter.models.map((row) => (
                      <tr key={row.model}>
                        <td>
                          <span className="sb-mono sb-prod-slug">
                            {row.model}
                          </span>
                        </td>
                        <td className="text-center">{row.calls}</td>
                        <td className="text-end">{count(row.tokens)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="sb-panel-body">
                <p className="sb-lead mb-0">{content.meter.emptyModels}</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
