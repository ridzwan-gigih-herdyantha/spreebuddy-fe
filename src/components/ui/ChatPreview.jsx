import Badge from "@/components/ui/Badge";
import Logo from "@/components/ui/Logo";
import { chatPreview } from "@/data/home";

function ProductRow({ icon, name, rating, meta, price }) {
  return (
    <div className="sb-card d-flex align-items-center gap-3 p-3 mt-2">
      <div className="sb-subtle rounded-3 d-flex align-items-center justify-content-center sb-icon-lg flex-none">
        <i className={`bi ${icon} fs-5`} />
      </div>
      <div className="flex-grow-1 min-w-0">
        <div className="sb-h3 text-truncate">{name}</div>
        <div className="sb-meta text-truncate">
          <i className="bi bi-star-fill sb-star" /> {rating} · {meta}
        </div>
      </div>
      <div className="sb-price text-primary">{price}</div>
    </div>
  );
}

function Message({ role, text, products = [], actions = [] }) {
  if (role === "user") {
    return <div className="sb-bubble sb-bubble-user">{text}</div>;
  }

  return (
    <div className="sb-bubble sb-bubble-ai" style={{ maxWidth: "100%" }}>
      {text}
      {products.map((p) => (
        <ProductRow key={p.name} {...p} />
      ))}
      {actions.length > 0 && (
        <div className="d-flex gap-2 mt-3">
          {actions.map((a) => (
            <button
              key={a.label}
              className={
                a.variant === "outline"
                  ? "sb-pill sb-pill-outline"
                  : "sb-pill border-0"
              }
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ChatPreview({ data = chatPreview }) {
  const { title, status, messages } = data;

  return (
    <div className="sb-card sb-shadow-lg sb-chat-preview ms-lg-auto">
      <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
        <div className="d-flex align-items-center gap-2">
          <Logo withText={false} />
          <span className="sb-brand-text fs-6">{title}</span>
        </div>
        <Badge variant="success">
          <i className="bi bi-circle-fill sb-glyph" /> {status}
        </Badge>
      </div>

      <div className="sb-subtle p-3 d-flex flex-column gap-3">
        {messages.map((msg, i) => (
          <Message key={i} {...msg} />
        ))}
      </div>
    </div>
  );
}
