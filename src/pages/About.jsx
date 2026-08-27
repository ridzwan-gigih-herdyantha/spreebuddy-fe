import { Fragment } from "react";
import { Link } from "react-router-dom";
import Badge from "@/components/ui/Badge";
import CtaBanner from "@/components/ui/CtaBanner";
import GradientBadge from "@/components/ui/GradientBadge";
import {
  aboutContent,
  aboutCta,
  aboutFaq,
  aboutPromises,
  aboutSteps,
  aboutStory,
} from "@/data/about";

export default function About() {
  return (
    <>
      <section className="sb-gradient-hero sb-section text-center">
        <div className="sb-measure-wide mx-auto">
          <Badge className="mb-4">
            <i className="bi bi-stars" /> {aboutContent.badge}
          </Badge>

          <h1 className="sb-display mb-3">
            {aboutContent.title.map((line, index) => (
              <Fragment key={line}>
                {line}
                {index < aboutContent.title.length - 1 && <br />}
              </Fragment>
            ))}
          </h1>

          <p className="sb-lead mb-4">{aboutContent.lead}</p>

          <div className="d-flex flex-wrap justify-content-center gap-2">
            <Link
              to={aboutContent.cta.to}
              className="btn btn-primary rounded-pill px-4"
            >
              {aboutContent.cta.label} <i className="bi bi-arrow-right" />
            </Link>
            <Link
              to={aboutContent.secondary.to}
              className="sb-pill sb-pill-outline"
            >
              {aboutContent.secondary.label}
            </Link>
          </div>
        </div>
      </section>

      <section className="sb-section">
        <div className="row g-5 align-items-start">
          <div className="col-lg-5">
            <p className="sb-eyebrow text-uppercase mb-2">
              {aboutStory.eyebrow}
            </p>
            <h2 className="sb-h1 mb-0">{aboutStory.title}</h2>
          </div>
          <div className="col-lg-7">
            {aboutStory.body.map((paragraph) => (
              <p className="sb-lead" key={paragraph.slice(0, 24)}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="sb-section sb-subtle">
        <div className="text-center mb-5">
          <p className="sb-eyebrow text-uppercase mb-2">{aboutSteps.eyebrow}</p>
          <h2 className="sb-h1 mb-0">{aboutSteps.title}</h2>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
          {aboutSteps.items.map(({ icon, title, body }, index) => (
            <div className="col" key={title}>
              <article className="sb-card h-100 p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <GradientBadge className="sb-pill-icon">
                    <i className={`bi ${icon}`} />
                  </GradientBadge>
                  <span className="sb-about-step">0{index + 1}</span>
                </div>
                <h3 className="sb-h3 mb-2">{title}</h3>
                <p className="sb-lead mb-0">{body}</p>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section className="sb-section">
        <div className="row g-5">
          <div className="col-lg-4">
            <p className="sb-eyebrow text-uppercase mb-2">
              {aboutPromises.eyebrow}
            </p>
            <h2 className="sb-h1 mb-0">{aboutPromises.title}</h2>
          </div>

          <div className="col-lg-8">
            <div className="row row-cols-1 row-cols-md-2 g-4">
              {aboutPromises.items.map(({ icon, title, body }) => (
                <div className="col" key={title}>
                  <div className="d-flex gap-3">
                    <span className="sb-about-icon">
                      <i className={`bi ${icon}`} />
                    </span>
                    <div>
                      <h3 className="sb-h3 mb-1">{title}</h3>
                      <p className="sb-lead mb-0">{body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sb-section sb-subtle">
        <div className="row g-5">
          <div className="col-lg-4">
            <p className="sb-eyebrow text-uppercase mb-2">{aboutFaq.eyebrow}</p>
            <h2 className="sb-h1 mb-0">{aboutFaq.title}</h2>
          </div>

          <div className="col-lg-8">
            <div className="sb-card">
              {aboutFaq.items.map(({ q, a }) => (
                <details className="sb-faq" key={q}>
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
      </section>

      <section className="sb-section">
        <CtaBanner data={aboutCta} className="sb-shadow-lg" />
      </section>
    </>
  );
}
