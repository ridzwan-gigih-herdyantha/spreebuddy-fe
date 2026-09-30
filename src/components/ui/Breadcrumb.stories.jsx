import Breadcrumb from "./Breadcrumb";

export default {
  title: "UI/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    items: [
      { label: "Home", to: "/" },
      { label: "Shop", to: "/shop" },
      { label: "Headphones" },
    ],
  },
};

export const TwoLevels = {
  args: {
    items: [
      { label: "Home", to: "/" },
      { label: "Account" },
    ],
  },
};

export const Deep = {
  args: {
    items: [
      { label: "Home", to: "/" },
      { label: "Shop", to: "/shop" },
      { label: "Audio", to: "/shop?category=audio" },
      { label: "Wireless", to: "/shop?category=wireless" },
      { label: "SpreeBuds Pro" },
    ],
  },
};
