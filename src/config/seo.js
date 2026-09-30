// The build resolves this from VITE_SITE_URL, or Vercel's production domain, so
// canonical and share URLs always point at the live site rather than wherever
// the page happens to be served from.
export const SITE_URL = String(import.meta.env.VITE_SITE_URL ?? "").replace(
  /\/+$/,
  "",
);

export const siteSeo = {
  name: "SpreeBuddy",
  title: "SpreeBuddy — AI Shopping Assistant",
  titleTemplate: "%s — SpreeBuddy",
  description:
    "Shop by conversation, not by browsing. Describe what you need in plain language and SpreeBuddy finds, compares and recommends products for you.",
  image: "/og-image.jpg",
  imageAlt:
    "SpreeBuddy home page: a chat asking what is worth buying, answered with discounted products",
  locale: "en_US",
};

// Anything not listed here is treated as not found and kept out of the index,
// which also covers the placeholder routes. Private areas are listed so they
// carry a title while still being excluded.
export const routeSeo = [
  { path: "/", title: null, description: siteSeo.description },
  {
    path: "/shop",
    title: "Shop",
    description:
      "Browse the SpreeBuddy catalogue by category, compare prices and find what is on sale today.",
  },
  { path: "/product", title: "Product" },
  {
    path: "/about",
    title: "About",
    description:
      "Why SpreeBuddy exists, and how shopping by conversation saves you from endless tabs and filters.",
  },
  {
    path: "/help",
    title: "Help centre",
    description:
      "Answers about orders, payments, delivery, your account and the SpreeBuddy assistant.",
  },
  {
    path: "/contact",
    title: "Contact",
    description: "Get in touch with the SpreeBuddy team.",
  },
  {
    path: "/careers",
    title: "Careers",
    description: "Open roles at SpreeBuddy.",
  },
  {
    path: "/blog",
    title: "Blog",
    description: "Buying guides, product comparisons and news from SpreeBuddy.",
  },
  {
    path: "/privacy",
    title: "Privacy",
    description: "What SpreeBuddy collects, why, and what you can do about it.",
  },
  {
    path: "/terms",
    title: "Terms",
    description: "The terms of using SpreeBuddy.",
  },
  {
    path: "/status",
    title: "Status",
    description: "Live status of the SpreeBuddy shop and assistant.",
  },

  { path: "/login", title: "Sign in", noindex: true },
  { path: "/register", title: "Create an account", noindex: true },
  { path: "/chat", title: "Chat", noindex: true },
  { path: "/chat-history", title: "Chat history", noindex: true },
  { path: "/cart", title: "Cart", noindex: true },
  { path: "/checkout", title: "Checkout", noindex: true },
  { path: "/wishlist", title: "Wishlist", noindex: true },
  { path: "/orders", title: "My orders", noindex: true },
  { path: "/account", title: "Account", noindex: true },
  { path: "/settings", title: "Settings", noindex: true },
  { path: "/admin", title: "Admin", noindex: true },
];

const NOT_FOUND = { title: "Page not found", noindex: true };

// Longest match on whole segments, so /product covers /product/meja but
// /products matches nothing.
export function routeSeoFor(pathname) {
  const match = routeSeo
    .filter(
      ({ path }) =>
        pathname === path ||
        (path !== "/" && pathname.startsWith(`${path}/`)),
    )
    .sort((a, b) => b.path.length - a.path.length)[0];
  return match ?? NOT_FOUND;
}
