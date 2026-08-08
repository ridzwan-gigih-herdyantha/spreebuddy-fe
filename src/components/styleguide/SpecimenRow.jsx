export default function SpecimenRow({ label, children }) {
  return (
    <div className="sb-spec-row">
      <div className="sb-meta">{label}</div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
