import { adminRoutes } from "@/config/admin";

export const adminLoginContent = {
  badge: "Admin",
  title: "Staff sign in",
  lead: "This area manages the catalogue, orders and accounts.",
  identifierLabel: "Email or username",
  identifierPlaceholder: "admin@spreebuddy.com",
  remember: "Keep me signed in",
  submit: "Sign in to admin",
  note: "Admin accounts are created by the seed script. There is no self service registration here.",
  back: { label: "Back to the shop", to: "/" },
  aside: {
    title: "The store console",
    lead: "Everything behind the shopfront in one place, with the same design language your customers already know.",
    benefits: [
      { icon: "bi-box-seam", label: "Catalogue, pricing and stock" },
      { icon: "bi-receipt", label: "Orders from placed to delivered" },
      { icon: "bi-people", label: "Accounts, roles and access" },
    ],
  },
};

export const adminDeniedContent = {
  title: "This account is not an admin",
  lead: "You are signed in, but the console needs a staff account.",
  back: { label: "Back to the shop", to: "/" },
  signOut: "Sign in as someone else",
};

export const dashboardContent = {
  title: "Dashboard",
  lead: "Store activity for the selected window.",
  addProduct: { label: "Add product", to: `${adminRoutes.products}/new` },
  chartTitle: "Orders over time",
  breakdownTitle: "Orders by status",
  recentTitle: "Recent orders",
  viewAll: { label: "View all", to: adminRoutes.orders },
  empty: "No orders fall inside this window yet.",
  unavailable: "—",
};

export const dashboardRanges = [
  { id: "30", label: "Last 30 days" },
  { id: "90", label: "Last 90 days" },
  { id: "all", label: "All time" },
];

// GET /orders has no aggregate endpoint, so the dashboard derives its figures
// from the newest slice of orders and says so in the UI.
export const ADMIN_ORDERS_SAMPLE = 100;
export const CHART_BUCKETS = 8;
export const RECENT_ORDERS = 6;

export const productsContent = {
  title: "Products",
  lead: "in the catalogue. Changes are picked up by the assistant immediately.",
  leadFiltered: "products match this filter.",
  add: { label: "Add product", to: `${adminRoutes.products}/new` },
  searchPlaceholder: "Search products",
  allCategories: "All",
  empty: {
    title: "No products match",
    lead: "Try another category, or clear the search.",
  },
  bulk: {
    count: "selected",
    selectAll: "Select all",
    resolving: "Collecting…",
    clear: "Clear",
    remove: "Delete selected",
  },
  actions: {
    detail: "Open",
    edit: "Edit",
    remove: "Delete",
  },
};

export const productFormContent = {
  create: {
    title: "Add product",
    lead: "It goes live in the catalogue as soon as you save.",
    submit: "Create product",
    pending: "Creating…",
  },
  edit: {
    title: "Edit product",
    lead: "Saving regenerates the slug, so any old link stops resolving.",
    submit: "Save changes",
    pending: "Saving…",
  },
  back: { label: "Back to products", to: adminRoutes.products },
  sections: {
    details: "Details",
    pricing: "Pricing",
    inventory: "Inventory",
    dimensions: "Dimensions",
  },
  fields: {
    name: "Name",
    description: "Description",
    category: "Category",
    type: "Type",
    regularPrice: "Regular price",
    salePrice: "Sale price",
    stock: "Stock",
    weight: "Weight",
    length: "Length",
    width: "Width",
    height: "Height",
  },
  help: {
    salePrice:
      "Leave empty for no discount. Must not exceed the regular price.",
    weight: "In kilograms.",
    dimensions: "In centimetres. Fill all three, or leave all three empty.",
  },
  errors: {
    dimensions: "Enter all three sides, or clear them all.",
    salePrice: "Sale price cannot be higher than the regular price.",
  },
  cancel: "Cancel",
};

export const productTypes = [
  { id: "physical", label: "Physical" },
  { id: "digital", label: "Digital" },
];

export const productDetailContent = {
  back: { label: "Back to products", to: adminRoutes.products },
  edit: "Edit",
  remove: "Delete",
  viewInShop: "View in the shop",
  descriptionTitle: "Description",
  specsTitle: "Specifications",
  pricingTitle: "Pricing",
  noDescription: "No description yet.",
  fields: {
    slug: "Slug",
    type: "Type",
    category: "Category",
    stock: "Stock",
    weight: "Weight",
    dimensions: "Dimensions",
    created: "Created",
    updated: "Updated",
    regularPrice: "Regular price",
    salePrice: "Sale price",
    discount: "Discount",
  },
};

