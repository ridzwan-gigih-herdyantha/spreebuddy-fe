import CtaBanner from "./CtaBanner";

export default {
  title: "UI/CtaBanner",
  component: CtaBanner,
  tags: ["autodocs"],
};

export const Gradient = {
  args: {
    data: {
      tone: "gradient",
      title: "Ready to shop smarter?",
      lead: "Let the assistant do the browsing while you sip your coffee.",
      button: { label: "Start chatting", to: "/chat" },
    },
  },
};

export const Dark = {
  args: {
    data: {
      tone: "dark",
      title: "Get early access",
      lead: "Join the beta and help shape the roadmap.",
      button: { label: "Sign up", to: "/signup" },
    },
  },
};
