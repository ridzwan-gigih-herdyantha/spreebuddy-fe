import Chip from "./Chip";

export default {
  title: "UI/Chip",
  component: Chip,
  tags: ["autodocs"],
};

export const Default = { args: { children: "Suggestion" } };

export const WithIcon = {
  args: {
    children: (
      <>
        <i className="bi bi-stars" /> Try this
      </>
    ),
  },
};

export const LongLabel = {
  args: { children: "Recommend a birthday gift under $50" },
};
