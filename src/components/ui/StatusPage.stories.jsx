import StatusPage from "./StatusPage";

export default {
  title: "UI/StatusPage",
  component: StatusPage,
  tags: ["autodocs"],
};

export const NotFound = {
  args: {
    status: {
      tone: "gradient",
      icon: "bi-compass",
      code: "Error 404",
      title: "We couldn't find that page",
      lead: "The link may be broken, or the page may have moved.",
      actions: [
        { label: "Back to home", to: "/", variant: "primary" },
        { label: "Browse shop", to: "/shop", variant: "outline" },
      ],
      suggestionsTitle: "Popular destinations",
      suggestions: [
        { label: "Shop", to: "/shop", icon: "bi-bag" },
        { label: "Chat", to: "/chat", icon: "bi-chat-dots" },
        { label: "Help", to: "/help", icon: "bi-life-preserver" },
      ],
    },
  },
};

export const ServerError = {
  args: {
    status: {
      tone: "warning",
      icon: "bi-exclamation-triangle",
      code: "Error 500",
      title: "Something went wrong",
      lead: "Our servers are having a moment. Please try again in a bit.",
      actions: [
        { label: "Try again", reload: true, variant: "primary" },
        { label: "Back to home", to: "/", variant: "outline" },
      ],
    },
  },
};

export const Maintenance = {
  args: {
    brand: true,
    status: {
      tone: "dark",
      icon: "bi-tools",
      code: "Under maintenance",
      title: "We'll be right back",
      lead: "SpreeBuddy is getting a quick tune-up. Try again shortly.",
      note: "Follow updates on our status page.",
    },
  },
};
