export const contactContent = {
  badge: "Contact",
  title: "Talk to a person",
  lead: "Order gone sideways, something broken, or just a question the help centre did not cover. Send it over and we will pick it up.",
  replyNote: "We aim to reply within {time}.",
  formTitle: "Send us a message",
  formLead:
    "This opens your email app with everything filled in, so you keep a copy of what you sent.",
  fields: {
    name: "Your name",
    email: "Your email",
    topic: "What is it about",
    message: "Message",
  },
  placeholders: {
    name: "Sinta",
    email: "you@example.com",
    message:
      "Tell us what happened, and include an order number if there is one.",
  },
  submit: "Open in my email app",
  topics: [
    { id: "order", label: "An order" },
    { id: "account", label: "My account" },
    { id: "product", label: "A product" },
    { id: "bug", label: "Something is broken" },
    { id: "other", label: "Something else" },
  ],
  channels: {
    title: "Other ways to reach us",
    email: { label: "Email", icon: "bi-envelope" },
    phone: { label: "Phone", icon: "bi-telephone" },
    whatsapp: { label: "WhatsApp", icon: "bi-whatsapp" },
    address: { label: "Address", icon: "bi-geo-alt" },
    hours: { label: "Opening hours", icon: "bi-clock" },
  },
  before: {
    title: "Faster than emailing",
    items: [
      {
        icon: "bi-life-preserver",
        title: "Check the help centre",
        body: "Most questions about orders, cancelling and accounts are answered there already.",
        action: { label: "Open help centre", to: "/help" },
      },
      {
        icon: "bi-stars",
        title: "Ask the assistant",
        body: "For anything about products, stock or what suits you, it answers straight away.",
        action: { label: "Start a chat", to: "/chat" },
      },
      {
        icon: "bi-receipt",
        title: "Look up your order",
        body: "Where an order has got to, and whether it can still be cancelled, is on the order itself.",
        action: { label: "My orders", to: "/orders" },
      },
    ],
  },
};
