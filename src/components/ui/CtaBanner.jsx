import { Link } from "react-router-dom";
import { footerBannerCTA } from "@/data/home";

const TONES = {
  gradient: "sb-gradient-vertical",
  dark: "sb-dark",
};

export default function CtaBanner({ data = footerBannerCTA, className = "" }) {
  const { tone = "gradient", title, lead, button } = data;

  return (
    <div
      className={`sb-cta text-center ${TONES[tone] ?? TONES.gradient} ${className}`}
    >
      <h2 className="sb-h1 mb-2">{title}</h2>
      <p className="sb-cta-lead mx-auto mb-4">{lead}</p>

      <Link to={button.to} className="btn sb-btn-invert fw-semibold px-4">
        {button.label} <i className="bi bi-arrow-right" />
      </Link>
    </div>
  );
}
