import { useState } from "react";

// `priority` is for the one image that is the main content of the page: lazy
// loading it delays the largest paint, which search ranks on.
export default function ProductMedia({ product, iconClass = "", priority }) {
  const src = product?.images?.[0];
  const [failedSrc, setFailedSrc] = useState(null);

  if (!src || failedSrc === src) {
    return <i className={`bi bi-box-seam ${iconClass}`.trim()} />;
  }

  return (
    <img
      src={src}
      alt={product?.name ?? ""}
      className="sb-product-img"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      onError={() => setFailedSrc(src)}
    />
  );
}
