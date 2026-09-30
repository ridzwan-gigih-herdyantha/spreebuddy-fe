import TokenSwatch from "./TokenSwatch";

export default {
  title: "Styleguide/TokenSwatch",
  component: TokenSwatch,
  tags: ["autodocs"],
};

export const Primary = {
  args: {
    token: {
      name: "Primary",
      value: "#6366f1",
      variable: "--sb-primary",
    },
  },
};

export const Surface = {
  args: {
    token: {
      name: "Surface",
      value: "#ffffff",
      variable: "--sb-surface",
    },
  },
};

export const GradientToken = {
  args: {
    token: {
      name: "Brand gradient",
      value: "linear-gradient(135deg, #6366f1, #ec4899)",
      variable: "--sb-gradient",
    },
  },
};

export const LongName = {
  args: {
    token: {
      name: "Muted foreground on subtle surface",
      value: "#6b7280",
      variable: "--sb-fg-muted-subtle",
    },
  },
};
