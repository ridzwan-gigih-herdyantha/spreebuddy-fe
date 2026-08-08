export const notFoundStatus = {
  code: "Error 404",
  icon: "bi-compass",
  title: "This page took a wrong turn",
  lead: "The link is broken, the page moved, or it never existed. Nothing is lost — SpreeBuddy can point you somewhere useful.",
  actions: [
    { label: "Back to home", to: "/", variant: "primary" },
    { label: "Ask the assistant", to: "/chat", variant: "outline" },
  ],
  suggestionsTitle: "Popular destinations",
  suggestions: [
    { label: "Shop", to: "/shop", icon: "bi-bag" },
    { label: "Compare", to: "/compare", icon: "bi-columns-gap" },
    { label: "Wishlist", to: "/wishlist", icon: "bi-heart" },
    { label: "Help center", to: "/help", icon: "bi-life-preserver" },
  ],
};

export const serverErrorStatus = {
  code: "Error 500",
  tone: "warning",
  icon: "bi-exclamation-triangle",
  title: "Something broke on our side",
  lead: "The request did not go through. Our team has been notified — trying again usually does the trick.",
  actions: [
    { label: "Try again", reload: true, variant: "primary" },
    { label: "Back to home", to: "/", variant: "outline" },
  ],
  note: "If this keeps happening, reach out and we will dig into it.",
};

export const maintenanceStatus = {
  code: "Scheduled maintenance",
  tone: "dark",
  icon: "bi-tools",
  title: "We are tuning the assistant",
  lead: "SpreeBuddy is briefly offline while we ship an upgrade. Your wishlist and chat history are untouched.",
  actions: [{ label: "Check again", reload: true, variant: "primary" }],
  note: "Expected back within the hour. Follow @spreebuddy for live updates.",
};

export const comingSoonStatus = {
  code: "Coming soon",
  icon: "bi-hourglass-split",
  title: "This page is on the way",
  lead: "We are still building this part of SpreeBuddy. In the meantime, the assistant can already help you find, compare, and decide.",
  actions: [
    { label: "Start chatting", to: "/chat", variant: "primary" },
    { label: "Back to home", to: "/", variant: "outline" },
  ],
};