export const productDeleteContent = {
  title: "Delete this product?",
  bodyOne: "It is removed from the catalogue and the assistant straight away.",
  bodyMany:
    "They are removed from the catalogue and the assistant straight away.",
  irreversible: "This cannot be undone.",
  confirm: "Delete",
  cancel: "Keep it",
  partial: "Some products could not be deleted.",
};

export const PRODUCTS_PAGE_SIZE = 15;

export const ordersAdminContent = {
  title: "Orders",
  lead: "in the store. Status changes move stock in the same transaction.",
  leadFiltered: "orders with this status.",
  allStatuses: "All",
  empty: {
    title: "No orders here",
    lead: "Nothing matches this status yet.",
  },
  actions: {
    detail: "Open",
    advance: "Move to",
  },
  columns: {
    order: "Order",
    customer: "Customer",
    product: "Product",
    qty: "Qty",
    total: "Total",
    status: "Status",
    placed: "Placed",
    actions: "Actions",
  },
  terminal: "No further transitions from here.",
};

export const orderDetailAdminContent = {
  back: { label: "Back to orders", to: adminRoutes.orders },
  timelineTitle: "Lifecycle",
  customerTitle: "Customer",
  itemTitle: "Item",
  summaryTitle: "Summary",
  actionsTitle: "Move this order",
  viewProduct: "View product",
  remove: "Delete order",
  deleteHint: "Only cancelled orders can be deleted.",
  fields: {
    order: "Order id",
    placed: "Placed",
    updated: "Updated",
    unitPrice: "Unit price",
    quantity: "Quantity",
    total: "Total",
    name: "Name",
    email: "Email",
    username: "Username",
    phone: "Phone",
  },
  missingProduct: "This product has been deleted.",
  missingCustomer: "This account has been removed.",
};

export const orderDeleteContent = {
  title: "Delete this order?",
  body: "The record is removed for good. Stock was already released when it was cancelled.",
  irreversible: "This cannot be undone.",
  confirm: "Delete",
  cancel: "Keep it",
};

export const ORDERS_ADMIN_PAGE_SIZE = 15;

export const usersAdminContent = {
  title: "Users",
  lead: "customer accounts. Admin accounts are not listed here.",
  leadFiltered: "accounts match this search.",
  searchPlaceholder: "Search name, username, email or phone",
  empty: {
    title: "No accounts match",
    lead: "Try a different name, email or phone number.",
  },
  columns: {
    user: "User",
    contact: "Contact",
    location: "Location",
    joined: "Joined",
    actions: "Actions",
  },
  actions: { detail: "Open", edit: "Edit" },
  noAddress: "No address",
};

export const userDetailContent = {
  back: { label: "Back to users", to: adminRoutes.users },
  edit: "Edit",
  accountTitle: "Account",
  contactTitle: "Contact",
  addressTitle: "Address",
  noAddress: "This account has no address on file.",
  fields: {
    id: "User id",
    username: "Username",
    email: "Email",
    phone: "Phone",
    role: "Role",
    joined: "Joined",
    updated: "Updated",
    street: "Street",
    district: "District",
    city: "City",
    state: "State",
    zip: "Postcode",
    fullAddress: "Full address",
  },
};

export const userFormContent = {
  title: "Edit user",
  lead: "Changes apply to the customer account immediately.",
  submit: "Save changes",
  pending: "Saving…",
  cancel: "Cancel",
  back: { label: "Back to users", to: adminRoutes.users },
  sections: {
    profile: "Profile",
    security: "Security",
    address: "Address",
  },
  fields: {
    name: "Name",
    username: "Username",
    email: "Email",
    phone: "Phone",
    password: "New password",
    avatar: "Avatar",
    street: "Street",
    district: "District",
    city: "City",
    state: "State",
    zip: "Postcode",
    fullAddress: "Full address",
  },
  help: {
    password: "Leave empty to keep the current password.",
    avatar: "JPG, PNG, WEBP or GIF, up to 2 MB.",
    address:
      "The API stores the address as one block, so fill every part or leave them all empty.",
    phone: "Digits only, 10 to 15, optionally starting with +.",
  },
  errors: {
    address: "Fill every address field, or clear them all.",
  },
};

export const USERS_PAGE_SIZE = 15;

