export default function IconButton({ children, className = "", ...rest }) {
  return (
    <button
      type="button"
      className={`btn btn-primary btn-icon rounded-circle sb-fab ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
