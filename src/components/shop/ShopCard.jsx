import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { currentPrice, formatPrice, isOnSale } from "@/utils/format";
import { LOW_STOCK_THRESHOLD } from "@/data/shop";

export default function ShopCard({
  product,
  wishlisted,
  busy,
  onToggleWishlist,
  onAddToCart,
}) {
  const { id, name, category, stock } = product;
  const soldOut = stock <= 0;
  const lowStock = !soldOut && stock <= LOW_STOCK_THRESHOLD;
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1500);
    return () => clearTimeout(timer);
  }, [added]);

  return (
    <article className="sb-card sb-card-hover sb-shop-card h-100">
      <div className="sb-shop-media">
        <i className="bi bi-box-seam" />
        {soldOut && <span className="sb-shop-flag">Out of stock</span>}
      </div>

      <div className="sb-shop-body">
        {category && <span className="sb-pill sb-shop-badge">{category}</span>}

        <h3 className="sb-shop-name text-truncate" title={name}>
          {name}
        </h3>

        <p className="sb-shop-meta">
          <i className="bi bi-star-fill sb-star" />
          {soldOut ? "Currently unavailable" : `${stock} in stock`}
        </p>

        <div className="sb-shop-price">
          <span className="sb-shop-price-now">
            {formatPrice(currentPrice(product))}
          </span>
          {isOnSale(product) && (
            <span className="sb-price-old d-block">
              {formatPrice(product.regularPrice)}
            </span>
          )}
          {lowStock && (
            <span className="sb-shop-lowstock">Only {stock} left</span>
          )}
        </div>
      </div>

      <div className="sb-shop-actions">
        <button
          type="button"
          className="btn btn-primary rounded-pill flex-grow-1"
          disabled={soldOut}
          onClick={() => {
            onAddToCart(product);
            setAdded(true);
          }}
        >
          <i className={`bi ${added ? "bi-check2" : "bi-cart2"}`} />{" "}
          {soldOut ? "Out of stock" : added ? "Added" : "Add to cart"}
        </button>

        <Link
          to={`/product/${id}`}
          className="sb-shop-icon-btn"
          aria-label={`View ${name}`}
        >
          <i className="bi bi-eye" />
        </Link>

        <button
          type="button"
          className="sb-shop-icon-btn"
          aria-pressed={wishlisted}
          aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
          disabled={busy}
          onClick={() => onToggleWishlist(product)}
        >
          <i className={`bi ${wishlisted ? "bi-heart-fill" : "bi-heart"}`} />
        </button>
      </div>
    </article>
  );
}
