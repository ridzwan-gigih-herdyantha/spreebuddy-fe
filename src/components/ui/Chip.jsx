export default function Chip({ onClick, children }) {
  return (
    <button type="button" className="sb-pill sb-pill-outline" onClick={onClick}>
      {children}
    </button>
  );
}
