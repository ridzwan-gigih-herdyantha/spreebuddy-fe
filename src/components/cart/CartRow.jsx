import { Link } from "react-router-dom";
import { currentPrice, formatPrice } from "@/utils/format";
import { LOW_STOCK_THRESHOLD } from "@/data/shop";

export default function CartRow({ item, busy, onQuantity, onRemove }) {
  const { product, quantity, total } = item;
  const stock = product?.stock ?? 0;
  const soldOut = stock <= 0;
  const lowStock = !soldOut && stock <= LOW_STOCK_THRESHOLD;
  const removing = busy === "remove";

  return (
    <div
      className={`sb-cart-row ${soldOut ? "is-blocked" : ""} ${removing ? "is-removing" : ""}`}
    >
      <span className="sb-cart-thumb">
        <i className="bi bi-box-seam" />
      </span>

      <div className="min-w-0">
        <Link to={`/product/${product?.id}`} className="sb-cart-name">
          {product?.name ?? "Product unavailable"}
        </Link>

        {product?.category && (
          <span className="sb-pill sb-shop-badge">{product.category}</span>
        )}

        <p className="sb-meta mb-0">
          Unit price {formatPrice(currentPrice(product ?? {}))}
        </p>

        {soldOut && (
          <p className="sb-cart-warn mb-0">
            Out of stock, remove it to place your order
          </p>
        )}
        {lowStock && <p className="sb-cart-warn mb-0">Only {stock} left</p>}
      </div>

      <div className="sb-cart-actions">
        <span className="sb-cart-total">{formatPrice(total)}</span>

        <div className="d-flex align-items-center gap-2">
          <div className="sb-stepper">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={soldOut || removing || quantity <= 1}
              onClick={() => onQuantity(quantity - 1)}
            >
              <i className="bi bi-dash" />
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={soldOut || removing || quantity >= stock}
              onClick={() => onQuantity(quantity + 1)}
            >
              <i className="bi bi-plus" />
            </button>
          </div>

          <button
            type="button"
            className="sb-cart-remove"
            aria-label={`Remove ${product?.name ?? "item"}`}
            disabled={removing}
            onClick={onRemove}
          >
            <i
              className={`bi ${removing ? "bi-arrow-repeat sb-spin" : "bi-trash3"}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
