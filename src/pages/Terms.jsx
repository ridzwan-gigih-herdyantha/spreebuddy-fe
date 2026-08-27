import { Link } from "react-router-dom";
import Badge from "@/components/ui/Badge";
import { legalEntity } from "@/data/legal";
import { termsContent, termsSections } from "@/data/terms";

export default function Terms() {
  const content = termsContent;

  return (
    <>
      <section className="sb-gradient-hero sb-section">
        <div className="sb-measure">
          <Badge className="mb-4">
            <i className="bi bi-file-text" /> {content.badge}
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
              {termsSections.map(({ id, title }) => (
                <a href={`#${id}`} key={id}>
                  {title}
                </a>
              ))}
            </nav>
          </div>

          <div className="col-lg-9">
            <div className="sb-legal sb-measure">
              {termsSections.map(({ id, title, blocks }) => (
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

              <section id="law">
                <h2 className="sb-h2 mb-3">Which law applies</h2>
                <p className="sb-lead">
                  These terms are governed by the laws of{" "}
                  {legalEntity.jurisdiction}, and disputes are dealt with there.
                </p>
                <p className="sb-lead">
                  Questions about any of this go to{" "}
                  <a href={`mailto:${legalEntity.supportEmail}`}>
                    {legalEntity.supportEmail}
                  </a>
                  . How we handle your data is a separate matter, covered in the{" "}
                  <Link to="/privacy">privacy page</Link>.
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
