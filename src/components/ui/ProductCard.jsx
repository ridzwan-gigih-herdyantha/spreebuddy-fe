import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import IconButton from "@/components/ui/IconButton";

export default function ProductCard({ product, onAdd }) {
  const { icon, badge, name, rating, meta, price, oldPrice } = product;

  return (
    <Card hover className="h-100 d-flex flex-column">
      <div className="sb-gradient-media sb-media d-flex align-items-center justify-content-center">
        <i className={`bi ${icon} display-4 text-body`} />
      </div>

      <div className="p-3 d-flex flex-column flex-grow-1">
        {badge && <Badge className="align-self-start mb-2">{badge}</Badge>}

        <div className="sb-h3">{name}</div>
        <div className="sb-meta mt-1">
          <i className="bi bi-star-fill sb-star" /> {rating} · {meta}
        </div>

        <div className="d-flex align-items-end justify-content-between mt-3">
          <div>
            <span className="sb-price">{price}</span>
            {oldPrice && <span className="sb-price-old ms-2">{oldPrice}</span>}
          </div>
          <IconButton
            aria-label={`Add ${name}`}
            onClick={() => onAdd?.(product)}
          >
            <i className="bi bi-plus-lg" />
          </IconButton>
        </div>
      </div>
    </Card>
  );
}
