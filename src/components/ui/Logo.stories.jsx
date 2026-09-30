import Logo from "./Logo";

export default {
  title: "UI/Logo",
  component: Logo,
  tags: ["autodocs"],
  argTypes: {
    withText: { control: "boolean" },
  },
};

export const WithText = { args: { withText: true } };
export const BadgeOnly = { args: { withText: false } };
