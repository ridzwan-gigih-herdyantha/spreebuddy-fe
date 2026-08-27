import api from "./axios";

// Not implemented on the server yet. Until it is, both calls 404 and the pages
// fall back to their empty states rather than showing an error.
export const listPosts = ({ page = 1, limit = 9 } = {}) =>
  api.get("/api/v1/posts", { params: { page, limit } });

export const getPost = (slug) => api.get(`/api/v1/posts/${slug}`);
