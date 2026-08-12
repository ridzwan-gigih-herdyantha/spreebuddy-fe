import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";
import Logo from "@/components/ui/Logo";
import { currentPrice, formatPrice, formatSpec } from "@/utils/format";

function ProductRow({ product, onMention }) {
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

      <button
        type="button"
        className="sb-mention-btn"
        aria-label={`Mention ${product.name}`}
        onClick={() => onMention?.(product.name)}
      >
        <i className="bi bi-at" />
      </button>

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
                <td key={product.id}>{formatSpec(key, product[key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ChatMessage({ message, onMention }) {
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
        <div className="sb-markdown">
          <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
        </div>

        {products.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            onMention={onMention}
          />
        ))}

        {comparison && <Comparison data={comparison} />}
      </div>
    </div>
  );
}
