import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ui/ProductCard";
import Skeleton from "@/components/ui/Skeleton";
import { listProducts } from "@/api/products";
import { featuredProducts } from "@/data/home";

const COUNT = 4;

export default function FeaturedProducts({
  data = featuredProducts,
  onAdd,
  busyOf,
}) {
  const { title, subtitle, viewAll } = data;

  const products = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => listProducts({ page: 1, limit: COUNT }),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const items = products.data?.data ?? [];

  return (
    <section className="sb-section">
      <div className="d-flex align-items-end justify-content-between mb-4">
        <div>
          <h1 className="sb-h1 mb-1">{title}</h1>
          <p className="sb-lead mb-0">{subtitle}</p>
        </div>
        {viewAll && (
          <Link to="/shop" className="sb-pill sb-pill-outline text-nowrap">
            {viewAll} <i className="bi bi-arrow-right" />
          </Link>
        )}
      </div>

      {products.isError ? (
        <p className="sb-lead text-center py-4 mb-0">{data.unavailable}</p>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
          {products.isPending
            ? Array.from({ length: COUNT }, (_, index) => (
                <div className="col" key={index}>
                  <Skeleton className="sb-skeleton-card" height={320} />
                </div>
              ))
            : items.map((product) => (
                <div className="col" key={product.id}>
                  <ProductCard
                    product={product}
                    onAdd={onAdd}
                    busy={Boolean(busyOf?.(product.id))}
                  />
                </div>
              ))}
        </div>
      )}
    </section>
  );
}
