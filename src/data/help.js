export const helpContent = {
  badge: "Help center",
  title: "How can we help?",
  lead: "Answers to the things people ask most. If yours is not here, we are one message away.",
  searchPlaceholder: "Search for a topic",
  noMatch: "Nothing matches that. Try a shorter word, or get in touch.",
  contact: {
    title: "Still stuck?",
    lead: "Tell us what happened and we will pick it up from there.",
    button: { label: "Contact us", to: "/contact" },
    secondary: { label: "Ask the assistant", to: "/chat" },
  },
};

export const helpTopics = [
  {
    id: "shopping",
    icon: "bi-stars",
    title: "Shopping with the assistant",
    items: [
      {
        q: "Do I have to use the chat to buy something?",
        a: "No. Browse the shop, open a product, add it to your cart. The assistant is optional, and it is there for when you would rather describe what you need than filter for it.",
      },
      {
        q: "What should I actually type?",
        a: "Whatever you would say to a shop assistant. Your budget, the room it is for, who it is a gift for. Full sentences work better than keywords here.",
      },
      {
        q: "Can it add things to my wishlist or cart?",
        a: "It can save things to your wishlist if you ask. Adding to the cart and placing the order stays with you, so nothing is bought without you pressing the button.",
      },
      {
        q: "Why did it ask me a question instead of answering?",
        a: "When there is not enough to go on, it asks one short question rather than guessing your requirements. Answer it and you get a much better shortlist.",
      },
      {
        q: "It said it could not answer. What now?",
        a: "Send the message again. That happens occasionally when a request needs several lookups in a row, and a retry almost always goes through.",
      },
    ],
  },
  {
    id: "orders",
    icon: "bi-box-seam",
    title: "Orders and delivery",
    items: [
      {
        q: "How do I place an order?",
        a: "Add what you want to your cart, open the cart, then place the order. You will find it in My orders straight away.",
      },
      {
        q: "Where is my order?",
        a: "Open My orders. Each one shows where it has got to: pending when it is just placed, then processing, shipped, and delivered.",
      },
      {
        q: "Can I cancel?",
        a: "Yes, while it is still pending or processing. Once it has shipped it is on its way and can no longer be cancelled from here.",
      },
      {
        q: "Am I charged when I order?",
        a: "Not at the moment. Orders are placed and tracked, but there is no payment step in the shop yet.",
      },
      {
        q: "Something in my cart went out of stock",
        a: "Stock is counted when the order is placed, so an item can sell out while it is sitting in your cart. Remove it and the rest of the order goes through as normal.",
      },
    ],
  },
  {
    id: "account",
    icon: "bi-person",
    title: "Your account",
    items: [
      {
        q: "How do I change my name, email or phone?",
        a: "Go to Settings from the menu under your avatar. Everything on your profile is editable there, including your photo.",
      },
      {
        q: "How do I set a delivery address?",
        a: "Also in Settings. The address is stored as one block, so fill in every field or leave them all blank.",
      },
      {
        q: "How do I change my password?",
        a: "Settings has a password field. Leave it empty to keep the one you have.",
      },
      {
        q: "I cannot get back into my account",
        a: "Password reset by email is not available yet, so get in touch and we will sort it out for you.",
      },
      {
        q: "Do I need an account to look around?",
        a: "No. Browsing and searching are open to everyone. You need to sign in to use the cart, the wishlist and the assistant, because those are tied to you.",
      },
    ],
  },
  {
    id: "wishlist",
    icon: "bi-heart",
    title: "Wishlist and cart",
    items: [
      {
        q: "What is the wishlist for?",
        a: "Things you are thinking about but are not ready to buy. It stays on your account, so it follows you to whatever device you sign in on next.",
      },
      {
        q: "Can I compare things I have saved?",
        a: "Yes. Pick up to three from your wishlist and send them to the assistant, and it lays them out side by side.",
      },
      {
        q: "Does my cart empty itself?",
        a: "No. It stays as you left it until you order or clear it.",
      },
    ],
  },
];
