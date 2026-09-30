import HowItWorks from "./HowItWorks";

export default {
  title: "Sections/HowItWorks",
  component: HowItWorks,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    data: {
      eyebrow: "How it works",
      title: "Shop by asking",
      subtitle: "Three steps from question to checkout.",
      steps: [
        {
          id: "ask",
          icon: "bi-chat-dots",
          title: "Ask",
          description:
            "Tell SpreeBuddy what you need, in plain language.",
        },
        {
          id: "compare",
          icon: "bi-bar-chart",
          title: "Compare",
          description:
            "Get side-by-side picks tailored to your budget and taste.",
        },
        {
          id: "checkout",
          icon: "bi-bag-check",
          title: "Checkout",
          description:
            "Add to cart and finish in a single, secure flow.",
        },
      ],
    },
  },
};

export const TwoSteps = {
  args: {
    data: {
      eyebrow: "Quick start",
      title: "Two steps to try it",
      subtitle: "No account required.",
      steps: [
        {
          id: "ask",
          icon: "bi-chat-dots",
          title: "Ask a question",
          description: "Anything from gift ideas to spec comparisons.",
        },
        {
          id: "shop",
          icon: "bi-bag",
          title: "See the results",
          description: "Real products, ranked and ready to buy.",
        },
      ],
    },
  },
};
