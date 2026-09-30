import IconButton from "./IconButton";

export default {
  title: "UI/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
  },
};

export const Plus = {
  args: {
    "aria-label": "Add",
    children: <i className="bi bi-plus-lg" />,
  },
};

export const Send = {
  args: {
    "aria-label": "Send",
    children: <i className="bi bi-arrow-up" />,
  },
};

export const Disabled = {
  args: {
    "aria-label": "Add",
    disabled: true,
    children: <i className="bi bi-plus-lg" />,
  },
};
