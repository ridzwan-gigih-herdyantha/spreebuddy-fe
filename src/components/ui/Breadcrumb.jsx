import { Link } from "react-router-dom";

export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="sb-breadcrumb">
        {items.map(({ label, to }, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={label}>
              {isLast || !to ? (
                <span aria-current={isLast ? "page" : undefined}>{label}</span>
              ) : (
                <Link to={to}>{label}</Link>
              )}
              {!isLast && <i className="bi bi-chevron-right" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
