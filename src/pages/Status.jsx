import { useQuery } from "@tanstack/react-query";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import { getHealth } from "@/api/health";
import { statusContent } from "@/data/status";

const REFRESH_MS = 30_000;

function formatUptime(seconds) {
  if (typeof seconds !== "number") return null;

  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function Status() {
  const content = statusContent;

  const health = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    refetchInterval: REFRESH_MS,
    retry: false,
  });

  // A dependency being down answers with 503, which lands here as an error.
  const reachable = !health.isError;
  const data = health.data;
  const dbUp = data?.services?.database === "up";
  const allGood = reachable && data?.status === "ok";

  const components = [
    {
      key: "shop",
      icon: "bi-shop",
      title: content.components.shop.title,
      body: content.components.shop.body,
      state: reachable ? "up" : "down",
    },
    {
      key: "database",
      icon: "bi-database",
      title: content.components.database.title,
      body: content.components.database.body,
      state: !reachable ? "unknown" : dbUp ? "up" : "down",
    },
    {
      key: "assistant",
      icon: "bi-stars",
      title: content.components.assistant.title,
      body: content.components.assistant.body,
      state: "external",
    },
  ];

  const banner = health.isPending
    ? content.banner.checking
    : allGood
      ? content.banner.ok
      : content.banner.down;

  return (
    <>
      <section
        className={`sb-status-hero sb-section ${allGood ? "is-ok" : health.isPending ? "" : "is-down"}`}
      >
        <div className="sb-measure">
          <Badge className="mb-4">
            <i className="bi bi-activity" /> {content.badge}
          </Badge>

          <h1 className="sb-display mb-3">{banner.title}</h1>
          <p className="sb-lead mb-4">{banner.lead}</p>

          <div className="d-flex flex-wrap align-items-center gap-3">
            <button
              type="button"
              className="sb-pill sb-pill-outline"
              disabled={health.isFetching}
              onClick={() => health.refetch()}
            >
              {health.isFetching ? (
                <Spinner size={14} />
              ) : (
                <i className="bi bi-arrow-clockwise" />
              )}
              {health.isFetching ? content.checking : content.refresh}
            </button>

            {data?.timestamp && (
              <span className="sb-meta">
                {content.lastChecked}{" "}
                {new Date(data.timestamp).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="sb-section">
        <div className="d-flex flex-column gap-3">
          {components.map(({ key, icon, title, body, state }) => (
            <div className="sb-card sb-status-row" key={key}>
              <span className="sb-about-icon">
                <i className={`bi ${icon}`} />
              </span>

              <div className="min-w-0">
                <h2 className="sb-h3 mb-1">{title}</h2>
                <p className="sb-meta mb-0">{body}</p>
              </div>

              <span className={`sb-status-pill is-${state}`}>
                <i className="sb-status-pill-dot" />
                {content.states[state]}
              </span>
            </div>
          ))}
        </div>

        <div className="sb-status-note">
          <p className="mb-0">
            <i className="bi bi-info-circle" /> {content.note}
          </p>
          {typeof data?.uptime === "number" && (
            <span className="sb-meta text-nowrap">
              {content.uptime.replace("{time}", formatUptime(data.uptime))}
            </span>
          )}
        </div>
      </section>
    </>
  );
}
