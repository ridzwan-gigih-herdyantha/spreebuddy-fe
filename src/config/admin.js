export const adminRoutes = {
  login: "/admin/login",
  dashboard: "/admin",
  products: "/admin/products",
  orders: "/admin/orders",
  users: "/admin/users",
  sessions: "/admin/chat-sessions",
  settings: "/admin/settings",
};

export const adminNav = [
  {
    label: "Dashboard",
    to: adminRoutes.dashboard,
    icon: "bi-grid-1x2",
    end: true,
  },
  { label: "Products", to: adminRoutes.products, icon: "bi-box-seam" },
  { label: "Orders", to: adminRoutes.orders, icon: "bi-receipt" },
  { label: "Users", to: adminRoutes.users, icon: "bi-people" },
  { label: "Chat sessions", to: adminRoutes.sessions, icon: "bi-chat-dots" },
  { label: "Settings", to: adminRoutes.settings, icon: "bi-gear" },
];

export const isAdmin = (user) =>
  String(user?.role ?? "").toLowerCase() === "admin";
