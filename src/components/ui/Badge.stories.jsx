import Badge from "./Badge";

export default {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "outline", "success", "gradient"],
    },
  },
};

export const Primary = { args: { variant: "primary", children: "New" } };
export const Outline = { args: { variant: "outline", children: "Beta" } };
export const Success = { args: { variant: "success", children: "Active" } };
export const Gradient = { args: { variant: "gradient", children: "Pro" } };

export const WithIcon = {
  args: {
    variant: "primary",
    children: (
      <>
        <i className="bi bi-stars" /> Featured
      </>
    ),
  },
};
