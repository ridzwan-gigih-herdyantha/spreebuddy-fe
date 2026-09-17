import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { getProduct } from "@/api/products";
import { currentPrice, formatPrice, isOnSale } from "@/utils/format";
import { LOW_STOCK_THRESHOLD } from "@/data/shop";
import { useCart } from "@/hooks/useCart";
import { usePageSeo } from "@/hooks/usePageSeo";
import ProductMedia from "@/components/ui/ProductMedia";
import { absoluteUrl, summarize } from "@/utils/seo";

function productSeo(product, slug) {
  const url = absoluteUrl(`/product/${slug}`);
  const images = (product.images ?? []).map(absoluteUrl);
  const description = summarize(
    product.description ||
      `${product.name} in ${product.category}, available on SpreeBuddy.`,
  );

  return {
    title: product.name,
    description,
    image: images[0],
    imageAlt: product.name,
    type: "product",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description,
        sku: product.id,
        category: product.category,
        ...(images.length ? { image: images } : {}),
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "USD",
          price: currentPrice(product).toFixed(2),
          itemCondition: "https://schema.org/NewCondition",
          availability:
            product.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { name: "Home", item: absoluteUrl("/") },
          { name: "Shop", item: absoluteUrl("/shop") },
          { name: product.name, item: url },
        ].map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          ...crumb,
        })),
      },
    ],
  };
}

export default function ProductDetail() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProduct(slug),
    retry: false,
  });

  // A missing product answers 200 from the SPA, so it has to opt out of the
  // index itself or it would be crawled as a thin duplicate page.
  usePageSeo(
    isError
      ? { title: "Product not found", noindex: true }
      : data?.data
        ? productSeo(data.data, slug)
        : null,
  );

  if (isPending) {
    return (
      <section className="sb-section">
        <div className="sb-card sb-shop-skeleton" />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="sb-section">
        <p className="sb-form-error" role="alert">
          <i className="bi bi-exclamation-triangle-fill" /> {error.message}
        </p>
        <Link to="/shop" className="sb-pill sb-pill-outline mt-3">
          Back to shop
        </Link>
      </section>
    );
  }

  const product = data.data;
  const soldOut = product.stock <= 0;
  const lowStock = !soldOut && product.stock <= LOW_STOCK_THRESHOLD;

  return (
    <section className="sb-section">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Shop", to: "/shop" },
          { label: product.name },
        ]}
      />

      <div className="row g-5 mt-0">
        <div className="col-lg-6">
          <div className="sb-card sb-shop-media">
            <ProductMedia product={product} priority />
          </div>
        </div>

        <div className="col-lg-6">
          {product.category && (
            <span className="sb-pill sb-shop-badge">{product.category}</span>
          )}

          <h1 className="sb-h1 mb-2">{product.name}</h1>

          <div className="d-flex align-items-baseline gap-2 mb-3">
            <span className="sb-h2 text-primary">
              {formatPrice(currentPrice(product))}
            </span>
            {isOnSale(product) && (
              <span className="sb-price-old">
                {formatPrice(product.regularPrice)}
              </span>
            )}
          </div>

          <p className="sb-meta mb-4">
            {soldOut
              ? "Out of stock"
              : `${product.stock} in stock${lowStock ? " · running low" : ""}`}
          </p>

          {product.description && (
            <p className="sb-body sb-measure mb-4">{product.description}</p>
          )}

          <div className="d-flex align-items-center gap-3">
            <div className="sb-stepper">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              >
                <i className="bi bi-dash" />
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={quantity >= product.stock}
                onClick={() => setQuantity((value) => value + 1)}
              >
                <i className="bi bi-plus" />
              </button>
            </div>

            <button
              type="button"
              className="btn btn-primary rounded-pill px-4"
              disabled={soldOut}
              onClick={() => addItem(product, quantity)}
            >
              <i className="bi bi-cart2" />{" "}
              {soldOut ? "Out of stock" : "Add to cart"}
            </button>
          </div>

          <dl className="sb-spec-list mt-5">
            {product.type && (
              <div>
                <dt>Type</dt>
                <dd>{product.type}</dd>
              </div>
            )}
            {typeof product.weight === "number" && (
              <div>
                <dt>Weight</dt>
                <dd>{product.weight} kg</dd>
              </div>
            )}
            {product.dimensions && (
              <div>
                <dt>Dimensions</dt>
                <dd>
                  {product.dimensions.length} × {product.dimensions.width} ×{" "}
                  {product.dimensions.height} cm
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </section>
  );
}
