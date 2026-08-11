// The API returns a plain items total, so tax is applied here on the client.
export const TAX_RATE = 0.11;

export const cartContent = {
  title: "Cart",
  lead: "Stock is reserved the moment you place the order.",
  back: { label: "Continue shopping", to: "/shop" },
  summaryTitle: "Order summary",
  placeOrder: "Place order",
  clear: "Clear cart",
  blocked: "Remove the out of stock items to place your order.",
  note: "No payment is taken. Placing the order reserves stock and creates it as pending.",
  reassurance: [
    { icon: "bi-truck", label: "Free shipping over Rp 100.000" },
    { icon: "bi-arrow-counterclockwise", label: "30 day returns policy" },
    { icon: "bi-clock-history", label: "Stock reserved once ordered" },
  ],
  empty: {
    title: "Your cart is empty",
    lead: "Browse the catalogue, or ask the assistant to find something for you.",
    browse: { label: "Browse the shop", to: "/shop" },
    ask: { label: "Ask the assistant", to: "/chat" },
  },
  signedOut: {
    title: "Sign in to see your cart",
    lead: "Your cart is tied to your account, so it follows you across devices.",
  },
};
