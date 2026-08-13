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

export const orderDetailContent = {
  back: { label: "Back to orders", to: "/orders" },
  itemsTitle: "Items",
  progressTitle: "Delivery progress",
  summaryTitle: "Summary",
  infoTitle: "Order info",
  helpTitle: "Need help?",
  helpLead: "Have an issue with this order? The assistant knows its details.",
  askAssistant: "Ask the assistant",
  contact: "Contact support",
  buyAgain: "Buy it again",
  viewProduct: "View product",
  paymentNote: "Not required for this demo",
};

export const orderSteps = [
  {
    key: "pending",
    label: "Pending",
    note: "Order created and stock reserved",
  },
  {
    key: "processing",
    label: "Processing",
    note: "Being prepared for shipment",
  },
  { key: "shipped", label: "Shipped", note: "On its way to you" },
  { key: "delivered", label: "Delivered", note: "Delivered to you" },
];
