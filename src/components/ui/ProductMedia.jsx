import { useState } from "react";

export default function ProductMedia({ product, iconClass = "" }) {
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
      loading="lazy"
      onError={() => setFailedSrc(src)}
    />
  );
}
