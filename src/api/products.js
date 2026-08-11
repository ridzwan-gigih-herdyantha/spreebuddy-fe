import api from "./axios";

export const listProducts = ({ page = 1, limit = 8 } = {}) =>
  api.get("/api/v1/products", { params: { page, limit } });

export const listCategories = () =>
  api.get("/api/v1/categories", { params: { page: 1, limit: 50 } });

export const getProduct = (id) => api.get(`/api/v1/products/${id}`);
