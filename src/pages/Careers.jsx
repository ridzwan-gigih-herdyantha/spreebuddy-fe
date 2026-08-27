import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import { listJobs } from "@/api/careers";
import { formatRelative } from "@/utils/format";
import { careersContent } from "@/data/careers";

// A missing endpoint or an unreachable server both mean "nothing published",
// not "something broke". Anything else is a genuine failure worth showing.
const isUnpublished = (error) =>
  error?.status === 404 || error?.status === 0 || error?.status === 501;

export default function Careers() {
  const content = careersContent;

  const jobs = useQuery({
    queryKey: ["careers"],
    queryFn: listJobs,
    retry: false,
  });

  const items = jobs.data?.data ?? [];
  const total = jobs.data?.meta?.total ?? items.length;
  const broke = jobs.isError && !isUnpublished(jobs.error);
  const nothing = !jobs.isPending && !broke && items.length === 0;

  return (
    <>
      <section className="sb-gradient-hero sb-section">
        <div className="sb-measure">
          <Badge className="mb-4">
            <i className="bi bi-briefcase" /> {content.badge}
          </Badge>

          <h1 className="sb-display mb-3">{content.title}</h1>
          <p className="sb-lead mb-0">{content.lead}</p>
        </div>
      </section>

      <section className="sb-section">
        <div className="d-flex flex-wrap align-items-baseline justify-content-between gap-2 mb-4">
          <h2 className="sb-h1 mb-0">{content.openings}</h2>
          {items.length > 0 && (
            <span className="sb-meta">
              {total === 1
                ? content.countOne
                : content.countMany.replace("{n}", total)}
            </span>
          )}
        </div>

        {jobs.isPending && (
          <div className="d-flex flex-column gap-3">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="sb-skeleton-card" height={92} />
            ))}
          </div>
        )}

        {broke && (
          <div className="sb-card p-5 text-center">
            <h3 className="sb-h2 mb-2">{content.failed.title}</h3>
            <p className="sb-lead mb-4">{content.failed.lead}</p>
            <button
              type="button"
              className="sb-pill sb-pill-outline"
              onClick={() => jobs.refetch()}
            >
              <i className="bi bi-arrow-clockwise" /> {content.failed.retry}
            </button>
          </div>
        )}

        {nothing && (
          <div className="sb-card p-5 text-center">
            <h3 className="sb-h2 mb-2">{content.empty.title}</h3>
            <p className="sb-lead sb-measure mx-auto mb-0">
              {content.empty.lead}
            </p>
          </div>
        )}

        {items.length > 0 && (
          <div className="d-flex flex-column gap-3">
            {items.map((job) => (
              <article className="sb-card sb-job" key={job.id}>
                <div className="min-w-0">
                  <h3 className="sb-h3 mb-2">{job.title}</h3>

                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {job.department && (
                      <span className="sb-pill">{job.department}</span>
                    )}
                    {job.location && (
                      <span className="sb-pill sb-pill-outline">
                        <i className="bi bi-geo-alt" /> {job.location}
                      </span>
                    )}
                    {job.type && (
                      <span className="sb-pill sb-pill-outline">
                        {job.type}
                      </span>
                    )}
                  </div>

                  {job.description && (
                    <p className="sb-lead mb-0">{job.description}</p>
                  )}

                  {job.createdAt && (
                    <p className="sb-caption mb-0 mt-2">
                      {content.posted} {formatRelative(job.createdAt)}
                    </p>
                  )}
                </div>

                {job.applyUrl && (
                  <a
                    href={job.applyUrl}
                    className="btn btn-primary rounded-pill px-4 text-nowrap"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {content.apply} <i className="bi bi-arrow-up-right" />
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="sb-section sb-subtle">
        <div className="sb-card sb-help-contact">
          <div>
            <h2 className="sb-h2 mb-2">{content.speculative.title}</h2>
            <p className="sb-lead mb-0">{content.speculative.lead}</p>
          </div>

          <Link
            to={content.speculative.button.to}
            className="btn btn-primary rounded-pill px-4 text-nowrap"
          >
            {content.speculative.button.label}
          </Link>
        </div>
      </section>
    </>
  );
}
