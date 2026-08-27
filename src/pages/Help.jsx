import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Badge from "@/components/ui/Badge";
import { helpContent, helpTopics } from "@/data/help";

export default function Help() {
  const content = helpContent;
  const [term, setTerm] = useState("");

  const topics = useMemo(() => {
    const needle = term.trim().toLowerCase();
    if (!needle) return helpTopics;

    return helpTopics
      .map((topic) => ({
        ...topic,
        items: topic.items.filter(({ q, a }) =>
          `${q} ${a}`.toLowerCase().includes(needle),
        ),
      }))
      .filter((topic) => topic.items.length > 0);
  }, [term]);

  const searching = term.trim().length > 0;

  return (
    <>
      <section className="sb-gradient-hero sb-section text-center">
        <div className="sb-measure mx-auto">
          <Badge className="mb-4">
            <i className="bi bi-life-preserver" /> {content.badge}
          </Badge>

          <h1 className="sb-display mb-3">{content.title}</h1>
          <p className="sb-lead mb-4">{content.lead}</p>

          <label className="sb-help-search">
            <i className="bi bi-search" />
            <input
              type="search"
              value={term}
              placeholder={content.searchPlaceholder}
              aria-label={content.searchPlaceholder}
              onChange={(event) => setTerm(event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="sb-section">
        {topics.length === 0 ? (
          <div className="text-center py-5">
            <p className="sb-lead mb-4">{content.noMatch}</p>
            <Link
              to={content.contact.button.to}
              className="btn btn-primary rounded-pill px-4"
            >
              {content.contact.button.label}
            </Link>
          </div>
        ) : (
          <div className="d-flex flex-column gap-5">
            {topics.map(({ id, icon, title, items }) => (
              <div className="row g-4" key={id}>
                <div className="col-lg-4">
                  <div className="d-flex align-items-center gap-3">
                    <span className="sb-about-icon">
                      <i className={`bi ${icon}`} />
                    </span>
                    <h2 className="sb-h2 mb-0">{title}</h2>
                  </div>
                </div>

                <div className="col-lg-8">
                  <div className="sb-card">
                    {items.map(({ q, a }) => (
                      <details className="sb-faq" key={q} open={searching}>
                        <summary>
                          {q}
                          <i className="bi bi-chevron-down" />
                        </summary>
                        <p className="sb-lead mb-0">{a}</p>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="sb-section sb-subtle">
        <div className="sb-card sb-help-contact">
          <div>
            <h2 className="sb-h2 mb-2">{content.contact.title}</h2>
            <p className="sb-lead mb-0">{content.contact.lead}</p>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <Link
              to={content.contact.secondary.to}
              className="sb-pill sb-pill-outline"
            >
              <i className="bi bi-stars" /> {content.contact.secondary.label}
            </Link>
            <Link
              to={content.contact.button.to}
              className="btn btn-primary rounded-pill px-4 text-nowrap"
            >
              {content.contact.button.label}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
