import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "@/components/ui/Skeleton";
import { listProducts } from "@/api/products";
import { currentPrice, formatPrice } from "@/utils/format";
import { searchablePages } from "@/config/navigation";
import { globalSearchContent } from "@/data/search";

const MIN_CHARS = 2;
const MAX_PAGES = 4;
const MAX_PRODUCTS = 5;

export default function GlobalSearch() {
  const content = globalSearchContent;
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const query = useDeferredValue(term.trim());

  useEffect(() => {
    if (!open) return;

    const close = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const pages = useMemo(() => {
    const needle = query.toLowerCase();
    if (needle.length < MIN_CHARS) return [];
    return searchablePages
      .filter(({ label, keywords }) =>
        `${label} ${keywords ?? ""}`.toLowerCase().includes(needle),
      )
      .slice(0, MAX_PAGES);
  }, [query]);

  const products = useQuery({
    queryKey: ["search", "products", query],
    queryFn: () =>
      listProducts({ page: 1, limit: MAX_PRODUCTS, search: query }),
    enabled: open && query.length >= MIN_CHARS,
    placeholderData: (previous) => previous,
    retry: false,
  });

  const items = products.data?.data ?? [];
  const total = products.data?.meta?.total ?? 0;
  const active = open && query.length >= MIN_CHARS;
  const loading = products.isFetching && items.length === 0;
  const empty = !loading && pages.length === 0 && items.length === 0;

  const go = (to) => {
    setOpen(false);
    setTerm("");
    navigate(to);
  };

  return (
    <div className="sb-globalsearch" ref={ref}>
      <input
        type="search"
        className="sb-search form-control bg-body-secondary border-0 rounded-pill px-3"
        placeholder={content.placeholder}
        aria-label={content.placeholder}
        value={term}
        role="combobox"
        aria-expanded={active}
        aria-controls="sb-search-results"
        onChange={(event) => {
          setTerm(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false);
            event.currentTarget.blur();
          }
          if (event.key === "Enter" && query.length >= MIN_CHARS) {
            event.preventDefault();
            go(`/shop?search=${encodeURIComponent(query)}`);
          }
        }}
      />

      {active && (
        <div className="sb-search-panel" id="sb-search-results" role="listbox">
          {pages.length > 0 && (
            <>
              <p className="sb-search-group">{content.pages}</p>
              {pages.map(({ label, to, icon }) => (
                <button
                  key={to}
                  type="button"
                  role="option"
                  aria-selected="false"
                  className="sb-search-item"
                  onClick={() => go(to)}
                >
                  <span className="sb-search-icon">
                    <i className={`bi ${icon}`} />
                  </span>
                  <span className="text-truncate">{label}</span>
                  <span className="sb-search-hint">{to}</span>
                </button>
              ))}
            </>
          )}

          <p className="sb-search-group">{content.products}</p>

          {loading &&
            Array.from({ length: 3 }, (_, index) => (
              <div className="sb-search-item is-static" key={index}>
                <Skeleton width={32} height={32} radius={8} />
                <Skeleton height={12} />
              </div>
            ))}

          {!loading &&
            items.map((product) => (
              <button
                key={product.id}
                type="button"
                role="option"
                aria-selected="false"
                className="sb-search-item"
                onClick={() => go(`/product/${product.slug}`)}
              >
                <span className="sb-search-icon">
                  <i className="bi bi-box-seam" />
                </span>
                <span className="text-truncate">{product.name}</span>
                <span className="sb-search-hint">
                  {formatPrice(currentPrice(product))}
                </span>
              </button>
            ))}

          {!loading && items.length === 0 && pages.length > 0 && (
            <p className="sb-search-none">{content.noProducts}</p>
          )}

          {empty && <p className="sb-search-none">{content.nothing}</p>}

          {total > items.length && (
            <button
              type="button"
              className="sb-search-all"
              onClick={() => go(`/shop?search=${encodeURIComponent(query)}`)}
            >
              {content.seeAll.replace("{n}", total)}
              <i className="bi bi-arrow-right" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
