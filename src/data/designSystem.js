export const foundationsMeta = {
  title: "SpreeBuddy",
  subtitle: "AI Shopping Assistant — Design System",
  description:
    "A modern, AI-native e-commerce interface where shopping happens through conversation.",
  specs: ["Desktop-first", "12-column grid", "Responsive to tablet & mobile"],
};

export const sections = [
  { id: "colors", label: "Color tokens" },
  { id: "typography", label: "Typography" },
  { id: "spacing", label: "Spacing" },
  { id: "radius", label: "Radius" },
  { id: "elevation", label: "Elevation & gradient" },
  { id: "components", label: "Components" },
];

export const colorGroups = [
  {
    title: "Surface",
    tokens: [
      { name: "bg/base", value: "#F6F7FB", variable: "--sb-bg-base" },
      { name: "bg/surface", value: "#FFFFFF", variable: "--sb-bg-surface" },
      { name: "bg/subtle", value: "#EEF0F7", variable: "--sb-bg-subtle" },
      {
        name: "bg/ai-bubble",
        value: "#EEF0FF",
        variable: "--sb-bg-ai-bubble",
      },
    ],
  },
  {
    title: "Text & border",
    tokens: [
      {
        name: "text/primary",
        value: "#0F1222",
        variable: "--sb-text-primary",
      },
      {
        name: "text/secondary",
        value: "#565B70",
        variable: "--sb-text-secondary",
      },
      { name: "text/muted", value: "#8A8FA3", variable: "--sb-text-muted" },
      {
        name: "border/subtle",
        value: "#E7E9F2",
        variable: "--sb-border-subtle",
      },
    ],
  },
  {
    title: "Accent",
    tokens: [
      { name: "accent/blue", value: "#4F6BFF", variable: "--sb-accent-blue" },
      {
        name: "accent/violet",
        value: "#8B5CF6",
        variable: "--sb-accent-violet",
      },
      {
        name: "accent/blue-soft",
        value: "#E5EAFF",
        variable: "--sb-accent-blue-soft",
      },
    ],
  },
  {
    title: "Status",
    tokens: [
      { name: "success", value: "#12B76A", variable: "--sb-success" },
      { name: "warning", value: "#F79009", variable: "--sb-warning" },
      { name: "star", value: "#FFB020", variable: "--sb-star" },
    ],
  },
];

export const typeScale = [
  {
    label: "Display / 48 Bold",
    className: "sb-display",
    sample: "Shop by conversation",
  },
  {
    label: "H1 / 34 Bold",
    className: "sb-h1",
    sample: "Find, compare, decide",
  },
  {
    label: "H2 / 24 Semi Bold",
    className: "sb-h2",
    sample: "Featured products",
  },
  { label: "H3 / 18 Semi Bold", className: "sb-h3", sample: "How it works" },
  {
    label: "Body / 16 Regular",
    className: "sb-body",
    sample: "The AI assistant helps you shop faster.",
  },
  {
    label: "Small / 13 Medium",
    className: "sb-small",
    sample: "Suggested for you",
  },
  {
    label: "Caption / 11 Regular",
    className: "sb-caption",
    sample: "Updated just now",
  },
];

export const spacingScale = [
  { step: 4, variable: "--sb-space-1" },
  { step: 8, variable: "--sb-space-2" },
  { step: 12, variable: "--sb-space-3" },
  { step: 16, variable: "--sb-space-4" },
  { step: 24, variable: "--sb-space-5" },
  { step: 32, variable: "--sb-space-6" },
  { step: 48, variable: "--sb-space-7" },
];

export const radiusScale = [
  { name: "sm", value: "8px", variable: "--sb-radius-sm" },
  { name: "md", value: "10px", variable: "--sb-radius-md" },
  { name: "lg", value: "14px", variable: "--sb-radius-lg" },
  { name: "xl", value: "18px", variable: "--sb-radius-xl" },
  { name: "full", value: "999px", variable: "--sb-radius-full" },
];

export const elevationScale = [
  {
    name: "Soft shadow",
    className: "sb-shadow",
    hint: "Cards, composer, sticky bars",
  },
  {
    name: "Large shadow",
    className: "sb-shadow-lg",
    hint: "Floating panels, chat preview",
  },
  {
    name: "Glass",
    className: "sb-glass",
    hint: "Overlays on gradient surfaces",
  },
  {
    name: "AI gradient",
    className: "sb-gradient",
    hint: "Brand mark, primary action, avatar",
  },
];

export const componentSpecs = [
  {
    id: "buttons",
    title: "Buttons",
    hint: "Primary uses the vertical AI gradient; pills carry secondary actions.",
  },
  {
    id: "badges",
    title: "Badges & chips",
    hint: "Pills share one radius token (full) and a 13px semi-bold label.",
  },
  {
    id: "inputs",
    title: "Inputs",
    hint: "Composer and search field both round to full and lift on focus.",
  },
  {
    id: "surfaces",
    title: "Cards & surfaces",
    hint: "Surface, flat and hover variants over the base background.",
  },
  {
    id: "conversation",
    title: "Conversation",
    hint: "User bubbles are accent-filled; AI bubbles are surface with a border.",
  },
];
