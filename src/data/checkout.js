export const ADDRESS_PARTS = [
  "street",
  "district",
  "city",
  "state",
  "zip",
  "fullAddress",
];

export const checkoutContent = {
  title: "Checkout",
  lead: "Confirm where this is going, and pay for your order.",
  back: { label: "Back to cart", to: "/cart" },

  addressTitle: "Delivery address",
  addressLead: "We only use this to ship your order.",
  useProfile: "Use the address on my profile",
  fields: {
    street: "Street",
    district: "District",
    city: "City",
    state: "State or province",
    zip: "Postcode",
    fullAddress: "Full address",
  },
  placeholders: {
    street: "12 Melati Road",
    district: "Menteng",
    city: "Jakarta",
    state: "DKI Jakarta",
    zip: "10310",
    fullAddress: "12 Melati Road, Menteng, Jakarta 10310",
  },
  required: "This is needed to deliver your order",

  summaryTitle: "Order summary",
  subtotal: "Subtotal",
  shipping: "Shipping",
  free: "Free",
  tax: "Tax",
  total: "Total",
  freeShippingNote: "Shipping is free on orders over {amount}.",
  pay: "Pay",
  paying: "Opening the payment service…",
  leaving: "You will finish paying and come straight back here.",
  disabled: {
    title: "Payments are switched off",
    lead: "This server has no payment provider configured, so checkout is unavailable right now.",
  },
  blocked: "Remove the out of stock items before checking out.",

  empty: {
    title: "Nothing to check out",
    lead: "Your cart is empty, so there is nothing to pay for yet.",
    action: { label: "Browse the shop", to: "/shop" },
  },
  signedOut: {
    title: "Sign in to check out",
    lead: "Your cart and orders are tied to your account.",
  },
};

export const checkoutReturnContent = {
  confirming: {
    title: "Confirming your payment",
    lead: "The payment service is letting us know how it went. This usually takes a moment.",
  },
  paid: {
    title: "Payment received",
    lead: "Your order is being prepared. You can follow it in My orders.",
    action: { label: "View my orders", to: "/orders" },
  },
  slow: {
    title: "Still waiting on confirmation",
    lead: "Your payment went through, but the confirmation has not reached us yet. It will land shortly, and your orders page will show it once it does.",
    action: { label: "View my orders", to: "/orders" },
  },
  failed: {
    title: "The payment did not go through",
    lead: "Nothing was charged. Your order is still waiting, so you can try paying again.",
    action: { label: "View my orders", to: "/orders" },
  },
  expired: {
    title: "This checkout expired",
    lead: "The session timed out, so the order was released and the stock put back. Add the items again whenever you are ready.",
    action: { label: "Back to the shop", to: "/shop" },
  },
  cancelled: {
    title: "Checkout cancelled",
    lead: "Nothing was charged. Your order is still waiting for payment, so you can pick it back up any time.",
    action: { label: "View my orders", to: "/orders" },
  },
  missing: {
    title: "We could not find that checkout",
    lead: "The link may be incomplete, or the checkout belongs to a different account.",
    action: { label: "View my orders", to: "/orders" },
  },
  reference: "Reference",
  amount: "Amount",
};

export const checkoutMessages = {
  ordersFailed: "Could not place your order.",
  checkoutFailed: "Could not start the payment.",
  orphaned:
    "Your order was placed but the payment did not start. You can pay for it from My orders.",
};
