export const chatContent = {
  sendFailed: "Your message did not go through. It is back in the box.",
  sendTimedOut:
    "The assistant is taking longer than usual. Your message was sent — reload in a moment to see the reply.",
  newChat: "New chat",
  placeholder: "Message SpreeBuddy…",
  greeting: {
    title: "What are you shopping for?",
    lead: "Describe what you need in plain language and the assistant will search the catalogue for you.",
  },
  quickChat: "Quick chat",
  results: {
    title: "Product results",
    empty: "Ask a question and matching products will appear here.",
    allCategories: "All",
  },
  signedOut: {
    title: "Sign in to start chatting",
    lead: "Conversations are saved to your account so you can pick them up later.",
  },
};

export const thinkingWords = [
  "Thinking",
  "Pondering",
  "Rummaging",
  "Scouting",
  "Comparing",
  "Curating",
  "Digging",
  "Weighing",
];

export const chatSortOptions = [
  { id: "relevance", label: "Best match" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
];

// Openers offered above the composer. The set follows the page the visitor came
// from, because someone arriving from their cart is asking about something
// different from someone arriving from the catalogue. Matched by path prefix,
// longest first, and anything unrecognised falls back to the default.
export const quickReplyPresets = {
  default: [
    "Compare the top 3",
    "Show cheaper options",
    "What is in stock?",
    "Add the first one to my wishlist",
  ],
  "/shop": [
    "Narrow this down for me",
    "What is worth buying here?",
    "Show me cheaper alternatives",
    "Compare the top 3",
  ],
  "/wishlist": [
    "Compare what I saved",
    "Which of these is the best value?",
    "Any of these on sale?",
    "What should I drop from my wishlist?",
  ],
  "/cart": [
    "Is anything in my cart overpriced?",
    "Find me a cheaper alternative",
    "What goes well with this?",
    "Am I missing anything?",
  ],
  "/orders": [
    "Where is my order?",
    "What did I buy recently?",
    "Help me reorder something",
    "Can I still cancel an order?",
  ],
  "/product": [
    "Is this a good buy?",
    "Show me something similar",
    "Compare this with cheaper options",
    "Add this to my wishlist",
  ],
};

export function quickRepliesFor(pathname) {
  if (!pathname) return quickReplyPresets.default;
  const match = Object.keys(quickReplyPresets)
    .filter((prefix) => prefix !== "default" && pathname.startsWith(prefix))
    .sort((a, b) => b.length - a.length)[0];
  return quickReplyPresets[match] ?? quickReplyPresets.default;
}
