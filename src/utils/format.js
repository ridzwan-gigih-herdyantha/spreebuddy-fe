const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export const formatPrice = (value) =>
  typeof value === "number" ? currency.format(value) : "—";

export const isOnSale = ({ salePrice, regularPrice }) =>
  typeof salePrice === "number" && salePrice > 0 && salePrice < regularPrice;

export const currentPrice = (product) =>
  isOnSale(product) ? product.salePrice : product.regularPrice;

const DAY = 86_400_000;

export function formatRelative(value) {
  if (!value) return "";
  const days = Math.floor((Date.now() - new Date(value).getTime()) / DAY);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "last week";
  if (days < 60) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}
