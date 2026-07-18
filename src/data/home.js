export const heroContent = {
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
  subtitle: "Hand-picked by the AI based on trending needs",
  viewAll: "View all",
  items: [
    {
      id: "aurora-nc-700",
      icon: "bi-headphones",
      badge: "Best value",
      name: "Aurora NC 700",
      rating: "4.6",
      meta: "Free shipping",
      price: "$139",
      oldPrice: "$199",
    },
    {
      id: "pulse-watch-s2",
      icon: "bi-smartwatch",
      badge: "Trending",
      name: "Pulse Watch S2",
      rating: "4.8",
      meta: "Free shipping",
      price: "$179",
    },
    {
      id: "lumen-x10-cam",
      icon: "bi-camera",
      badge: "AI pick",
      name: "Lumen X10 Cam",
      rating: "4.7",
      meta: "Free shipping",
      price: "$649",
    },
    {
      id: "nomad-pack-pro",
      icon: "bi-backpack",
      badge: "Popular",
      name: "Nomad Pack Pro",
      rating: "4.5",
      meta: "Free shipping",
      price: "$89",
      oldPrice: "$120",
    },
  ],
};

export const chatPreview = {
  title: "SpreeBuddy Assistant",
  status: "Online",
  messages: [
    {
      role: "user",
      text: "I need wireless headphones under $150 for travel",
    },
    {
      role: "ai",
      text: "Great pick for travel! Here are 3 with strong noise cancelling.",
      products: [
        {
          icon: "bi-headphones",
          name: "Aurora NC 700",
          rating: "4.6",
          meta: "30h battery · ANC",
          price: "$139",
        },
      ],
      actions: [
        { label: "Compare all 3", variant: "solid" },
        { label: "Show cheaper", variant: "outline" },
      ],
    },
  ],
};
