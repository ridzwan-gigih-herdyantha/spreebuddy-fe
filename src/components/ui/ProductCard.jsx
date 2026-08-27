import { Link } from "react-router-dom";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import IconButton from "@/components/ui/IconButton";
import Spinner from "@/components/ui/Spinner";
import { currentPrice, formatPrice, isOnSale } from "@/utils/format";
import { LOW_STOCK_THRESHOLD } from "@/data/shop";

export default function ProductCard({ product, onAdd, busy }) {
  const { slug, name, category, stock } = product;
  const soldOut = !stock || stock <= 0;

  return (
    <Card hover className="h-100 d-flex flex-column">
      <Link to={`/product/${slug}`} className="sb-product-media">
        <i className="bi bi-box-seam display-6 text-body" />
        {soldOut && <span className="sb-shop-flag">Out of stock</span>}
      </Link>

      <div className="p-3 d-flex flex-column flex-grow-1">
        {category && (
          <Badge className="align-self-start mb-2">{category}</Badge>
        )}

        <Link to={`/product/${slug}`} className="sb-h3 sb-prod-link">
          {name}
        </Link>

        <div className="sb-meta mt-1">
          {soldOut
            ? "Currently unavailable"
            : stock <= LOW_STOCK_THRESHOLD
              ? `Only ${stock} left`
              : `${stock} in stock`}
        </div>

        <div className="d-flex align-items-end justify-content-between mt-3">
          <div>
            <span className="sb-price">
              {formatPrice(currentPrice(product))}
            </span>
            {isOnSale(product) && (
              <span className="sb-price-old ms-2">
                {formatPrice(product.regularPrice)}
              </span>
            )}
          </div>

          <IconButton
            aria-label={`Add ${name} to cart`}
            disabled={soldOut || busy}
            onClick={() => onAdd?.(product)}
          >
            {busy ? <Spinner size={14} /> : <i className="bi bi-plus-lg" />}
          </IconButton>
        </div>
      </div>
    </Card>
  );
}
