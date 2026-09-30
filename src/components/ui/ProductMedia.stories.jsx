import ProductMedia from "./ProductMedia";

export default {
  title: "UI/ProductMedia",
  component: ProductMedia,
  tags: ["autodocs"],
};

export const WithImage = {
  args: {
    product: {
      name: "Sample Product",
      images: ["https://picsum.photos/seed/spreebuddy/240/240"],
    },
    iconClass: "display-6 text-body",
  },
};

export const FallbackIcon = {
  args: {
    product: { name: "No image product", images: [] },
    iconClass: "display-6 text-body",
  },
};

export const SmallIcon = {
  args: {
    product: { name: "Compact", images: [] },
    iconClass: "fs-5",
  },
};
