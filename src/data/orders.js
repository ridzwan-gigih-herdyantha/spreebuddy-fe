export const ordersContent = {
  title: "My orders",
  lead: "Every order you have placed, newest first.",
  back: { label: "Continue shopping", to: "/shop" },
  searchPlaceholder: "Search by order or product",
  allStatuses: "All",
  empty: {
    title: "No orders yet",
    lead: "Once you place an order it will show up here with its status.",
    action: { label: "Browse the shop", to: "/shop" },
  },
  signedOut: {
    title: "Sign in to see your orders",
    lead: "Orders are tied to your account, so they follow you across devices.",
  },
};

export const orderStatuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export const orderSortOptions = [
  { id: "newest", label: "Newest first" },
  { id: "oldest", label: "Oldest first" },
  { id: "total-desc", label: "Total: high to low" },
  { id: "total-asc", label: "Total: low to high" },
];

export const ORDERS_PAGE_SIZE = 10;
