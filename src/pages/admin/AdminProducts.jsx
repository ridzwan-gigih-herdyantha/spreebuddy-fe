import { useDeferredValue, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import FilterBar from "@/components/ui/FilterBar";
import StatusPill from "@/components/ui/StatusPill";
import { SkeletonRows } from "@/components/ui/Skeleton";
import { deleteProduct, fetchProductIds, listProducts } from "@/api/products";
import { listCategories } from "@/api/categories";
import { currentPrice, formatPrice, isOnSale } from "@/utils/format";
import { adminRoutes } from "@/config/admin";
import { LOW_STOCK_THRESHOLD } from "@/data/shop";
import {
  PRODUCTS_PAGE_SIZE,
  productDeleteContent,
  productsContent,
} from "@/data/admin";

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
  const removeCopy = productDeleteContent;
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(content.allCategories);
  const [selected, setSelected] = useState(() => new Set());
  const [pending, setPending] = useState(null);
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

  const current = Math.min(page, totalPages);
  const pages = pageWindow(current, totalPages);

  const allChecked =
    items.length > 0 && items.every(({ id }) => selected.has(id));
  const canSelectAll = allChecked && total > selected.size;

  // "Select all" resolves real ids, so a bulk action never acts on a count it
  // cannot enumerate.
  const resolveAll = useMutation({
    mutationFn: () => fetchProductIds({ search: term, category: filter }),
    onSuccess: (ids) => setSelected(new Set(ids)),
  });

  const remove = useMutation({
    mutationFn: async (ids) => {
      const results = await Promise.allSettled(ids.map(deleteProduct));
      const failed = results.filter(({ status }) => status === "rejected");
      if (failed.length) {
        throw new Error(
          `${removeCopy.partial} (${failed.length}/${ids.length})`,
        );
      }
      return ids;
    },
    onSuccess: (ids) => {
      setSelected((state) => {
        const next = new Set(state);
        ids.forEach((id) => next.delete(id));
        return next;
      });
      setPending(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const resetFilter = (apply) => {
    apply();
    setPage(1);
  };

  const toggleOne = (id) =>
    setSelected((state) => {
      const next = new Set(state);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected((state) => {
      const next = new Set(state);
      items.forEach(({ id }) => (allChecked ? next.delete(id) : next.add(id)));
      return next;
    });

  const askDelete = (ids, label) => {
    remove.reset();
    setPending({ ids, label });
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

      {selected.size > 0 && (
        <div className="sb-bulkbar">
          <span className="fw-semibold">
            {selected.size} {content.bulk.count}
          </span>

          {canSelectAll && (
            <button
              type="button"
              className="sb-pill sb-pill-outline"
              disabled={resolveAll.isPending}
              onClick={() => resolveAll.mutate()}
            >
              {resolveAll.isPending
                ? content.bulk.resolving
                : `${content.bulk.selectAll} ${total}`}
            </button>
          )}

          <button
            type="button"
            className="sb-pill sb-pill-danger"
            onClick={() => askDelete([...selected])}
          >
            <i className="bi bi-trash3" /> {content.bulk.remove}
          </button>

          <button
            type="button"
            className="sb-pill sb-pill-outline"
            onClick={() => setSelected(new Set())}
          >
            {content.bulk.clear}
          </button>
        </div>
      )}

      <section className="sb-card">
        {products.isPending ? (
          <SkeletonRows rows={8} columns={7} />
        ) : products.isSuccess && items.length === 0 ? (
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
                        checked={selected.has(product.id)}
                        onChange={() => toggleOne(product.id)}
                      />
                    </td>

                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <span className="sb-order-thumb">
                          <i className="bi bi-box-seam" />
                        </span>
                        <div className="min-w-0 sb-prod-cell">
                          <Link
                            to={`${adminRoutes.products}/${product.slug}`}
                            className="sb-order-name sb-prod-link text-truncate"
                            title={product.name}
                          >
                            {product.name}
                          </Link>
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
                          to={`${adminRoutes.products}/${product.slug}`}
                          className="sb-row-action"
                          title={content.actions.detail}
                          aria-label={`${content.actions.detail} ${product.name}`}
                        >
                          <i className="bi bi-eye" />
                        </Link>
                        <Link
                          to={`${adminRoutes.products}/${product.slug}/edit`}
                          className="sb-row-action"
                          title={content.actions.edit}
                          aria-label={`${content.actions.edit} ${product.name}`}
                        >
                          <i className="bi bi-pencil" />
                        </Link>
                        <button
                          type="button"
                          className="sb-row-action is-danger"
                          title={content.actions.remove}
                          aria-label={`${content.actions.remove} ${product.name}`}
                          onClick={() => askDelete([product.id], product.name)}
                        >
                          <i className="bi bi-trash3" />
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

      <ConfirmDialog
        open={Boolean(pending)}
        title={removeCopy.title}
        body={
          <>
            {pending?.label ? (
              <>
                <strong>{pending.label}</strong> — {removeCopy.bodyOne}
              </>
            ) : (
              <>
                <strong>{pending?.ids.length} products</strong> —{" "}
                {removeCopy.bodyMany}
              </>
            )}{" "}
            {removeCopy.irreversible}
          </>
        }
        confirmLabel={removeCopy.confirm}
        cancelLabel={removeCopy.cancel}
        pending={remove.isPending}
        error={remove.error?.message}
        onConfirm={() => remove.mutate(pending.ids)}
        onCancel={() => (remove.isPending ? null : setPending(null))}
      />
    </>
  );
}
