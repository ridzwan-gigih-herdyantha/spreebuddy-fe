export const blogContent = {
  badge: "Blog",
  title: "Notes from the shop",
  lead: "What we are building, what we changed, and the occasional thing we got wrong.",
  loadMore: "Load more",
  loading: "Loading…",
  readMore: "Read",
  by: "By",
  empty: {
    title: "Nothing published yet",
    lead: "We have not written anything here so far. When we do, this is where it lands.",
    action: { label: "Browse the shop instead", to: "/shop" },
  },
  failed: {
    title: "We could not load the posts",
    lead: "Something went wrong on our side. Try again in a moment.",
    retry: "Try again",
  },
};

export const postContent = {
  back: { label: "All posts", to: "/blog" },
  by: "By",
  notFound: {
    title: "That post is not here",
    lead: "It may have been moved or never published.",
    action: { label: "Back to the blog", to: "/blog" },
  },
};
