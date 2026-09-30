import Select from "./Select";

const sortOptions = [
  { id: "relevance", label: "Best match" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "newest", label: "Newest first" },
];

export default {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    value: "relevance",
    options: sortOptions,
    onChange: () => {},
  },
};

export const WithLabel = {
  args: {
    label: "Sort by",
    value: "price-asc",
    options: sortOptions,
    onChange: () => {},
  },
};

export const WithIcon = {
  args: {
    value: "newest",
    options: sortOptions,
    icon: "bi-sort-down",
    onChange: () => {},
  },
};

export const Placeholder = {
  args: {
    value: undefined,
    placeholder: "Choose an option",
    options: sortOptions,
    onChange: () => {},
  },
};
