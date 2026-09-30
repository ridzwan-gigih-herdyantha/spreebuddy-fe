import SearchField from "./SearchField";

export default {
  title: "UI/SearchField",
  component: SearchField,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    placeholder: "Search",
    value: "",
    onChange: () => {},
  },
};

export const Filled = {
  args: {
    placeholder: "Search products",
    value: "wireless headphones",
    onChange: () => {},
  },
};

export const CustomPlaceholder = {
  args: {
    placeholder: "Search orders by ID",
    value: "",
    onChange: () => {},
  },
};
