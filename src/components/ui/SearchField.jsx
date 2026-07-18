import { Form } from "react-bootstrap";

export default function SearchField({
  placeholder = "Search",
  value,
  onChange,
  className = "",
}) {
  return (
    <Form.Control
      type="search"
      placeholder={placeholder}
      aria-label={placeholder}
      value={value}
      onChange={onChange}
      className={`sb-search bg-body-secondary border-0 rounded-pill px-3 ${className}`}
    />
  );
}
