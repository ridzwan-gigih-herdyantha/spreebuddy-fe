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

export const loginContent = {
  title: "Welcome!",
  lead: "Sign in to pick up your conversation where you left off.",
  submit: "Sign in",
  identifierLabel: "Email or username",
  identifierPlaceholder: "you@example.com",
  remember: "Remember me",
  forgot: { label: "Forgot password?", to: "/forgot-password" },
  note: "Chat history and wishlist are tied to your account, so they follow you across devices.",
  footer: {
    text: "Don't have an account?",
    linkLabel: "Create one",
    to: "/register",
  },
  aside: {
    title: "Shop by conversation, not by browsing.",
    lead: "Experience the next generation of e-commerce with your personal AI shopping assistant.",
    chat: {
      question: "wireless headphones under $150",
      answer:
        "I've found a few great options that fit your budget. The Aurora NC 700 are currently on sale.",
      product: {
        icon: "bi-headphones",
        name: "Aurora NC 700",
        price: "$139",
        oldPrice: "$199",
      },
    },
  },
};

export const passwordStrength = {
  labels: ["weak", "fair", "good"],
  prefix: "Strength:",
};
