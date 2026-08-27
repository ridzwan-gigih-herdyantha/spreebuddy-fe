import { Link } from "react-router-dom";
import Badge from "@/components/ui/Badge";
import { legalEntity, privacyContent, privacySections } from "@/data/privacy";

export default function Privacy() {
  const content = privacyContent;

  return (
    <>
      <section className="sb-gradient-hero sb-section">
        <div className="sb-measure">
          <Badge className="mb-4">
            <i className="bi bi-shield-check" /> {content.badge}
          </Badge>

          <h1 className="sb-display mb-3">{content.title}</h1>
          <p className="sb-lead mb-3">{content.lead}</p>
          <p className="sb-meta mb-0">
            {content.updatedLabel} {legalEntity.updated}
          </p>
        </div>
      </section>

      <section className="sb-section">
        <div className="row g-5">
          <div className="col-lg-3">
            <nav className="sb-legal-nav" aria-label="On this page">
              {privacySections.map(({ id, title }) => (
                <a href={`#${id}`} key={id}>
                  {title}
                </a>
              ))}
            </nav>
          </div>

          <div className="col-lg-9">
            <div className="sb-legal sb-measure">
              {privacySections.map(({ id, title, blocks }) => (
                <section id={id} key={id}>
                  <h2 className="sb-h2 mb-3">{title}</h2>

                  {blocks.map(({ subtitle, body }) => (
                    <div key={body.slice(0, 32)}>
                      {subtitle && <h3 className="sb-h3 mb-1">{subtitle}</h3>}
                      <p className="sb-lead">{body}</p>
                    </div>
                  ))}
                </section>
              ))}

              <section id="contact">
                <h2 className="sb-h2 mb-3">Asking us about your data</h2>
                <p className="sb-lead">
                  Write to{" "}
                  <a href={`mailto:${legalEntity.contactEmail}`}>
                    {legalEntity.contactEmail}
                  </a>{" "}
                  and we will answer. If you would rather talk it through first,
                  the <Link to="/contact">contact page</Link> has the other ways
                  to reach us.
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
