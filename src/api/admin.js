import api from "./axios";

export const listUsers = ({ page = 1, limit = 10 } = {}) =>
  api.get("/api/v1/users", { params: { page, limit } });

export const getUser = (id) => api.get(`/api/v1/users/${id}`);
