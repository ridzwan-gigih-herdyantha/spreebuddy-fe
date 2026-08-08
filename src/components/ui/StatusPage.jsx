import { Link } from "react-router-dom";
import Logo from "@/components/ui/Logo";

const TONES = {
  gradient: "sb-status-icon-gradient",
  warning: "sb-status-icon-warning",
  dark: "sb-status-icon-dark",
};

const ACTIONS = {
  primary: "btn btn-primary rounded-pill fw-semibold px-4",
  outline: "btn sb-btn-outline rounded-pill fw-semibold px-4",
};

function Action({ action }) {
  const className = ACTIONS[action.variant] ?? ACTIONS.primary;

  if (action.reload) {
    return (
      <button
        type="button"
        className={className}
        onClick={() => window.location.reload()}
      >
        {action.label}
      </button>
    );
  }

  return (
    <Link to={action.to} className={className}>
      {action.label}
    </Link>
  );
}

export default function StatusPage({ status, art, brand = false }) {
  const {
    tone = "gradient",
    icon,
    code,
    title,
    lead,
    actions = [],
    suggestionsTitle,
    suggestions = [],
    note,
  } = status;

  return (
    <section className="sb-status sb-gradient-hero">
      <div className="sb-measure text-center mx-auto">
        {brand && (
          <div className="mb-5">
            <Logo />
          </div>
        )}

        {art ? (
          <div className="sb-status-art mx-auto">{art}</div>
        ) : (
          <span className={`sb-status-icon ${TONES[tone] ?? TONES.gradient}`}>
            <i className={`bi ${icon}`} />
          </span>
        )}

        <div className="sb-eyebrow text-uppercase mt-4">{code}</div>
        <h1 className="sb-h1 mt-2 mb-3">{title}</h1>
        <p className="sb-lead mb-4">{lead}</p>

        {actions.length > 0 && (
          <div className="d-flex flex-wrap justify-content-center gap-3">
            {actions.map((action) => (
              <Action key={action.label} action={action} />
            ))}
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="mt-5">
            {suggestionsTitle && (
              <div className="sb-meta mb-3">{suggestionsTitle}</div>
            )}
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {suggestions.map(({ label, to, icon: chipIcon }) => (
                <Link key={to} to={to} className="sb-pill sb-pill-outline">
                  <i className={`bi ${chipIcon}`} /> {label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {note && <p className="sb-meta mt-4 mb-0">{note}</p>}
      </div>
    </section>
  );
}
