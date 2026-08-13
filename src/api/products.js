import api from "./axios";

export const listProducts = ({ page = 1, limit = 8, search } = {}) =>
  api.get("/api/v1/products", {
    params: { page, limit, ...(search ? { search } : {}) },
  });

export const listCategories = () =>
  api.get("/api/v1/categories", { params: { page: 1, limit: 50 } });

export const getProduct = (slug) => api.get(`/api/v1/products/${slug}`);
