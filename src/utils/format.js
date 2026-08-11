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
