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

// The API sends dates as DD/MM/YYYY, which Date parses as MM/DD/YYYY.
export function parseApiDate(value) {
  if (!value) return null;
  const dmy = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  const date = dmy
    ? new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]))
    : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatRelative(value) {
  const date = parseApiDate(value);
  if (!date) return "";
  const days = Math.floor((Date.now() - date.getTime()) / DAY);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "last week";
  if (days < 60) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

export function formatDimensions(value) {
  if (!value || typeof value !== "object") return "—";
  const { length, width, height } = value;
  if ([length, width, height].some((side) => side === undefined)) return "—";
  return `${length} × ${width} × ${height} cm`;
}

export function formatSpec(key, value) {
  if (value === null || value === undefined || value === "") return "—";
  if (key === "dimensions") return formatDimensions(value);
  if (key === "weight") return `${value} kg`;
  if (key.toLowerCase().includes("price")) return formatPrice(value);
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
