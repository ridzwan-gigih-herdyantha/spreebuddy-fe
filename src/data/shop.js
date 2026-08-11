export const shopContent = {
  title: "Shop",
  lead: "Browse the catalogue, or just ask the assistant to find it for you.",
  askAi: { label: "Ask the AI instead", to: "/chat" },
  allCategories: "All",
  loadMore: "Load more",
  empty: {
    title: "Nothing here yet",
    lead: "No products match this filter. Try another category.",
  },
};

export const sortOptions = [
  { id: "relevance", label: "Best match" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "name", label: "Name A–Z" },
];

export const PAGE_SIZE = 8;
export const LOW_STOCK_THRESHOLD = 6;
