import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import GradientBadge from "@/components/ui/GradientBadge";
import { howItWorks } from "@/data/home";

export default function HowItWorks({ data = howItWorks }) {
  const { eyebrow, title, subtitle, steps } = data;

  return (
    <section className="sb-section sb-surface">
      <div className="sb-measure text-center mx-auto mb-5">
        <Badge>{eyebrow}</Badge>
        <h2 className="sb-h1 mt-3 mb-2">{title}</h2>
        <p className="sb-lead mb-0">{subtitle}</p>
      </div>

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {steps.map((step, index) => (
          <div className="col" key={step.id}>
            <Card flat className="sb-step h-100 p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <GradientBadge className="sb-pill-icon">
                  <i className={`bi ${step.icon}`} />
                </GradientBadge>
                <span className="sb-eyebrow">Step {index + 1}</span>
              </div>

              <h3 className="sb-h3 mb-2">{step.title}</h3>
              <p className="sb-meta mb-0">{step.description}</p>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
