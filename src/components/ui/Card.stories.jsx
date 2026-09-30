import Card from "./Card";

export default {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    hover: { control: "boolean" },
    flat: { control: "boolean" },
  },
};

export const Default = {
  args: {
    children: (
      <div className="p-4">
        <h3 className="sb-h3 mb-2">Card title</h3>
        <p className="sb-meta mb-0">A plain card with padded content.</p>
      </div>
    ),
  },
};

export const Hover = {
  args: {
    hover: true,
    children: (
      <div className="p-4">
        <h3 className="sb-h3 mb-2">Hover me</h3>
        <p className="sb-meta mb-0">This card lifts on hover.</p>
      </div>
    ),
  },
};

export const Flat = {
  args: {
    flat: true,
    children: (
      <div className="p-4">
        <h3 className="sb-h3 mb-2">Flat card</h3>
        <p className="sb-meta mb-0">No shadow, subtle border only.</p>
      </div>
    ),
  },
};
