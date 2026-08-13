import { Link } from "react-router-dom";
import {
  currentPrice,
  formatPrice,
  formatRelative,
  isOnSale,
} from "@/utils/format";

export default function WishlistCard({
  entry,
  selected,
  selectDisabled,
  removing,
  onSelect,
  onRemove,
}) {
  const { product, createdAt, note } = entry;
  const soldOut = (product?.stock ?? 0) <= 0;

  return (
    <article
      className={`sb-card sb-card-hover sb-shop-card h-100 ${removing ? "is-removing" : ""}`}
    >
      <div className="sb-shop-media">
        <i className="bi bi-box-seam" />
        {soldOut && <span className="sb-shop-flag">Out of stock</span>}
      </div>

      <div className="sb-shop-body">
        {product?.category && (
          <span className="sb-pill sb-shop-badge">{product.category}</span>
        )}

        <label
          className={`sb-wish-name ${selectDisabled ? "is-disabled" : ""}`}
        >
          <input
            type="checkbox"
            className="sb-check-box"
            checked={selected}
            disabled={selectDisabled}
            onChange={onSelect}
            aria-label={`Select ${product?.name ?? "item"} to compare`}
          />
          <span className="text-truncate" title={product?.name}>
            {product?.name ?? "Product unavailable"}
          </span>
        </label>

        <p className="sb-shop-meta">
          <i className="bi bi-clock-history" />
          Saved {formatRelative(createdAt)}
        </p>

        {note && <p className="sb-wish-note">{note}</p>}

        <div className="sb-shop-price">
          <span className="sb-shop-price-now">
            {formatPrice(currentPrice(product ?? {}))}
          </span>
          {product && isOnSale(product) && (
            <span className="sb-price-old d-block">
              {formatPrice(product.regularPrice)}
            </span>
          )}
        </div>
      </div>

      <div className="sb-shop-actions">
        <Link
          to={`/product/${product?.slug}`}
          className="btn btn-primary rounded-pill flex-grow-1"
        >
          View
        </Link>

        <button
          type="button"
          className="sb-shop-icon-btn"
          aria-label={`Remove ${product?.name ?? "item"} from wishlist`}
          disabled={removing}
          onClick={onRemove}
        >
          <i
            className={`bi ${removing ? "bi-arrow-repeat sb-spin" : "bi-trash3"}`}
          />
        </button>
      </div>
    </article>
  );
}
