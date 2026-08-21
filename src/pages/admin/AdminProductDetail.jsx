import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import StatusPill from "@/components/ui/StatusPill";
import { deleteProduct, getProduct } from "@/api/products";
import {
  currentPrice,
  formatDimensions,
  formatPrice,
  isOnSale,
} from "@/utils/format";
import { adminRoutes } from "@/config/admin";
import { LOW_STOCK_THRESHOLD } from "@/data/shop";
import { productDeleteContent, productDetailContent } from "@/data/admin";

const stockStatus = (stock) => {
  if (!stock || stock <= 0) return "Out of stock";
  return stock <= LOW_STOCK_THRESHOLD ? "Low stock" : "In stock";
};

function Row({ label, children }) {
  return (
    <div className="sb-spec-row">
      <span className="sb-spec-label">{label}</span>
      <span className="sb-spec-value">{children}</span>
    </div>
  );
}

export default function AdminProductDetail() {
  const { slug } = useParams();
  const content = productDetailContent;
  const removeCopy = productDeleteContent;

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [confirming, setConfirming] = useState(false);

  const query = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProduct(slug),
    retry: false,
  });

  const product = query.data?.data;

  const remove = useMutation({
    mutationFn: () => deleteProduct(product.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate(adminRoutes.products, { replace: true });
    },
  });

  if (query.isError) {
    return (
      <div className="sb-admin-soon">
        <h1 className="sb-h1 mb-2">Product not found</h1>
        <p className="sb-lead mb-4">{query.error.message}</p>
        <Link to={content.back.to} className="sb-pill sb-pill-outline">
          <i className="bi bi-arrow-left" /> {content.back.label}
        </Link>
      </div>
    );
  }

  if (!product) return <div className="sb-admin-boot">Loading…</div>;

  const discount = isOnSale(product)
    ? Math.round(
        ((product.regularPrice - product.salePrice) / product.regularPrice) *
          100,
      )
    : null;

  return (
    <>
      <header className="sb-admin-head">
        <div className="min-w-0">
          <Link to={content.back.to} className="sb-admin-back">
            <i className="bi bi-arrow-left" /> {content.back.label}
          </Link>
          <h1 className="sb-h1 mt-2 mb-2">{product.name}</h1>
          <div className="d-flex flex-wrap align-items-center gap-2">
            <StatusPill status={stockStatus(product.stock)} />
            <span className="sb-pill">{product.category}</span>
            <span className="sb-meta">{product.stock} in stock</span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Link
            to={`/product/${product.slug}`}
            className="sb-pill sb-pill-outline text-nowrap"
          >
            <i className="bi bi-box-arrow-up-right" /> {content.viewInShop}
          </Link>
          <button
            type="button"
            className="sb-pill sb-pill-outline text-nowrap"
            onClick={() => setConfirming(true)}
          >
            <i className="bi bi-trash3" /> {content.remove}
          </button>
          <Link
            to={`${adminRoutes.products}/${product.slug}/edit`}
            className="btn btn-primary rounded-pill px-4 text-nowrap"
          >
            <i className="bi bi-pencil" /> {content.edit}
          </Link>
        </div>
      </header>

      <div className="row g-3">
        <div className="col-12 col-xl-8">
          <section className="sb-card sb-panel h-100">
            <div className="sb-panel-head">
              <h2 className="sb-h3 mb-0">{content.descriptionTitle}</h2>
            </div>
            <div className="sb-panel-body">
              <p className="sb-lead mb-0">
                {product.description || content.noDescription}
              </p>
            </div>
          </section>
        </div>

        <div className="col-12 col-xl-4">
          <div className="d-flex flex-column gap-3">
            <section className="sb-card sb-panel">
              <div className="sb-panel-head">
                <h2 className="sb-h3 mb-0">{content.pricingTitle}</h2>
              </div>
              <div className="sb-panel-body">
                <div className="sb-detail-price">
                  {formatPrice(currentPrice(product))}
                </div>

                <div className="sb-spec-list mt-3">
                  <Row label={content.fields.regularPrice}>
                    {formatPrice(product.regularPrice)}
                  </Row>
                  <Row label={content.fields.salePrice}>
                    {typeof product.salePrice === "number"
                      ? formatPrice(product.salePrice)
                      : "—"}
                  </Row>
                  {discount !== null && (
                    <Row label={content.fields.discount}>
                      <span className="sb-pill sb-pill-success">
                        {discount}% off
                      </span>
                    </Row>
                  )}
                </div>
              </div>
            </section>

            <section className="sb-card sb-panel">
              <div className="sb-panel-head">
                <h2 className="sb-h3 mb-0">{content.specsTitle}</h2>
              </div>
              <div className="sb-panel-body sb-spec-list">
                <Row label={content.fields.slug}>
                  <span className="sb-mono">{product.slug}</span>
                </Row>
                <Row label={content.fields.type}>{product.type}</Row>
                <Row label={content.fields.category}>{product.category}</Row>
                <Row label={content.fields.stock}>{product.stock}</Row>
                <Row label={content.fields.weight}>{product.weight} kg</Row>
                <Row label={content.fields.dimensions}>
                  {formatDimensions(product.dimensions)}
                </Row>
                <Row label={content.fields.created}>{product.createdAt}</Row>
                <Row label={content.fields.updated}>{product.updatedAt}</Row>
              </div>
            </section>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirming}
        title={removeCopy.title}
        body={
          <>
            <strong>{product.name}</strong> — {removeCopy.bodyOne}{" "}
            {removeCopy.irreversible}
          </>
        }
        confirmLabel={removeCopy.confirm}
        cancelLabel={removeCopy.cancel}
        pending={remove.isPending}
        error={remove.error?.message}
        onConfirm={() => remove.mutate()}
        onCancel={() => (remove.isPending ? null : setConfirming(false))}
      />
    </>
  );
}
