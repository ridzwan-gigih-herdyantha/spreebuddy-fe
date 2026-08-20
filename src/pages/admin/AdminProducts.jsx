import { useDeferredValue, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import FilterBar from "@/components/ui/FilterBar";
import StatusPill from "@/components/ui/StatusPill";
import { listCategories, listProducts } from "@/api/products";
import { currentPrice, formatPrice, isOnSale } from "@/utils/format";
import { LOW_STOCK_THRESHOLD } from "@/data/shop";
import { PRODUCTS_PAGE_SIZE, productsContent } from "@/data/admin";

const PAGE_SPAN = 3;

const stockStatus = (stock) => {
  if (!stock || stock <= 0) return "Out of stock";
  return stock <= LOW_STOCK_THRESHOLD ? "Low stock" : "In stock";
};

function pageWindow(current, totalPages) {
  const end = Math.min(totalPages, Math.max(current + 1, PAGE_SPAN));
  const start = Math.max(1, end - PAGE_SPAN + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export default function AdminProducts() {
  const content = productsContent;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(content.allCategories);
  const [selected, setSelected] = useState(() => new Set());
  const [allMatching, setAllMatching] = useState(false);
  const term = useDeferredValue(search);

  const filter = category === content.allCategories ? undefined : category;

  const products = useQuery({
    queryKey: ["admin", "products", page, term, filter],
    queryFn: () =>
      listProducts({
        page,
        limit: PRODUCTS_PAGE_SIZE,
        search: term,
        category: filter,
      }),
    placeholderData: (previous) => previous,
    retry: false,
  });

  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
    staleTime: 5 * 60 * 1000,
  });

  const items = useMemo(() => products.data?.data ?? [], [products.data]);
  const meta = products.data?.meta;
  const total = meta?.total ?? items.length;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);

  const categoryNames = useMemo(
    () => (categories.data?.data ?? []).map(({ name }) => name),
    [categories.data],
  );

  // Narrowing the filter resets to page one, so the two only ever disagree
  // between a filter change and its refetch.
  const current = Math.min(page, totalPages);
  const pages = pageWindow(current, totalPages);

  const isChecked = (id) => allMatching || selected.has(id);
  const allChecked = items.length > 0 && items.every(({ id }) => isChecked(id));
  const selectedCount = allMatching ? total : selected.size;
  const canSelectAll = !allMatching && allChecked && total > items.length;

  const resetFilter = (apply) => {
    apply();
    setPage(1);
    setAllMatching(false);
  };

  const clearSelection = () => {
    setAllMatching(false);
    setSelected(new Set());
  };

  const toggleOne = (id) => {
    if (allMatching) {
      setAllMatching(false);
      setSelected(
        new Set(items.map((product) => product.id).filter((it) => it !== id)),
      );
      return;
    }

    setSelected((state) => {
      const next = new Set(state);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allMatching) return clearSelection();

    setSelected((state) => {
      const next = new Set(state);
      items.forEach(({ id }) => (allChecked ? next.delete(id) : next.add(id)));
      return next;
    });
  };

  return (
    <>
      <header className="sb-admin-head">
        <div>
          <h1 className="sb-h1 mb-1">{content.title}</h1>
          <p className="sb-lead mb-0">
            {total}{" "}
            {term || filter ? content.leadFiltered : `products ${content.lead}`}
          </p>
        </div>

        <Link
          to={content.add.to}
          className="btn btn-primary rounded-pill px-4 text-nowrap"
        >
          <i className="bi bi-plus-lg" /> {content.add.label}
        </Link>
      </header>

      <FilterBar
        search={search}
        onSearch={(value) => resetFilter(() => setSearch(value))}
        searchPlaceholder={content.searchPlaceholder}
        chips={[content.allCategories, ...categoryNames]}
        active={category}
        onChip={(value) => resetFilter(() => setCategory(value))}
        trailing={
          <span className="sb-meta">
            {items.length} of {total}
          </span>
        }
      />

      {products.isError && (
        <p className="sb-form-error" role="alert">
          <i className="bi bi-exclamation-triangle-fill" />{" "}
          {products.error.message}
        </p>
      )}

      {selectedCount > 0 && (
        <div className="sb-bulkbar">
          <span className="fw-semibold">
            {selectedCount} {content.bulk.count}
          </span>

          {canSelectAll && (
            <button
              type="button"
              className="sb-pill sb-pill-outline"
              onClick={() => setAllMatching(true)}
            >
              {content.bulk.selectAll} {total}
            </button>
          )}

          {allMatching && (
            <span className="sb-meta">{content.bulk.allSelected}</span>
          )}

          <button
            type="button"
            className="sb-pill sb-pill-outline"
            disabled
            title={content.bulk.disabled}
          >
            <i className="bi bi-trash3" /> {content.bulk.remove}
          </button>

          <button
            type="button"
            className="sb-pill sb-pill-outline"
            onClick={clearSelection}
          >
            {content.bulk.clear}
          </button>
        </div>
      )}

      <section className="sb-card">
        {products.isSuccess && items.length === 0 ? (
          <div className="text-center py-5">
            <h2 className="sb-h2 mb-2">{content.empty.title}</h2>
            <p className="sb-lead mb-0">{content.empty.lead}</p>
          </div>
        ) : (
          <div className="sb-table-wrap">
            <table className="sb-table">
              <thead>
                <tr>
                  <th className="sb-table-check">
                    <input
                      type="checkbox"
                      className="sb-check-box"
                      aria-label="Select every product on this page"
                      checked={allChecked}
                      onChange={toggleAll}
                    />
                  </th>
                  <th>Product</th>
                  <th>Category</th>
                  <th className="text-end">Price</th>
                  <th className="text-center">Stock</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>

              <tbody>
                {items.map((product) => (
                  <tr
                    key={product.id}
                    className={product.stock > 0 ? "" : "is-muted"}
                  >
                    <td>
                      <input
                        type="checkbox"
                        className="sb-check-box"
                        aria-label={`Select ${product.name}`}
                        checked={isChecked(product.id)}
                        onChange={() => toggleOne(product.id)}
                      />
                    </td>

                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <span className="sb-order-thumb">
                          <i className="bi bi-box-seam" />
                        </span>
                        <div className="min-w-0 sb-prod-cell">
                          <div
                            className="sb-order-name text-truncate"
                            title={product.name}
                          >
                            {product.name}
                          </div>
                          <div className="sb-mono sb-prod-slug text-truncate">
                            {product.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      {product.category ? (
                        <span className="sb-pill" title={product.category}>
                          {product.category}
                        </span>
                      ) : (
                        <span className="sb-meta">—</span>
                      )}
                    </td>

                    <td className="text-end">
                      <div className="sb-order-total">
                        {formatPrice(currentPrice(product))}
                      </div>
                      {isOnSale(product) && (
                        <div className="sb-price-old">
                          {formatPrice(product.regularPrice)}
                        </div>
                      )}
                    </td>

                    <td className="text-center">{product.stock ?? 0}</td>

                    <td>
                      <StatusPill status={stockStatus(product.stock)} />
                    </td>

                    <td>
                      <div className="sb-row-actions">
                        <Link
                          to={`/product/${product.slug}`}
                          className="sb-row-action"
                          title={content.actions.view}
                          aria-label={`${content.actions.view}: ${product.name}`}
                        >
                          <i className="bi bi-eye" />
                        </Link>
                        <button
                          type="button"
                          className="sb-row-action"
                          disabled
                          title={content.actions.editDisabled}
                          aria-label={`${content.actions.edit} ${product.name}`}
                        >
                          <i className="bi bi-pencil" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="sb-table-foot">
          <span className="sb-meta">
            Showing {items.length} of {total} products
          </span>

          {totalPages > 1 && (
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="sb-page-btn"
                disabled={!meta?.hasPrevPage}
                onClick={() => setPage(current - 1)}
                aria-label="Previous page"
              >
                <i className="bi bi-chevron-left" />
              </button>

              {pages.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`sb-page-btn ${value === current ? "is-active" : ""}`}
                  aria-current={value === current ? "page" : undefined}
                  onClick={() => setPage(value)}
                >
                  {value}
                </button>
              ))}

              {pages.at(-1) < totalPages && <span className="sb-meta">…</span>}

              <button
                type="button"
                className="sb-page-btn"
                disabled={!meta?.hasNextPage}
                onClick={() => setPage(current + 1)}
                aria-label="Next page"
              >
                <i className="bi bi-chevron-right" />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
