import { Link } from "react-router-dom";
import { adminSoonContent } from "@/data/admin";

export default function AdminSoon({ title }) {
  const { lead, back } = adminSoonContent;

  return (
    <div className="sb-admin-soon">
      <span className="sb-pill sb-pill-icon">
        <i className="bi bi-cone-striped" />
      </span>
      <h1 className="sb-h1 mt-4 mb-2">{title}</h1>
      <p className="sb-lead mb-4">{lead}</p>
      <Link to={back.to} className="sb-pill sb-pill-outline">
        <i className="bi bi-arrow-left" /> {back.label}
      </Link>
    </div>
  );
}
