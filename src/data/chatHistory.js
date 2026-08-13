export const chatHistoryContent = {
  title: "Chat history",
  lead: "Every conversation is saved to your account. Pick one up where you left it.",
  newChat: { label: "New chat", to: "/chat" },
  searchPlaceholder: "Search your conversations",
  groups: ["Today", "This week", "Earlier"],
  allRange: "All",
  empty: {
    title: "No conversations yet",
    lead: "Ask the assistant what you are shopping for and it will show up here.",
    action: { label: "Start chatting", to: "/chat" },
  },
  signedOut: {
    title: "Sign in to see your chats",
    lead: "Conversations are tied to your account, so they follow you across devices.",
  },
};

export const chatHistorySortOptions = [
  { id: "recent", label: "Most recent" },
  { id: "oldest", label: "Oldest first" },
  { id: "title", label: "Title A–Z" },
];
