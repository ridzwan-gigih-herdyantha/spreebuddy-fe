export const registerContent = {
  title: "Create your account",
  lead: "It takes a minute. Your wishlist and chat history save automatically.",
  submit: "Create account",
  footer: {
    text: "Already have an account?",
    linkLabel: "Sign in",
    to: "/login",
  },
  aside: {
    title: "Everything saves to your account",
    benefits: [
      {
        icon: "bi-heart-fill",
        label: "Wishlist that follows you across devices",
      },
      { icon: "bi-chat-dots-fill", label: "Chat history you can pick back up" },
      { icon: "bi-globe2", label: "Comparisons the AI remembers" },
    ],
    card: {
      eyebrow: "Saved to wishlist",
      icon: "bi-headphones",
      name: "Sony WH-1000XM5",
      price: "$348.00",
    },
  },
};

export const passwordStrength = {
  labels: ["weak", "fair", "good"],
  prefix: "Strength:",
};
