import StatusPill from "./StatusPill";

export default {
  title: "UI/StatusPill",
  component: StatusPill,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "in stock",
        "low stock",
        "out of stock",
      ],
    },
  },
};

export const Pending = { args: { status: "pending" } };
export const Processing = { args: { status: "processing" } };
export const Shipped = { args: { status: "shipped" } };
export const Delivered = { args: { status: "delivered" } };
export const Cancelled = { args: { status: "cancelled" } };
export const InStock = { args: { status: "in stock" } };
export const LowStock = { args: { status: "low stock" } };
export const OutOfStock = { args: { status: "out of stock" } };
export const Unknown = { args: { status: "" } };
