import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Badge from "@/components/ui/Badge";
import Logo from "@/components/ui/Logo";
import Skeleton from "@/components/ui/Skeleton";
import { getHealth } from "@/api/health";
import { listProducts } from "@/api/products";
import { currentPrice, formatPrice, isOnSale } from "@/utils/format";
import { chatPreview } from "@/data/home";

const POOL = 6;
const SHOWN = 2;
const FRESH_FOR = 5 * 60 * 1000;

const discount = ({ salePrice, regularPrice }) =>
  Math.round((1 - salePrice / regularPrice) * 100);

// Discounted lines make the better answer, so they go first; the rest of the
// page order fills in behind them.
function pick(products) {
  const sale = products.filter(isOnSale);
  const rest = products.filter((product) => !isOnSale(product));
  return [...sale, ...rest].slice(0, SHOWN);
}

function ProductRow({ product, content }) {
  const sale = isOnSale(product);

  return (
    <Link to={`/product/${product.slug}`} className="sb-preview-row">
      <span className="sb-subtle rounded-3 d-flex align-items-center justify-content-center sb-icon-lg flex-none">
        <i className="bi bi-box-seam fs-5" />
      </span>

      <span className="flex-grow-1 min-w-0">
        <span className="sb-h3 d-block text-truncate">{product.name}</span>
        <span className="sb-meta d-block text-truncate">
          {product.category}
          {" · "}
          {product.stock > 0
            ? content.inStock.replace("{n}", product.stock)
            : content.soldOut}
        </span>
      </span>

      <span className="text-end flex-none">
        <span className="sb-price text-primary d-block">
          {formatPrice(currentPrice(product))}
        </span>
        {sale && (
          <span className="sb-preview-save">
            {content.save.replace("{n}", discount(product))}
          </span>
        )}
      </span>
    </Link>
  );
}

export default function ChatPreview({ data = chatPreview, onAsk }) {
  const content = data;

  const products = useQuery({
    queryKey: ["products", "preview"],
    queryFn: () => listProducts({ page: 1, limit: POOL }),
    staleTime: FRESH_FOR,
    retry: false,
  });

  // The badge claims the assistant is reachable, so it answers to the same
  // health check the status page uses rather than being decoration.
  const health = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    staleTime: FRESH_FOR,
    retry: false,
  });

  const items = pick(products.data?.data ?? []);
  const hasSale = items.some(isOnSale);

  const answer = products.isError
    ? content.answerEmpty
    : hasSale
      ? content.answerSale
      : content.answerPlain;

  const state = health.isPending ? "checking" : health.isError ? "down" : "up";

  return (
    <div className="sb-card sb-shadow-lg sb-chat-preview ms-lg-auto">
      <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
        <div className="d-flex align-items-center gap-2">
          <Logo withText={false} />
          <span className="sb-brand-text fs-6">{content.title}</span>
        </div>
        <Badge variant={state === "up" ? "success" : "outline"}>
          <i className="bi bi-circle-fill sb-glyph" /> {content.status[state]}
        </Badge>
      </div>

      <div className="sb-subtle p-3 d-flex flex-column gap-3">
        <div className="sb-bubble sb-bubble-user">{content.question}</div>

        <div className="sb-bubble sb-bubble-ai" style={{ maxWidth: "100%" }}>
          {products.isPending ? <Skeleton width="80%" height={12} /> : answer}

          {products.isPending &&
            Array.from({ length: SHOWN }, (_, index) => (
              <span className="sb-preview-row is-static" key={index}>
                <Skeleton width={44} height={44} radius={12} />
                <Skeleton height={12} />
              </span>
            ))}

          {items.map((product) => (
            <ProductRow key={product.id} product={product} content={content} />
          ))}

          {items.length > 0 && (
            <div className="d-flex gap-2 mt-3">
              {items.length > 1 && (
                <button
                  type="button"
                  className="sb-pill border-0"
                  onClick={() =>
                    onAsk?.(
                      content.comparePrompt.replace(
                        "{names}",
                        items.map(({ name }) => name).join(" and "),
                      ),
                    )
                  }
                >
                  {content.compare}
                </button>
              )}
              <Link to="/shop" className="sb-pill sb-pill-outline">
                {content.more}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
