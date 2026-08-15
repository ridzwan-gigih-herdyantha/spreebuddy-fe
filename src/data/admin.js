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
  addProduct: { label: "Add product", to: adminRoutes.products },
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
