import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Select from "@/components/ui/Select";
import { currentPrice, formatPrice } from "@/utils/format";
import { chatContent, chatSortOptions } from "@/data/chatPage";

const sorters = {
  "price-asc": (a, b) => currentPrice(a) - currentPrice(b),
  "price-desc": (a, b) => currentPrice(b) - currentPrice(a),
};

export default function ResultsPanel({ products, onAddToCart }) {
  const content = chatContent.results;
  const [category, setCategory] = useState(content.allCategories);
  const [sort, setSort] = useState("relevance");

  const categories = useMemo(
    () =>
      [...new Set(products.map((product) => product.category))].filter(Boolean),
    [products],
  );

  const visible = useMemo(() => {
    const filtered =
      category === content.allCategories
        ? products
        : products.filter((product) => product.category === category);
    return sorters[sort] ? [...filtered].sort(sorters[sort]) : filtered;
  }, [products, category, sort, content.allCategories]);

  return (
    <aside className="sb-chat-rail">
      <div className="d-flex align-items-center justify-content-between gap-3 mb-1">
        <h2 className="sb-h2 mb-0">{content.title}</h2>
        {products.length > 0 && (
          <Select value={sort} options={chatSortOptions} onChange={setSort} />
        )}
      </div>

      {products.length === 0 ? (
        <p className="sb-meta mb-0">{content.empty}</p>
      ) : (
        <>
          <p className="sb-meta">
            {visible.length} {visible.length === 1 ? "match" : "matches"} for
            your search
          </p>

          {categories.length > 1 && (
            <div className="d-flex flex-wrap gap-2 mb-3">
              {[content.allCategories, ...categories].map((name) => (
                <button
                  key={name}
                  type="button"
                  className={`sb-pill ${category === name ? "sb-pill-gradient" : "sb-pill-outline"}`}
                  onClick={() => setCategory(name)}
                >
                  {name}
                </button>
              ))}
            </div>
          )}

          <div className="d-flex flex-column gap-3">
            {visible.map((product) => (
              <article key={product.id} className="sb-card sb-chat-result">
                <div className="d-flex gap-3">
                  <span className="sb-chat-thumb">
                    <i className="bi bi-box-seam" />
                  </span>
                  <div className="min-w-0">
                    <div className="sb-chat-product-name text-truncate">
                      {product.name}
                    </div>
                    <div className="sb-meta">{product.stock} in stock</div>
                    <div className="sb-chat-price">
                      {formatPrice(currentPrice(product))}
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2 mt-3">
                  <button
                    type="button"
                    className="btn btn-primary rounded-pill flex-grow-1"
                    disabled={product.stock <= 0}
                    onClick={() => onAddToCart(product)}
                  >
                    {product.stock <= 0 ? "Out of stock" : "Add to cart"}
                  </button>
                  <Link
                    to={`/product/${product.id}`}
                    className="sb-shop-icon-btn"
                    aria-label={`View ${product.name}`}
                  >
                    <i className="bi bi-eye" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </aside>
  );
}
