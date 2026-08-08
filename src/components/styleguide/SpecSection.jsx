export default function SpecSection({ id, eyebrow, title, hint, children }) {
  return (
    <section id={id} className="sb-ds-anchor mb-5 pb-2">
      <div className="mb-4">
        {eyebrow && <div className="sb-eyebrow mb-2">{eyebrow}</div>}
        <h2 className="sb-h2 mb-1">{title}</h2>
        {hint && <p className="sb-lead mb-0">{hint}</p>}
      </div>
      {children}
    </section>
  );
}