export const chatAdminContent = {
  title: "Chat sessions",
  lead: "How the assistant is being used across the store.",
  chartTitle: "Chat activity",
  chartCaption: "messages per day",
  usersTitle: "Busiest users",
  usageTitle: "AI account",
  healthTitle: "Reply health",
  emptyUsers: "Nobody has chatted yet.",
  stats: {
    sessions: "Sessions",
    sessionsNote: "conversations started",
    today: "Messages today",
    todayNote: "since midnight UTC",
    people: "People chatting",
    peopleNote: "accounts with a session",
    messages: "Messages",
    messagesNote: "user and assistant turns",
  },
  usage: {
    model: "Model",
    plan: "Plan",
    free: "Free tier",
    paid: "Credits",
    limit: "Spending limit",
    remaining: "Remaining",
    spentTotal: "Spent all time",
    spentToday: "Spent today",
    spentWeek: "Spent this week",
    spentMonth: "Spent this month",
    reset: "Limit resets",
    expires: "Key expires",
    uncapped: "Uncapped",
    never: "Never",
    noCredit: "No credit on this key",
    unreachable: "Could not reach the AI provider.",
    unconfigured: "No AI key is configured on the server.",
    note: "These are spending limits in USD, not request quotas. Free models cost nothing, so a free-tier key shows no spend. The separate free-model daily request cap is not part of the provider API and only surfaces in a rejected request.",
  },
  health: {
    replies: "Assistant replies",
    failed: "Gave up",
    rate: "Failure rate",
    note: "A reply counts as given up when the assistant produced no answer and fell back to an apology.",
  },
  columns: { user: "User", sessions: "Sessions", messages: "Messages" },
  meter: {
    title: "Requests and tokens",
    modelsTitle: "Models served",
    requestsToday: "Requests today",
    requestsTotal: "Requests all time",
    capLabel: "of the free daily cap",
    capNote:
      "OpenRouter documents 50 free-model requests per day under $10 of credits, and 1,000 at $10 or more. The remaining count is not returned by any endpoint, so this bar counts the calls this server made and assumes the lower tier.",
    observed: "Last rejection reported",
    tokensToday: "Tokens today",
    tokensTotal: "Tokens all time",
    prompt: "Prompt",
    completion: "Completion",
    perRequest: "Average per request",
    context: "Context window",
    maxCompletion: "Max completion",
    failedToday: "Rejected today",
    fanoutNote:
      "One user message can cost several requests: each tool step is its own call, and the title is another.",
    emptyModels: "No calls recorded yet.",
    columns: { model: "Model", calls: "Calls", tokens: "Tokens" },
  },
};

export const FREE_DAILY_CAP = 50;

export const settingsContent = {
  title: "Settings",
  lead: "Your own account, the catalogue taxonomy, and what this server is running.",
  account: {
    title: "Your account",
    lead: "You are editing the admin you are signed in as.",
    submit: "Save changes",
    pending: "Saving…",
    saved: "Saved.",
    fields: {
      name: "Name",
      username: "Username",
      email: "Email",
      phone: "Phone",
      password: "New password",
      avatar: "Avatar",
    },
    help: {
      password: "Leave empty to keep your current password.",
      avatar: "JPG, PNG, WEBP or GIF, up to 2 MB.",
      phone: "Digits only, 10 to 15, optionally starting with +.",
    },
  },
  categories: {
    title: "Categories",
    lead: "Products reference a category by name, so renaming one moves every product with it.",
    add: "Add category",
    adding: "Adding…",
    namePlaceholder: "Category name",
    descriptionPlaceholder: "Short description (optional)",
    inUse: "in use",
    empty: "No categories yet.",
    lockedHint: "A category cannot be deleted while products still use it.",
    columns: { name: "Name", products: "Products", actions: "Actions" },
    save: "Save",
    cancel: "Cancel",
    rename: "Rename",
    remove: "Delete",
  },
  categoryDelete: {
    title: "Delete this category?",
    body: "Nothing references it, so removing it is safe.",
    confirm: "Delete",
    cancel: "Keep it",
  },
  assistant: {
    title: "Assistant configuration",
    lead: "Set in the server environment, shown here read only.",
    fields: {
      model: "Model",
      context: "Context window",
      history: "History carried",
      steps: "Tool steps per reply",
      tools: "Tools available",
    },
    messages: "messages",
    steps: "calls",
  },
  lifecycle: {
    title: "Order lifecycle",
    lead: "The transitions the API accepts. Cancelling uses its own endpoint, and only cancelled orders can be deleted.",
    terminal: "Terminal",
  },
  rules: {
    title: "Catalogue rules",
    lead: "Frontend constants, changed in code rather than here.",
    lowStock: "Low stock at or below",
    productsPerPage: "Products per page",
    ordersPerPage: "Orders per page",
    usersPerPage: "Users per page",
    units: "units",
    rows: "rows",
  },
  system: {
    title: "System",
    apiTitle: "API",
    aiTitle: "Assistant",
    appTitle: "This build",
    fields: {
      status: "Status",
      database: "Database",
      uptime: "Uptime",
      baseUrl: "API base URL",
      model: "Model",
      plan: "Plan",
      previewPages: "Preview pages",
      maintenance: "Maintenance mode",
    },
    on: "Enabled",
    off: "Disabled",
    unreachable: "Not reachable",
  },
};
