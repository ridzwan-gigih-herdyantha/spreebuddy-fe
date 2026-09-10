export const heroContent = {
  signInToAsk: "Sign in first so the assistant can remember your chat.",
  badge: "AI-native shopping",
  title: ["Shop by conversation,", "not by browsing."],
  lead: "SpreeBuddy is your AI shopping assistant. Describe what you need in plain language.",
  placeholder:
    'Ask me anything… e.g. "wireless headphones under $150 for travel"',
  suggestions: [
    { icon: "bi-headphones", label: "Headphones under $150" },
    { icon: "bi-camera", label: "Compare mirrorless cameras" },
    { icon: "bi-gift", label: "Gift for a coffee lover" },
    { icon: "bi-person-walking", label: "Running shoes for flat feet" },
  ],
};

export const featuredProducts = {
  title: "Featured products",
  unavailable: "The catalogue is not reachable right now.",
  signInToAdd: "Sign in first to build a cart.",
  subtitle: "Straight from the catalogue, updated as stock changes",
  viewAll: "View all",
};

export const chatPreview = {
  title: "SpreeBuddy Assistant",
  status: {
    up: "Online",
    down: "Offline",
    checking: "Checking",
  },
  question: "What is worth buying right now?",
  answerSale: "These are discounted in the catalogue at the moment.",
  answerPlain: "Here is what the catalogue has right now.",
  answerEmpty:
    "The catalogue is not reachable at the moment, but ask me anything and I will look again.",
  save: "Save {n}%",
  inStock: "{n} in stock",
  soldOut: "Out of stock",
  compare: "Compare these",
  comparePrompt: "Compare {names}",
  more: "Show me more",
};

export const howItWorks = {
  eyebrow: "How it works",
  title: "Shopping in 3 conversational steps",
  subtitle:
    "No filters, no endless tabs. Just tell SpreeBuddy what you need and let it do the digging.",
  steps: [
    {
      id: "describe",
      icon: "bi-chat-left-text",
      title: "Describe what you need",
      description:
        "Tell the assistant in plain language — budget, use-case, style. No filters to fiddle with.",
    },
    {
      id: "compare",
      icon: "bi-lightning-charge",
      title: "AI finds & compares",
      description:
        "SpreeBuddy searches, ranks, and lays out the best matches with pros, cons, and prices.",
    },
    {
      id: "decide",
      icon: "bi-check2-circle",
      title: "Decide with confidence",
      description:
        "Get a clear recommendation, compare side-by-side, then save or buy — all in the chat.",
    },
  ],
};

export const footerBannerCTA = {
  tone: "gradient",
  title: "Ready to shop the smart way?",
  lead: "Start a conversation and let SpreeBuddy find your perfect match.",
  button: { label: "Start chatting now", to: "/chat" },
};
