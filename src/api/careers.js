import api from "./axios";

// Not implemented on the server yet. Until it is, this 404s and the page
// falls back to its empty state rather than showing an error.
export const listJobs = ({ page = 1, limit = 50 } = {}) =>
  api.get("/api/v1/careers", { params: { page, limit } });
