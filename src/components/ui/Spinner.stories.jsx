import Spinner from "./Spinner";

export default {
  title: "UI/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "range", min: 8, max: 64, step: 2 } },
  },
};

export const Default = { args: { size: 16 } };
export const Small = { args: { size: 12 } };
export const Large = { args: { size: 40 } };
