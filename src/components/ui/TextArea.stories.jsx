import TextArea from "./TextArea";

export default {
  title: "UI/TextArea",
  component: TextArea,
  tags: ["autodocs"],
  argTypes: {
    rows: { control: { type: "number", min: 1, max: 20 } },
  },
};

export const Default = {
  args: {
    id: "ta-default",
    label: "Notes",
    placeholder: "Type here…",
  },
};

export const WithHelp = {
  args: {
    id: "ta-help",
    label: "Delivery instructions",
    help: "Anything the driver should know? (max 200 characters)",
    placeholder: "Leave at door, ring bell twice…",
  },
};

export const WithError = {
  args: {
    id: "ta-error",
    label: "Message",
    error: "Message cannot be empty.",
    placeholder: "Say hi…",
  },
};

export const Tall = {
  args: {
    id: "ta-tall",
    label: "Your review",
    rows: 8,
    placeholder: "What did you think?",
  },
};
