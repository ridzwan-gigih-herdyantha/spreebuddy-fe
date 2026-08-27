import { previewPagesEnabled, previewRoutes } from "@/config/features";

export const mainNav = [
  { label: "Home", to: "/", end: true },
  { label: "Shop", to: "/shop" },
  { label: "Compare", to: "/compare" },
  { label: "Wishlist", to: "/wishlist" },
  { label: "Chat History", to: "/chat-history" },
];

export const footerNav = [
  {
    title: "Product",
    links: [
      { label: "AI Chat", to: "/chat" },
      { label: "Compare", to: "/compare" },
      { label: "Wishlist", to: "/wishlist" },
      { label: "Pricing", to: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Careers", to: "/careers" },
      { label: "Blog", to: "/blog" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help center", to: "/help" },
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
      { label: "Status", to: "/status" },
      ...(previewPagesEnabled
        ? [{ label: "Design system", to: previewRoutes.styleGuide }]
        : []),
    ],
  },
];

export const userMenu = [
  { label: "Account", to: "/account", icon: "bi-person" },
  { label: "Settings", to: "/settings", icon: "bi-gear" },
  { label: "Wishlist", to: "/wishlist", icon: "bi-heart" },
  { label: "Orders", to: "/orders", icon: "bi-receipt" },
];

// Destinations the global search can actually reach: routes with a real page,
// not the placeholders generated from the nav lists.
export const searchablePages = [
  { label: "Home", to: "/", icon: "bi-house", keywords: "landing start" },
  {
    label: "Shop",
    to: "/shop",
    icon: "bi-shop",
    keywords: "catalogue browse products",
  },
  {
    label: "AI chat",
    to: "/chat",
    icon: "bi-stars",
    keywords: "assistant ask",
  },
  {
    label: "Chat history",
    to: "/chat-history",
    icon: "bi-chat-dots",
    keywords: "conversations",
  },
  {
    label: "Wishlist",
    to: "/wishlist",
    icon: "bi-heart",
    keywords: "saved favourites",
  },
  { label: "Cart", to: "/cart", icon: "bi-cart2", keywords: "basket checkout" },
  {
    label: "My orders",
    to: "/orders",
    icon: "bi-receipt",
    keywords: "purchases history",
  },
  { label: "Account", to: "/account", icon: "bi-person", keywords: "profile" },
  {
    label: "Settings",
    to: "/settings",
    icon: "bi-gear",
    keywords: "profile password address",
  },
];

const allLinks = [...mainNav, ...footerNav.flatMap((group) => group.links)];

export const navLabels = Object.fromEntries(
  allLinks.map(({ to, label }) => [to, label]),
);

export const placeholderRoutes = [
  ...new Set([...allLinks.map(({ to }) => to), "/chat"]),
].filter((to) => to !== "/" && to !== previewRoutes.styleGuide);
