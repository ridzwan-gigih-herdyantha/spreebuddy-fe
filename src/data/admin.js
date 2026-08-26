import { adminRoutes } from "@/config/admin";

export const adminLoginContent = {
  badge: "Admin",
  title: "Staff sign in",
  lead: "This area manages the catalogue, orders and accounts.",
  identifierLabel: "Email or username",
  identifierPlaceholder: "admin@spreebuddy.com",
  remember: "Keep me signed in",
  submit: "Sign in to admin",
  note: "Admin accounts are created by the seed script. There is no self service registration here.",
  back: { label: "Back to the shop", to: "/" },
  aside: {
    title: "The store console",
    lead: "Everything behind the shopfront in one place, with the same design language your customers already know.",
    benefits: [
      { icon: "bi-box-seam", label: "Catalogue, pricing and stock" },
      { icon: "bi-receipt", label: "Orders from placed to delivered" },
      { icon: "bi-people", label: "Accounts, roles and access" },
    ],
  },
};

export const adminDeniedContent = {
  title: "This account is not an admin",
  lead: "You are signed in, but the console needs a staff account.",
  back: { label: "Back to the shop", to: "/" },
  signOut: "Sign in as someone else",
};

export const dashboardContent = {
  title: "Dashboard",
  lead: "Store activity for the selected window.",
  addProduct: { label: "Add product", to: `${adminRoutes.products}/new` },
  chartTitle: "Orders over time",
  breakdownTitle: "Orders by status",
  recentTitle: "Recent orders",
  viewAll: { label: "View all", to: adminRoutes.orders },
  empty: "No orders fall inside this window yet.",
  unavailable: "—",
};

export const dashboardRanges = [
  { id: "30", label: "Last 30 days" },
  { id: "90", label: "Last 90 days" },
  { id: "all", label: "All time" },
];

export const adminSoonContent = {
  lead: "This screen is designed but not wired up yet.",
  back: { label: "Back to dashboard", to: adminRoutes.dashboard },
};

// GET /orders has no aggregate endpoint, so the dashboard derives its figures
// from the newest slice of orders and says so in the UI.
export const ADMIN_ORDERS_SAMPLE = 100;
export const CHART_BUCKETS = 8;
export const RECENT_ORDERS = 6;

export const productsContent = {
  title: "Products",
  lead: "in the catalogue. Changes are picked up by the assistant immediately.",
  leadFiltered: "products match this filter.",
  add: { label: "Add product", to: `${adminRoutes.products}/new` },
  searchPlaceholder: "Search products",
  allCategories: "All",
  empty: {
    title: "No products match",
    lead: "Try another category, or clear the search.",
  },
  bulk: {
    count: "selected",
    selectAll: "Select all",
    resolving: "Collecting…",
    clear: "Clear",
    remove: "Delete selected",
  },
  actions: {
    detail: "Open",
    edit: "Edit",
    remove: "Delete",
  },
};

export const productFormContent = {
  create: {
    title: "Add product",
    lead: "It goes live in the catalogue as soon as you save.",
    submit: "Create product",
    pending: "Creating…",
  },
  edit: {
    title: "Edit product",
    lead: "Saving regenerates the slug, so any old link stops resolving.",
    submit: "Save changes",
    pending: "Saving…",
  },
  back: { label: "Back to products", to: adminRoutes.products },
  sections: {
    details: "Details",
    pricing: "Pricing",
    inventory: "Inventory",
    dimensions: "Dimensions",
  },
  fields: {
    name: "Name",
    description: "Description",
    category: "Category",
    type: "Type",
    regularPrice: "Regular price",
    salePrice: "Sale price",
    stock: "Stock",
    weight: "Weight",
    length: "Length",
    width: "Width",
    height: "Height",
  },
  help: {
    salePrice:
      "Leave empty for no discount. Must not exceed the regular price.",
    weight: "In kilograms.",
    dimensions: "In centimetres. Fill all three, or leave all three empty.",
  },
  errors: {
    dimensions: "Enter all three sides, or clear them all.",
    salePrice: "Sale price cannot be higher than the regular price.",
  },
  cancel: "Cancel",
};

export const productTypes = [
  { id: "physical", label: "Physical" },
  { id: "digital", label: "Digital" },
];

export const productDetailContent = {
  back: { label: "Back to products", to: adminRoutes.products },
  edit: "Edit",
  remove: "Delete",
  viewInShop: "View in the shop",
  descriptionTitle: "Description",
  specsTitle: "Specifications",
  pricingTitle: "Pricing",
  noDescription: "No description yet.",
  fields: {
    slug: "Slug",
    type: "Type",
    category: "Category",
    stock: "Stock",
    weight: "Weight",
    dimensions: "Dimensions",
    created: "Created",
    updated: "Updated",
    regularPrice: "Regular price",
    salePrice: "Sale price",
    discount: "Discount",
  },
};

export const productDeleteContent = {
  title: "Delete this product?",
  bodyOne: "It is removed from the catalogue and the assistant straight away.",
  bodyMany:
    "They are removed from the catalogue and the assistant straight away.",
  irreversible: "This cannot be undone.",
  confirm: "Delete",
  cancel: "Keep it",
  partial: "Some products could not be deleted.",
};

export const PRODUCTS_PAGE_SIZE = 15;

export const ordersAdminContent = {
  title: "Orders",
  lead: "in the store. Status changes move stock in the same transaction.",
  leadFiltered: "orders with this status.",
  allStatuses: "All",
  empty: {
    title: "No orders here",
    lead: "Nothing matches this status yet.",
  },
  actions: {
    detail: "Open",
    advance: "Move to",
  },
  columns: {
    order: "Order",
    customer: "Customer",
    product: "Product",
    qty: "Qty",
    total: "Total",
    status: "Status",
    placed: "Placed",
    actions: "Actions",
  },
  terminal: "No further transitions from here.",
};

export const orderDetailAdminContent = {
  back: { label: "Back to orders", to: adminRoutes.orders },
  timelineTitle: "Lifecycle",
  customerTitle: "Customer",
  itemTitle: "Item",
  summaryTitle: "Summary",
  actionsTitle: "Move this order",
  viewProduct: "View product",
  remove: "Delete order",
  deleteHint: "Only cancelled orders can be deleted.",
  fields: {
    order: "Order id",
    placed: "Placed",
    updated: "Updated",
    unitPrice: "Unit price",
    quantity: "Quantity",
    total: "Total",
    name: "Name",
    email: "Email",
    username: "Username",
    phone: "Phone",
  },
  missingProduct: "This product has been deleted.",
  missingCustomer: "This account has been removed.",
};

export const orderDeleteContent = {
  title: "Delete this order?",
  body: "The record is removed for good. Stock was already released when it was cancelled.",
  irreversible: "This cannot be undone.",
  confirm: "Delete",
  cancel: "Keep it",
};

export const ORDERS_ADMIN_PAGE_SIZE = 15;
