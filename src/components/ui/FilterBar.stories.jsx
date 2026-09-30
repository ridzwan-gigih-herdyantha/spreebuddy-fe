import FilterBar from "./FilterBar";

export default {
  title: "UI/FilterBar",
  component: FilterBar,
  tags: ["autodocs"],
};

export const Full = {
  args: {
    search: "",
    onSearch: () => {},
    searchPlaceholder: "Search products",
    chips: ["All", "Audio", "Wearables", "Home"],
    active: "Audio",
    onChip: () => {},
    sort: "relevance",
    sortOptions: [
      { id: "relevance", label: "Best match" },
      { id: "price-asc", label: "Price: low to high" },
      { id: "price-desc", label: "Price: high to low" },
    ],
    onSort: () => {},
  },
};

export const ChipsOnly = {
  args: {
    chips: ["All", "New", "On sale", "Popular"],
    active: "New",
    onChip: () => {},
  },
};

export const SearchOnly = {
  args: {
    search: "",
    onSearch: () => {},
    searchPlaceholder: "Search orders",
  },
};

export const WithTrailing = {
  args: {
    chips: ["All", "Pending", "Shipped"],
    active: "All",
    onChip: () => {},
    trailing: <span className="sb-meta">32 results</span>,
  },
};
