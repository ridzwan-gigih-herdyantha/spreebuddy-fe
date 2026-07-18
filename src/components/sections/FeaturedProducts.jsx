import { Link } from "react-router-dom";
import ProductCard from "@/components/ui/ProductCard";
import { featuredProducts } from "@/data/home";

export default function FeaturedProducts({ data = featuredProducts, onAdd }) {
  const { title, subtitle, viewAll, items } = data;

  return (
    <section className="sb-section">
      <div className="d-flex align-items-end justify-content-between mb-4">
        <div>
          <h2 className="sb-h2 mb-1">{title}</h2>
          <p className="sb-lead mb-0">{subtitle}</p>
        </div>
        {viewAll && (
          <Link to="/shop" className="sb-pill sb-pill-outline text-nowrap">
            {viewAll} <i className="bi bi-arrow-right" />
          </Link>
        )}
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
        {items.map((product) => (
          <div className="col" key={product.id}>
            <ProductCard product={product} onAdd={onAdd} />
          </div>
        ))}
      </div>
    </section>
  );
}
