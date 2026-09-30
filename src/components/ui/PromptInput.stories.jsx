import PromptInput from "./PromptInput";

export default {
  title: "UI/PromptInput",
  component: PromptInput,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
  },
};

export const Default = {
  args: {
    placeholder: "Ask me anything…",
    onSubmit: (text) => console.log("submitted:", text),
  },
};

export const Disabled = {
  args: {
    placeholder: "Assistant is thinking…",
    disabled: true,
    onSubmit: () => {},
  },
};

export const Prefilled = {
  args: {
    value: "Find me a wireless charger under $30",
    onChange: () => {},
    onSubmit: () => {},
    placeholder: "Ask me anything…",
  },
};
