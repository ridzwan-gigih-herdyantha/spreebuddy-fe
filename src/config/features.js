const flag = (value) => String(value).toLowerCase() === "true";

export const previewPagesEnabled = flag(
  import.meta.env.ENABLE_PREVIEW_PAGES ??
    import.meta.env.VITE_ENABLE_PREVIEW_PAGES,
);

export const previewRoutes = {
  styleGuide: "/style-guide",
};
