import ProductCard from "./ProductCard";

const baseProduct = {
  id: "p-1",
  slug: "spreebuds-pro",
  name: "SpreeBuds Pro",
  category: "Audio",
  stock: 24,
  regularPrice: 199,
  salePrice: null,
  images: [],
};

export default {
  title: "UI/ProductCard",
  component: ProductCard,
  tags: ["autodocs"],
  argTypes: {
    busy: { control: "boolean" },
  },
};

export const Default = {
  args: {
    product: baseProduct,
    onAdd: () => {},
  },
};

export const OnSale = {
  args: {
    product: {
      ...baseProduct,
      id: "p-2",
      salePrice: 149,
    },
    onAdd: () => {},
  },
};

export const LowStock = {
  args: {
    product: {
      ...baseProduct,
      id: "p-3",
      stock: 2,
    },
    onAdd: () => {},
  },
};

export const OutOfStock = {
  args: {
    product: {
      ...baseProduct,
      id: "p-4",
      stock: 0,
    },
    onAdd: () => {},
  },
};

export const Busy = {
  args: {
    product: baseProduct,
    busy: true,
    onAdd: () => {},
  },
};
