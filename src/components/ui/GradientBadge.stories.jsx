import GradientBadge from "./GradientBadge";

export default {
  title: "UI/GradientBadge",
  component: GradientBadge,
  tags: ["autodocs"],
};

export const Default = { args: { children: "Pro" } };

export const WithIcon = {
  args: {
    children: (
      <>
        <i className="bi bi-stars" /> AI powered
      </>
    ),
  },
};

export const Numeric = { args: { children: "12" } };
