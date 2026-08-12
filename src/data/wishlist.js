export const wishlistContent = {
  title: "Wishlist",
  lead: "Saved items stay with your account across devices.",
  allCategories: "All",
  compare: "Compare selected",
  askAi: { label: "Ask the AI about these", to: "/chat" },
  empty: {
    title: "Nothing saved yet",
    lead: "Tap the heart on any product and it will wait for you here.",
    action: { label: "Browse the shop", to: "/shop" },
  },
  signedOut: {
    title: "Sign in to see your wishlist",
    lead: "Saved items are tied to your account, so they follow you across devices.",
  },
};

export const wishlistSortOptions = [
  { id: "recent", label: "Recently added" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "name", label: "Name A–Z" },
];

export const COMPARE_MAX = 3;
