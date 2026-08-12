import { Link } from "react-router-dom";
import Logo from "@/components/ui/Logo";
import { currentPrice, formatPrice } from "@/utils/format";

function ProductRow({ product }) {
  return (
    <div className="sb-chat-product">
      <span className="sb-chat-thumb">
        <i className="bi bi-box-seam" />
      </span>

      <div className="min-w-0">
        <div className="sb-chat-product-name text-truncate">{product.name}</div>
        <div className="sb-meta text-truncate">
          {product.category} · {product.stock} in stock
        </div>
      </div>

      <span className="fw-bold text-primary">
        {formatPrice(currentPrice(product))}
      </span>

      <Link
        to={`/product/${product.id}`}
        className="sb-pill sb-pill-outline text-nowrap"
      >
        View
      </Link>
    </div>
  );
}

function Comparison({ data }) {
  return (
    <div className="sb-chat-compare">
      <table>
        <thead>
          <tr>
            <th />
            {data.products.map((product) => (
              <th key={product.id}>{product.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.fields.map(({ key, label }) => (
            <tr key={key}>
              <td>{label}</td>
              {data.products.map((product) => (
                <td key={product.id}>
                  {key.toLowerCase().includes("price")
                    ? formatPrice(product[key])
                    : String(product[key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";
  const attachments = message.attachments;
  const products = attachments?.products ?? [];
  const comparison = attachments?.type === "comparison" ? attachments : null;

  if (isUser) {
    return (
      <div className="sb-chat-turn is-user">
        <div className="sb-bubble sb-bubble-user">{message.content}</div>
      </div>
    );
  }

  return (
    <div className="sb-chat-turn">
      <Logo withText={false} />

      <div className="sb-bubble sb-bubble-ai">
        {message.content}

        {products.map((product) => (
          <ProductRow key={product.id} product={product} />
        ))}

        {comparison && <Comparison data={comparison} />}
      </div>
    </div>
  );
}
